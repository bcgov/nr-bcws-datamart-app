import {
    AfterViewInit,
    ApplicationRef,
    Component,
    EnvironmentInjector,
    createComponent
} from '@angular/core';

import * as L from 'leaflet';

import {
    StationInformationPanelComponent
} from './station-information-panel/station-information-panel.component';

declare const SMK: any;

declare global {
    interface Window {
        weatherStationPopup: (reading: any) => string;
    }
}

@Component({
    selector: 'app-station-selection-map',
    templateUrl: './station-selection-map.component.html',
    styleUrl: './station-selection-map.component.scss'
})
export class StationSelectionMapComponent
    implements AfterViewInit {

    private smk: any;
    private map: any;
	private activeMarker: L.Marker | null = null;

	private stationMarkers = new Map<string, L.Marker>();
	private popupComponentRef: any;
	private popupHost: HTMLElement | null = null;

	
	constructor(
		private readonly appRef: ApplicationRef,
		private readonly environmentInjector: EnvironmentInjector
	) {

		const me = this;

		window.weatherStationPopup = function (
			reading: any
		): string {

			if (reading) {

				setTimeout(() => {
					me.buildPopup(reading);
					me.setActiveMarker(reading.stationName);
				}, 100);

				return 'Loading...';
			}

			return 'Station not found';
		};
	}

	private monitorPopupHost(popupHost: HTMLElement): void {

		const observer = new MutationObserver(() => {

			if (!popupHost.isConnected) {

				this.activeMarker?.getElement()?.classList.remove('active');

				this.activeMarker = null;

				observer.disconnect();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	private buildPopup(reading: any): void {

		const popupHost = document.getElementById('weatherStationPopup');

		if (!popupHost) {
			return;
		}

		popupHost.innerHTML = '';

		const componentRef = createComponent(
			StationInformationPanelComponent,
			{
				environmentInjector: this.environmentInjector
			}
		);

		componentRef.instance.station = reading.station;

		this.popupComponentRef = componentRef;
		this.popupHost = popupHost;

		this.appRef.attachView(componentRef.hostView);

		this.monitorPopupHost(popupHost);

		popupHost.appendChild(componentRef.location.nativeElement);
	}

	async ngAfterViewInit(): Promise<void> {

		this.smk = await SMK.INIT({
			containerSel: '#station-map',
			config: [
				'./assets/smk/station-selection-config.json',
				'?'
			]
		});

		this.map = this.smk.$viewer.map;

		const identify = this.smk.getToolById('IdentifyFeatureTool');

		identify.active = true;

		await this.loadStations();
	}

	private async loadStations(): Promise<void> {

		const response = await fetch(
			'https://container-app-api-yujhzooydm766.bluewater-fbba4d31.canadacentral.azurecontainerapps.io/api/weather_stations'
		);

		const data =
			await response.json();

		this.renderStations(
			data.value
		);
	}


	
	private renderStations(stations: any[]): void {

		const uniqueStations = [
			...new Map(
				stations.map(station => [
					station.WEATHER_STATION_GUID,
					station
				])
			).values()
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

			uniqueStations.forEach(station => {
				const marker = this.createStationMarker(station);

				if (marker) {
					layer.addLayer(marker);
				}
			});
		});

		this.map.invalidateSize();
	}

	private createStationMarker(station: any): L.Marker | null {

		if (station.LATITUDE == null || station.LONGITUDE == null) {
			return null;
		}

		const marker = L.marker(
			[station.LATITUDE, station.LONGITUDE],
			{
				icon: L.divIcon({
					className: 'weather-station-marker',
					iconSize: [20, 20],
					iconAnchor: [10, 10],
					html: `
						<svg width="20" height="20" viewBox="0 0 20 20">
							<circle class="station-marker-inner" cx="10" cy="10" r="6.5"></circle>
							<circle class="station-marker-outer" cx="10" cy="10" r="9"></circle>
						</svg>
					`
				})
			}
		);

		const row = {
			station,
			stationName: station.STATION_NAME,
			latitude: station.LATITUDE,
			longitude: station.LONGITUDE
		};

		this.initializeStationMarker(marker, row);

		this.stationMarkers.set(station.STATION_NAME, marker);

		return marker;
	}

	private initializeStationMarker(marker: L.Marker, row: any): void {

		marker.feature = {
			type: 'Feature',
			properties: row,
			geometry: {
				type: 'Point',
				coordinates: [row.latitude, row.longitude]
			}
		};


	}

	private setActiveMarker(stationName: string): void {

		this.stationMarkers.forEach(marker => {
			marker.getElement()?.classList.remove('active');
		});

		const marker = this.stationMarkers.get(stationName);

		marker?.getElement()?.classList.add('active');

		this.activeMarker = marker ?? null;
	}

}                       