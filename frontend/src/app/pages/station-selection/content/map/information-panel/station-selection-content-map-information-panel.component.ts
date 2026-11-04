import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Input,
} from '@angular/core';
import { ButtonComponent, IndicatorComponent } from '@bcgov/nr-ngx-component-lib';
import { SelectedWeatherStationsService } from '../../../../../services/selected-weather-stations.service';

@Component({
    selector: 'station-selection-content-map-information-panel',
    templateUrl: './station-selection-content-map-information-panel.component.html',
    styleUrl: './station-selection-content-map-information-panel.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        IndicatorComponent,
        ButtonComponent
    ]
})
export class StationSelectionContentMapInformationPanelComponent {
    selectedWeatherStationsService = inject( SelectedWeatherStationsService )

    @Input() feature: any;

    display(value: any): string {
        return value === null || value === undefined || value === ''
            ? '–'
            : String(value);
    }

    get isSelected(): boolean {
        return this.selectedWeatherStationsService.isSelected(this.feature);
    }

    onSelectStation(): void {
        this.selectedWeatherStationsService.addStation(this.feature);
    }

    onRemoveStation(): void {
        this.selectedWeatherStationsService.removeStation(this.feature);
    }

    get installationDate(): string {
        if (!this.feature.properties?.INSTALLATION_TIMESTAMP_MSEC) {
            return '–';
        }

        return new Date(
            this.feature.properties.INSTALLATION_TIMESTAMP_MSEC,
        ).toLocaleDateString();
    }

    get indicatorClass(): string {
        switch (this.feature.properties?.STATION_STATUS_CODE) {
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