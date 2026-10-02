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

  latitudeMin: number | null = null;
  latitudeMax: number | null = null;

  longitudeMin: number | null = null;
  longitudeMax: number | null = null;

  stationStatus: string | null = null;

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
      latitudeMin: this.latitudeMin,
      latitudeMax: this.latitudeMax,
      longitudeMin: this.longitudeMin,
      longitudeMax: this.longitudeMax,
      stationStatus: this.stationStatus,
    };

    await this.stationDataService.loadStationsFiltered(filters);
  }

  async clearFilters(): Promise<void> {

    this.elevationMin = null;
    this.elevationMax = null;

    this.latitudeMin = null;
    this.latitudeMax = null;

    this.longitudeMin = null;
    this.longitudeMax = null;

    this.stationStatus = null;

    await this.stationDataService.clearFilters();
  }

  get activeFilterCount(): number {

    let count = 0;

    if (this.elevationMin !== null || this.elevationMax !== null) count++;
    if (this.latitudeMin !== null || this.latitudeMax !== null) count++;
    if (this.longitudeMin !== null || this.longitudeMax !== null) count++;
    if (this.stationStatus) count++;

    return count;
  }

  get isMobileView(): boolean {
    return window.innerWidth <= 992;
  }

}
