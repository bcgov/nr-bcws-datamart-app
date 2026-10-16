import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GeoJsonPoint, WeatherStation } from './station-data.service';

@Injectable( {
    providedIn: 'root',
} )
export class SelectedStationsService {
    private readonly selectedStationsSubject = new BehaviorSubject<GeoJsonPoint<WeatherStation>[]>( [] );

    readonly selectedStations$ = this.selectedStationsSubject.asObservable();

    addStation( station: GeoJsonPoint<WeatherStation> ): void {
        const stations = this.selectedStationsSubject.value;

        const exists = stations.some(
            ( s ) => s.properties.WEATHER_STATION_GUID === station.properties.WEATHER_STATION_GUID,
        );

        if ( exists ) {
            return;
        }

        this.selectedStationsSubject.next( [
            ...stations,
            station,
        ] );
    }

    addStations( stations: GeoJsonPoint<WeatherStation>[] ): void {
        const existingStations = this.selectedStationsSubject.value;

        let newStations = stations.filter( s => {
            return !existingStations.some( e => {
                return e.properties.WEATHER_STATION_GUID == s.properties.WEATHER_STATION_GUID
            } )
        } )

        if ( newStations.length == 0 ) return

        this.selectedStationsSubject.next( [
            ...existingStations,
            ...newStations,
        ] )
    }

    removeStation( station: GeoJsonPoint<WeatherStation> ): void {
        this.selectedStationsSubject.next(
            this.selectedStationsSubject.value.filter(
                ( s ) => s.properties.WEATHER_STATION_GUID !== station.properties.WEATHER_STATION_GUID,
            ),
        );
    }

    isSelected( station: GeoJsonPoint<WeatherStation> ): boolean {
        return this.selectedStationsSubject.value.some(
            ( s ) => s.properties.WEATHER_STATION_GUID === station.properties.WEATHER_STATION_GUID,
        );
    }

    clearStations(): void {
        this.selectedStationsSubject.next( [] );
    }

    get count(): number {
        return this.selectedStationsSubject.value.length;
    }

    get selectedStations(): any[] {
        return this.selectedStationsSubject.value;
    }
}