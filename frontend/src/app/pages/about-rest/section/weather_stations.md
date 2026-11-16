## `/stations`

Returns information about BC Wildfire Service weather stations.

### Request

    GET /stations

### Response attributes

Attribute | Type | Description

-- | - | ----
`stationCode` | Text | Unique station code.
`stationName` | Text | Common name of the weather station.
`fireCentre` | Text | Fire Centre associated with the station.
`fireZone` | Text | Fire Zone associated with the station.
`stationAcronym` | Text | Station acronym, if available.
`elevation` | Number | Elevation in metres above sea level.
`slope` | Number | Average slope of the terrain.
`aspect` | Number | General direction the station site faces.
`windspeedHeight` | Number | Height of the mast where the wind speed instrument is mounted.
`adjustedRoughness` | Number | Roughness factor applied to wind speed readings.
`isSnowGauge` | Boolean | Indicates whether the station has a snow gauge.
`isPrecip` | Boolean | Indicates whether the station reports overwinter precipitation.
`geometry` | GeoJSON | Geographic location.

For definitions of the information about weather stations returned by this endpoint, see [About weather stations](about-weather-stations).

### Query parameters

Parameter | Type | Description
-- | - | ----
`pageNumber` | Integer | Page to retrieve. Pages are zero-indexed.
`pageRowCount` | Integer | Number of records to return on each page.
`orderBy` | String | Attribute and direction to sort by.
`query` | String | Advanced query used to filter results.
`fireCentre` | String | Filter by Fire Centre.
`fireZone` | String | Filter by Fire Zone.
`stationCode` | String | Filter by station code.
`stationName` | String | Filter by station name.
`stationAcronym` | String | Filter by station acronym.
`boundingBox` | String | Limit results to a geographic bounding box.
`point` | String | Geographic point used with distance.
`distance` | String | Radius around point, in kilometres.

### Example request

Retrieve station information for stations within a fire centre.

    GET /stations?fireCentre=6

### Example response

Retrieve station information for stations within a fire centre.

{{'
    { ... }
'}}



## `/stations/[station-code]`

Returns information about a specific BC Wildfire Service weather station.

### Path parameter

Parameter | Type | Description
-- | - | ----
`station-code` | String | The unique code identifying the weather station.

### Response attributes

The response contains the weather station attributes described in the [`/stations`](about-rest#stations) endpoint.

### Example request

Retrieve information about a specific weather station.

    GET /stations/[station-code]

For example:

    GET /stations/790

### Example response

{{'
    { ... }
'}}
