import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-station-selection-filters',
  templateUrl: './station-selection-filters.component.html',
  styleUrl: './station-selection-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class StationSelectionFiltersComponent {
  filtersExpanded = false;

  toggleFilters(): void {
    this.filtersExpanded = !this.filtersExpanded;
  }
}
