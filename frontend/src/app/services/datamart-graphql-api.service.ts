import { inject, Injectable } from '@angular/core';
import { formatApiDate } from '../util';
import { CodeTableService } from './code-table.service';

const GRAPHQL_BASE_URL = 'https://nr-bcws-datamart-app-dev-api.azurewebsites.net/graphql'
const DOWNLOAD_BASE_URL = 'https://nr-bcws-datamart-app-dev-download-api.azurewebsites.net/api/downloads'

export type Result<T> = {
    items: Partial<T>[]
    hasNextPage: boolean
    endCursor: string
}

export type DailyWeather = {
    DAILY_WEATHER_MEAS_GUID: string
    WEATHER_STATION_GUID: string
    STATION_CODE: number
    STATION_NAME: string
    STATION_ACRONYM: string
    WEATHER_TIMESTAMP_MSEC: number
    WEATHER_TIMESTAMP: string
    DAILY_MEASUREMENT_TYPE_CODE: string
    TEMPERATURE: number
    TEMPERATURE_MIN: number
    TEMPERATURE_MAX: number
    RELATIVE_HUMIDITY: number
    RELATIVE_HUMIDITY_MIN: number
    RELATIVE_HUMIDITY_MAX: number
    PRECIPITATION: number
    WIND_SPEED: number
    WIND_DIRECTION_DEGREES: number
    ADJUSTED_WIND_SPEED: number
    DAILY_SEVERITY_RATING: number
    DROUGHT_CODE: number
    DUFF_MOISTURE_CODE: number
    FINE_FUEL_MOISTURE_CODE: number
    GRASSLAND_CURING: number
    BUILD_UP_INDEX: number
    DANGER_FOREST_INDEX: number
    DANGER_GRASSLAND_INDEX: number
    DANGER_SCRUB_INDEX: number
    FIRE_WEATHER_INDEX: number
    INITIAL_SPREAD_INDEX: number
    MISSING_HOURLY_DATA_IND: string
    OBSERVATION_VALID_IND: string
    OBSERVATION_VALID_COMMENT: string
    ARCHIVED_IND: string
    LAST_UPDATED_TIMESTAMP_MSEC: number
    LAST_UPDATED_TIMESTAMP: string
    CREATE_USER: string
    CREATE_DATE: string
    UPDATE_USER: string
    UPDATE_DATE: string
}

export type HourlyWeather = {
    HOURLY_WEATHER_MEAS_GUID: string
    WEATHER_STATION_GUID: string
    STATION_CODE: number
    STATION_NAME: string
    STATION_ACRONYM: string
    WEATHER_TIMESTAMP_MSEC: number
    WEATHER_TIMESTAMP: string
    HOURLY_MEASUREMENT_TYPE_CODE: string
    HOURLY_MEASUREMENT_TYPE_DESC: string
    TEMPERATURE: number
    BAROMETRIC_PRESSURE: number
    RELATIVE_HUMIDITY: number
    PRECIPITATION: number
    WIND_SPEED: number
    WIND_DIRECTION_DEGREES: number
    FINE_FUEL_MOISTURE_CODE: number
    FIRE_WEATHER_INDEX: number
    INITIAL_SPREAD_INDEX: number
    OBSERVATION_VALID_IND: string
    OBSERVATION_VALID_COMMENT: string
    ADJUSTED_WIND_SPEED: number
    BATTERY_SUPPLY_CURRENT: number
    BATTERY_SUPPLY_VOLTAGE: number
    FUEL_STICK_MOISTURE: number
    FUEL_STICK_TEMPERATURE: number
    PRECIP_PLUVIO_1_STATUS: number
    PRECIP_PLUVIO_1_TOTAL: number
    PRECIP_PLUVIO_2_STATUS: number
    PRECIP_PLUVIO_2_TOTAL: number
    PRECIP_RIT_STATUS: number
    PRECIP_RIT_TOTAL: number
    PRECIP_RGT: number
    PRECIP_PC2_STATUS: number
    PRECIP_PC2_TOTAL: number
    RELATIVE_HUMIDITY_HOURLY_AVG: number
    RN_1_PLUVIO_1: number
    RN_1_PLUVIO_2: number
    RN_1_RIT: number
    RN_1_PC2: number
    SNOW_DEPTH: number
    SNOW_DEPTH_QUALITY: number
    SOLAR_RADIATION_CM3: number
    SOLAR_RADIATION_LICOR: number
    SOLAR_SUPPLY_CURRENT: number
    SOLAR_SUPPLY_VOLTAGE: number
    TEMPERATURE_HOURLY_AVERAGE: number
    WIND_SPEED_HOURLY_AVERAGE: number
    WIND_DIRECTION_HOURLY_AVERAGE: number
    WIND_SPEED_MAX_10_MINUTE: number
    WIND_GUST: number
    SOIL_MOISTURE_PROBE_1: number
    SOIL_MOISTURE_PROBE_2: number
    SOIL_MOISTURE_PROBE_3: number
    SOIL_TEMPERATURE_PROBE_1: number
    SOIL_TEMPERATURE_PROBE_2: number
    SOIL_TEMPERATURE_PROBE_3: number
    ARCHIVED_IND: string
    LAST_UPDATED_TIMESTAMP_MSEC: number
    LAST_UPDATED_TIMESTAMP: string
    CREATE_USER: string
    CREATE_DATE: string
    UPDATE_USER: string
    UPDATE_DATE: string
}

