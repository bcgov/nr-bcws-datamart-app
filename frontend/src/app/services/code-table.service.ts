import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CodeTableService {
    DAILY_WEATHER_COLUMNS = new CodeTableHeading([
        // weather observations
        { code: "recordType",           description: "Record type" },
        { code: "temperature",          description: "Temperature at noon",                 heading: "Temperature (°C)" },
        { code: "relativeHumidity",     description: "Relative humidity at noon",           heading: "Relative humidity (%)" },
        { code: "windSpeed",            description: "Wind speed at noon",                  heading: "Wind speed (km/h)" },
        { code: "windDirection",        description: "Wind direction at noon",              heading: "Wind direction (degrees)" },
        { code: "precipitation",        description: "Precipitation in previous 24 hours",  heading: "Daily precipitation (mm)" },

        // fire weather calculations 
        { code: "dangerForest",         description: "Danger Forest Index (DFI)" },
        { code: "fineFuelMoistureCode", description: "Fine Fuel Moisture Code (FFMC)" },
        { code: "duffMoistureCode",     description: "Duff Moisture Code (DMC)" },
        { code: "droughtCode",          description: "Drought Code (DC)" },
        { code: "initialSpreadIndex",   description: "Initial Spread Index (ISI)" },
        { code: "buildUpIndex",         description: "Buildup Index (BUI)" },
        { code: "fireWeatherIndex",     description: "Fire Weather Index (FWI)" },
        { code: "grasslandCuring",      description: "Grassland Curing" },
        { code: "dailyRating",          description: "Daily Severity Rating (DSR)" },
    ])

    HOURLY_WEATHER_COLUMNS = new CodeTableHeading([
        // weather observations
        { code: "temperature",              description: "Temperature",                     heading: "Temperature (°C)",                    style: 'numeric' },
        { code: "windSpeed",                description: "Wind speed",                      heading: "Wind speed (km/h)",                   style: 'numeric' },
        { code: "windDirection",            description: "Wind direction",                  heading: "Wind direction (degrees)",            style: 'numeric' },
        { code: "windGust",                 description: "Wind gust",                       heading: "Wind gust (km/hr)",                   style: 'numeric' },
        { code: "precipitation",            description: "Precipitation",                   heading: "Precipitation (mm)",                  style: 'numeric' },
        { code: "relativeHumidity",         description: "Relative humidity",               heading: "Relative humidity (%)",               style: 'numeric' },

        // fire weather calculations
        { code: "fineFuelMoistureCode",     description: "Fine Fuel Moisture Code (FFMC)" },
        { code: "initialSpreadIndex",       description: "Initial Spread Index (ISI)" },
        { code: "fireWeatherIndex",         description: "Fire Weather Index (FWI)" },

        // ancillary observations
        { code: "snowDepth",                description: "Snow depth",                                                                      style: 'numeric' },
        { code: "snowDepthQuality",         description: "Snow depth quality" },
        { code: "rn1Pluvio1",               description: "Pluvio 1 RN" },
        { code: "precipPluvio1Status",      description: "Pluvio 1 precipitation status" },
        { code: "precipPluvio1Total",       description: "Pluvio 1 precipitation total",    heading: "Pluvio 1 precipitation total (mm)",   style: 'numeric' },
        { code: "rn1Pluviop2",              description: "Pluvio 2 RN" },
        { code: "precipPluvio2Status",      description: "Pluvio 2 precipitation status" },
        { code: "precipPluvio2Total",       description: "Pluvio 2 precipitation total",    heading: "Pluvio 2 precipitation total (mm)",   style: 'numeric' },
        { code: "rn1RitPrecipRitStatus",    description: "RIT precipitation status" },
        { code: "precipRitTotalPrecipRGT",  description: "RIT precipitation total",                                                         style: 'numeric' },
        { code: "solarRadiationLicor",      description: "Solar Radiation Licor" },
        { code: "solarRadiationCM3",        description: "Solar Radiation CM3" },
    ])

    STATIONS_METADATA_COLUMNS = new CodeTableHeading([
        { code: "stationName",              description: "Station name" },
        { code: "stationCode",              description: "Station code" },
        { code: "stationAcronym",           description: "Station acronym" },
        { code: "fireCentre",               description: "Fire centre" },
        { code: "fireZone",                 description: "Fire zone" },
        { code: "elevation",                description: "Elevation",                       heading: "Elevation (m)",                       style: 'numeric' },
        { code: "slope",                    description: "Slope",                                                                           style: 'numeric' },
        { code: "geometry",                 description: "Geometry" },
        { code: "aspect",                   description: "Aspect",                                                                          style: 'numeric' },
        { code: "pluvioSnowGaugeInd",       description: "Has Pluvio Snow Gauge" },
        { code: "overwinterPrecipInd",      description: "Has Over Winter Precipitation Adjustment" },
        { code: "latitude",                 description: "Latitude",                                                                        style: 'numeric' },
        { code: "longitude",                description: "Longitude",                                                                       style: 'numeric' },
    ])
}


export type CodeDescription = {
    code: string
    description: string
}

export class CodeTable {
    constructor( 
        protected _items: ( CodeDescription )[], 
        protected _reload?: () => Promise<CodeDescription[]> 
    ) {}

    get items(): CodeDescription[] {
        return this._items
    }

    forCode( code: string ): CodeDescription|undefined {
        return this._items.find( o => o.code == code )
    }

    reload(): Promise<void> {
        if ( !this._reload ) return Promise.reject( 'no reload defined' )

        return this._reload()
            .then( res => {
                this._items = res
            } )
    }
}


export type CodeDescriptionHeading = CodeDescription & { heading?: string, style?: string }

class CodeTableHeading extends CodeTable {
    constructor( _items: CodeDescriptionHeading[], _reload?: () => Promise<CodeDescriptionHeading[]> ) {
        _items.forEach( i => {
            if ( i.heading === undefined ) i.heading = i.description
        } )

        super( _items, _reload )
    }

    override forCode( code: string ): CodeDescriptionHeading|undefined {
        return this._items.find( o => o.code == code )
    }
}
