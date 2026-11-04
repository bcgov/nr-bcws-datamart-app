import { inject, Injectable } from '@angular/core';
import { DatamartRestApiService } from './datamart-rest-api.service';

@Injectable({
    providedIn: 'root',
})
export class CodeTableService {
    datamartRestApiService = inject(DatamartRestApiService)

    // *********************************************************************************************************************
    // Do not re-assign or re-use abbreviations if you want to maintain compatibility with filter state URLs past & future.
    // *********************************************************************************************************************

    // weather observations
    DAILY_WEATHER_OBSERVATIONS_COLUMNS = new CodeTableHeading([
        { code: "DAILY_MEASUREMENT_TYPE_CODE",           description: "Record type",                             abbrev: 'rt' },
        { code: "TEMPERATURE",          description: "Temperature at noon (°C)",                abbrev: 't' },
        { code: "RELATIVE_HUMIDITY",     description: "Relative humidity at noon (%)",           abbrev: 'rh' },
        { code: "WIND_SPEED",            description: "Wind speed at noon (km/h)",               abbrev: 'ws' },
        { code: "WIND_DIRECTION_DEGREES",        description: "Wind direction at noon (degrees)",        abbrev: 'wd' },
        { code: "PRECIPITATION",        description: "Precipitation in previous 24 hours (mm)", abbrev: 'p' },
    ])

    // fire weather calculations 
    DAILY_WEATHER_CALCULATIONS_COLUMNS = new CodeTableHeading([
        { code: "DANGER_FOREST_INDEX",         description: "Danger Forest Index (DFI)",               abbrev: 'dfi' },
        { code: "FINE_FUEL_MOISTURE_CODE", description: "Fine Fuel Moisture Code (FFMC)",          abbrev: 'ffmc' },
        { code: "DUFF_MOISTURE_CODE",     description: "Duff Moisture Code (DMC)",                abbrev: 'dmc' },
        { code: "DROUGHT_CODE",          description: "Drought Code (DC)",                       abbrev: 'dc' },
        { code: "INITIAL_SPREAD_INDEX",   description: "Initial Spread Index (ISI)",              abbrev: 'isi' },
        { code: "BUILD_UP_INDEX",         description: "Buildup Index (BUI)",                     abbrev: 'bui' },
        { code: "FIRE_WEATHER_INDEX",     description: "Fire Weather Index (FWI)",                abbrev: 'fwi' },
        { code: "GRASSLAND_CURING",      description: "Grassland Curing",                        abbrev: 'gc' },
        { code: "DAILY_SEVERITY_RATING",          description: "Daily Severity Rating (DSR)",             abbrev: 'dsr' },
    ])

    DAILY_WEATHER_COLUMNS = new CodeTableHeading( [ 
        ...this.DAILY_WEATHER_OBSERVATIONS_COLUMNS.items, 
        ...this.DAILY_WEATHER_CALCULATIONS_COLUMNS.items 
    ] )


    // weather observations
    HOURLY_WEATHER_OBSERVATIONS_COLUMNS = new CodeTableHeading([
        { code: "TEMPERATURE",              description: "Temperature (°C)",                    abbrev: 't',    style: 'numeric' },
        { code: "WIND_SPEED",                description: "Wind speed (km/h)",                   abbrev: 'ws',   style: 'numeric' },
        { code: "WIND_DIRECTION_DEGREES",            description: "Wind direction (degrees)",            abbrev: 'wd',   style: 'numeric' },
        { code: "WIND_GUST",                 description: "Wind gust (km/h)",                    abbrev: 'wg',   style: 'numeric' },
        { code: "PRECIPITATION",            description: "Precipitation (mm)",                  abbrev: 'p',    style: 'numeric' },
        { code: "RELATIVE_HUMIDITY",         description: "Relative humidity (%)",               abbrev: 'rh',   style: 'numeric' },
    ])

    // fire weather calculations
    HOURLY_WEATHER_CALCULATIONS_COLUMNS = new CodeTableHeading([
        { code: "FINE_FUEL_MOISTURE_CODE",     description: "Fine Fuel Moisture Code (FFMC)",      abbrev: 'ffmc' },
        { code: "INITIAL_SPREAD_INDEX",       description: "Initial Spread Index (ISI)",          abbrev: 'isi' },
        { code: "FIRE_WEATHER_INDEX",         description: "Fire Weather Index (FWI)",            abbrev: 'fwi' },
    ])
    
