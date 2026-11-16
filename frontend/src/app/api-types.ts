type ApiTypeMap = {
    String: string
    DateTime: string
    Decimal: number
    Float: number
    Long: number
    Short: number
    Int: number
    Single: number
    daily_weatherConnection: unknown
    hourly_weatherConnection: unknown
}

export type FieldDef = {
    name: string
    apiType: string
    description: string
}

// curl -v --json 
//     '{ "query": "query Inspect { __type(name: \"weather_stations\") { fields { name type { name } } } }" }' 
//     https://nr-bcws-datamart-app-int-api.azurewebsites.net/graphql 
//     | jq '.data.__type.fields[] | { name:.name, apiType:.type.name }' -c  

export const WeatherStationDefs = [
    {   name: "WEATHER_STATION_GUID", apiType: "String",
        description: '', 
    },
    {   name: "STATION_STATUS_CODE", apiType: "String",
        description: '', 
    },
    {   name: "STATION_STATUS_DESC", apiType: "String",
        description: '', 
    },
    {   name: "STATION_CODE", apiType: "Long",
        description: 'Unique station code.', 
    },
    {   name: "STATION_ACRONYM", apiType: "String",
        description: 'Station acronym, if available.', 
    },
    {   name: "STATION_NAME", apiType: "String",
        description: 'Common name of the weather station.', 
    },
    {   name: "STATION_COMMENT", apiType: "String",
        description: '', 
    },
    {   name: "CRD_STATION_NAME", apiType: "String",
        description: '', 
    },
    {   name: "STATION_RANKING", apiType: "Short",
        description: '', 
    },
    {   name: "STATION_ACCESS_TYPE_CODE", apiType: "String",
        description: '', 
    },
    {   name: "STATION_ACCESS_TYPE_DESC", apiType: "String",
        description: '', 
    },
    {   name: "SITE_TYPE_CODE", apiType: "String",
        description: '', 
    },
    {   name: "SITE_TYPE_DESC", apiType: "String",
        description: '', 
    },
    {   name: "INFLUENCING_ASPECT_CODE", apiType: "String",
        description: '', 
    },
    {   name: "INFLUENCING_ASPECT_DESC", apiType: "String",
        description: 'General direction the station site faces.', 
    },
    {   name: "WEATHER_STATION_OWNER_GUID", apiType: "String",
        description: '', 
    },
    {   name: "OWNER_NAME", apiType: "String",
        description: '', 
    },
    {   name: "OWNER_DISPLAY_NAME", apiType: "String",
        description: '', 
    },
    {   name: "OWNER_COMMENT", apiType: "String",
        description: '', 
    },
    {   name: "DATA_LOGGER_TYPE_CODE", apiType: "String",
        description: '', 
    },
    {   name: "DATA_LOGGER_TYPE_DESC", apiType: "String",
        description: '', 
    },
    {   name: "WEATHER_ZONE", apiType: "Short",
        description: '', 
    },
    {   name: "WEATHER_ZONE_DESC", apiType: "String",
        description: '', 
    },
    {   name: "DANGER_REGION", apiType: "Short",
        description: '', 
    },
    {   name: "STATION_ACCESS_DESCRIPTION", apiType: "String",
        description: '', 
    },
    {   name: "FIRE_CENTRE_ORG_UNIT_IDENT", apiType: "Long",
        description: '', 
    },
    {   name: "FIRE_CENTRE", apiType: "String",
        description: 'Fire Centre associated with the station.', 
    },
    {   name: "ZONE_ORG_UNIT_IDENTIFIER", apiType: "Long",
        description: '', 
    },
    {   name: "FIRE_ZONE", apiType: "String",
        description: 'Fire Zone associated with the station.', 
    },
    {   name: "DATA_SOURCE", apiType: "String",
        description: '', 
    },
    {   name: "INSTALLATION_TIMESTAMP_MSEC", apiType: "Decimal",
        description: '', 
    },
    {   name: "DECOMMISSION_TIMESTAMP_MSEC", apiType: "Decimal",
        description: '', 
    },
    {   name: "HOURLY_IND", apiType: "String",
        description: '', 
    },
    {   name: "OVER_WINTER_PRECIP_ADJ_IND", apiType: "String",
        description: 'Indicates whether the station reports overwinter precipitation.', 
    },
    {   name: "PLUVIO_SNOW_GUAGE_IND", apiType: "String",
        description: 'Indicates whether the station has a snow gauge.', 
    },
    {   name: "AUTO_UPDATE_LAT_LON_IND", apiType: "String",
        description: '', 
    },
    {   name: "LATITUDE", apiType: "Float",
        description: 'Latitude of station location.', 
    },
    {   name: "LONGITUDE", apiType: "Float",
        description: 'Longitude of station location.', 
    },
    {   name: "ELEVATION_M", apiType: "Int",
        description: 'Elevation in metres above sea level.', 
    },
    {   name: "INFLUENCING_SLOPE", apiType: "Short",
        description: 'Average slope of the terrain.', 
    },
    {   name: "SURFACE_TYPE_CODE", apiType: "String",
        description: '', 
    },
    {   name: "SURFACE_TYPE_DESC", apiType: "String",
        description: '', 
    },
    {   name: "WINDSPEED_ADJUSTMENT_HEIGHT", apiType: "String",
        description: 'Height of the mast where the wind speed instrument is mounted.', 
    },
    {   name: "WINDSPEED_ADJUSTMENT_ROUGHNESS", apiType: "Single",
        description: 'Roughness factor applied to wind speed readings.', 
    },
    {   name: "ECCC_FILE_BASE_URL_TEMPLATE", apiType: "String",
        description: '', 
    },
    {   name: "LAST_PROCESSED_SOURCE_TIME", apiType: "String",
        description: '', 
    },
    {   name: "LAST_UPDATED_TIMESTAMP_MSEC", apiType: "Decimal",
        description: '', 
    },
    {   name: "CREATE_USER", apiType: "String",
        description: '', 
    },
    {   name: "CREATE_DATE", apiType: "DateTime",
        description: '', 
    },
    {   name: "UPDATE_USER", apiType: "String",
        description: '', 
    },
    {   name: "UPDATE_DATE", apiType: "DateTime",
        description: '', 
    },
    {   name: "daily_weather", apiType: "daily_weatherConnection",
        description: '', 
    },
    {   name: "hourly_weather", apiType: "hourly_weatherConnection",
        description: '', 
    },
] as const

