import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent, DesktopViewDirective, DeviceViewComponent, IconComponent, MobileViewDirective, TabComponent, TabContentDirective, TabGroupComponent, TabLabelDirective } from '@bcgov/nr-ngx-component-lib';
import { ROUTE } from '../../bcws-datamart-app.routes';
import { DataMartHeaderComponent } from '../../components/datamart-header/datamart-header.component';
import { DialogService } from '../../services/dialog.service';
import { SelectedWeatherStationsService } from '../../services/selected-weather-stations.service';
import { emptyFilter, StationSelectionFiltersComponent } from './filters/station-selection-filters.component';
import { WeatherStationService } from '../../services/weather-station.service';
import { StationSelectionContentMapComponent } from './map/station-selection-content-map.component';
import { StationSelectionContentListComponent } from './list/station-selection-content-list.component';

@Component({
    selector: 'station-selection-page',
    templateUrl: './station-selection.page.html',
    styleUrl: './station-selection.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        StationSelectionFiltersComponent,
        StationSelectionContentMapComponent,
        StationSelectionContentListComponent,
        DataMartHeaderComponent,
        ButtonComponent,
        IconComponent,
        DeviceViewComponent,
        DesktopViewDirective,
        MobileViewDirective,
        TabGroupComponent,
        TabComponent,
        TabContentDirective,
        TabLabelDirective,
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

        this.weatherStationService.filterStations(emptyFilter())
    }    

    onViewDataClick() {
        if ( this.selectedWeatherStationsService.count == 0 ) {
            this.dialogService.openMessageDialog( {
                title: 'Select a weather station',
                message: 'To view data, select at least one weather station from the map or list.'
            } )
            return;
        }

        this.router.navigate( [ ROUTE.DATA_DOWNLOAD ], {
            queryParams: {
                w: this.selectedWeatherStationsService.selectedStations.map( s => s.properties.STATION_CODE ).join(','),
            }
        } )       
    }
}