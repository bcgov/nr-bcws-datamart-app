import { inject, Injectable } from '@angular/core';
import { formatApiDate } from '../util';
import { CodeTableService } from './code-table.service';

const BASE_URL = 'https://nr-bcws-datamart-app-dev-api.azurewebsites.net/graphql'

export type Result<T> = {
    items: T[]
    hasNextPage: boolean
    endCursor: string
}

export type DailyWeather = {
    DAILY_WEATHER_MEAS_GUID?: string             // "0x000062DE1D9B4452AB7192C43CA88038",
    WEATHER_STATION_GUID?: string                // "0xBB7CB089281A4734E0531D09228EECA8",
    WEATHER_TIMESTAMP_MSEC?: number              // 1659470400000,
    WEATHER_TIMESTAMP: string                   // "2022-08-02 20:00:00.000000",
    DAILY_MEASUREMENT_TYPE_CODE?: string         // "ACTUAL",
    TEMPERATURE?: number                         // 13.7,
    TEMPERATURE_MIN?: number                     // 13,
    TEMPERATURE_MAX?: number                     // 17.3,
    RELATIVE_HUMIDITY?: number                   // 96,
    RELATIVE_HUMIDITY_MIN?: number               // 79,
    RELATIVE_HUMIDITY_MAX?: number               // 98,
    PRECIPITATION?: number                       // 2.9,
    WIND_SPEED?: number                          // 13,
    WIND_DIRECTION_DEGREES?: number              // 160,
    ADJUSTED_WIND_SPEED?: number                 // 13,
    DAILY_SEVERITY_RATING?: string               // null,
    DROUGHT_CODE?: string                        // null,
    DUFF_MOISTURE_CODE?: string                  // null,
    FINE_FUEL_MOISTURE_CODE?: string             // null,
    GRASSLAND_CURING?: string                    // null,
    BUILD_UP_INDEX?: string                      // null,
    DANGER_FOREST_INDEX?: string                 // null,
    DANGER_GRASSLAND_INDEX?: string              // null,
    DANGER_SCRUB_INDEX?: string                  // null,
    FIRE_WEATHER_INDEX?: string                  // null,
    INITIAL_SPREAD_INDEX?: string                // null,
    MISSING_HOURLY_DATA_IND?: string             // "N",
    OBSERVATION_VALID_IND?: string               // "Y",
    OBSERVATION_VALID_COMMENT?: string           // null,
    ARCHIVED_IND?: string                        // "Y",
    LAST_UPDATED_TIMESTAMP_MSEC?: number         // 1659471252602,
    LAST_UPDATED_TIMESTAMP?: string              // "2022-08-02 20:14:12.602000",
    CREATE_USER?: string                         // "WFWX_WEATHER_API",
    CREATE_DATE?: string                         // "2022-08-02 13:14:12.000000",
    UPDATE_USER?: string                         // "WFWX-2413",
    UPDATE_DATE?: string                         // "2024-06-26 10:49:07.000000"
    STATION_CODE: number
}

export type WeatherStation = {
    weather_station_guid: string                // "0xBB7CB0892BE34734E0531D09228EECA8",
    station_code: number                        // 1341,
    station_status_code: string                 // "ARCHIVED",
    station_status_desc: string                 // "Archived",
    site_type_code: string                      // "WXSTN_TEL",
    site_type_desc: string                      // "Weather Station - Telephone",
    influencing_aspect_code: string             // "SW",
    influencing_aspect_desc: string             // "South-West",
    data_logger_type_code: string               // "FWS12S",
    data_logger_type_desc: string               // "FWS12S",
    weather_zone: number                        // 26,
    weather_zone_desc: string                   // "Zone 26",
    danger_region: number                       // 3,
    station_acronym: string                     // null,
    station_name: string                        // "ZZ SYRINGA QD",
    fire_centre_org_unit_ident: number          // 34,
    fire_centre: string                         // "Southeast Fire Centre",
    zone_org_unit_identifier: number            // 38,
    fire_zone: string                           // "Arrow Zone",
    data_source: string                         // "HRLY_POLL",
    installation_timestamp_msec: number         // 1534921200000,
    decommission_timestamp_msec: number         // 1600239600000,
    hourly_ind: string                          // "Y",
    over_winter_precip_adj_ind: string          // "N",
    latitude: number                            // 49.4088,
    longitude: number                           // -117.96,
    elevation_m: number                         // 863,
    influencing_slope: string                   // null,
    windspeed_adjustment_height: string         // "2.0_2.9",
    windspeed_adjustment_roughness: string      // null,
    eccc_file_base_url_template: string         // null,
    last_updated_timestamp_msec: number         // 1613486000000,
    create_user: string                         // "LEGACY_DATA_LOAD",
    create_date: string                         // "2021-02-16 14:33:20.000000",
    update_user: string                         // "WFWX-2495",
    update_date: string                         // "2024-11-20 13:05:43.000000"
}

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

