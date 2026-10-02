import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

import { StationDataService } from '../../services/station-data.service';

@Component({
  selector: 'app-station-selection',
  templateUrl: './station-selection.component.html',
  styleUrl: './station-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class StationSelectionComponent implements OnInit {

  constructor(
    private readonly stationDataService: StationDataService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.stationDataService.loadStations();
  }
}