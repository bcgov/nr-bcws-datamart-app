import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Filter } from '../pages/station-selection/filters/station-selection-filters.component';

const WEATHER_STATIONS_API = 'https://container-app-api-yujhzooydm766.bluewater-fbba4d31.canadacentral.azurecontainerapps.io/api/weather_stations';

export type WeatherStation = {
    WEATHER_STATION_GUID: string              // "03C0B7CE66EF41BFB0DBDE3A70AB68D0",
    STATION_ACRONYM: string                   // null,
    STATION_NAME: string                      // "Utopia",
    STATION_STATUS_CODE: string               // "ACTIVE",
    STATION_STATUS_DESC: string               // "Active",
    STATION_CODE: number                      // 1817,
    SITE_TYPE_CODE: string                    // null,
    SITE_TYPE_DESC: string                    // null,
    INFLUENCING_ASPECT_CODE: string           // null,
    INFLUENCING_ASPECT_DESC: string           // null,
    WEATHER_STATION_OWNER_GUID: string        // null,
    OWNER_NAME: string                        // null,
    OWNER_DISPLAY_NAME: string                // null,
    OWNER_COMMENT: string                     // null,
    DATA_LOGGER_TYPE_CODE: string             // "NONE",
    DATA_LOGGER_TYPE_DESC: string             // "None",
    WEATHER_ZONE: string                      // null,
    WEATHER_ZONE_DESC: string                 // null,
    DANGER_REGION: string                     // null,
    STATION_COMMENT: string                   // null,
    CRD_STATION_NAME: string                  // null,
    FIRE_CENTRE_ORG_UNIT_IDENT: string        // null,
    ZONE_ORG_UNIT_IDENTIFIER: string          // null,
    DATA_SOURCE: string                       // null,
    INSTALLATION_TIMESTAMP_MSEC: number       // 1790210557223,
    DECOMMISSION_TIMESTAMP_MSEC: string       // null,
    PST_DECOMM_TIMESTAMP: string              // "null",
    HOURLY_IND: string                        // "N",
    OVER_WINTER_PRECIP_ADJ_IND: string        // "N",
    LATITUDE: number                          // 45.555,
    LONGITUDE: number                         // -144.99,
    WKT_GEOM: string                          // "POINT (-144.99 45.555)",
    ELEVATION_M: number                       // 100,
    INFLUENCING_SLOPE: string                 // null,
    WINDSPEED_ADJUSTMENT_HEIGHT: string       // null,
    WINDSPEED_ADJUSTMENT_ROUGHNESS: string    // null,
    LAST_PROCESSED_SOURCE_TIME: string        // null,
    LAST_UPDATED_TIMESTAMP_MSEC: string       // 1790210860551
}

export type GeoJsonPoint<P> = {
    type: 'Feature',
    properties: P,
    geometry: {
        type: 'Point',
        coordinates: [ number, number ]
    }
}

@Injectable({
  providedIn: 'root',
})
export class StationDataService {
    private readonly stationsSubject = new BehaviorSubject<any[]>([]);
    
    readonly stations$ = this.stationsSubject.asObservable();
  
    private _stationsPromise?: Promise<GeoJsonPoint<WeatherStation>[]>

    initialize() {
        this.loadStations()
            .then( stations => {
                this.stationsSubject.next( stations )
            } )
    }

    loadStations(): Promise<GeoJsonPoint<WeatherStation>[]> {
        if ( this._stationsPromise ) return this._stationsPromise

        let fetchPage: ( url: string, accum: WeatherStation[], m: number ) => Promise<WeatherStation[]> = ( url, accum, maxPages ) => { 
            if ( maxPages == 0 ) return Promise.resolve( accum )

            return this.fetchWithRetry( url, 'getStations' ) 
                .then( res => res.json() )
                .then( payload => {
                    if ( payload.nextLink )
                        return fetchPage( payload.nextLink, accum.concat( payload.value ), maxPages - 1 )
                    
                    return accum.concat( payload.value )
                } )
        }

        this._stationsPromise = fetchPage( WEATHER_STATIONS_API, [], 2 )
            .then( stations => {
                return stations.map( s => {
                    // remove when API is fixed
                    [ s.LONGITUDE, s.LATITUDE ] = randomPoint()
                    s.WEATHER_STATION_GUID = crypto.randomUUID()

                    return {
                        type: 'Feature',
                        properties: s,
                        geometry: {
                            type: 'Point',
                            coordinates: [ s.LONGITUDE, s.LATITUDE ]
                        }
                    }
                } )
            } )

        return this._stationsPromise
    }

    filterStations( filter: Filter ): Promise<GeoJsonPoint<WeatherStation>[]> {
        return this.loadStations()
            .then( stations => {
                let filteredStations = stations.filter( s => {
                    return textFilter( s.properties.STATION_NAME, filter.search )
                        && rangeFilter( s.properties.ELEVATION_M, filter.elevation )
                        && rangeFilter( s.properties.LATITUDE, filter.latitude )
                        && rangeFilter( s.properties.LONGITUDE, filter.longitude )
                } )

                this.stationsSubject.next( filteredStations )

                return filteredStations
            } )
    }

    fetchWithRetry( url: string, description: string, retries = 3, delay = 1000 ): Promise<Response> {
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
                            return this.fetchWithRetry( url, description, retries - 1 )
                        } )
                }
                else {
                    console.error( `${ description } failed: ${ err }` )

                    throw Error( `${ description } failed` )
                }
            } )
    }
}

function randomPoint(): [ number, number ] {
    const LONG = [ -139.1782, -110.3533 ]
    const LAT = [ 47.6039, 60.5939 ]
    return [
        Math.random() * ( LONG[ 1 ] - LONG[ 0 ] ) + LONG[ 0 ],
        Math.random() * ( LAT[ 1 ] - LAT[ 0 ] ) + LAT[ 0 ],
    ]
}

function textFilter( text: string, filter: string ): boolean {
    if ( !filter ) return true
    return text.toLowerCase().includes( filter.toLowerCase().trim() )
}

function rangeFilter( value: number, range: string[] ): boolean {
    if ( !range[ 0 ] && !range[ 1 ] ) return true
    let min = Number( range[ 0 ] )
    let max = Number( range[ 1 ] )
    return value >= min && value <= max
}
