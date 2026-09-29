import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StationDataService {
  private readonly stationsSubject = new BehaviorSubject<any[]>([]);

  readonly stations$ = this.stationsSubject.asObservable();

  private loaded = false;
  private loading = false;

  async loadStations(): Promise<void> {
    if (this.loaded || this.loading) {
      return;
    }

    this.loading = true;

    try {
      const response = await this.fetchWithRetry(
        'https://container-app-api-yujhzooydm766.bluewater-fbba4d31.canadacentral.azurecontainerapps.io/api/weather_stations',
      );

      const data = await response.json();

      const uniqueStations = [
        ...new Map(
          data.value.map((station: any) => [
            station.WEATHER_STATION_GUID,
            station,
          ]),
        ).values(),
      ];

      this.stationsSubject.next(uniqueStations);

      this.loaded = true;
    } finally {
      this.loading = false;
    }
  }

  private async fetchWithRetry(
    url: string,
    maxAttempts = 3,
  ): Promise<Response> {
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