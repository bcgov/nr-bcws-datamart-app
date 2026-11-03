import { Injectable } from '@angular/core';

const BASE_URL = 'https://nr-bcws-datamart-app-dev-api.azurewebsites.net/api'

export type DailyWeather = {
    DAILY_WEATHER_MEAS_GUID: string             // "0x000062DE1D9B4452AB7192C43CA88038",
    WEATHER_STATION_GUID: string                // "0xBB7CB089281A4734E0531D09228EECA8",
    WEATHER_TIMESTAMP_MSEC: number              // 1659470400000,
    WEATHER_TIMESTAMP: string                   // "2022-08-02 20:00:00.000000",
    DAILY_MEASUREMENT_TYPE_CODE: string         // "ACTUAL",
    TEMPERATURE: number                         // 13.7,
    TEMPERATURE_MIN: number                     // 13,
    TEMPERATURE_MAX: number                     // 17.3,
    RELATIVE_HUMIDITY: number                   // 96,
    RELATIVE_HUMIDITY_MIN: number               // 79,
    RELATIVE_HUMIDITY_MAX: number               // 98,
    PRECIPITATION: number                       // 2.9,
    WIND_SPEED: number                          // 13,
    WIND_DIRECTION_DEGREES: number              // 160,
    ADJUSTED_WIND_SPEED: number                 // 13,
    DAILY_SEVERITY_RATING: string               // null,
    DROUGHT_CODE: string                        // null,
    DUFF_MOISTURE_CODE: string                  // null,
    FINE_FUEL_MOISTURE_CODE: string             // null,
    GRASSLAND_CURING: string                    // null,
    BUILD_UP_INDEX: string                      // null,
    DANGER_FOREST_INDEX: string                 // null,
    DANGER_GRASSLAND_INDEX: string              // null,
    DANGER_SCRUB_INDEX: string                  // null,
    FIRE_WEATHER_INDEX: string                  // null,
    INITIAL_SPREAD_INDEX: string                // null,
    MISSING_HOURLY_DATA_IND: string             // "N",
    OBSERVATION_VALID_IND: string               // "Y",
    OBSERVATION_VALID_COMMENT: string           // null,
    ARCHIVED_IND: string                        // "Y",
    LAST_UPDATED_TIMESTAMP_MSEC: number         // 1659471252602,
    LAST_UPDATED_TIMESTAMP: string              // "2022-08-02 20:14:12.602000",
    CREATE_USER: string                         // "WFWX_WEATHER_API",
    CREATE_DATE: string                         // "2022-08-02 13:14:12.000000",
    UPDATE_USER: string                         // "WFWX-2413",
    UPDATE_DATE: string                         // "2024-06-26 10:49:07.000000"
}

