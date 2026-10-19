import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent, DialogService, IconComponent } from '@bcgov/nr-ngx-component-lib';
import { Subscription } from 'rxjs';
import { SelectedStationsService } from '../../services/selected-stations.service';

@Component({
    selector: 'datamart-header',
    templateUrl: './datamart-header.component.html',
    styleUrl: './datamart-header.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        IconComponent,
        ButtonComponent,
        // RowListDesktopComponent,
        // MatTableModule,
        // MatSortModule,
        // NgxPaginationModule,
        // RowListPaginationComponent,
        // GapComponent
    ]
})
export class DataMartHeaderComponent implements OnInit, OnDestroy {
    selectedStationsService = inject( SelectedStationsService )
    dialogService = inject( DialogService )
    router = inject( Router )
    changeDetectorRef = inject( ChangeDetectorRef )

    // @ViewChild('noStationsSelectedDialog', { static: true })
    // noStationsSelectedDialog!: TemplateRef<unknown>;

    @ViewChild('emptySelectedStationsDialog', { static: true })
    emptySelectedStationsDialog!: TemplateRef<unknown>;

    // @ViewChild('selectedStationsDialog', { static: true })
    // selectedStationsDialog!: TemplateRef<unknown>;

    selectedCount = 0;
    // selectedStations: any[] = [];

    // displayedColumns = [
    //     'stationName',
    //     'stationCode',
    //     'stationAcronym',
    //     'fireCentre',
    //     'fireZone',
    //     'latitude',
    //     'longitude',
    //     'elevation',
    //     'status',
    //     'remove',
    // ];

    // pageSize = 10;
    // pageNumber = 1;
    // sortColumn = 'stationName';
    // sortDirection: 'asc' | 'desc' = 'asc';

    selectedStationsSubscription?: Subscription

    ngOnInit(): void {
        this.selectedStationsSubscription = this.selectedStationsService.selectedStations$.subscribe(
            (stations) => {
                this.selectedCount = stations.length;
                this.changeDetectorRef.markForCheck();
            },
        );
    }

    ngOnDestroy(): void {
        if ( this.selectedStationsSubscription ) this.selectedStationsSubscription.unsubscribe()
    }

    get selectedStationsLabel() {
        if ( this.selectedCount == 0 ) {
            return 'No station selected'
        }
        else if ( this.selectedCount == 1 ) {
            return '1 station selected'
        }
        else {
            return this.selectedCount + ' stations selected'
        }
    }

    onStationsSelectedClick() {        
        if (this.selectedCount === 0) {
            this.dialogService.openConfirmDialog(
                {
                    title: 'No Stations Selected',
                    saveLabel: 'OK',
                    template: this.emptySelectedStationsDialog,
                },
                {
                    disableClose: false,
                    panelClass: ['no-stations-selected-dialog'],
                },
            );

            return;
        }

        this.selectedStations = [
            ...this.selectedStationsService.selectedStations,
        ];

        this.selectedStations.sort((a, b) =>
            String(a.properties.STATION_NAME).localeCompare(
                String(b.properties.STATION_NAME),
                undefined,
                { sensitivity: 'base' },
            ),
        );

        this.sortColumn = 'stationName';
        this.sortDirection = 'asc';

        this.pageNumber = 1;

        this.dialogService.openConfirmDialog(
            {
                title: 'Selected Stations',
                saveLabel: 'Close',
                template: this.selectedStationsDialog,
            },
            {
                disableClose: false,
                panelClass: [
                    'nrcl-dialog',
                    'nrcl-dialog-fullscreen',
                    'selected-stations-dialog',
                ],
            },
        );

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