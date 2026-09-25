import { Component, OnInit } from '@angular/core';

import { StationDataService } from '../../../../services/station-data.service';

interface WeatherStationRow {
    WEATHER_STATION_GUID: string;
    STATION_CODE: string;
    STATION_NAME: string;
    STATION_ACRONYM: string | null;
    STATUS?: string;
}

@Component({
    selector: 'app-station-selection-station-list',
    templateUrl: './station-selection-station-list.component.html',
    styleUrl: './station-selection-station-list.component.scss'
})
export class StationSelectionStationListComponent
    implements OnInit {

    columns = ['selected', 'station'];

    pageNumber = 1;

    pageSize = 10;

    sortOption = 'nameAsc';

    stations: WeatherStationRow[] = [];

    constructor(
        private readonly stationDataService: StationDataService
    ) {}

    ngOnInit(): void {

        this.stationDataService.stations$
            .subscribe(stations => {

                this.stations = stations;
            });
    }

    display(value: unknown): string {

        return value === null ||
            value === undefined ||
            value === ''
            ? '–'
            : String(value);
    }

    onPageNumberChange(pageNumber: number): void {

        this.pageNumber = pageNumber;
    }

    onPageSizeChange(pageSize: number): void {

        this.pageSize = pageSize;
        this.pageNumber = 1;
    }

    get startRow(): number {

        if (this.stations.length === 0) {
            return 0;
        }

        return ((this.pageNumber - 1) * this.pageSize) + 1;
    }

    get endRow(): number {

        return Math.min(
            this.pageNumber * this.pageSize,
            this.stations.length
        );
    }
}