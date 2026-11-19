import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent, DesktopViewDirective, DeviceViewComponent, IconComponent, MobileViewDirective, SnackbarUtilService, TabComponent, TabContentDirective, TabGroupComponent, TabLabelDirective } from '@bcgov/nr-ngx-component-lib';
import { loadFailureMessage } from '../../util';
import { ROUTE } from '../../bcws-datamart-app.routes';
import { DataMartHeaderComponent } from '../../components/datamart-header/datamart-header.component';
import { DialogService } from '../../services/dialog.service';
import { SelectedWeatherStationsService } from '../../services/selected-weather-stations.service';
import { emptyFilter, StationSelectionFiltersComponent } from './filters/station-selection-filters.component';
import { WeatherStationService } from '../../services/weather-station.service';
import { CodeTableService } from '../../services/code-table.service';
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
    codeTableService = inject(CodeTableService)
    snackbarUtilService = inject(SnackbarUtilService)

    loadingCount = 0

    get isLoading() {
        return this.loadingCount > 0
    }

    startLoading() {
        this.loadingCount += 1
        this.changeDetectorRef.detectChanges()
    }

    stopLoading() {
        this.loadingCount -= 1
        this.changeDetectorRef.detectChanges()
    }

    onIsLoadingChange( ev: boolean ) {
        if ( ev ) {
            this.startLoading()
        }
        else {
            this.stopLoading()
        }
    }

    // keeps the spinner visible until the promise settles (resolved or rejected)
    trackLoading<T>( promise: Promise<T> ): Promise<T> {
        this.startLoading()
        promise
            .catch( () => {} )
            .finally( () => this.stopLoading() )
        return promise
    }

    ngOnInit(): void {
        // hack to make page load properly
        setTimeout(() => {
            this.changeDetectorRef.detectChanges()
        }, 1000);

        // collect every startup failure into one snackbar, since a new snackbar replaces the previous one
        let failed: string[] = []
        let load = ( resource: string, promise: Promise<unknown> ) => {
            return this.trackLoading( promise )
                .catch( err => {
                    console.warn( `loading ${ resource } failed`, err )
                    failed.push( resource )
                } )
        }

        Promise.all( [
            load( 'weather stations', this.weatherStationService.filterStations( emptyFilter() ) ),
            load( 'fire centres', this.codeTableService.FIRE_CENTRES.isLoading ),
            load( 'fire zones', this.codeTableService.FIRE_ZONES.isLoading ),
        ] )
            .then( () => {
                if ( failed.length > 0 ) this.snackbarUtilService.error( loadFailureMessage( failed ) )
            } )
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