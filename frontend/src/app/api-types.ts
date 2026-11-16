type ApiTypeMap = {
    String: string
    DateTime: string
    Decimal: number
    Float: number
    Long: number
    Short: number
    Int: number
    Single: number
}

export type FieldDef = {
    name: string
    apiType: string
    description: string
}

//#######################################################################################################################

// curl -v https://nr-bcws-datamart-app-int-api.azurewebsites.net/graphql \
//     --json '{ "query": "query Inspect { __type(name: \"weather_stations\") { fields { name type { name } } } }" }' \
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
    // {   name: "daily_weather", apiType: "daily_weatherConnection",
    //     description: '', 
    // },
    // {   name: "hourly_weather", apiType: "hourly_weatherConnection",
    //     description: '', 
    // },
] as const

export const WeatherStationDef = WeatherStationDefs.reduce<{ [ key: string ]: FieldDef }>( (a,v) => {
    a[ v.name ] = v
    return a
}, {} )

export type WeatherStation = {
    [ Item in typeof WeatherStationDefs[number] as Item['name'] ]: ApiTypeMap[ Item['apiType'] ]
}

//#######################################################################################################################

// curl -v https://nr-bcws-datamart-app-int-api.azurewebsites.net/graphql \
//     --json '{ "query": "query Inspect { __type(name: \"daily_weather\") { fields { name type { name } } } }" }' \
//     | jq '.data.__type.fields[] | { name:.name, apiType:.type.name }' -c  

export const DailyWeatherDefs = [
    { name:"DAILY_WEATHER_MEAS_GUID", apiType:"String",
        description: ''
    },
    { name:"WEATHER_STATION_GUID", apiType:"String",
        description: ''
    },
    { name:"WEATHER_TIMESTAMP_MSEC", apiType:"Decimal",
        description: ''
    },
    { name:"WEATHER_TIMESTAMP", apiType:"DateTime",
        description: 'Date and time associated with the observation.'
    },
    { name:"DAILY_MEASUREMENT_TYPE_CODE", apiType:"String",
        description: 'Indicates whether the observation is actual or manually entered.'
    },
    { name:"TEMPERATURE", apiType:"Float",
        description: 'Air temperature.'
    },
    { name:"TEMPERATURE_MIN", apiType:"Float",
        description: ''
    },
    { name:"TEMPERATURE_MAX", apiType:"Float",
        description: ''
    },
    { name:"RELATIVE_HUMIDITY", apiType:"Float",
        description: 'Relative humidity.'
    },
    { name:"RELATIVE_HUMIDITY_MIN", apiType:"Float",
        description: ''
    },
    { name:"RELATIVE_HUMIDITY_MAX", apiType:"Float",
        description: ''
    },
    { name:"PRECIPITATION", apiType:"Float",
        description: 'Precipitation.'
    },
    { name:"WIND_SPEED", apiType:"Float",
        description: 'Wind speed.'
    },
    { name:"WIND_DIRECTION_DEGREES", apiType:"Float",
        description: 'Wind direction in degrees.'
    },
    { name:"ADJUSTED_WIND_SPEED", apiType:"Float",
        description: ''
    },
    { name:"DAILY_SEVERITY_RATING", apiType:"Float",
        description: ''
    },
    { name:"DROUGHT_CODE", apiType:"Float",
        description: 'Drought Code (DC).'
    },
    { name:"DUFF_MOISTURE_CODE", apiType:"Float",
        description: 'Duff Moisture Code (DMC).'
    },
    { name:"FINE_FUEL_MOISTURE_CODE", apiType:"Float",
        description: 'Fine Fuel Moisture Code (FFMC).'
    },
    { name:"GRASSLAND_CURING", apiType:"Float",
        description: 'Grassland curing value.'
    },
    { name:"BUILD_UP_INDEX", apiType:"Float",
        description: 'Buildup Index (BUI).'
    },
    { name:"DANGER_FOREST_INDEX", apiType:"Long",
        description: 'Danger Forest Index associated with the observation.'
    },
    { name:"DANGER_GRASSLAND_INDEX", apiType:"Long",
        description: ''
    },
    { name:"DANGER_SCRUB_INDEX", apiType:"Long",
        description: ''
    },
    { name:"FIRE_WEATHER_INDEX", apiType:"Float",
        description: 'Fire Weather Index (FWI).'
    },
    { name:"INITIAL_SPREAD_INDEX", apiType:"Float",
        description: 'Initial Spread Index (ISI).'
    },
    { name:"MISSING_HOURLY_DATA_IND", apiType:"String",
        description: ''
    },
    { name:"OBSERVATION_VALID_IND", apiType:"String",
        description: ''
    },
    { name:"OBSERVATION_VALID_COMMENT", apiType:"String",
        description: ''
    },
    { name:"ARCHIVED_IND", apiType:"String",
        description: ''
    },
    { name:"LAST_UPDATED_TIMESTAMP_MSEC", apiType:"Decimal",
        description: ''
    },
    { name:"LAST_UPDATED_TIMESTAMP", apiType:"DateTime",
        description: ''
    },
    { name:"CREATE_USER", apiType:"String",
        description: ''
    },
    { name:"CREATE_DATE", apiType:"DateTime",
        description: ''
    },
    { name:"UPDATE_USER", apiType:"String",
        description: ''
    },
    { name:"UPDATE_DATE", apiType:"DateTime",
        description: ''
    },
    // { name:"station", apiType:"weather_stations",
    //     description: ''
    // },
] as const

