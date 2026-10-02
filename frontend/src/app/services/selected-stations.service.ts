import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class SelectedStationsService {
  private readonly selectedStationsSubject = new BehaviorSubject<any[]>([]);

  readonly selectedStations$ = this.selectedStationsSubject.asObservable();

  addStation(station: any): void {
    const stations = this.selectedStationsSubject.value;

    const exists = stations.some(
      (s) =>  s.WEATHER_STATION_GUID === station.WEATHER_STATION_GUID,
    );

    if (exists) {
      return;
    }

    this.selectedStationsSubject.next([
      ...stations,
      station,
    ]);
  }

  removeStation(station: any): void {
    this.selectedStationsSubject.next(
      this.selectedStationsSubject.value.filter(
        (s) => s.WEATHER_STATION_GUID !== station.WEATHER_STATION_GUID,
      ),
    );
  }

  isSelected(station: any): boolean {
    return this.selectedStationsSubject.value.some(
      (s) => s.WEATHER_STATION_GUID === station.WEATHER_STATION_GUID,
    );
  }

  clearStations(): void {
    this.selectedStationsSubject.next([]);
  }

  get count(): number {
    return this.selectedStationsSubject.value.length;
  }

  get selectedStations(): any[] {
    return this.selectedStationsSubject.value;
  }

  
}