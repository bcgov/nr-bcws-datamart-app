import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { ButtonComponent, IconComponent, RowListDesktopComponent, RowListPaginationComponent } from '@bcgov/nr-ngx-component-lib';
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
        ButtonComponent
    ]
})
export class StationSelectionContentListComponent implements OnInit {
    stationDataService = inject( StationDataService )
    selectedStationsService = inject( SelectedStationsService )
    changeDetectorRef = inject( ChangeDetectorRef )

    sortOption: SortOption = 'nameAsc';
    stations: GeoJsonPoint<WeatherStation>[] = [];

    ngOnInit(): void {
        this.stationDataService.stations$.subscribe( (stations) => {
            this.stations = stations
            // this.pageNumber = 1
        } )
    }

    get listDescription() {
        let t = this.stationDataService.totalCount
        let f = this.stationDataService.filteredCount

        if ( t == f ) {
            return `Showing all ${ t } stations`
        }
        else {
            return `Showing ${ f } station${ f == 1 ? '' : 's' } out of a total of ${ t }`
        }
    }
    
    get sortDescription() {
        switch (this.sortOption) {
            case 'nameAsc':     return 'Name, A-Z';
            case 'nameDesc':    return 'Name, Z-A';
            case 'codeAsc':     return 'Code, Low-High';
            case 'codeDesc':    return 'Code, High-Low';
        }
    }

    get sortButton() {
        return 'Sort: ' + this.sortDescription
    }

    get sortLabel() {
        return 'Sort stations. Current sort: ' + this.sortDescription
    }

    isSelected(station: GeoJsonPoint<WeatherStation>): boolean {
        return this.selectedStationsService.isSelected(station);
    }

    onStationSelectClick(station: GeoJsonPoint<WeatherStation>): void {
        this.selectedStationsService.isSelected(station)
            ? this.selectedStationsService.removeStation(station)
            : this.selectedStationsService.addStation(station);
    }

    get areAllSelected(): boolean {
        return this.stations.every( s => this.selectedStationsService.isSelected( s ) )
    }

    onSelectAllClick(): void {
        if ( this.areAllSelected ) {
            this.selectedStationsService.clearStations()
        }
        else {
            this.stations.forEach( s => this.selectedStationsService.addStation( s ) )
        }
    }

    setSort(sortOption: SortOption): void {
        this.sortOption = sortOption;
    }

    get sortedStations(): GeoJsonPoint<WeatherStation>[] {
        const stations = [...this.stations];

        switch (this.sortOption) {
            case 'nameAsc':
                return stations.sort((a, b) => a.properties.STATION_NAME.localeCompare(b.properties.STATION_NAME));

            case 'nameDesc':
                return stations.sort((a, b) => b.properties.STATION_NAME.localeCompare(a.properties.STATION_NAME));

            case 'codeAsc':
                return stations.sort((a, b) => Number(a.properties.STATION_CODE) - Number(b.properties.STATION_CODE));

            case 'codeDesc':
                return stations.sort((a, b) => Number(b.properties.STATION_CODE) - Number(a.properties.STATION_CODE));

            default:
                return stations;
        }
    }
}
