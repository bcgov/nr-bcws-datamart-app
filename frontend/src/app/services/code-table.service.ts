import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CodeTableService {
    // *********************************************************************************************************************
    // Do not re-assign or re-use abbreviations if you want to maintain compatibility with filter state URLs past & future.
    // *********************************************************************************************************************

    // weather observations
    DAILY_WEATHER_OBSERVATIONS_COLUMNS = new CodeTableHeading([
        { code: "recordType",           description: "Record type",                             abbrev: 'rt' },
        { code: "temperature",          description: "Temperature at noon (°C)",                abbrev: 't' },
        { code: "relativeHumidity",     description: "Relative humidity at noon (%)",           abbrev: 'rh' },
        { code: "windSpeed",            description: "Wind speed at noon (km/h)",               abbrev: 'ws' },
        { code: "windDirection",        description: "Wind direction at noon (degrees)",        abbrev: 'wd' },
        { code: "precipitation",        description: "Precipitation in previous 24 hours (mm)", abbrev: 'p' },
    ])

    // fire weather calculations 
    DAILY_WEATHER_CALCULATIONS_COLUMNS = new CodeTableHeading([
        { code: "dangerForest",         description: "Danger Forest Index (DFI)",               abbrev: 'dfi' },
        { code: "fineFuelMoistureCode", description: "Fine Fuel Moisture Code (FFMC)",          abbrev: 'ffmc' },
        { code: "duffMoistureCode",     description: "Duff Moisture Code (DMC)",                abbrev: 'dmc' },
        { code: "droughtCode",          description: "Drought Code (DC)",                       abbrev: 'dc' },
        { code: "initialSpreadIndex",   description: "Initial Spread Index (ISI)",              abbrev: 'isi' },
        { code: "buildUpIndex",         description: "Buildup Index (BUI)",                     abbrev: 'bui' },
        { code: "fireWeatherIndex",     description: "Fire Weather Index (FWI)",                abbrev: 'fwi' },
        { code: "grasslandCuring",      description: "Grassland Curing",                        abbrev: 'gc' },
        { code: "dailyRating",          description: "Daily Severity Rating (DSR)",             abbrev: 'dsr' },
    ])

    DAILY_WEATHER_COLUMNS = new CodeTableHeading( [ 
        ...this.DAILY_WEATHER_OBSERVATIONS_COLUMNS.items, 
        ...this.DAILY_WEATHER_CALCULATIONS_COLUMNS.items 
    ] )


    // weather observations
    HOURLY_WEATHER_OBSERVATIONS_COLUMNS = new CodeTableHeading([
        { code: "temperature",              description: "Temperature (°C)",                    abbrev: 't',    style: 'numeric' },
        { code: "windSpeed",                description: "Wind speed (km/h)",                   abbrev: 'ws',   style: 'numeric' },
        { code: "windDirection",            description: "Wind direction (degrees)",            abbrev: 'wd',   style: 'numeric' },
        { code: "windGust",                 description: "Wind gust (km/h)",                    abbrev: 'wg',   style: 'numeric' },
        { code: "precipitation",            description: "Precipitation (mm)",                  abbrev: 'p',    style: 'numeric' },
        { code: "relativeHumidity",         description: "Relative humidity (%)",               abbrev: 'rh',   style: 'numeric' },
    ])

    // fire weather calculations
    HOURLY_WEATHER_CALCULATIONS_COLUMNS = new CodeTableHeading([
        { code: "fineFuelMoistureCode",     description: "Fine Fuel Moisture Code (FFMC)",      abbrev: 'ffmc' },
        { code: "initialSpreadIndex",       description: "Initial Spread Index (ISI)",          abbrev: 'isi' },
        { code: "fireWeatherIndex",         description: "Fire Weather Index (FWI)",            abbrev: 'fwi' },
    ])
    
    // ancillary observations
    HOURLY_WEATHER_ADDITIONAL_COLUMNS = new CodeTableHeading([
        { code: "snowDepth",                description: "Snow depth",                          abbrev: 'sd',   style: 'numeric' },
        { code: "snowDepthQuality",         description: "Snow depth quality",                  abbrev: 'sdq' },
        { code: "rn1Pluvio1",               description: "Pluvio 1 RN",                         abbrev: 'p1' },
        { code: "precipPluvio1Status",      description: "Pluvio 1 precipitation status",       abbrev: 'p1s' },
        { code: "precipPluvio1Total",       description: "Pluvio 1 precipitation total (mm)",   abbrev: 'p1t',  style: 'numeric' },
        { code: "rn1Pluviop2",              description: "Pluvio 2 RN",                         abbrev: 'p2' },
        { code: "precipPluvio2Status",      description: "Pluvio 2 precipitation status",       abbrev: 'p2s' },
        { code: "precipPluvio2Total",       description: "Pluvio 2 precipitation total (mm)",   abbrev: 'p2t',  style: 'numeric' },
        { code: "rn1RitPrecipRitStatus",    description: "RIT precipitation status",            abbrev: 'rps' },
        { code: "precipRitTotalPrecipRGT",  description: "RIT precipitation total",             abbrev: 'rpt',  style: 'numeric' },
        { code: "solarRadiationLicor",      description: "Solar Radiation Licor",               abbrev: 'srl' },
        { code: "solarRadiationCM3",        description: "Solar Radiation CM3",                 abbrev: 'src' },
    ])

    HOURLY_WEATHER_COLUMNS = new CodeTableHeading( [ 
        ...this.HOURLY_WEATHER_OBSERVATIONS_COLUMNS.items, 
        ...this.HOURLY_WEATHER_CALCULATIONS_COLUMNS.items, 
        ...this.HOURLY_WEATHER_ADDITIONAL_COLUMNS.items 
    ] )


    STATIONS_METADATA_COLUMNS = new CodeTableHeading([
        { code: "stationName",              description: "Station name",                        abbrev: 'sn' },
        { code: "stationCode",              description: "Station code",                        abbrev: 'sc' },
        { code: "stationAcronym",           description: "Station acronym",                     abbrev: 'sa' },
        { code: "fireCentre",               description: "Fire centre",                         abbrev: 'fc' },
        { code: "fireZone",                 description: "Fire zone",                           abbrev: 'fz' },
        { code: "elevation",                description: "Elevation (m)",                       abbrev: 'e',    style: 'numeric' },
        { code: "slope",                    description: "Slope",                               abbrev: 's',    style: 'numeric' },
        { code: "geometry",                 description: "Geometry",                            abbrev: 'g' },
        { code: "aspect",                   description: "Aspect",                              abbrev: 'a',    style: 'numeric' },
        { code: "pluvioSnowGaugeInd",       description: "Has Pluvio Snow Gauge",               abbrev: 'psg' },
        { code: "overwinterPrecipInd",      description: "Has Over Winter Precipitation Adjustment",    abbrev: 'owpa' },
        { code: "latitude",                 description: "Latitude",                            abbrev: 'lat',  style: 'numeric' },
        { code: "longitude",                description: "Longitude",                           abbrev: 'long', style: 'numeric' },
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


export type CodeDescriptionHeading = CodeDescription & { 
    abbrev: string, 
    style?: string 
}

class CodeTableHeading extends CodeTable {
    constructor( _items: CodeDescriptionHeading[], _reload?: () => Promise<CodeDescriptionHeading[]> ) {
        super( _items, _reload )

        let a: { [ key: string ]: CodeDescriptionHeading } = {}

        this.items.forEach( c => {
            if ( a[ c.abbrev ] ) throw Error( `${ c.code } and ${ a[ c.abbrev ].code } have same abbrev '${ c.abbrev }'` )
           
            a[ c.abbrev ] = c
        } )
    }

    override get items(): CodeDescriptionHeading[] {
        return this._items as CodeDescriptionHeading[]
    }

    override forCode( code: string ): CodeDescriptionHeading|undefined {
        return this.items.find( o => o.code == code )
    }

    forAbbrev( abbrev: string ): CodeDescriptionHeading|undefined {
        return this.items.find( o => o.abbrev == abbrev )
    }
}