export const WeatherStationDef = WeatherStationDefs.reduce<{ [ key: string ]: FieldDef }>( (a,v) => {
    a[ v.name ] = v
    return a
}, {} )

export type WeatherStation = {
    [ Item in typeof WeatherStationDefs[number] as Item['name'] ]: ApiTypeMap[ Item['apiType'] ]
}

// export type WeatherStation = {
//     WEATHER_STATION_GUID: string                 // "0x58AE85ADAE834D1D92539B1B2208065B",
//     STATION_STATUS_CODE: string                  // "ACTIVE",
//     STATION_STATUS_DESC: string                  // "Active",
//     STATION_CODE: number                         // 1573,
//     STATION_ACRONYM: string                      // "PPS",
//     STATION_NAME: string                         // "PAUL PILONS STATION",
//     STATION_COMMENT: string                      // "This is a test station for IM",
//     CRD_STATION_NAME: string                     // null,
//     STATION_RANKING: number                      // 11,
//     STATION_ACCESS_TYPE_CODE: string             // null,
//     STATION_ACCESS_TYPE_DESC: string             // null,
//     SITE_TYPE_CODE: string                       // "DOWNLOAD",
//     SITE_TYPE_DESC: string                       // "Download",
//     INFLUENCING_ASPECT_CODE: string              // "NE",
//     INFLUENCING_ASPECT_DESC: string              // "North-East",
//     WEATHER_STATION_OWNER_GUID: string           // "0xA9843BB70F444A808A6279CCA2A5C758",
//     OWNER_NAME: string                           // "BCWS",
//     OWNER_DISPLAY_NAME: string                   // "BC Wildfire Service",
//     OWNER_COMMENT: string                        // null,
//     DATA_LOGGER_TYPE_CODE: string                // "AXIOM_F6",
//     DATA_LOGGER_TYPE_DESC: string                // "AXIOM/F6",
//     WEATHER_ZONE: number                         // 2,
//     WEATHER_ZONE_DESC: string                    // "Zone 2",
//     DANGER_REGION: number                        // 1,
//     STATION_ACCESS_DESCRIPTION: string           // null,
//     FIRE_CENTRE_ORG_UNIT_IDENT: number           // 50,
//     FIRE_CENTRE: string                          // "Coastal Fire Centre",
//     ZONE_ORG_UNIT_IDENTIFIER: number             // 54,
//     FIRE_ZONE: string                            // "South Island Zone",
//     DATA_SOURCE: string                          // "ELEM360",
//     INSTALLATION_TIMESTAMP_MSEC: number          // 1652126012891,
//     DECOMMISSION_TIMESTAMP_MSEC: string          // null,
//     HOURLY_IND: string                           // "Y",
//     OVER_WINTER_PRECIP_ADJ_IND: string           // "Y",
//     PLUVIO_SNOW_GUAGE_IND: string                // "Y",
//     AUTO_UPDATE_LAT_LON_IND: string              // "N",
//     LATITUDE: number                             // 48.659,
//     LONGITUDE: number                            // -124.593,
//     ELEVATION_M: number                          // 240,
//     INFLUENCING_SLOPE: number                    // 67,
//     WINDSPEED_ADJUSTMENT_HEIGHT: string          // "9.0_11.9",
//     WINDSPEED_ADJUSTMENT_ROUGHNESS: number       // 1,
//     SURFACE_TYPE_CODE: string                    // "SMOOTH",
//     SURFACE_TYPE_DESC: string                    // "Smooth",
//     ECCC_FILE_BASE_URL_TEMPLATE: string          // null,
//     LAST_PROCESSED_SOURCE_TIME: string           // null,
//     LAST_UPDATED_TIMESTAMP_MSEC: number          // 1652126101059,
//     CREATE_USER: string                          // "DHEMSWOR",
//     CREATE_DATE: string                          // "2022-05-09 12:53:33.000000",
//     UPDATE_USER: string                          // "WFWX-2995",
//     UPDATE_DATE: string                          // "2026-08-06 12:33:27.000000"
// }

