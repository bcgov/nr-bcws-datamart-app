import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, DestroyRef, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StationSelectionMapComponent } from './station-selection-map/station-selection-map.component';
import { StationSelectionStationListComponent } from './station-selection-station-list/station-selection-station-list.component';
import { IconComponent } from '@bcgov/nr-ngx-component-lib';

@Component({
  selector: 'app-station-selection-content',
  templateUrl: './station-selection-content.component.html',
  styleUrl: './station-selection-content.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    StationSelectionMapComponent,
    StationSelectionStationListComponent,
    IconComponent
  ]
})
export class StationSelectionContentComponent {
  activeMobileTab: 'list' | 'map' = 'list';

  isMobile = false;

  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe(['(max-width: 992px)'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }
}
