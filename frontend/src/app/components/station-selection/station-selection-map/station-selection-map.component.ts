import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';


declare const SMK: any;

@Component({
    selector: 'app-station-selection-map',
    templateUrl: './station-selection-map.component.html',
    styleUrl: './station-selection-map.component.scss'
})

export class StationSelectionMapComponent implements AfterViewInit {

    private smk: any;
	private map: any;

	async ngAfterViewInit(): Promise<void> {

		this.smk = await SMK.INIT({
			containerSel: '#station-map',
			config: [
				'./assets/smk/station-selection-config.json',
				'?'
			]
		});

		this.map = this.smk.$viewer.map;

		await this.loadStations();
	}

	private async loadStations(): Promise<void> {

		const response = await fetch(
			'https://container-app-api-yujhzooydm766.bluewater-fbba4d31.canadacentral.azurecontainerapps.io/api/weather_stations'
		);

		const data = await response.json();

		this.renderStations(data.value);
	}

	

	private renderStations(stations: any[]): void {

		const uniqueStations = [
			...new Map(
				stations.map(s => [
					s.WEATHER_STATION_GUID,
					s
				])
			).values()
		];

		this.map.eachLayer((layer: any) => {

			if (
				Object.prototype.hasOwnProperty.call(layer, '_smk_id') &&
				layer._smk_id === 'weather-stations'
			) {

				if (typeof layer.clearLayers === 'function') {
					layer.clearLayers();
				}

				uniqueStations.forEach((station: any) => {

					if (!station.LATITUDE || !station.LONGITUDE) {
						return;
					}

					const marker = L.marker(
						[
							station.LATITUDE,
							station.LONGITUDE
						],
						{
							icon: L.divIcon({
								className: 'weather-station-marker',
								iconSize: [10, 10],
								iconAnchor: [5, 5]
							})
						}
					);

					marker.feature = {
						type: 'Feature',
						properties: {
							stationName: station.STATION_NAME,
							stationCode: station.STATION_CODE
						},
						geometry: {
							type: 'Point',
							coordinates: [
								station.LONGITUDE,
								station.LATITUDE
							]
						}
					};

					marker.bindPopup(`
						<strong>${station.STATION_NAME}</strong>
						<br>
						Acronym: ${station.STATION_ACRONYM}
						<br>
						Lat: ${station.LATITUDE}
						<br>
						Long: ${station.LONGITUDE}
					`);

					layer.addLayer(marker);
				});
			}
		});
	}
}