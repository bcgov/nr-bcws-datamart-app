import {
    Component,
    Input,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { SelectedStationsService } from '../../../../../services/selected-stations.service';
import { ButtonComponent, IconComponent, IndicatorComponent } from '@bcgov/nr-ngx-component-lib';

@Component({
    selector: 'station-selection-content-map-information-panel',
    templateUrl: './station-selection-content-map-information-panel.component.html',
    styleUrl: './station-selection-content-map-information-panel.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        IconComponent,
        IndicatorComponent,
        ButtonComponent
    ]
})
export class StationSelectionContentMapInformationPanelComponent {
    selectedStationsService = inject( SelectedStationsService )

    @Input()
    station: any;

    display(value: any): string {
        return value === null || value === undefined || value === ''
            ? '–'
            : String(value);
    }

    get isSelected(): boolean {
        return this.selectedStationsService.isSelected(this.station);
    }

    selectStation(): void {
        this.selectedStationsService.addStation(this.station);
    }

    removeStation(): void {
        this.selectedStationsService.removeStation(this.station);
    }

    get installationDate(): string {
        if (!this.station?.INSTALLATION_TIMESTAMP_MSEC) {
            return '–';
        }

        return new Date(
            this.station.INSTALLATION_TIMESTAMP_MSEC,
        ).toLocaleDateString();
    }

    get indicatorClass(): string {
        switch (this.station?.STATION_STATUS_CODE) {
            case 'ACTIVE':
                return 'future';

            case 'ARCHIVED':
            case 'DISABLED':
                return 'active';

            case 'PROJECT':
            case 'TEST':
                return 'ok';

            default:
                return 'none';
        }
    }
}