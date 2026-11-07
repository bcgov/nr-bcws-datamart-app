import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Input,
} from '@angular/core';
import { ButtonComponent, IndicatorComponent } from '@bcgov/nr-ngx-component-lib';
import { SelectedWeatherStationsService } from '../../../../../services/selected-weather-stations.service';
import { formatTableDate } from '../../../../../util';

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

    formatNumber( val: any, decimals: number ): string|undefined {
        if ( val == null ) return
        let n = Number( val )
        return n.toFixed( decimals )
    }

    formatWindspeed( val: any ): string|undefined {
        if ( val == null ) return
        let ws = String( val ).split( '_' )
        return `${ ws[ 0 ] } m .. ${ ws[ 1 ] } m`
    }

    formatBoolean( val: any ): string|undefined {
        if ( val == null ) return
        if ( val == 'N' ) return 'No'
        if ( val == 'Y' ) return 'Yes'
        return val
    }

    formatDate( val: any ): string|undefined {
        return formatTableDate( val )
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
}