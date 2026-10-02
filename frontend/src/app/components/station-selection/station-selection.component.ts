import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

import { StationDataService } from '../../services/station-data.service';
import { StationSelectionContentComponent } from './station-selection-content/station-selection-content.component';
import { StationSelectionFiltersComponent } from './station-selection-filters/station-selection-filters.component';
import { StationSelectionHeaderComponent } from './station-selection-header/station-selection-header.component';

@Component({
  selector: 'app-station-selection',
  templateUrl: './station-selection.component.html',
  styleUrl: './station-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    StationSelectionContentComponent,
    StationSelectionFiltersComponent,
    StationSelectionHeaderComponent
  ]
})
export class StationSelectionComponent implements OnInit {

  constructor(
    private readonly stationDataService: StationDataService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.stationDataService.loadStations();
  }
}