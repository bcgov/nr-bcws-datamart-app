import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { Router } from '@angular/router';

import { DialogService } from '@bcgov/nr-ngx-component-lib';

import { SelectedStationsService } from '../../../services/selected-stations.service';
import { StationDataService } from '../../../services/station-data.service';


@Component({
  selector: 'app-station-selection-header',
  templateUrl: './station-selection-header.component.html',
  styleUrl: './station-selection-header.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
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


  constructor(
    private readonly selectedStationsService: SelectedStationsService,
    private readonly stationDataService: StationDataService,
    private readonly dialogService: DialogService,
    private readonly router: Router,
  ) {}

  

  ngOnInit(): void {
    this.selectedStationsService.selectedStations$.subscribe(
      (stations) => (this.selectedCount = stations.length),
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

  async viewSelectedStations(): Promise<void> {
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

    const stationGuids = this.selectedStationsService.selectedStations.map(
        (station) => station.WEATHER_STATION_GUID,
      );

    this.selectedStations = await this.stationDataService.loadStationsByIds(stationGuids,);

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


}