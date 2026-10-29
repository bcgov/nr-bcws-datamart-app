import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Filter } from '../pages/station-selection/filters/station-selection-filters.component';
import { DatamartRestApiService, WeatherStation } from './datamart-rest-api.service';
import { SnackbarUtilService } from '@bcgov/nr-ngx-component-lib';

export type GeoJsonPoint<P> = {
    type: 'Feature',
    properties: P,
    geometry: {
        type: 'Point',
        coordinates: [ number, number ]
    }
}

export type WeatherStationFeature = GeoJsonPoint<WeatherStation>

@Injectable({
  providedIn: 'root',
})
export class WeatherStationService {
    datamartRestApiService = inject( DatamartRestApiService )
    snackbarUtilService = inject( SnackbarUtilService )

    private readonly stationsSubject = new BehaviorSubject<any[]>([]);
    
    readonly stations$ = this.stationsSubject.asObservable();
  
    private _stationsPromise?: Promise<GeoJsonPoint<WeatherStation>[]>

    private _totalCount = 0

    get totalCount() {
        return this._totalCount
    }

    get filteredCount() {
        return this.stationsSubject.value.length
    }

    initialize() {
        this.loadStations()
            .then( stations => {
                this._totalCount = stations.length
                this.stationsSubject.next( stations )
            } )
            .catch( err => {
                this.snackbarUtilService.error( err )
            } )
    }

    loadStations(): Promise<WeatherStationFeature[]> {
        if ( this._stationsPromise ) return this._stationsPromise

        this._stationsPromise = this.datamartRestApiService.getActiveWeatherStations()
            .then( stations => {
                return stations.map( ( s ) => {
                    return {
                        type: 'Feature',
                        properties: s,
                        geometry: {
                            type: 'Point',
                            coordinates: [ s.longitude, s.latitude ]
                        }
                    }
                } )
            } )

        return this._stationsPromise
    }

    filterStations( filter: Filter ): Promise<WeatherStationFeature[]> {
        return this.loadStations()
            .then( stations => {
                let filteredStations = stations.filter( s => {
                    return textFilter( s.properties.station_name, filter.search )
                        && rangeFilter( s.properties.elevation_m, filter.elevation )
                        && rangeFilter( s.properties.latitude, filter.latitude )
                        && rangeFilter( s.properties.longitude, filter.longitude )
                } )

                this.stationsSubject.next( filteredStations )

                return filteredStations
            } )
    }

    getStationsByCode( codes: number[] ): Promise<WeatherStationFeature[]> {
        return this.loadStations()
            .then( stations => {
                return stations.filter( s => codes.includes( s.properties.station_code ) )
            } )
    }
}

// function randomPoint(): [ number, number ] {
//     const LONG = [ -139.1782, -110.3533 ]
//     const LAT = [ 47.6039, 60.5939 ]
//     return [
//         Math.random() * ( LONG[ 1 ] - LONG[ 0 ] ) + LONG[ 0 ],
//         Math.random() * ( LAT[ 1 ] - LAT[ 0 ] ) + LAT[ 0 ],
//     ]
// }

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