@Injectable({
    providedIn: 'root',
})
export class DatamartGraphqlApiService {
    codeTableService = inject( CodeTableService )
    
    getHourlyWeather() {
        let url = `${ BASE_URL }/hourly_weather`
    }

    getDailyWeather( startDate: string, endDate: string, stationCodes: number[], fields: string[], endCursor?: string ): Promise<Result<DailyWeather>> {
        // let url = `${ BASE_URL }/daily_weather`
// console.log(fields)        
        let filteredFields = fields.filter( f => this.codeTableService.DAILY_WEATHER_COLUMNS.forCode( f ) )
        let after = ''
        if ( endCursor ) after = `after: "${ endCursor }"`

        return fetchGraphQL<DailyWeather>( { query: `
            query {
                daily_weathers( 
                    ${ after }
                    filter: {
                        WEATHER_TIMESTAMP: { gte: "${ formatApiDate( startDate ) }", lt: "${ formatApiDate( endDate ) }" } 
                        weather_station: { station_code: { in: [${ stationCodes.join(',')}] }}
                    } 
                    orderBy: {
                        WEATHER_TIMESTAMP: ASC
                    }
                ) {
                    items {
                        WEATHER_TIMESTAMP
                        weather_station {
                            station_code
                        }
                        ${ filteredFields.join( '\n' ) }
                    }
                    hasNextPage
                    endCursor
                }
            }
        ` }, 'daily_weathers' )
            .then( res => {
                res.items = res.items.map( (row: any) => {
                    return {
                        ...row,
                        STATION_CODE: row.weather_station.station_code
                    }
                } )

                return res
            } )
    }

    getFireCentres() {
    }

    getFireZones() {
    }

    getOrgUnits() {
    }
}

function fetchGraphQL<T>( body: { query: string, [key: string]: string }, queryName: string ): Promise<Result<T>> {
    let query = body.query.replace( /\s+/g, ' ' )
    // console.log( query )
    return fetch( BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( { ...body, query } )
    } )
        .then( res => {
            if ( !res.ok ) throw Error( 'HTTP error: ' + res.statusText )
            return res.json()
        } )
        .then( res => {
            return res.data[ queryName ]
        } )
}

// export function fetchAllPages<RESULT>( url: string, accum: RESULT[], maxPages: number, description: string ): Promise<RESULT[]> { 
//     if ( maxPages == 0 ) return Promise.resolve( accum )

//     return fetchWithRetry( url, description, 3 ) 
//         .then( res => res.json() )
//         .then( payload => {
//             if ( payload.nextLink )
//                 return fetchAllPages( payload.nextLink, accum.concat( payload.value ), maxPages - 1, description )
            
//             return accum.concat( payload.value )
//         } )
// }

// export function fetchWithRetry( url: string, description: string, retries: number, delay = 1000 ): Promise<Response> {
//     return fetch( url )
//         .then( res => {
//             if ( !res.ok ) {
//                 throw Error( res.statusText )
//             }

//             return res
//         } )
//         .catch( err => {
//             if ( retries > 0 ) {
//                 console.warn( `${ description } failed: ${ err }, retrying` )

//                 return new Promise( res => { setTimeout( res, delay ) } )
//                     .then( () => {
//                         return fetchWithRetry( url, description, retries - 1 )
//                     } )
//             }
//             else {
//                 console.error( `${ description } failed: ${ err }` )

//                 throw Error( `${ description } failed` )
//             }
//         } )
// }



// query { 
//     daily_weathers( 
//         filter: { 
//             WEATHER_STATION_GUID: { eq: \"0xBB7CB089281A4734E0531D09228EECA8\" }, 
//             WEATHER_TIMESTAMP_MSEC: { gte: 1659470400000, lt: 1659579600000 } 
//         }
//     ) { 
//         items { 
//             DAILY_WEATHER_MEAS_GUID 
//             WEATHER_STATION_GUID
//             WEATHER_TIMESTAMP_MSEC
//             DAILY_MEASUREMENT_TYPE_CODE
//             TEMPERATURE
//             TEMPERATURE_MIN
//             TEMPERATURE_MAX
//             RELATIVE_HUMIDITY
//             RELATIVE_HUMIDITY_MIN
//             RELATIVE_HUMIDITY_MAX
//             PRECIPITATION
//             WIND_SPEED
//             WIND_DIRECTION_DEGREES
//             DAILY_SEVERITY_RATING
//             DROUGHT_CODE
//             DUFF_MOISTURE_CODE
//             FINE_FUEL_MOISTURE_CODE
//             GRASSLAND_CURING
//             BUILD_UP_INDEX
//             DANGER_FOREST_INDEX
//             DANGER_GRASSLAND_INDEX
//             DANGER_SCRUB_INDEX
//             FIRE_WEATHER_INDEX
//             INITIAL_SPREAD_INDEX
//             LAST_UPDATED_TIMESTAMP_MSEC
//         } 
//     } 
// }