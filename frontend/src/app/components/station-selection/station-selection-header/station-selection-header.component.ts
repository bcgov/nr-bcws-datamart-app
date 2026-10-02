import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';

import { Router } from '@angular/router';

import { MatSortModule, Sort } from '@angular/material/sort';

import { ButtonComponent, DialogService, GapComponent, IconComponent, RowListDesktopComponent, RowListPaginationComponent } from '@bcgov/nr-ngx-component-lib';

import { SelectedStationsService } from '../../../services/selected-stations.service';
import { MatTableModule } from '@angular/material/table';
import { NgxPaginationModule } from 'ngx-pagination';



@Component({
  selector: 'app-station-selection-header',
  templateUrl: './station-selection-header.component.html',
  styleUrl: './station-selection-header.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    IconComponent,
    ButtonComponent,
    RowListDesktopComponent,
    MatTableModule,
    MatSortModule,
    NgxPaginationModule,
    RowListPaginationComponent,
    GapComponent
  ]
})
export class StationSelectionHeaderComponent implements OnInit {
  @ViewChild('noStationsSelectedDialog', { static: true })
  noStationsSelectedDialog!: TemplateRef<unknown>;

  @ViewChild('emptySelectedStationsDialog', { static: true })
  emptySelectedStationsDialog!: TemplateRef<unknown>;

  @ViewChild('selectedStationsDialog', { static: true })
  selectedStationsDialog!: TemplateRef<unknown>;
  

  selectedCount = 0;

  selectedStations: any[] = [];

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

  pageSize = 10;
  pageNumber = 1;
  sortColumn = 'stationName';
  sortDirection: 'asc' | 'desc' = 'asc';


  constructor(
    private readonly selectedStationsService: SelectedStationsService,
    private readonly dialogService: DialogService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  

  ngOnInit(): void {
    this.selectedStationsService.selectedStations$.subscribe(
      (stations) => {
        this.selectedCount = stations.length;
        this.cdr.markForCheck();
      },
    );
  }

  viewData(): void {
    if (this.selectedCount === 0) {
      this.dialogService.openConfirmDialog(
        {
          title: 'Select a Weather Station',
          saveLabel: 'OK',
          template: this.noStationsSelectedDialog,
        },
        {
          disableClose: false,
          panelClass: ['no-stations-selected-dialog'],
        },
      );

      return;
    }

    this.router.navigate(['/data-download']);
  }

  viewSelectedStations(): void {
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
      String(a.STATION_NAME).localeCompare(
        String(b.STATION_NAME),
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

  clearSelectedStations(): void {
    this.selectedStationsService.clearStations();
    this.selectedStations = [];
    this.selectedCount = 0;
    this.pageNumber = 1;
  }


  removeStation(station: any): void {
    this.selectedStationsService.removeStation(station);

    this.selectedStations =
      this.selectedStations.filter(
        (s) =>
          s.WEATHER_STATION_GUID !==
          station.WEATHER_STATION_GUID,
      );

    this.selectedCount = this.selectedStations.length;

    const maxPage = Math.max(1, Math.ceil(this.selectedCount / this.pageSize), );

    if (this.pageNumber > maxPage) {
      this.pageNumber = maxPage;
    }

  }

  get pagedStations() {
    const start = ( this.pageNumber - 1 ) * this.pageSize;

    return this.selectedStations.slice(
        start,
        start + this.pageSize
    );
  }

  onPageNumberChange( pageNumber: number ) {
      this.pageNumber = pageNumber;
  }

  onPageSizeChange( pageSize: number ) {
      this.pageSize = pageSize;
      this.pageNumber = 1;
  }


  onSortChange(sort: Sort): void {
    if (!sort.direction) {
      this.sortColumn = 'stationName';
      this.sortDirection = 'asc';

      return;
    }

    this.sortColumn = sort.active;
    this.sortDirection = sort.direction as 'asc' | 'desc';

    this.selectedStations.sort((a, b) => {
      const aValue = this.getSortValue(a, sort.active);
      const bValue = this.getSortValue(b, sort.active);

      const numericColumns = [
        'latitude',
        'longitude',
        'elevation',
      ];

      if (numericColumns.includes(sort.active)) {
        const result = Number(aValue ?? 0) - Number(bValue ?? 0);

        return sort.direction === 'desc'
          ? -result
          : result;
      }

      const result = String(aValue ?? '').localeCompare(
        String(bValue ?? ''),
        undefined,
        {
          numeric: true,
          sensitivity: 'base',
        },
      );

      return sort.direction === 'desc'
        ? -result
        : result;
    });
  }

  private getSortValue(station: any, column: string): any {
    switch (column) {
      case 'stationName':
        return station.STATION_NAME;

      case 'stationCode':
        return station.STATION_CODE;

      case 'stationAcronym':
        return station.STATION_ACRONYM;

      case 'fireCentre':
        return station.FIRE_CENTRE_ORG_UNIT_IDENT;

      case 'fireZone':
        return station.ZONE_ORG_UNIT_IDENTIFIER;

      case 'latitude':
        return station.LATITUDE;

      case 'longitude':
        return station.LONGITUDE;

      case 'elevation':
        return station.ELEVATION_M;

      case 'status':
        return station.STATION_STATUS_DESC;

      default:
        return '';
    }
  }

  closeSelectedStationsDialog(): void {
    (
      document.querySelector(
        '.selected-stations-dialog .title-bar .close button',
      ) as HTMLButtonElement
    )?.click();
  }

}