export const DailyWeatherDef = DailyWeatherDefs.reduce<{ [ key: string ]: FieldDef }>( (a,v) => {
    a[ v.name ] = v
    return a
}, {} )

export type DailyWeather = {
    [ Item in typeof DailyWeatherDefs[number] as Item['name'] ]: ApiTypeMap[ Item['apiType'] ]
}

export type DailyWeatherStation = DailyWeather & { station: WeatherStation }

//#######################################################################################################################

// curl -v https://nr-bcws-datamart-app-int-api.azurewebsites.net/graphql \
//     --json '{ "query": "query Inspect { __type(name: \"hourly_weather\") { fields { name type { name } } } }" }' \
//     | jq '.data.__type.fields[] | { name:.name, apiType:.type.name }' -c  

export const HourlyWeatherDefs = [
    { name:"HOURLY_WEATHER_MEAS_GUID", apiType:"String",
        description: ''
    },
    { name:"WEATHER_STATION_GUID", apiType:"String",
        description: ''
    },
    { name:"WEATHER_TIMESTAMP_MSEC", apiType:"Decimal",
        description: ''
    },
    { name:"WEATHER_TIMESTAMP", apiType:"DateTime",
        description: 'Date and time associated with the observation.'
    },
    { name:"HOURLY_MEASUREMENT_TYPE_CODE", apiType:"String",
        description: 'Indicates whether the observation is actual or manually entered.'
    },
    { name:"HOURLY_MEASUREMENT_TYPE_DESC", apiType:"String",
        description: ''
    },
    { name:"TEMPERATURE", apiType:"Float",
        description: 'Air temperature.'
    },
    { name:"BAROMETRIC_PRESSURE", apiType:"Float",
        description: ''
    },
    { name:"RELATIVE_HUMIDITY", apiType:"Float",
        description: 'Relative humidity.'
    },
    { name:"PRECIPITATION", apiType:"Float",
        description: 'Precipitation accumulated over the previous hour.'
    },
    { name:"WIND_SPEED", apiType:"Float",
        description: 'Wind speed.'
    },
    { name:"WIND_DIRECTION_DEGREES", apiType:"Float",
        description: 'Wind direction in degrees.'
    },
    { name:"FINE_FUEL_MOISTURE_CODE", apiType:"Float",
        description: 'Fine Fuel Moisture Code (FFMC).'
    },
    { name:"FIRE_WEATHER_INDEX", apiType:"Float",
        description: 'Fire Weather Index (FWI).'
    },
    { name:"INITIAL_SPREAD_INDEX", apiType:"Float",
        description: 'Initial Spread Index (ISI).'
    },
    { name:"OBSERVATION_VALID_IND", apiType:"String",
        description: ''
    },
    { name:"OBSERVATION_VALID_COMMENT", apiType:"String",
        description: ''
    },
    { name:"ADJUSTED_WIND_SPEED", apiType:"Float",
        description: ''
    },
    { name:"BATTERY_SUPPLY_CURRENT", apiType:"Float",
        description: ''
    },
    { name:"BATTERY_SUPPLY_VOLTAGE", apiType:"Float",
        description: ''
    },
    { name:"FUEL_STICK_MOISTURE", apiType:"Float",
        description: ''
    },
    { name:"FUEL_STICK_TEMPERATURE", apiType:"Float",
        description: ''
    },
    { name:"PRECIP_PLUVIO_1_STATUS", apiType:"Float",
        description: ''
    },
    { name:"PRECIP_PLUVIO_1_TOTAL", apiType:"Float",
        description: ''
    },
    { name:"PRECIP_PLUVIO_2_STATUS", apiType:"Float",
        description: ''
    },
    { name:"PRECIP_PLUVIO_2_TOTAL", apiType:"Float",
        description: ''
    },
    { name:"PRECIP_RIT_STATUS", apiType:"Float",
        description: ''
    },
    { name:"PRECIP_RIT_TOTAL", apiType:"Float",
        description: ''
    },
    { name:"PRECIP_RGT", apiType:"Float",
        description: ''
    },
    { name:"PRECIP_PC2_STATUS", apiType:"Float",
        description: ''
    },
    { name:"PRECIP_PC2_TOTAL", apiType:"Float",
        description: ''
    },
    { name:"RELATIVE_HUMIDITY_HOURLY_AVG", apiType:"Float",
        description: ''
    },
    { name:"RN_1_PLUVIO_1", apiType:"Float",
        description: ''
    },
    { name:"RN_1_PLUVIO_2", apiType:"Float",
        description: ''
    },
    { name:"RN_1_RIT", apiType:"Float",
        description: ''
    },
    { name:"RN_1_PC2", apiType:"Float",
        description: ''
    },
    { name:"SNOW_DEPTH", apiType:"Float",
        description: ''
    },
    { name:"SNOW_DEPTH_QUALITY", apiType:"Float",
        description: ''
    },
    { name:"SOLAR_RADIATION_CM3", apiType:"Float",
        description: ''
    },
    { name:"SOLAR_RADIATION_LICOR", apiType:"Float",
        description: ''
    },
    { name:"SOLAR_SUPPLY_CURRENT", apiType:"Float",
        description: ''
    },
    { name:"SOLAR_SUPPLY_VOLTAGE", apiType:"Float",
        description: ''
    },
    { name:"TEMPERATURE_HOURLY_AVERAGE", apiType:"Float",
        description: ''
    },
    { name:"WIND_SPEED_HOURLY_AVERAGE", apiType:"Float",
        description: ''
    },
    { name:"WIND_DIRECTION_HOURLY_AVERAGE", apiType:"Float",
        description: ''
    },
    { name:"WIND_SPEED_MAX_10_MINUTE", apiType:"Float",
        description: ''
    },
    { name:"WIND_GUST", apiType:"Float",
        description: 'Maximum wind gust during the previous hour.'
    },
    { name:"SOIL_MOISTURE_PROBE_1", apiType:"Float",
        description: ''
    },
    { name:"SOIL_MOISTURE_PROBE_2", apiType:"Float",
        description: ''
    },
    { name:"SOIL_MOISTURE_PROBE_3", apiType:"Float",
        description: ''
    },
    { name:"SOIL_TEMPERATURE_PROBE_1", apiType:"Float",
        description: ''
    },
    { name:"SOIL_TEMPERATURE_PROBE_2", apiType:"Float",
        description: ''
    },
    { name:"SOIL_TEMPERATURE_PROBE_3", apiType:"Float",
        description: ''
    },
    { name:"ARCHIVED_IND", apiType:"String",
        description: ''
    },
    { name:"LAST_UPDATED_TIMESTAMP_MSEC", apiType:"Decimal",
        description: ''
    },
    { name:"LAST_UPDATED_TIMESTAMP", apiType:"DateTime",
        description: ''
    },
    { name:"CREATE_USER", apiType:"String",
        description: ''
    },
    { name:"CREATE_DATE", apiType:"DateTime",
        description: ''
    },
    { name:"UPDATE_USER", apiType:"String",
        description: ''
    },
    { name:"UPDATE_DATE", apiType:"DateTime",
        description: ''
    },
    // { name:"station", apiType:"weather_stations",
    //     description: ''
    // },
] as const

export const HourlyWeatherDef = HourlyWeatherDefs.reduce<{ [ key: string ]: FieldDef }>( (a,v) => {
    a[ v.name ] = v
    return a
}, {} )

export type HourlyWeather = {
    [ Item in typeof HourlyWeatherDefs[number] as Item['name'] ]: ApiTypeMap[ Item['apiType'] ]
}

export type HourlyWeatherStation = HourlyWeather & { station: WeatherStation }

