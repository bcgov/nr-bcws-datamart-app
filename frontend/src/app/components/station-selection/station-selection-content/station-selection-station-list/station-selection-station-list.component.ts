import { Component, OnInit } from '@angular/core';

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
    selector: 'app-station-selection-station-list',
    templateUrl: './station-selection-station-list.component.html',
    styleUrl: './station-selection-station-list.component.scss'
})
export class StationSelectionStationListComponent implements OnInit {

    columns = ['selected', 'station'];

    pageNumber = 1;

    pageSize = 10;

    sortOption: SortOption = 'nameAsc';

    stations: WeatherStationRow[] = [];

    constructor(
        private readonly stationDataService: StationDataService
    ) {}

    ngOnInit(): void {

        this.stationDataService.stations$
            .subscribe(stations => this.stations = stations);
    }

    display(value: unknown): string {

        return value === null || value === undefined || value === ''
            ? '–'
            : String(value);
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
            case 'nameAsc': return 'Name, A-Z';
            case 'nameDesc': return 'Name, Z-A';
            case 'codeAsc': return 'Code, Low-High';
            case 'codeDesc': return 'Code, High-Low';
        }
    }

    get sortedStations(): WeatherStationRow[] {

        const stations = [...this.stations];

        switch (this.sortOption) {

            case 'nameAsc':

                return stations.sort((a, b) =>
                    this.display(a.STATION_NAME).localeCompare(this.display(b.STATION_NAME)));

            case 'nameDesc':

                return stations.sort((a, b) =>
                    this.display(b.STATION_NAME).localeCompare(this.display(a.STATION_NAME)));

            case 'codeAsc':

                return stations.sort((a, b) =>
                    Number(a.STATION_CODE) - Number(b.STATION_CODE));

            case 'codeDesc':

                return stations.sort((a, b) =>
                    Number(b.STATION_CODE) - Number(a.STATION_CODE));

            default:

                return stations;
        }
    }

    get startRow(): number {

        if (this.stations.length === 0) return 0;

        return ((this.pageNumber - 1) * this.pageSize) + 1;
    }

    get endRow(): number {

        return Math.min(this.pageNumber * this.pageSize, this.stations.length);
    }
}