export type DailyWeather = {
    DAILY_WEATHER_MEAS_GUID: string
    WEATHER_STATION_GUID: string
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

export type DailyWeatherStation = DailyWeather & { station: WeatherStation }

export type HourlyWeather = {
    HOURLY_WEATHER_MEAS_GUID: string
    WEATHER_STATION_GUID: string
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

export type HourlyWeatherStation = HourlyWeather & { station: WeatherStation }

/*
    Use these commands to regenerate the types:
    (Requires curl and jq)

    curl -v --json '{
        "query": "query Inspect { __type(name: \"daily_weather\") { fields { name type { name } } } }"
    }' https://nr-bcws-datamart-app-int-api.azurewebsites.net/graphql | jq '.data.__type.fields[]|[.name,.type.name]' -c 

    curl -v --json '{
        "query": "query Inspect { __type(name: \"hourly_weather\") { fields { name type { name } } } }"
    }' https://nr-bcws-datamart-app-int-api.azurewebsites.net/graphql | jq '.data.__type.fields[]|[.name,.type.name]' -c 

    curl -v --json '{
        "query": "query Inspect { __type(name: \"weather_stations\") { fields { name type { name } } } }"
    }' https://nr-bcws-datamart-app-int-api.azurewebsites.net/graphql | jq '.data.__type.fields[]|[.name,.type.name]' -c 
*/