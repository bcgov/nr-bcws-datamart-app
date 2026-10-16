import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { IconComponent, RowListDesktopComponent, RowListPaginationComponent } from '@bcgov/nr-ngx-component-lib';
import { NgxPaginationModule } from 'ngx-pagination';
import { SelectedStationsService } from '../../../../services/selected-stations.service';
import { GeoJsonPoint, StationDataService, WeatherStation } from '../../../../services/station-data.service';

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
        IconComponent,
        JsonPipe
    ]
})
export class StationSelectionContentListComponent implements OnInit {
    stationDataService = inject( StationDataService )
    selectedStationsService = inject( SelectedStationsService )
    changeDetectorRef = inject( ChangeDetectorRef )

    pageNumber = 1;
    pageSize = 10;
    sortOption: SortOption = 'nameAsc';
    stations: GeoJsonPoint<WeatherStation>[] = [];

    ngOnInit(): void {
        this.stationDataService.stations$.subscribe( (stations) => {
            this.stations = stations
            this.pageNumber = 1
        } )
    }

    display(value: unknown): string {
        return value === null || value === undefined || value === '' ? '–' : String(value);
    }

    isSelected(station: GeoJsonPoint<WeatherStation>): boolean {
        return this.selectedStationsService.isSelected(station);
    }

    toggleStation(station: GeoJsonPoint<WeatherStation>): void {
        this.selectedStationsService.isSelected(station)
            ? this.selectedStationsService.removeStation(station)
            : this.selectedStationsService.addStation(station);
    }

    get visibleStations(): GeoJsonPoint<WeatherStation>[] {
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

    get sortedStations(): GeoJsonPoint<WeatherStation>[] {
        const stations = [...this.stations];

        switch (this.sortOption) {
            case 'nameAsc':
                return stations.sort((a, b) => this.display(a.properties.STATION_NAME).localeCompare(this.display(b.properties.STATION_NAME)));

            case 'nameDesc':
                return stations.sort((a, b) => this.display(b.properties.STATION_NAME).localeCompare(this.display(a.properties.STATION_NAME)));

            case 'codeAsc':
                return stations.sort((a, b) => Number(a.properties.STATION_CODE) - Number(b.properties.STATION_CODE));

            case 'codeDesc':
                return stations.sort((a, b) => Number(b.properties.STATION_CODE) - Number(a.properties.STATION_CODE));

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
