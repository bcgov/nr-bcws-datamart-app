## `/hourlies`

Returns hourly weather observations for BC Wildfire Service weather stations.

### Request

    GET /hourlies

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
`windGust` | Number | Maximum wind gust during the previous hour.
`precipitation` | Number | Precipitation accumulated over the previous hour.
`fineFuelMoistureCode` | Number | Fine Fuel Moisture Code (FFMC).
`initialSpreadIndex` | Number | Initial Spread Index (ISI).
`fireWeatherIndex` | Number | Fire Weather Index (FWI).
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

Retrieve hourly weather data for a station within a specified date range.

    GET /hourlies?stationCode=790&from=2022080100&to=2022080123

### Example response

Retrieve hourly weather data for a station within a specified date range.

{{'
    { ... }
'}}