export type WeatherStation = {
    weather_station_guid: string
    station_code: number
    station_status_code: string
    station_status_desc: string
    site_type_code: string
    site_type_desc: string
    influencing_aspect_code: string
    influencing_aspect_desc: string
    data_logger_type_code: string
    data_logger_type_desc: string
    weather_zone: number
    weather_zone_desc: string
    danger_region: number
    station_acronym: string
    station_name: string
    fire_centre_org_unit_ident: number
    fire_centre: string
    zone_org_unit_identifier: number
    fire_zone: string
    data_source: string
    installation_timestamp_msec: number
    decommission_timestamp_msec: number
    hourly_ind: string
    over_winter_precip_adj_ind: string
    latitude: number
    longitude: number
    elevation_m: number
    influencing_slope: number
    windspeed_adjustment_height: string
    windspeed_adjustment_roughness: number
    eccc_file_base_url_template: string
    last_updated_timestamp_msec: number
    create_user: string
    create_date: string
    update_user: string
    update_date: string
}

@Injectable({
    providedIn: 'root',
})
export class DatamartGraphqlApiService {
    codeTableService = inject( CodeTableService )

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

    getHourlyWeather( startDate: string, endDate: string, stationCodes: number[], fields: string[], endCursor?: string ): Promise<Result<DailyWeather>> {
        return fetchGraphQL<HourlyWeather>( 'hourly_weathers',  this.makeHourlyWeatherQuery( startDate, endDate, stationCodes, fields, endCursor, true ) )
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
        return fetchGraphQL<DailyWeather>( 'daily_weathers', this.makeDailyWeatherQuery( startDate, endDate, stationCodes, fields, endCursor, true ) )
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

        return fetch( DOWNLOAD_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( body )
        } )
            .then( res => {
                if ( !res.ok ) throw Error( 'HTTP error: ' + res.statusText )
                return res.json()
            } )
            .then( res => {
                console.log(res)
                // return res.data[ queryName ]
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

function fetchGraphQL<T>( queryName: string, query: string, body?: { [key: string]: string } ): Promise<Result<T>> {
    return fetch( GRAPHQL_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( { ...body, query: query.replace( /\s+/g, ' ' ) } )
    } )
        .then( res => {
            if ( !res.ok ) throw Error( 'HTTP error: ' + res.statusText )
            return res.json()
        } )
        .then( res => {
            return res.data[ queryName ]
        } )
}

function compact( s: string ): string {
    return s.replace( /\s+/g, ' ' )
}
