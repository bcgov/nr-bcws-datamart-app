import { Component, ChangeDetectionStrategy } from '@angular/core';

import { StationDataService } from '../../../services/station-data.service';
import { StationFilters } from '../../../models/station-filters';
import { ButtonComponent, FilterContainerComponent, FilterSearchComponent, FilterSelectComponent, FiltersPanelComponent, IconComponent } from '@bcgov/nr-ngx-component-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-station-selection-filters',
  templateUrl: './station-selection-filters.component.html',
  styleUrl: './station-selection-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    IconComponent,
    FilterSearchComponent,
    FiltersPanelComponent,
    FilterSelectComponent,
    FilterContainerComponent,
    FormsModule,
    ButtonComponent
  ]
})
export class StationSelectionFiltersComponent {
  filtersExpanded = false;

  elevationMin: number | null = null;
  elevationMax: number | null = null;

  latitudeOperator: 'gt' | 'lt' | 'eq' = 'gt';
  latitudeValue: number | null = null;

  longitudeOperator: 'gt' | 'lt' | 'eq' = 'gt';
  longitudeValue: number | null = null;

  constructor(
    private readonly stationDataService: StationDataService,
  ) {}

  toggleFilters(): void {
    this.filtersExpanded = !this.filtersExpanded;
  }

  async applyFilters(): Promise<void> {

    const filters: StationFilters = {
      elevationMin: this.elevationMin,
      elevationMax: this.elevationMax,
      latitudeOperator: this.latitudeOperator,
      latitudeValue: this.latitudeValue,
      longitudeOperator: this.longitudeOperator,
      longitudeValue: this.longitudeValue,
    };

    await this.stationDataService.loadStationsFiltered(filters);
  }

  async clearFilters(): Promise<void> {

    this.elevationMin = null;
    this.elevationMax = null;

    this.latitudeOperator = 'gt';
    this.latitudeValue = null;

    this.longitudeOperator = 'gt';
    this.longitudeValue = null;

    await this.stationDataService.clearFilters();
  }

  get activeFilterCount(): number {

    let count = 0;

    if (this.elevationMin !== null || this.elevationMax !== null) count++;
    if (this.latitudeValue !== null) count++;
    if (this.longitudeValue !== null) count++;

    return count;
  }

}
