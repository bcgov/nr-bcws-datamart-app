import {
    ChangeDetectionStrategy,
    Component,
    inject
} from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ButtonComponent, GapComponent, InitialState, RowListBase, RowListDesktopComponent, RowListPaginationComponent } from '@bcgov/nr-ngx-component-lib';
import { NgxPaginationModule } from 'ngx-pagination';
import { Observable, of } from 'rxjs';
import { SelectedStationsService } from '../../../services/selected-stations.service';
import { GeoJsonPoint, WeatherStation } from '../../../services/station-data.service';

export type TableRow = GeoJsonPoint<WeatherStation>
export type Filter = {}

@Component({
    selector: 'selected-stations-list',
    templateUrl: './selected-stations-list.component.html',
    styleUrl: './selected-stations-list.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ButtonComponent,
        RowListDesktopComponent,
        MatTableModule,
        MatSortModule,
        NgxPaginationModule,
        RowListPaginationComponent,
        GapComponent
    ]
})
export class SelectedStationsListComponent extends RowListBase<Filter, TableRow, any> {
    selectedStationsService = inject( SelectedStationsService )

    displayedColumns = [
        'stationName',
        'stationCode',
        'stationAcronym',
        'fireCentre',
        'fireZone',
        'latitude',
        'longitude',
        'elevation',
        'status',
        'remove',
    ];

    fetchRowListPage(): Observable<GeoJsonPoint<WeatherStation>[]> {
        return of( this.selectedStationsService.selectedStations )
    }
    
    parseRows(res: GeoJsonPoint<WeatherStation>[]): TableRow[] {
        return res
    }

    override parseTotalRowCount(res: any): number {
        return this.selectedStationsService.selectedStations.length
    }

    getInitialPageState(): InitialState<Filter> {
        return {
            instance: 'selected-stations',
            filter: {},
            pageConfig: {
                pageSize: 10,
                pageNumber: 1,
                sortActive: 'stationName',
                sortDirection: 'asc',
            }
        }
    }

    onRemoveStationClick( station: GeoJsonPoint<WeatherStation> ) {
        this.selectedStationsService.removeStation( station )
        this.refreshRowList()
    }

    // viewData(): void {
    //     if (this.selectedCount === 0) {
    //         this.dialogService.openConfirmDialog(
    //             {
    //                 title: 'Select a Weather Station',
    //                 saveLabel: 'OK',
    //                 template: this.noStationsSelectedDialog,
    //             },
    //             {
    //                 disableClose: false,
    //                 panelClass: ['no-stations-selected-dialog'],
    //             },
    //         );

    //         return;
    //     }

    //     this.router.navigate( [ ROUTE.DATA_DOWNLOAD ] );
    // }

    // viewSelectedStations(): void {
    //     if (this.selectedCount === 0) {
    //         this.dialogService.openConfirmDialog(
    //             {
    //                 title: 'No Stations Selected',
    //                 saveLabel: 'OK',
    //                 template: this.emptySelectedStationsDialog,
    //             },
    //             {
    //                 disableClose: false,
    //                 panelClass: ['no-stations-selected-dialog'],
    //             },
    //         );

    //         return;
    //     }

    //     this.selectedStations = [
    //         ...this.selectedStationsService.selectedStations,
    //     ];

    //     this.selectedStations.sort((a, b) =>
    //         String(a.properties.STATION_NAME).localeCompare(
    //             String(b.properties.STATION_NAME),
    //             undefined,
    //             { sensitivity: 'base' },
    //         ),
    //     );

    //     this.sortColumn = 'stationName';
    //     this.sortDirection = 'asc';

    //     this.pageNumber = 1;

    //     this.dialogService.openConfirmDialog(
    //         {
    //             title: 'Selected Stations',
    //             saveLabel: 'Close',
    //             template: this.selectedStationsDialog,
    //         },
    //         {
    //             disableClose: false,
    //             panelClass: [
    //                 'nrcl-dialog',
    //                 'nrcl-dialog-fullscreen',
    //                 'selected-stations-dialog',
    //             ],
    //         },
    //     );
    // }

    // clearSelectedStations(): void {
    //     this.selectedStationsService.clearStations();
    //     this.selectedStations = [];
    //     this.selectedCount = 0;
    //     this.pageNumber = 1;
    // }

    // removeStation(station: any): void {
    //     this.selectedStationsService.removeStation(station);

    //     this.selectedStations =
    //         this.selectedStations.filter(
    //             (s) =>
    //                 s.properties.WEATHER_STATION_GUID !==
    //                 station.properties.WEATHER_STATION_GUID,
    //         );

    //     this.selectedCount = this.selectedStations.length;

    //     const maxPage = Math.max(1, Math.ceil(this.selectedCount / this.pageSize),);

    //     if (this.pageNumber > maxPage) {
    //         this.pageNumber = maxPage;
    //     }
    // }

    // get pagedStations() {
    //     const start = (this.pageNumber - 1) * this.pageSize;

    //     return this.selectedStations.slice(
    //         start,
    //         start + this.pageSize
    //     );
    // }

    // onPageNumberChange(pageNumber: number) {
    //     this.pageNumber = pageNumber;
    // }

    // onPageSizeChange(pageSize: number) {
    //     this.pageSize = pageSize;
    //     this.pageNumber = 1;
    // }


    // onSortChange(sort: Sort): void {
    //     if (!sort.direction) {
    //         this.sortColumn = 'stationName';
    //         this.sortDirection = 'asc';

    //         return;
    //     }

    //     this.sortColumn = sort.active;
    //     this.sortDirection = sort.direction as 'asc' | 'desc';

    //     this.selectedStations.sort((a, b) => {
    //         const aValue = this.getSortValue(a, sort.active);
    //         const bValue = this.getSortValue(b, sort.active);

    //         const numericColumns = [
    //             'latitude',
    //             'longitude',
    //             'elevation',
    //         ];

    //         if (numericColumns.includes(sort.active)) {
    //             const result = Number(aValue ?? 0) - Number(bValue ?? 0);

    //             return sort.direction === 'desc'
    //                 ? -result
    //                 : result;
    //         }

    //         const result = String(aValue ?? '').localeCompare(
    //             String(bValue ?? ''),
    //             undefined,
    //             {
    //                 numeric: true,
    //                 sensitivity: 'base',
    //             },
    //         );

    //         return sort.direction === 'desc'
    //             ? -result
    //             : result;
    //     });
    // }

    // private getSortValue(station: any, column: string): any {
    //     switch (column) {
    //         case 'stationName':
    //             return station.properties.STATION_NAME;

    //         case 'stationCode':
    //             return station.properties.STATION_CODE;

    //         case 'stationAcronym':
    //             return station.properties.STATION_ACRONYM;

    //         case 'fireCentre':
    //             return station.properties.FIRE_CENTRE_ORG_UNIT_IDENT;

    //         case 'fireZone':
    //             return station.properties.ZONE_ORG_UNIT_IDENTIFIER;

    //         case 'latitude':
    //             return station.properties.LATITUDE;

    //         case 'longitude':
    //             return station.properties.LONGITUDE;

    //         case 'elevation':
    //             return station.properties.ELEVATION_M;

    //         case 'status':
    //             return station.properties.STATION_STATUS_DESC;

    //         default:
    //             return '';
    //     }
    // }

    // closeSelectedStationsDialog(): void {
    //     (
    //         document.querySelector(
    //             '.selected-stations-dialog .title-bar .close button',
    //         ) as HTMLButtonElement
    //     )?.click();
    // }

}