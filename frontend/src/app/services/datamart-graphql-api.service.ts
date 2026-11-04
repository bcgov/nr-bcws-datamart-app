import { inject, Injectable } from '@angular/core';
import { formatApiDate } from '../util';
import { CodeTableService } from './code-table.service';
import { ApplicationStateService } from './application-state.service';
import { DailyWeather, HourlyWeather } from '../api-types';

export type Result<T> = {
    items: Partial<T>[]
    hasNextPage: boolean
    endCursor: string
}

@Injectable({
    providedIn: 'root',
})
export class DatamartGraphqlApiService {
    codeTableService = inject( CodeTableService )
    applicationStateService = inject( ApplicationStateService )

    makeHourlyWeatherQuery( startDate: string, endDate: string, stationCodes: number[], fields: string[], endCursor?: string, pagination = false ): string {
        let filteredFields = fields.filter( f => this.codeTableService.HOURLY_WEATHER_COLUMNS.forCode( f ) )

        let after = ''
        if ( endCursor ) after = `after: "${ endCursor }"`

        return compact( `
            query {
                hourly_weathers(
                    ${ after }
                    filter: {
                        WEATHER_TIMESTAMP: { gte: "${ formatApiDate( startDate ) }", lt: "${ formatApiDate( endDate ) }" }
                        STATION_CODE: { in: [${ stationCodes.join(',')}] }
                    }
                    orderBy: {
                        WEATHER_TIMESTAMP: ASC,
                        STATION_NAME: ASC
                    }
                ) {
                    items {
                        WEATHER_TIMESTAMP
                        STATION_NAME
                        STATION_CODE
                        ${ filteredFields.join( '\n' ) }
                    }
                    ${ pagination ? 'hasNextPage endCursor' : '' }
                }
            }
        ` )
    }

    getHourlyWeather( startDate: string, endDate: string, stationCodes: number[], fields: string[], endCursor?: string ): Promise<Result<HourlyWeather>> {
        return this.fetchGraphQL<HourlyWeather>( 'hourly_weathers',  this.makeHourlyWeatherQuery( startDate, endDate, stationCodes, fields, endCursor, true ) )
            .then( res => {
                // res.items = res.items.map( (row: any) => {
                //     return {
                //         ...row,
                //     }
                // } )

                return res
            } )
    }

    makeDailyWeatherQuery( startDate: string, endDate: string, stationCodes: number[], fields: string[], endCursor?: string, pagination = false ): string {
        let filteredFields = fields.filter( f => this.codeTableService.DAILY_WEATHER_COLUMNS.forCode( f ) )

        let after = ''
        if ( endCursor ) after = `after: "${ endCursor }"`

        return compact( `
            query {
                daily_weathers(
                    ${ after }
                    filter: {
                        WEATHER_TIMESTAMP: { gte: "${ formatApiDate( startDate ) }", lt: "${ formatApiDate( endDate ) }" }
                        STATION_CODE: { in: [${ stationCodes.join(',')}] }
                    }
                    orderBy: {
                        WEATHER_TIMESTAMP: ASC,
                        STATION_NAME: ASC
                    }
                ) {
                    items {
                        WEATHER_TIMESTAMP
                        STATION_NAME
                        STATION_CODE
                        ${ filteredFields.join( '\n' ) }
                    }
                    ${ pagination ? 'hasNextPage endCursor' : '' }
                }
            }
        ` )
    }

    getDailyWeather( startDate: string, endDate: string, stationCodes: number[], fields: string[], endCursor?: string ): Promise<Result<DailyWeather>> {
        return this.fetchGraphQL<DailyWeather>( 'daily_weathers', this.makeDailyWeatherQuery( startDate, endDate, stationCodes, fields, endCursor, true ) )
            .then( res => {
                // res.items = res.items.map( (row: any) => {
                //     return {
                //         ...row,
                //     }
                // } )

                return res
            } )
    }

    getFireCentres() {
    }

    getFireZones() {
    }

    getOrgUnits() {
    }

    getCount() {
        // return fetchGraphQL<any>('daily_weathers', `
// query {
//   dailies(groupBy: []) {
//     count(field: id) {
//       value
//     }
//   }
// }  
  

// query {
//   daily_weathers {
//     groupBy( fields: DAILY_WEATHER_MEAS_GUID) {
//       aggregations {
//         count: count(field: DAILY_WEATHER_MEAS_GUID)
//       }
//     }
//   }
// }
//         `)
    }

