import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { ButtonComponent } from '@bcgov/nr-ngx-component-lib';
import { SelectedWeatherStationsService } from '../../../../services/selected-weather-stations.service';
import { WeatherStationFeature, WeatherStationService } from '../../../../services/weather-station.service';

type SortOption = 'nameAsc' | 'nameDesc' | 'codeAsc' | 'codeDesc';

@Component({
    selector: 'station-selection-content-list',
    templateUrl: './station-selection-content-list.component.html',
    styleUrl: './station-selection-content-list.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatTableModule,
        MatCheckboxModule,
        MatMenuModule,
        ButtonComponent
    ]
})
export class StationSelectionContentListComponent implements OnInit {
    weatherStationService = inject( WeatherStationService )
    selectedWeatherStationsService = inject( SelectedWeatherStationsService )
    changeDetectorRef = inject( ChangeDetectorRef )

    sortOption: SortOption = 'nameAsc';
    stations: WeatherStationFeature[] = [];

    ngOnInit(): void {
        this.weatherStationService.stations$.subscribe( (stations) => {
            this.stations = stations
            // console.log(this.stations)
            // this.pageNumber = 1
            this.changeDetectorRef.detectChanges()
        } )
    }

    get listDescription() {
        let t = this.weatherStationService.totalCount
        let f = this.weatherStationService.filteredCount

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

    isSelected(station: WeatherStationFeature): boolean {
        return this.selectedWeatherStationsService.isSelected(station);
    }

    onStationSelectClick(station: WeatherStationFeature): void {
        this.selectedWeatherStationsService.isSelected(station)
            ? this.selectedWeatherStationsService.removeStation(station)
            : this.selectedWeatherStationsService.addStation(station);
    }

    get areAllSelected(): boolean {
        return this.stations.every( s => this.selectedWeatherStationsService.isSelected( s ) )
    }

    onSelectAllClick(): void {
        if ( this.areAllSelected ) {
            this.selectedWeatherStationsService.clearStations()
        }
        else {
            this.stations.forEach( s => this.selectedWeatherStationsService.addStation( s ) )
        }
    }

    setSort(sortOption: SortOption): void {
        this.sortOption = sortOption;
    }

    get sortedStations(): WeatherStationFeature[] {
        const stations = [...this.stations];

        switch (this.sortOption) {
            case 'nameAsc':
                return stations.sort((a, b) => a.properties.station_name.localeCompare(b.properties.station_name));

            case 'nameDesc':
                return stations.sort((a, b) => b.properties.station_name.localeCompare(a.properties.station_name));

            case 'codeAsc':
                return stations.sort((a, b) => Number(a.properties.station_code) - Number(b.properties.station_code));

            case 'codeDesc':
                return stations.sort((a, b) => Number(b.properties.station_code) - Number(a.properties.station_code));

            default:
                return stations;
        }
    }
}
