import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { StationFilters } from '../models/station-filters';

const WEATHER_STATIONS_API = 'https://container-app-api-yujhzooydm766.bluewater-fbba4d31.canadacentral.azurecontainerapps.io/api/weather_stations';

@Injectable({
  providedIn: 'root',
})
export class StationDataService {
  private readonly stationsSubject = new BehaviorSubject<any[]>([]);

  readonly stations$ = this.stationsSubject.asObservable();
  

  private loaded = false;
  private loading = false;

  constructor(private readonly ngZone: NgZone) {}

  async loadStations(): Promise<void> {
    if (this.loaded || this.loading) return;

    this.loading = true;

    try {
      const response = await this.fetchWithRetry(WEATHER_STATIONS_API);
      const data = await response.json();

      const uniqueStations = [
        ...new Map(
          data.value.map((station: any) => [
            station.WEATHER_STATION_GUID,
            station,
          ]),
        ).values(),
      ];

      this.ngZone.run(() => {
        this.stationsSubject.next(uniqueStations);
        this.loaded = true;
      });
    } finally {
      this.loading = false;
    }
  }

  async loadStationsByIds( stationGuids: string[] ): Promise<any[]> {
    if (stationGuids.length === 0) return [];

    const filter = stationGuids
      .map((id) => `WEATHER_STATION_GUID eq '${id}'`)
      .join(' or ');

    const response = await this.fetchWithRetry(
      `${WEATHER_STATIONS_API}?$filter=${encodeURIComponent(filter)}`,
    );

    const data = await response.json();

    return [
      ...new Map(
        data.value.map((station: any) => [
          station.WEATHER_STATION_GUID,
          station,
        ]),
      ).values(),
    ];
  }

  async loadStationsFiltered(filters: StationFilters): Promise<void> {

    const predicates: string[] = [];

    if (filters.elevationMin !== null) predicates.push(`ELEVATION_M ge ${filters.elevationMin}`);

    if (filters.elevationMax !== null) predicates.push(`ELEVATION_M le ${filters.elevationMax}`);

    if (filters.latitudeMin !== null) predicates.push(`LATITUDE ge ${filters.latitudeMin}`);

    if (filters.latitudeMax !== null) predicates.push(`LATITUDE le ${filters.latitudeMax}`);

    if (filters.longitudeMin !== null) predicates.push(`LONGITUDE ge ${filters.longitudeMin}`);

    if (filters.longitudeMax !== null) predicates.push(`LONGITUDE le ${filters.longitudeMax}`);

    if (filters.stationStatus) predicates.push(`STATION_STATUS_DESC eq '${filters.stationStatus}'`);

    const url = predicates.length
      ? `${WEATHER_STATIONS_API}?$filter=${encodeURIComponent(predicates.join(' and '))}`
      : WEATHER_STATIONS_API;

    const response = await this.fetchWithRetry(url);
    const data = await response.json();

    const uniqueStations = [
      ...new Map(
        data.value.map((station: any) => [
          station.WEATHER_STATION_GUID,
          station,
        ]),
      ).values(),
    ];

    const filteredStations =
      filters.searchText?.trim()
        ? uniqueStations.filter(
            (station: any) =>
              station.STATION_NAME?.toLowerCase().includes(
                filters.searchText!.trim().toLowerCase(),
              ),
          )
        : uniqueStations;

    this.ngZone.run(() => this.stationsSubject.next(filteredStations));
  }

  async clearFilters(): Promise<void> {
    this.loaded = false;
    await this.loadStations();
  }

  private async fetchWithRetry( url: string, maxAttempts = 3, ): Promise<Response> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Request failed with status ${response.status}`,
          );
        }

        return response;
      } catch (error) {
        lastError = error;

        if (attempt < maxAttempts) {
          await this.delay(attempt * 1000);
        }
      }
    }

    throw lastError;
  }

  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) =>
      setTimeout(resolve, milliseconds),
    );
  }

  get stations(): any[] {
    return this.stationsSubject.value;
  }
}