    downloadWeatherData( startDate: string, endDate: string, stationCodes: number[], dailyFields: string[], hourlyFields: string[] ): Promise<void> {
        let body = {
            queries: [
                {
                    name: 'daily-weather',
                    query: this.makeDailyWeatherQuery( startDate, endDate, stationCodes, dailyFields )
                },
                {
                    name: 'hourly-weather',
                    query: this.makeHourlyWeatherQuery( startDate, endDate, stationCodes, hourlyFields )
                },
            ],
            startDate: startDate,
            endDate: endDate,
            emailAddress: "cody.bergin@gov.bc.ca",
            emailDownload: false
        }

        return fetch( this.applicationStateService.environment.DOWNLOAD_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( body ),            
        } )
            .then( res => {
                if ( !res.ok ) throw Error( 'HTTP error: ' + res.statusText )
                res.headers.forEach((v,k)=>console.log(k,v))
                let disposition = res.headers.get( 'content-disposition' )
                console.log( disposition )
                let filename = disposition?.match( /filename="(.+)"/ )?.[1]
                console.log( filename )

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
                        // console.log(res)
                        // return res.data[ queryName ]
                    } )

            } )
    }

    fetchGraphQL<T>( queryName: string, query: string, body?: { [key: string]: string } ): Promise<Result<T>> {
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
                return res.data[ queryName ]
            } )
    }
}
// {
//   "queries": [
//     {
//       "name": "daily-weather",
//       "query":  "query { daily_weathers( filter: { WEATHER_STATION_GUID: { eq: \"0xBB7CB089281A4734E0531D09228EECA8\" }, WEATHER_TIMESTAMP_MSEC: { gte: 1659470400000, lt: 1662148800000 } }) { items { DAILY_WEATHER_MEAS_GUID WEATHER_STATION_GUID WEATHER_TIMESTAMP_MSEC DAILY_MEASUREMENT_TYPE_CODE TEMPERATURE TEMPERATURE_MIN TEMPERATURE_MAX RELATIVE_HUMIDITY RELATIVE_HUMIDITY_MIN RELATIVE_HUMIDITY_MAX PRECIPITATION WIND_SPEED WIND_DIRECTION_DEGREES DAILY_SEVERITY_RATING DROUGHT_CODE DUFF_MOISTURE_CODE FINE_FUEL_MOISTURE_CODE GRASSLAND_CURING BUILD_UP_INDEX DANGER_FOREST_INDEX DANGER_GRASSLAND_INDEX DANGER_SCRUB_INDEX FIRE_WEATHER_INDEX INITIAL_SPREAD_INDEX LAST_UPDATED_TIMESTAMP_MSEC } } }"
//     },
//     {
//       "name": "hourly-weather",
//       "query": "query { hourly_weathers(filter: { WEATHER_STATION_GUID: { eq: \"0xBB7CB089281A4734E0531D09228EECA8\" }, WEATHER_TIMESTAMP_MSEC: { gte: 1659470400000, lt: 1662148800000 } }) { items { HOURLY_WEATHER_MEAS_GUID WEATHER_STATION_GUID WEATHER_TIMESTAMP_MSEC HOURLY_MEASUREMENT_TYPE_CODE HOURLY_MEASUREMENT_TYPE_DESC TEMPERATURE BAROMETRIC_PRESSURE RELATIVE_HUMIDITY PRECIPITATION WIND_SPEED WIND_DIRECTION_DEGREES FINE_FUEL_MOISTURE_CODE FIRE_WEATHER_INDEX INITIAL_SPREAD_INDEX OBSERVATION_VALID_IND OBSERVATION_VALID_COMMENT ADJUSTED_WIND_SPEED LAST_UPDATED_TIMESTAMP_MSEC } } }"
//     }
//   ],
//   "startDate": "2022-08-01",
//   "endDate": "2022-09-01",
//   "emailAddress": "cody.bergin@gov.bc.ca",
//   "emailDownload": false
// }
//         `, {} )
//     }
// }


export function compact( s: string ): string {
    console.log(s)
    return s.replace( /\s+/g, ' ' )
}
