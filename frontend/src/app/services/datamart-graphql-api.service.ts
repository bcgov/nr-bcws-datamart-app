import { inject, Injectable } from '@angular/core';
import { formatApiDate } from '../util';
import { CodeTableService } from './code-table.service';
import { ApplicationStateService } from './application-state.service';
import { DailyWeather, DailyWeatherStation, HourlyWeather, HourlyWeatherStation } from '../api-types';

export type GraphQlResult = {
    data: any
}

export type Result<T> = {
    items: Partial<T>[]
    hasNextPage: boolean
    endCursor: string
    groupBy?: {
        aggregations: {
            count: number
        }
    }[] 
}

@Injectable({
    providedIn: 'root',
})
export class DatamartGraphqlApiService {
    codeTableService = inject( CodeTableService )
    applicationStateService = inject( ApplicationStateService )

    makeHourlyWeatherQuery( startDate: string, endDate: string, stationCodes: number[], hourlyFields: string[], stationFields: string[], endCursor?: string, pagination = false ): string {
        let after = ''
        if ( endCursor ) after = `after: "${ endCursor }"`

        return `
            query {
                hourly_weathers(
                    ${ after }
                    filter: {
                        WEATHER_TIMESTAMP: { gte: "${ formatApiDate( startDate ) }", lt: "${ formatApiDate( endDate ) }" }
                        ${ makeInFilter( stationCodes, ( cl ) => `{ station: { STATION_CODE: { ${ cl } } } }` ) }
                    }
                    orderBy: {
                        WEATHER_TIMESTAMP: ASC,
                    }
                ) {
                    items {
                        WEATHER_TIMESTAMP
                        ${ hourlyFields.join( ' ' ) }
                        station { STATION_CODE ${ stationFields.filter( f => f != 'STATION_CODE' ).join( ' ' ) } }
                    }
                    ${ pagination ? 'hasNextPage endCursor' : '' }
                }
            }
        `
    }

    getHourlyWeather( startDate: string, endDate: string, stationCodes: number[], hourlyFields: string[], stationFields: string[], endCursor?: string ): Promise<Result<HourlyWeatherStation>> {
        return this.parseGraphQL<HourlyWeatherStation>( 'hourly_weathers', 
            this.fetchGraphQL( 
                this.makeHourlyWeatherQuery( startDate, endDate, stationCodes, hourlyFields, stationFields, endCursor, true ) 
            ) 
        )
    }

    makeDailyWeatherQuery( startDate: string, endDate: string, stationCodes: number[], dailyFields: string[], stationFields: string[], endCursor?: string, pagination = false ): string {
        let after = ''
        if ( endCursor ) after = `after: "${ endCursor }"`

        return `
            query {
                daily_weathers(
                    ${ after }
                    filter: {
                        WEATHER_TIMESTAMP: { gte: "${ formatApiDate( startDate ) }", lt: "${ formatApiDate( endDate ) }" }
                        ${ makeInFilter( stationCodes, ( cl ) => `{ station: { STATION_CODE: { ${ cl } } } }` ) }
                    }
                    orderBy: {
                        WEATHER_TIMESTAMP: ASC,
                    }
                ) {
                    items {
                        WEATHER_TIMESTAMP
                        ${ dailyFields.join( ' ' ) }
                        station { STATION_CODE ${ stationFields.filter( f => f != 'STATION_CODE' ).join( ' ' ) } }
                    }
                    ${ pagination ? 'hasNextPage endCursor' : '' }
                }
            }
        `
    }

    getDailyWeather( startDate: string, endDate: string, stationCodes: number[], dailyFields: string[], stationFields: string[], endCursor?: string ): Promise<Result<DailyWeatherStation>> {
        return this.parseGraphQL<DailyWeatherStation>( 'daily_weathers', 
            this.fetchGraphQL( 
                this.makeDailyWeatherQuery( startDate, endDate, stationCodes, dailyFields, stationFields, endCursor, true ) 
            )
        )
    }

    getFireCentres() {
    }

    getFireZones() {
    }

    getOrgUnits() {
    }

