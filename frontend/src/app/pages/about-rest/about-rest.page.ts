import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataMartMarkdownComponent } from '../../components/datamart-markdown/datamart-markdown.component';
import { ApplicationStateService } from '../../services/application-state.service';
import { AboutRestDailyWeatherComponent } from './daily-weather/about-rest-daily-weather.component';
import { AboutRestHourlyWeatherComponent } from './hourly-weather/about-rest-hourly-weather.component';
import { AboutRestWeatherStationsComponent } from './weather-stations/about-rest-weather-stations.component';

@Component( {
    selector: 'about-rest-page',
    templateUrl: './about-rest.page.html',
    styleUrl: './about-rest.page.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DataMartMarkdownComponent,
        AboutRestWeatherStationsComponent,
        AboutRestDailyWeatherComponent,
        AboutRestHourlyWeatherComponent,
    ]
} )
export class AboutRestPage {
    applicationStateService = inject( ApplicationStateService )

    // REST_BASE_URL may be relative to the app's host (e.g. 'api' in prod), so resolve it
    // against the document's base URL to show users a full, usable URL
    readonly restBaseUrl = new URL( this.applicationStateService.environment.REST_BASE_URL, document.baseURI ).href.replace( /\/$/, '' )

    readonly openApiUrl = `${ this.restBaseUrl }/openapi`
}


/*

curl --url 'https://nr-bcws-datamart-app-int-api.azurewebsites.net/api/openapi'

{
  "openapi": "3.0.1",
  "info": {
    "title": "Data API builder - REST Endpoint",
    "version": "2.0.12"
  },
  "servers": [
    {
      "url": "/api"
    }
  ],
  "paths": { },
  "components": { },
  "tags": [
    {
      "name": "daily_weather"
    },
    {
      "name": "hourly_weather"
    },
    {
      "name": "weather_stations"
    },
    {
      "name": "daily_measurement_type_codes"
    },
    {
      "name": "fire_centres"
    },
    {
      "name": "fire_zones"
    },
    {
      "name": "org_units"
    },
    {
      "name": "wildfire_org_units"
    }
  ]
}

*/