export type HourlyWeather = {
    HOURLY_WEATHER_MEAS_GUID: string            // "0x0854B7E8378648D8B323AF5B842EDA70",
    WEATHER_STATION_GUID: string                // "0xBB7CB0892AAD4734E0531D09228EECA8",
    WEATHER_TIMESTAMP_MSEC: number              // 1793275200000,
    WEATHER_TIMESTAMP: string                   // "2026-10-29 12:00:00.000000",
    HOURLY_MEASUREMENT_TYPE_CODE: string        // "ACTUAL",
    HOURLY_MEASUREMENT_TYPE_DESC: string        // "Actual",
    TEMPERATURE: number                         // 2.5,
    BAROMETRIC_PRESSURE: string                 // null,
    RELATIVE_HUMIDITY: number                   // 96,
    PRECIPITATION: number                       // 0.508,
    WIND_SPEED: number                          // 10.2,
    WIND_DIRECTION_DEGREES: number              // 261,
    FINE_FUEL_MOISTURE_CODE: string             // null,
    FIRE_WEATHER_INDEX: string                  // null,
    INITIAL_SPREAD_INDEX: string                // null,
    OBSERVATION_VALID_IND: string               // "Y",
    OBSERVATION_VALID_COMMENT: string           // null,
    ADJUSTED_WIND_SPEED: number                 // 10.2,
    BATTERY_SUPPLY_CURRENT: string              // null,
    BATTERY_SUPPLY_VOLTAGE: string              // null,
    FUEL_STICK_MOISTURE: string                 // null,
    FUEL_STICK_TEMPERATURE: string              // null,
    PRECIP_PLUVIO_1_STATUS: string              // null,
    PRECIP_PLUVIO_1_TOTAL: string               // null,
    PRECIP_PLUVIO_2_STATUS: string              // null,
    PRECIP_PLUVIO_2_TOTAL: string               // null,
    PRECIP_RIT_STATUS: string                   // null,
    PRECIP_RIT_TOTAL: string                    // null,
    PRECIP_RGT: string                          // null,
    PRECIP_PC2_STATUS: string                   // null,
    PRECIP_PC2_TOTAL: string                    // null,
    RELATIVE_HUMIDITY_HOURLY_AVG: string        // null,
    RN_1_PLUVIO_1: string                       // null,
    RN_1_PLUVIO_2: string                       // null,
    RN_1_RIT: string                            // null,
    RN_1_PC2: string                            // null,
    SNOW_DEPTH: string                          // null,
    SNOW_DEPTH_QUALITY: string                  // null,
    SOLAR_RADIATION_CM3: string                 // null,
    SOLAR_RADIATION_LICOR: string               // null,
    SOLAR_SUPPLY_CURRENT: string                // null,
    SOLAR_SUPPLY_VOLTAGE: string                // null,
    TEMPERATURE_HOURLY_AVERAGE: string          // null,
    WIND_SPEED_HOURLY_AVERAGE: string           // null,
    WIND_DIRECTION_HOURLY_AVERAGE: string       // null,
    WIND_SPEED_MAX_10_MINUTE: string            // null,
    WIND_GUST: string                           // null,
    SOIL_MOISTURE_PROBE_1: string               // null,
    SOIL_MOISTURE_PROBE_2: string               // null,
    SOIL_MOISTURE_PROBE_3: string               // null,
    SOIL_TEMPERATURE_PROBE_1: string            // null,
    SOIL_TEMPERATURE_PROBE_2: string            // null,
    SOIL_TEMPERATURE_PROBE_3: string            // null,
    ARCHIVED_IND: string                        // "N",
    LAST_UPDATED_TIMESTAMP_MSEC: number         // 1793358329407,
    LAST_UPDATED_TIMESTAMP: string              // "2026-10-30 11:05:29.407000",
    CREATE_USER: string                         // "WFWX_WEATHER_API",
    CREATE_DATE: string                         // "2026-10-29 05:05:38.000000",
    UPDATE_USER: string                         // "WFWX_WEATHER_API",
    UPDATE_DATE: string                         // "2026-10-30 04:05:29.000000"    
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

export type RestOptions = {
    filter?: string,
    orderby?: string,
    select?: string[]
}

function formatRestOptions( opt: RestOptions ): string {
    let out = []
    if ( opt.filter ) out.push( `$filter=${ opt.filter }` )
    if ( opt.orderby ) out.push( `$orderby=${ opt.orderby }` )
    if ( opt.select ) out.push( `$filter=${ opt.select.join( ',' ) }` )
    return out.join( '&' )
}
 
@Injectable({
    providedIn: 'root',
})
export class DatamartRestApiService {
    getHourlyWeather( opt: RestOptions ): Promise<HourlyWeather[]> {
        let url = `${ BASE_URL }/hourly_weather?${ formatRestOptions( opt ) }`

        return fetchAllPages<HourlyWeather>( url, [], 10, 'getHourlyWeather' )
    }

    getDailyWeather( opt: RestOptions ): Promise<DailyWeather[]> {
        let url = `${ BASE_URL }/daily_weather?${ formatRestOptions( opt ) }`

        return fetchAllPages<DailyWeather>( url, [], 10, 'getDailyWeather' )
    }

    getActiveWeatherStations( opt: RestOptions ): Promise<WeatherStation[]> {
        // let url = `${ BASE_URL }/weather_stations?$filter=station_status_code eq 'ACTIVE'`
        let url = `${ BASE_URL }/weather_stations?${ formatRestOptions( opt ) }`

        return fetchAllPages<WeatherStation>( url, [], 20, 'getActiveWeatherStations' )
    }

    getFireCentres() {
        let url = `${ BASE_URL }/fire_centres`

        return fetchAllPages<FireCentre>( url, [], 20, 'getFireCentres' )
    }

    getFireZones() {
        let url = `${ BASE_URL }/fire_zones`

        return fetchAllPages<FireZone>( url, [], 20, 'getFireZones' )
    }

    getOrgUnits() {
        let url = `${ BASE_URL }/org_units`

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

