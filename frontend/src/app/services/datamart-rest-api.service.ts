import { Injectable } from '@angular/core';

const BASE_URL = 'https://nr-bcws-datamart-app-dev-api.azurewebsites.net/api'

export type WeatherStation = {
    weather_station_guid: string              // "0xBB7CB0892BE34734E0531D09228EECA8",
    station_code: number                      // 1341,
    station_status_code: string               // "ARCHIVED",
    station_status_desc: string               // "Archived",
    site_type_code: string                    // "WXSTN_TEL",
    site_type_desc: string                    // "Weather Station - Telephone",
    influencing_aspect_code: string           // "SW",
    influencing_aspect_desc: string           // "South-West",
    data_logger_type_code: string             // "FWS12S",
    data_logger_type_desc: string             // "FWS12S",
    weather_zone: number                      // 26,
    weather_zone_desc: string                 // "Zone 26",
    danger_region: number                     // 3,
    station_acronym: string                   // null,
    station_name: string                      // "ZZ SYRINGA QD",
    fire_centre_org_unit_ident: number        // 34,
    fire_centre: string                       // "Southeast Fire Centre",
    zone_org_unit_identifier: number          // 38,
    fire_zone: string                         // "Arrow Zone",
    data_source: string                       // "HRLY_POLL",
    installation_timestamp_msec: number       // 1534921200000,
    decommission_timestamp_msec: number       // 1600239600000,
    hourly_ind: string                        // "Y",
    over_winter_precip_adj_ind: string        // "N",
    latitude: number                          // 49.4088,
    longitude: number                         // -117.96,
    elevation_m: number                       // 863,
    influencing_slope: string                 // null,
    windspeed_adjustment_height: string       // "2.0_2.9",
    windspeed_adjustment_roughness: string    // null,
    eccc_file_base_url_template: string       // null,
    last_updated_timestamp_msec: number       // 1613486000000,
    create_user: string                       // "LEGACY_DATA_LOAD",
    create_date: string                       // "2021-02-16 14:33:20.000000",
    update_user: string                       // "WFWX-2495",
    update_date: string                       // "2024-11-20 13:05:43.000000"
}


@Injectable({
    providedIn: 'root',
})
export class DatamartRestApiService {
    getHourlyWeather() {
        let url = `${ BASE_URL }/hourly_weather`
    }

    getDailyWeather() {
        let url = `${ BASE_URL }/daily_weather`
    }

    getActiveWeatherStations(): Promise<WeatherStation[]> {
        let url = `${ BASE_URL }/weather_stations?$filter=station_status_code eq 'ACTIVE'`

        return fetchAllPages<WeatherStation>( url, [], 20, 'getActiveWeatherStations' )
    }

    getFireCentres() {
        let url = `${ BASE_URL }/fire_centres`
    }

    getFireZones() {
        let url = `${ BASE_URL }/fire_zones`
    }

    getOrgUnits() {
        let url = `${ BASE_URL }/org_units`
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