    getDailyWeatherCount( startDate: string, endDate: string, stationCodes: number[] ): Promise<number> {
        return this.parseGraphQL<void>( 'daily_weathers', 
            this.fetchGraphQL( `
                query {
                    daily_weathers(
                        filter: {
                            WEATHER_TIMESTAMP: { gte: "${ formatApiDate( startDate ) }", lt: "${ formatApiDate( endDate ) }" }
                            ${ makeInFilter( stationCodes, ( cl ) => `{ station: { STATION_CODE: { ${ cl } } } }` ) }
                        }
                    ) {               
                        groupBy {
                            aggregations {
                                count: count(field: WEATHER_TIMESTAMP_MSEC)
                            }
                        }
                    }
                }
            ` )
        )
            .then( res => {
                return res.groupBy![0].aggregations.count
            } )
    }

    getHourlyWeatherCount( startDate: string, endDate: string, stationCodes: number[] ): Promise<number> {
        return this.parseGraphQL<void>( 'hourly_weathers', 
            this.fetchGraphQL( `
                query {
                    hourly_weathers(
                        filter: {
                            WEATHER_TIMESTAMP: { gte: "${ formatApiDate( startDate ) }", lt: "${ formatApiDate( endDate ) }" }
                            ${ makeInFilter( stationCodes, ( cl ) => `{ station: { STATION_CODE: { ${ cl } } } }` ) }
                        }
                    ) {               
                        groupBy {
                            aggregations {
                                count: count(field: WEATHER_TIMESTAMP_MSEC)
                            }
                        }
                    }
                }
            ` )
        )
            .then( res => {
                return res.groupBy![0].aggregations.count
            } )
    }

    downloadWeatherData( startDate: string, endDate: string, stationCodes: number[], dailyFields: string[], hourlyFields: string[], stationFields: string[], emailAddress?: string ): Promise<void> {
        let queries = []
        if ( dailyFields.length > 0 ) queries.push( {
            name: 'daily-weather',
            query: compact( this.makeDailyWeatherQuery( startDate, endDate, stationCodes, dailyFields, stationFields ) )
        } )
        if ( hourlyFields.length > 0 ) queries.push( {
            name: 'hourly-weather',
            query: compact( this.makeHourlyWeatherQuery( startDate, endDate, stationCodes, hourlyFields, stationFields ) )
        } )

        let emailDownload = false
        if ( emailAddress ) emailDownload = true

        return fetch( this.applicationStateService.environment.DOWNLOAD_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( { queries, startDate, endDate, emailDownload, emailAddress } ),            
        } )
            .then( res => {
                if ( !res.ok ) throw Error( 'HTTP error: ' + res.statusText )
                let disposition = res.headers.get( 'content-disposition' )
                let filename = disposition?.match( /filename="(.+)"/ )?.[1]

                return res.blob()
                    .then( res => {
                        let obj = URL.createObjectURL( res )

                        let anchor = document.createElement('a')
                        anchor.href = obj
                        anchor.download = filename!
                        document.body.appendChild( anchor )
                        anchor.click()

                        anchor.remove()
                        URL.revokeObjectURL( obj )
                    } )
            } )
    }

    fetchGraphQL( query: string, body?: { [key: string]: string } ): Promise<GraphQlResult> {
        return fetch( this.applicationStateService.environment.GRAPHQL_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( { ...body, query: compact( query ) } )
        } )
            .then( res => {
                return res.json()
            } )
            .then( res => {
                if ( res.errors ) throw res.errors
                return res
            } )
    }

    parseGraphQL<T>( queryName: string, graphQLResult: Promise<GraphQlResult> ): Promise<Result<T>> {
        return graphQLResult
            .then( res => {
                return res.data[ queryName ]
            } )
    }
}

export function compact( s: string ): string {
    return s.replace( /\s+/g, ' ' )
}

export function makeInFilter( vals: any[], wrapper: ( s: string ) => string  ) {
    let c = vals.length 
    let bs = Math.floor( c / Math.ceil( c / 100 ) )
    let blk: any[] = []
    let blks: any[] = [ blk ]
    vals.forEach( v => {
        if ( blk.length < bs ) {
            blk.push( v )
            return
        }

        blk = [ v ]
        blks.push( blk )
    } )

    if ( blks.length == 1 ) return wrapper( `in: [${ blks[0].join(',')}]` )

    return 'or: [' + blks.map( bl => wrapper( `in: [${ bl.join(',')}]` ) ).join( ' ' ) + ']'
}
