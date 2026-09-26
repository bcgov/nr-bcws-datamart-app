import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-station-information-panel',
    templateUrl: './station-information-panel.component.html',
    styleUrl: './station-information-panel.component.scss'
})
export class StationInformationPanelComponent {

    @Input()
    station: any;

    

    display(value: any): string {
        return value === null || value === undefined || value === '' ? '–' : String(value);
    }

    get installationDate(): string {

        if (!this.station?.INSTALLATION_TIMESTAMP_MSEC) {
            return '–';
        }

        return new Date(
            this.station.INSTALLATION_TIMESTAMP_MSEC
        ).toLocaleDateString();
    }

    get indicatorLabel(): string {

        switch (this.station?.STATION_STATUS_CODE) {

            case 'ACTIVE':
                return 'Future';

            case 'ARCHIVED':
            case 'DISABLED':
                return 'Active';

            case 'PROJECT':
            case 'TEST':
                return 'Ok';

            default:
                return 'Not defined';
        }
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