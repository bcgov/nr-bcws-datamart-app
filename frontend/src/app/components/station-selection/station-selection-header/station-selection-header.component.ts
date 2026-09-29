import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SelectedStationsService } from '../../../services/selected-stations.service';



@Component({
  selector: 'app-station-selection-header',
  templateUrl: './station-selection-header.component.html',
  styleUrl: './station-selection-header.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class StationSelectionHeaderComponent {

  selectedCount = 0;

  constructor(
    private readonly selectedStationsService: SelectedStationsService,
  ) {}

  ngOnInit(): void {
    this.selectedStationsService.selectedStations$.subscribe(
      (stations) => {
        this.selectedCount = stations.length;
      },
    );
  }
}