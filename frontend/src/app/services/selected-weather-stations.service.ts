import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WeatherStationFeature } from './weather-station.service';

@Injectable( {
    providedIn: 'root',
} )
export class SelectedWeatherStationsService {
    private readonly selectedStationsSubject = new BehaviorSubject<WeatherStationFeature[]>( [] );

    readonly selectedStations$ = this.selectedStationsSubject.asObservable();

    addStation( station: WeatherStationFeature ): void {
        const stations = this.selectedStationsSubject.value;

        const exists = stations.some(
            ( s ) => s.properties.weather_station_guid === station.properties.weather_station_guid,
        );

        if ( exists ) {
            return;
        }

        this.selectedStationsSubject.next( [
            ...stations,
            station,
        ] );
    }

    addStations( stations: WeatherStationFeature[] ): void {
        const existingStations = this.selectedStationsSubject.value;

        let newStations = stations.filter( s => {
            return !existingStations.some( e => {
                return e.properties.weather_station_guid == s.properties.weather_station_guid
            } )
        } )

        if ( newStations.length == 0 ) return

        this.selectedStationsSubject.next( [
            ...existingStations,
            ...newStations,
        ] )
    }

    removeStation( station: WeatherStationFeature ): void {
        this.selectedStationsSubject.next(
            this.selectedStationsSubject.value.filter(
                ( s ) => s.properties.weather_station_guid !== station.properties.weather_station_guid,
            ),
        );
    }

    isSelected( station: WeatherStationFeature ): boolean {
        return this.selectedStationsSubject.value.some(
            ( s ) => s.properties.weather_station_guid === station.properties.weather_station_guid,
        );
    }

    clearStations(): void {
        this.selectedStationsSubject.next( [] );
    }

    get count(): number {
        return this.selectedStationsSubject.value.length;
    }

    get selectedStations(): WeatherStationFeature[] {
        return this.selectedStationsSubject.value;
    }
}