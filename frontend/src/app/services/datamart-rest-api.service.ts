import { inject, Injectable } from '@angular/core';
import { ApplicationStateService } from './application-state.service';
import { DailyWeather, HourlyWeather, WeatherStation } from '../api-types';

export type FireCentre = {
    FIRE_ZONE_ORG_UNIT_IDENTIFIER: number       // 2,
    FIRE_ZONE_INTEGER_ALIAS: number             // 7,
    FIRE_ZONE_ORG_UNIT_NAME: string             // "Cariboo Fire Centre",
    FIRE_ZONE_ORG_UNIT_TYPE_DESC: string        // "Fire Centre"
}

export type FireZone = {
    FIRE_ZONE_ORG_UNIT_IDENTIFIER: number       // 2,
    FIRE_ZONE_INTEGER_ALIAS: number             // 7,
    FIRE_ZONE_ORG_UNIT_NAME: string             // "Cariboo Fire Centre",
    FIRE_ZONE_ORG_UNIT_TYPE_DESC: string        // "Fire Centre"
}

export type RestOptions = {
    filter?: string,
    orderby?: string,
    select?: string[]
    first?: number
}

function formatRestOptions( opt: RestOptions ): string {
    let out = []
    if ( opt.filter ) out.push( `$filter=${ opt.filter }` )
    if ( opt.orderby ) out.push( `$orderby=${ opt.orderby }` )
    if ( opt.select ) out.push( `$select=${ opt.select.join( ',' ) }` )
    if ( opt.first ) out.push( `$first=${ opt.first }` )
    return out.join( '&' )
}
 
@Injectable({
    providedIn: 'root',
})
export class DatamartRestApiService {
    applicationStateService = inject( ApplicationStateService )

    getHourlyWeather( opt: RestOptions ): Promise<HourlyWeather[]> {
        let url = `${ this.applicationStateService.environment.REST_BASE_URL }/hourly_weather?${ formatRestOptions( opt ) }`

        return fetchAllPages<HourlyWeather>( url, [], 10, 'getHourlyWeather' )
    }

    getDailyWeather( opt: RestOptions ): Promise<DailyWeather[]> {
        let url = `${ this.applicationStateService.environment.REST_BASE_URL }/daily_weather?${ formatRestOptions( opt ) }`

        return fetchAllPages<DailyWeather>( url, [], 10, 'getDailyWeather' )
    }

    getActiveWeatherStations( opt: RestOptions ): Promise<WeatherStation[]> {
        let url = `${ this.applicationStateService.environment.REST_BASE_URL }/weather_stations?${ formatRestOptions( opt ) }`

        return fetchAllPages<WeatherStation>( url, [], 20, 'getActiveWeatherStations' )
    }

    getFireCentres() {
        let url = `${ this.applicationStateService.environment.REST_BASE_URL }/fire_centres`

        return fetchAllPages<FireCentre>( url, [], 20, 'getFireCentres' )
    }

    getFireZones() {
        let url = `${ this.applicationStateService.environment.REST_BASE_URL }/fire_zones`

        return fetchAllPages<FireZone>( url, [], 20, 'getFireZones' )
    }

    getOrgUnits() {
        let url = `${ this.applicationStateService.environment.REST_BASE_URL }/org_units`

        return fetchAllPages<FireZone>( url, [], 20, 'getOrgUnits' )
    }
}

export function fetchAllPages<RESULT>( url: string, accum: RESULT[], maxPages: number, description: string ): Promise<RESULT[]> { 
    if ( maxPages == 0 ) return Promise.resolve( accum )

    return fetchWithRetry( url, description, 3 ) 
        .then( res => res.json() )
        .then( payload => {
            if ( payload.nextLink )
                return fetchAllPages( payload.nextLink, accum.concat( payload.value ), maxPages - 1, description )
            
            return accum.concat( payload.value )
        } )
}

export function fetchWithRetry( url: string, description: string, retries: number, delay = 1000 ): Promise<Response> {
    return fetch( url )
        .then( res => {
            if ( !res.ok ) {
                throw Error( res.statusText )
            }

            return res
        } )
        .catch( err => {
            if ( retries > 0 ) {
                console.warn( `${ description } failed: ${ err }, retrying` )

                return new Promise( res => { setTimeout( res, delay ) } )
                    .then( () => {
                        return fetchWithRetry( url, description, retries - 1 )
                    } )
            }
            else {
                console.error( `${ description } failed: ${ err }` )

                throw Error( `${ description } failed` )
            }
        } )
}

