import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, DestroyRef, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IconComponent } from '@bcgov/nr-ngx-component-lib';
import { StationSelectionContentListComponent } from './list/station-selection-content-list.component';
import { StationSelectionContentMapComponent } from './map/station-selection-content-map.component';

@Component({
    selector: 'station-selection-content',
    templateUrl: './station-selection-content.component.html',
    styleUrl: './station-selection-content.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        StationSelectionContentMapComponent,
        StationSelectionContentListComponent,
        IconComponent
    ]
})
export class StationSelectionContentComponent {
    activeMobileTab: 'list' | 'map' = 'list';

    isMobile = false;

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private readonly breakpointObserver: BreakpointObserver,
        private readonly cdr: ChangeDetectorRef,
    ) {
        this.breakpointObserver
            .observe(['(max-width: 992px)'])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                this.isMobile = result.matches;
                this.cdr.markForCheck();
            });
    }
}
