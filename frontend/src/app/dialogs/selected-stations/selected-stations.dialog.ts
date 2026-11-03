import {
    ChangeDetectionStrategy,
    Component,
    inject
} from '@angular/core';
import { ButtonComponent, DialogBase, DialogComponent, GapComponent } from '@bcgov/nr-ngx-component-lib';
import { SelectedWeatherStationsService } from '../../services/selected-weather-stations.service';
import { SelectedStationsListComponent } from './list/selected-stations-list.component';

export type SelectedStationsDialogConfig = {}
export type SelectedStationsDialogResult = void

@Component({
    selector: 'selected-stations-dialog',
    templateUrl: './selected-stations.dialog.html',
    styleUrl: './selected-stations.dialog.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DialogComponent,
        ButtonComponent,
        GapComponent,
        SelectedStationsListComponent
    ]
})
export class SelectedStationsDialog extends DialogBase<SelectedStationsDialogConfig,SelectedStationsDialogResult> {
    selectedWeatherStationsService = inject( SelectedWeatherStationsService )

    selectedCount = 0;

    override ngOnInit(): void {
        this.selectedWeatherStationsService.selectedStations$.subscribe(
            (stations) => {
                this.selectedCount = stations.length;
                this.changeDetectorRef.markForCheck();
            },
        );
    }

    onRemoveAllClick() {
        this.selectedWeatherStationsService.clearStations()
    }
}