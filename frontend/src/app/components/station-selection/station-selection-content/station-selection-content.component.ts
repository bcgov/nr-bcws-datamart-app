import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-station-selection-content',
    templateUrl: './station-selection-content.component.html',
    styleUrl: './station-selection-content.component.scss'
})
export class StationSelectionContentComponent {

    activeMobileTab: 'list' | 'map' = 'list';

    isMobile = false;

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private readonly breakpointObserver: BreakpointObserver
    ) {

        this.breakpointObserver
            .observe(['(max-width: 992px)'])
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(result => {

                this.isMobile = result.matches;

            });
    }
}