    // ancillary observations
    HOURLY_WEATHER_ADDITIONAL_COLUMNS = new CodeTableHeading([
        { code: "SNOW_DEPTH",                description: "Snow depth",                          abbrev: 'sd',   style: 'numeric' },
        { code: "SNOW_DEPTH_QUALITY",         description: "Snow depth quality",                  abbrev: 'sdq' },
        { code: "RN_1_PLUVIO_1",               description: "Pluvio 1 RN",                         abbrev: 'p1' },
        { code: "PRECIP_PLUVIO_1_STATUS",      description: "Pluvio 1 precipitation status",       abbrev: 'p1s' },
        { code: "PRECIP_PLUVIO_1_TOTAL",       description: "Pluvio 1 precipitation total (mm)",   abbrev: 'p1t',  style: 'numeric' },
        { code: "RN_1_PLUVIO_2",              description: "Pluvio 2 RN",                         abbrev: 'p2' },
        { code: "PRECIP_PLUVIO_2_STATUS",      description: "Pluvio 2 precipitation status",       abbrev: 'p2s' },
        { code: "PRECIP_PLUVIO_2_TOTAL",       description: "Pluvio 2 precipitation total (mm)",   abbrev: 'p2t',  style: 'numeric' },
        { code: "PRECIP_RIT_STATUS",    description: "RIT precipitation status",            abbrev: 'rps' },
        { code: "PRECIP_RIT_TOTAL",  description: "RIT precipitation total",             abbrev: 'rpt',  style: 'numeric' },
        { code: "SOLAR_RADIATION_LICOR",      description: "Solar Radiation Licor",               abbrev: 'srl' },
        { code: "SOLAR_RADIATION_CM3",        description: "Solar Radiation CM3",                 abbrev: 'src' },
    ])

    HOURLY_WEATHER_COLUMNS = new CodeTableHeading( [ 
        ...this.HOURLY_WEATHER_OBSERVATIONS_COLUMNS.items, 
        ...this.HOURLY_WEATHER_CALCULATIONS_COLUMNS.items, 
        ...this.HOURLY_WEATHER_ADDITIONAL_COLUMNS.items 
    ] )


    STATION_COLUMNS = new CodeTableHeading([
        { code: "STATION_NAME",              description: "Station name",                        abbrev: 'sn' },
        { code: "STATION_CODE",              description: "Station code",                        abbrev: 'sc' },
        { code: "STATION_ACRONYM",           description: "Station acronym",                     abbrev: 'sa' },
    ])

    METADATA_COLUMNS = new CodeTableHeading([
        { code: "FIRE_CENTRE",               description: "Fire centre",                         abbrev: 'fc' },
        { code: "FIRE_ZONE",                 description: "Fire zone",                           abbrev: 'fz' },
        { code: "ELEVATION_M",                description: "Elevation (m)",                       abbrev: 'e',    style: 'numeric' },
        { code: "INFLUENCING_SLOPE",                    description: "Slope",                               abbrev: 's',    style: 'numeric' },
        { code: "GEOMETRY",                 description: "Geometry",                            abbrev: 'g' },
        { code: "INFLUENCING_ASPECT_DESC",                   description: "Aspect",                              abbrev: 'a',    style: 'numeric' },
        { code: "PLUVIOSNOWGAUGEIND",       description: "Has Pluvio Snow Gauge",               abbrev: 'psg' },
        { code: "OVER_WINTER_PRECIP_ADJ_IND",      description: "Has Over Winter Precipitation Adjustment",    abbrev: 'owpa' },
        { code: "LATITUDE",                 description: "Latitude",                            abbrev: 'lat',  style: 'numeric' },
        { code: "LONGITUDE",                description: "Longitude",                           abbrev: 'long', style: 'numeric' },
    ])

    STATION_METADATA_COLUMNS = new CodeTableHeading([
        ...this.STATION_COLUMNS.items, 
        ...this.METADATA_COLUMNS.items, 
    ])

    // FIRE_CENTRES = new CodeTable( [], () => {
    //     return this.datamartRestApiService.getFireCentres()
    //         .then( fcs => {
    //             return fcs.map( fc => {
    //                 return {
    //                     code: String(fc.FIRE_ZONE_ORG_UNIT_IDENTIFIER),
    //                     description: fc.FIRE_ZONE_ORG_UNIT_NAME
    //                 }
    //             } )
    //         } )
    // } )
    
    // FIRE_ZONES = new CodeTable( [], () => {
    //     return this.datamartRestApiService.getFireZones()
    //         .then( fcs => {
    //             return fcs.map( fc => {
    //                 return {
    //                     code: String(fc.FIRE_ZONE_ORG_UNIT_IDENTIFIER),
    //                     description: fc.FIRE_ZONE_ORG_UNIT_NAME
    //                 }
    //             } )
    //         } )
    // } )

    // ORG_UNITS = new CodeTable( [], () => {
    //     return this.datamartRestApiService.getOrgUnits()
    //         .then( fcs => {
    //             return fcs.map( fc => {
    //                 return {
    //                     code: String(fc.FIRE_ZONE_ORG_UNIT_IDENTIFIER),
    //                     description: fc.FIRE_ZONE_ORG_UNIT_NAME
    //                 }
    //             } )
    //         } )
    // } )
}


export type CodeDescription = {
    code: string
    description: string
}

export class CodeTable {
    constructor( 
        protected _items: ( CodeDescription )[], 
        protected _reload?: () => Promise<CodeDescription[]> 
    ) {
        if ( _items.length == 0 ) this.reload()
    }

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
                console.log(res)
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
