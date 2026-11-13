## `/dailies` 

Returns daily weather data derived from the noon hourly observation. 
Daily data includes weather measurements, precipitation accumulated over the previous 24 hours, fire weather indices when available and danger class.

### Request

    GET /dailies

### Response attributes

Each object in the response contains the following attributes.

Attribute | Type | Description
-- | - | ----
`recordType` | Text | Indicates whether the observation is actual or manually entered.
`stationName` | Text | Common name of the weather station.
`stationCode` | Text | Unique station code.
`fireCentre` | Text | Fire Centre associated with the station.
`stationAcronym` | Text | Station acronym, if available.
`weatherTimestamp` | Number | Date and time associated with the observation.
`temperature` | Number | Air temperature.
`relativeHumidity` | Number | Relative humidity.
`windSpeed` | Number | Wind speed.
`windDirection` | Number | Wind direction in degrees.
`precipitation` | Number | Precipitation.
`dangerForest` | Number | Danger Forest Index associated with the observation.
`fineFuelMoistureCode` | Number | Fine Fuel Moisture Code (FFMC).
`duffMoistureCode` | Number | Duff Moisture Code (DMC).
`droughtCode` | Number | Drought Code (DC).
`initialSpreadIndex` | Number | Initial Spread Index (ISI).
`buildUpIndex` | Number | Buildup Index (BUI).
`fireWeatherIndex` | Number | Fire Weather Index (FWI).
`grasslandCuring` | Number | Grassland curing value.
`elevation` | Number | Elevation in metres above sea level.
`geometry` | GeoJSON | Geographic location.

For definitions of the measurements and fire weather indices returned by this endpoint, see [About weather data](about-weather-data).


### Query parameters

Parameter | Type | Description
-- | - | ----
`pageNumber` | Integer | Page to retrieve. Pages are zero-indexed.
`pageRowCount` | Integer | Number of records to return on each page.
`orderBy` | String | Attribute and direction to sort by.
`query` | String | Advanced query used to filter results.
`from` | Date | Start of requested date range, yyyyMMddHH.
`to` | Date | End of requested date range, yyyyMMddHH. Maximum range is 31 days.
`fireCentre` | String | Filter by Fire Centre.
`stationCode` | String | Filter by station code.
`stationName` | String | Filter by station name.
`stationAcronym` | String | Filter by station acronym.
`boundingBox` | String | Limit results to a geographic bounding box.
`point` | String | Geographic point used with distance.
`distance` | String | Radius around point, in kilometres.

### Example request

Retrieve daily weather data for a station within a specified date range.

    GET /dailies?stationCode=790&from=2022080100&to=2022083023

### Example response

Retrieve daily weather data for a station within a specified date range.

{{'
    { ... }
'}}

