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
import { StationDataService, WeatherStation } from '../../../../services/station-data.service';
import { StationSelectionContentMapInformationPanelComponent } from './information-panel/station-selection-content-map-information-panel.component';

declare const SMK: any;

declare global {
    interface Window {
        weatherStationPopup: (reading: any) => string;
    }
}

export type GeoJsonPoint<P> = {
    // type: "FeatureCollection",
    // features: [ {
        type: 'Feature',
        properties: P,
        geometry: {
            type: 'Point',
            coordinates: [ number, number ]
        }
    // } ]
}

export type ClickCallback = ( event: any ) => void

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

    private smk: any;
    private map: any;
    // private activeMarker: L.Marker | null = null;

    // private stationMarkers = new Map<string, L.Marker>();
    private popupComponentRef: any;
    private popupHost: HTMLElement | null = null;
    stationLayer: { [key:string]: any } = {}

    constructor() {
        const me = this;

        window.weatherStationPopup = function ( feature: any): string {
            if ( feature ) {
                setTimeout(() => {
                    me.buildPopup( feature );
                    // me.setActiveMarker(reading.station.WEATHER_STATION_GUID,);
                }, 100);

                return 'Loading...';
            }

            return 'Station not found';
        };
    }

    ngAfterViewInit() {
        // SMK/Leaflet initialization can fail during Angular HMR
        // if the container is initialized before the browser has
        // completed the current render cycle.
        Promise.resolve()
            .then( () => {
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
                this.map = this.smk.$viewer.map;

                // const identify = this.smk.getToolById('IdentifyFeatureTool');

                // identify.active = true;

                // this.stationDataService.stations$.subscribe((stations) => {
                //     this.renderStations(stations);
                // });

                this.selectedStationsService.selectedStations$.subscribe((stations) => {
                    this.updateSelectedMarkers(stations);
                });

                // console.log(this.smk)
                this.smk.$viewer.selected.addedFeatures( ( ev:any ) => {
                    let ids = Object.keys( this.smk.$viewer.selected.featureSet )
                    console.log('selected.addedFeatures',ids)
                    this.smk.$viewer.selected.highlight( ids )
                } )

                this.smk.$viewer.lassoed.addedFeatures( ( ev:any ) => {
                    // let ids = Object.keys( this.smk.$viewer.lassoed.featureSet )
                    console.log('lassoed.addedFeatures',ev)
                    // this.smk.$viewer.selected.highlight( ids )
                    ev.features.forEach( (ft:any) => {
                    //     // let ft = this.smk.$viewer.lassoed.get( id )
                    //     // console.log(ft)
                        this.selectedStationsService.addStation( ft )
                    } )
                    // this.selectedStationsService.addStation( ev.features )

                } )

                return this.stationDataService.getStations()
            } )
            .then( stations => {
                console.log(stations)
                this.loadLayer( 'weather-stations', () => {
                        // return this.toGeoJsonPoints<WeatherStation>( stations, ( s ) => [ s.LONGITUDE, s.LATITUDE ] )
                    return {
                        "type": "FeatureCollection",
                        "features": stations.map( (s:any) => {
                            [ s.LONGITUDE, s.LATITUDE ] = this.randomPoint()
                            s.WEATHER_STATION_GUID = crypto.randomUUID()

                            return {
                                type: 'Feature',
                                properties: s,
                                geometry: {
                                    type: 'Point',
                                    coordinates: [ s.LONGITUDE, s.LATITUDE ]
                                }
                            }
                        } )
                        // "features": this.toGeoJsonPoints<WeatherStation>( stations, ( s ) => this.randomPoint() )
                    }
                } )
            } )
            .catch( console.warn )
    }

    randomPoint(): [ number, number ] {
        const LONG = [ -139.1782, -110.3533 ]
        const LAT = [ 47.6039, 60.5939 ]
        return [
            Math.random() * ( LONG[ 1 ] - LONG[ 0 ] ) + LONG[ 0 ],
            Math.random() * ( LAT[ 1 ] - LAT[ 0 ] ) + LAT[ 0 ],
        ]
    }

    private loadLayer( layerId: string, data: () => any, clickCallback?: ClickCallback ): Promise<void> {
        return Promise.resolve()
            .then( () => {
                this.clearLayer( layerId )

                return this.showLayer( layerId, true )
            } )
            .then( () => {
                // console.log( 'loading layer', layerId )
                // console.log(data())
                // debugger
                let features = data()
                // features.forEach( ( ft: any ) => {
                // console.log(features.features.map( (f:any) => f.geometry.coordinates ))
                    this.smk.$viewer.layerId[ layerId ].loadLayer( features )
                // } )
                // this.smk.$viewer.layerId[ layerId ].setClickCallback( clickCallback )
                // return this.showLayer( layerId, true )
        // return this.smk.$viewer.refreshLayers()

                this.stationLayer = {}
                this.smk.$viewer.visibleLayer[ layerId ].getLayers().forEach( (featureLayer:any) => {
                    let key: string = featureLayer.feature.properties[ 'WEATHER_STATION_GUID' ]
                    this.stationLayer[ key ] = featureLayer
                } )
                console.log(this.stationLayer)
            } )
    }

    private clearLayer( layerId: string ) {
        this.smk.$viewer.layerId[ layerId ].clear()
    }

    private showLayer( layerId: string, visible: boolean ): Promise<void> {
        this.smk.$viewer.displayContext.layers.setItemVisible( layerId, visible )

        // return this.smk.$viewer.changedLayerVisibility()
        return this.smk.$viewer.refreshLayers()
    }

    private monitorPopupHost(popupHost: HTMLElement): void {
        const observer = new MutationObserver(() => {
            if (!popupHost.isConnected) {
                // this.activeMarker?.getElement()?.classList.remove('active');

                // this.activeMarker = null;
// 
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    private buildPopup( feature: any ): void {
        // debugger
        const popupHost = document.getElementById('weatherStationPopup');

        if (!popupHost) {
            return;
        }

        popupHost.innerHTML = '';

        const componentRef = createComponent(StationSelectionContentMapInformationPanelComponent, {
            environmentInjector: this.environmentInjector,
        });
console.log(feature)
        componentRef.instance.feature = {
            ...feature,
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [ feature.properties.LONGITUDE, feature.properties.LATITUDE ]
            }
        }//.station;

        this.popupComponentRef = componentRef;
        this.popupHost = popupHost;

        this.appRef.attachView(componentRef.hostView);

        this.monitorPopupHost(popupHost);

        popupHost.appendChild(componentRef.location.nativeElement);
    }


    private renderStations(stations: any[]): void {
        const uniqueStations = [
            ...new Map(stations.map((station) => [station.WEATHER_STATION_GUID, station])).values(),
        ];

        this.map.eachLayer((layer: any) => {
            if (
                !Object.prototype.hasOwnProperty.call(layer, '_smk_id') ||
                layer._smk_id !== 'popup-link'
            ) {
                return;
            }

            const intLayer = this.smk?.$viewer?.layerId?.[layer._smk_id];

            intLayer?.clear?.();
            intLayer?.clearLayer?.();
            layer.clearLayers?.();

            uniqueStations.forEach((station) => {
                // const marker = this.createStationMarker(station);

                // if (marker) {
                    // layer.addLayer(marker);
                // }
            });
        });

        this.map.invalidateSize();
    }

    // private createStationMarker(station: any): L.Marker | null {
    //     if (station.LATITUDE == null || station.LONGITUDE == null) {
    //         return null;
    //     }

    //     const marker = L.marker([station.LATITUDE, station.LONGITUDE], {
    //         icon: L.divIcon({
    //             className: 'weather-station-marker',
    //             iconSize: [20, 20],
    //             iconAnchor: [10, 10],
    //             html: `
	// 					<svg width="20" height="20" viewBox="0 0 20 20">
	// 						<circle class="station-marker-inner" cx="10" cy="10" r="6.5"></circle>
	// 						<circle class="station-marker-outer" cx="10" cy="10" r="9"></circle>
	// 					</svg>
	// 				`,
    //         }),
    //     });

    //     const row = {
    //         station,
    //         stationName: station.STATION_NAME,
    //         latitude: station.LATITUDE,
    //         longitude: station.LONGITUDE,
    //     };

    //     this.initializeStationMarker(marker, row);

    //     // this.stationMarkers.set(station.WEATHER_STATION_GUID, marker,);

    //     return marker;
    // }

    // private initializeStationMarker(marker: L.Marker, row: any): void {
    //     marker.feature = {
    //         type: 'Feature',
    //         properties: row,
    //         geometry: {
    //             type: 'Point',
    //             coordinates: [row.latitude, row.longitude],
    //         },
    //     };
    // }

    private setActiveMarker(stationGuid: string,): void {
        // this.stationMarkers.forEach((marker) => { marker.getElement()?.classList.remove('active'); });

        // const marker = this.stationMarkers.get(stationGuid);

        // marker?.getElement()?.classList.add('active');

        // this.activeMarker = marker ?? null;
    }

    private updateSelectedMarkers( selectedFeatures: any[],): void {
        let selected = this.smk.$viewer.selected

        selected.clear()
        selected.add( "weather-stations", selectedFeatures )

        // const selectedIds = new Set(
        //     selectedStations.map(
        //         (station) => station.WEATHER_STATION_GUID,
        //     ),
        // );

        // this.stationMarkers.forEach((marker, stationGuid) => {
        //     if (selectedIds.has(stationGuid)) {
        //         marker.getElement()?.classList.add('selected');
        //     } else {
        //         marker.getElement()?.classList.remove('selected');
        //     }
        // });
    }

    toGeoJsonPoints<P>( stations: P[], point: ( prop: P ) => [ number, number ] ): GeoJsonPoint<P>[] {
        return stations.map( s => {
            return {
                // type: "FeatureCollection",
                // features: [ {
                    type: 'Feature',
                    properties: { ...s, WEATHER_STATION_GUID: crypto.randomUUID() },
                    geometry: {
                        type: 'Point',
                        coordinates: point( s )
                    }
                // } ]
            }
        } )
    } 
}
