import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SelectedStationsService } from '../../../../../services/selected-stations.service';

@Component({
  selector: 'app-station-information-panel',
  templateUrl: './station-information-panel.component.html',
  styleUrl: './station-information-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class StationInformationPanelComponent {
  @Input()
  station: any;

  constructor(
    private readonly selectedStationsService: SelectedStationsService,
  ) {}

  display(value: any): string {
    return value === null || value === undefined || value === ''
      ? '–'
      : String(value);
  }

  get isSelected(): boolean {
    return this.selectedStationsService.isSelected(this.station);
  }

  selectStation(): void {
    this.selectedStationsService.addStation(this.station);
  }

  removeStation(): void {
    this.selectedStationsService.removeStation(this.station);
  }

  get installationDate(): string {
    if (!this.station?.INSTALLATION_TIMESTAMP_MSEC) {
      return '–';
    }

    return new Date(
      this.station.INSTALLATION_TIMESTAMP_MSEC,
    ).toLocaleDateString();
  }

  get indicatorClass(): string {
    switch (this.station?.STATION_STATUS_CODE) {
      case 'ACTIVE':
        return 'future';

      case 'ARCHIVED':
      case 'DISABLED':
        return 'active';

      case 'PROJECT':
      case 'TEST':
        return 'ok';

      default:
        return 'none';
    }
  }
}