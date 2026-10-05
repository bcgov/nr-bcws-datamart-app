import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { IconComponent, RowListDesktopComponent, RowListPaginationComponent } from '@bcgov/nr-ngx-component-lib';
import { NgxPaginationModule } from 'ngx-pagination';
import { SelectedStationsService } from '../../../../services/selected-stations.service';
import { StationDataService } from '../../../../services/station-data.service';

interface WeatherStationRow {
  WEATHER_STATION_GUID: string;
  STATION_CODE: string;
  STATION_NAME: string;
  STATION_ACRONYM: string | null;
  STATUS?: string;
}

type SortOption = 'nameAsc' | 'nameDesc' | 'codeAsc' | 'codeDesc';

@Component({
  selector: 'station-selection-content-list',
  templateUrl: './station-selection-content-list.component.html',
  styleUrl: './station-selection-content-list.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    RowListDesktopComponent,
    MatTableModule,
    MatCheckboxModule,
    RowListPaginationComponent,
    NgxPaginationModule,
    MatMenuModule,
    IconComponent
  ]
})
export class StationSelectionContentListComponent implements OnInit {
  columns = ['selected', 'station'];

  pageNumber = 1;

  pageSize = 10;

  sortOption: SortOption = 'nameAsc';

  stations: WeatherStationRow[] = [];

  constructor(
    private readonly stationDataService: StationDataService,
    private readonly selectedStationsService: SelectedStationsService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.stationDataService.stations$.subscribe((stations) => {
      this.stations = stations;
      this.cdr.markForCheck();
    });
  }


  display(value: unknown): string {
    return value === null || value === undefined || value === '' ? '–' : String(value);
  }

  isSelected(station: WeatherStationRow): boolean {
    return this.selectedStationsService.isSelected(station);
  }

  toggleStation(station: WeatherStationRow): void {
    this.selectedStationsService.isSelected(station)
      ? this.selectedStationsService.removeStation(station)
      : this.selectedStationsService.addStation(station);
  }

  get visibleStations(): WeatherStationRow[] {
    const start = (this.pageNumber - 1) * this.pageSize;

    return this.sortedStations.slice(start, start + this.pageSize);
  }

  get allVisibleSelected(): boolean {
    return this.visibleStations.length > 0 &&
      this.visibleStations.every((station) => this.selectedStationsService.isSelected(station));
  }

  toggleSelectAll(): void {
    if (this.allVisibleSelected) {
      this.visibleStations.forEach((station) => this.selectedStationsService.removeStation(station));

      return;
    }

    this.visibleStations.forEach((station) => this.selectedStationsService.addStation(station));
  }

  setSort(sortOption: SortOption): void {
    this.sortOption = sortOption;
    this.pageNumber = 1;
  }

  onPageNumberChange(pageNumber: number): void {
    this.pageNumber = pageNumber;
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageNumber = 1;
  }

  get sortLabel(): string {
    switch (this.sortOption) {
      case 'nameAsc':
        return 'Name, A-Z';
      case 'nameDesc':
        return 'Name, Z-A';
      case 'codeAsc':
        return 'Code, Low-High';
      case 'codeDesc':
        return 'Code, High-Low';
    }
  }

  get sortedStations(): WeatherStationRow[] {
    const stations = [...this.stations];

    switch (this.sortOption) {
      case 'nameAsc':
        return stations.sort((a, b) => this.display(a.STATION_NAME).localeCompare(this.display(b.STATION_NAME)));

      case 'nameDesc':
        return stations.sort((a, b) => this.display(b.STATION_NAME).localeCompare(this.display(a.STATION_NAME)));

      case 'codeAsc':
        return stations.sort((a, b) => Number(a.STATION_CODE) - Number(b.STATION_CODE));

      case 'codeDesc':
        return stations.sort((a, b) => Number(b.STATION_CODE) - Number(a.STATION_CODE));

      default:
        return stations;
    }
  }

  get startRow(): number {
    if (this.stations.length === 0) return 0;

    return (this.pageNumber - 1) * this.pageSize + 1;
  }

  get endRow(): number {
    return Math.min(this.pageNumber * this.pageSize, this.stations.length);
  }
}