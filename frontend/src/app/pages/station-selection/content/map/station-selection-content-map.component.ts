import {
    AfterViewInit,
    ApplicationRef,
    ChangeDetectionStrategy,
    Component,
    EnvironmentInjector,
    createComponent,
    inject,
} from '@angular/core';
// import * as L from 'leaflet';
import { SelectedStationsService } from '../../../../services/selected-stations.service';
import { StationDataService } from '../../../../services/station-data.service';
import { StationSelectionContentMapInformationPanelComponent } from './information-panel/station-selection-content-map-information-panel.component';
import { SnackbarUtilService } from '@bcgov/nr-ngx-component-lib';

declare const SMK: any;

declare global {
    interface Window {
        weatherStationPopup: (reading: any) => string;
    }
}

@Component({
    selector: 'station-selection-content-map',
    templateUrl: './station-selection-content-map.component.html',
    styleUrl: './station-selection-content-map.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
    ]
})
export class StationSelectionContentMapComponent implements AfterViewInit {
    appRef = inject( ApplicationRef )
    environmentInjector = inject( EnvironmentInjector )
    stationDataService = inject( StationDataService )
    selectedStationsService = inject( SelectedStationsService )
    snackbarUtilService = inject( SnackbarUtilService )

    smk: any;
    stationLayer: { [key:string]: any } = {}
    activeStationId?: string|null
    stationWasSelected?: string[] 

    constructor() {
        window.weatherStationPopup = ( feature: any ): string => {
            if ( feature ) {
                setTimeout(() => {
                    this.buildPopup( feature );
                }, 100);

                return 'Loading...';
            }

            return 'Station not found';
        };
    }

    ngAfterViewInit() {
        Promise.resolve()
            .then( () => {
                // SMK/Leaflet initialization can fail during Angular HMR
                // if the container is initialized before the browser has
                // completed the current render cycle.
                return new Promise<void>( res => requestAnimationFrame( () => res() ) )
            } )
            .then( () => {
                return SMK.INIT({
                    containerSel: '#station-map',
                    config: ['./assets/smk/station-selection-config.json', '?'],
                } )
            } )
            .then( ( smk ) => {
                this.smk = smk

                this.selectedStationsService.selectedStations$.subscribe((stations) => {
                    if ( this.stationWasSelected ) {
                        this.stationWasSelected.forEach( id => {
                            this.toggleStationSelected( id, false )
                        } )
                    }

                    this.stationWasSelected = stations.map( s => s.properties.WEATHER_STATION_GUID )

                    this.stationWasSelected.forEach( id => {
                        this.toggleStationSelected( id, true )
                    } )
                });

                this.smk.$viewer.lassoed.addedFeatures( ( ev:any ) => {
                    this.selectedStationsService.addStations( ev.features )
                    if ( ev.features.length == 1 ) {
                        this.snackbarUtilService.successful( 'Selected 1 station', 2000 )
                    }
                    else {
                        this.snackbarUtilService.successful( 'Selected ' + ev.features.length + ' stations', 2000 )
                    }
                } )

                this.smk.$viewer.map.on( 'lasso.finished', (event:any) => {
                    if ( event.layers.length == 0 ) {
                        this.snackbarUtilService.information( 'No stations found in this area', 2000 )
                    }
                } )

                this.stationDataService.stations$.subscribe( (stations) => {
                    this.loadLayer( 'weather-stations', {
                        "type": "FeatureCollection",
                        "features": stations
                    } )
                } )

                this.smk.on( 'SelectLassoListTool', {
                    'activate': () => {
                        if ( this.smk.$tool.SelectLassoListTool.active ) {
                            this.snackbarUtilService.information( 'Draw an area on the map to select stations', 2000 )
                        }
                        console.log('activate',this.smk.$tool.SelectLassoListTool.active )
                    }
                } )
            } )
            .catch( console.warn )
    }

    loadLayer( layerId: string, featureCollection: any ): Promise<void> {
        return Promise.resolve()
            .then( () => {
                this.smk.$viewer.layerId[ layerId ].clear()
                this.smk.$viewer.displayContext.layers.setItemVisible( layerId, true )

                return this.smk.$viewer.refreshLayers()
            } )
            .then( () => {
                this.smk.$viewer.layerId[ layerId ].loadLayer( featureCollection )

                this.stationLayer = {}
                this.smk.$viewer.visibleLayer[ layerId ].getLayers().forEach( (featureLayer:any) => {
                    let key: string = featureLayer.feature.properties[ 'WEATHER_STATION_GUID' ]
                    this.stationLayer[ key ] = featureLayer
                } )
            } )
    }

    toggleStationActive( id: string|null, toggle: boolean ) {
        if ( this.activeStationId ) this.stationLayer[ this.activeStationId ]._icon.classList.toggle( 'active', false )
        if ( id ) this.stationLayer[ id ]._icon.classList.toggle( 'active', toggle )
        this.activeStationId = id
    }

    toggleStationSelected( id: string, toggle: boolean ) {
        this.stationLayer[ id ]._icon.classList.toggle( 'selected', toggle )
    }

    private monitorPopupHost(popupHost: HTMLElement): void {
        const observer = new MutationObserver(() => {
            if (!popupHost.isConnected) {
                this.toggleStationActive( null, true )
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    private buildPopup( feature: any ): void {
        const popupHost = document.getElementById('weatherStationPopup');

        if (!popupHost) {
            return;
        }

        popupHost.innerHTML = '';

        const componentRef = createComponent(StationSelectionContentMapInformationPanelComponent, {
            environmentInjector: this.environmentInjector,
        });

        this.toggleStationActive( feature.properties[ 'WEATHER_STATION_GUID' ], true )

        componentRef.instance.feature = {
            ...feature,
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [ feature.properties.LONGITUDE, feature.properties.LATITUDE ]
            }
        }

        this.appRef.attachView(componentRef.hostView);

        this.monitorPopupHost(popupHost);

        popupHost.appendChild(componentRef.location.nativeElement);
    }
}
