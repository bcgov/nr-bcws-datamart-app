import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StationDataService {

    private readonly stationsSubject =
        new BehaviorSubject<any[]>([]);

    readonly stations$ =
        this.stationsSubject.asObservable();

    async loadStations(): Promise<void> {

        const response = await fetch(
            'https://container-app-api-yujhzooydm766.bluewater-fbba4d31.canadacentral.azurecontainerapps.io/api/weather_stations'
        );

        const data =
            await response.json();

        const uniqueStations = [
            ...new Map(
                data.value.map((station: any) => [
                    station.WEATHER_STATION_GUID,
                    station
                ])
            ).values()
        ];

        this.stationsSubject.next(
            uniqueStations
        );
    }

    get stations(): any[] {

        return this.stationsSubject.value;
    }
}