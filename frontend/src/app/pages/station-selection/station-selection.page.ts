import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@bcgov/nr-ngx-component-lib';
import { ROUTE } from '../../bcws-datamart-app.routes';
import { DataMartHeaderComponent } from '../../components/datamart-header/datamart-header.component';
import { DialogService } from '../../services/dialog.service';
import { SelectedWeatherStationsService } from '../../services/selected-weather-stations.service';
import { StationSelectionContentComponent } from './content/station-selection-content.component';
import { StationSelectionFiltersComponent } from './filters/station-selection-filters.component';
import { WeatherStationService } from '../../services/weather-station.service';

@Component({
    selector: 'station-selection-page',
    templateUrl: './station-selection.page.html',
    styleUrl: './station-selection.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        StationSelectionContentComponent,
        StationSelectionFiltersComponent,
        DataMartHeaderComponent,
        ButtonComponent
    ]
})
export class StationSelectionPage implements OnInit {
    weatherStationService = inject(WeatherStationService)
    changeDetectorRef = inject(ChangeDetectorRef)
    selectedWeatherStationsService = inject( SelectedWeatherStationsService )
    dialogService = inject(DialogService)
    router = inject(Router)

    ngOnInit(): void {
        // hack to make page load properly
        setTimeout(() => {
            this.changeDetectorRef.detectChanges()
        }, 1000);

        this.weatherStationService.initialize()
    }    

    onViewDataClick() {
        if ( this.selectedWeatherStationsService.count == 0 ) {
            this.dialogService.openMessageDialog( {
                title: 'Select a Weather Station',
                message: 'To view data, select at least one weather station from the map or list.'
            } )
            return;
        }

        this.router.navigate( [ ROUTE.DATA_DOWNLOAD ] )       
    }
}