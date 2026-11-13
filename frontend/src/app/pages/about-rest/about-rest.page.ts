import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataMartMarkdownComponent } from '../../components/datamart-markdown/datamart-markdown.component';
import { ApplicationStateService } from '../../services/application-state.service';
// @ts-ignore — `with { loader: 'text' }` is resolved by the bundler, not TypeScript.
import dailies from './section/dailies.md' with { loader: 'text' }

@Component( {
    selector: 'about-rest-page',
    templateUrl: './about-rest.page.html',
    styleUrl: './about-rest.page.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DataMartMarkdownComponent,
    ]
} )
export class AboutRestPage {
    applicationStateService = inject( ApplicationStateService )
    dailies = dailies
}

/*

curl --url 'https://nr-bcws-datamart-app-int-api.azurewebsites.net/api/weather_stations?$filter=STATION_STATUS_CODE%20eq%20%27ACTIVE%27&$after=W3siRW50aXR5TmFtZSI6IndlYXRoZXJfc3RhdGlvbnMiLCJGaWVsZE5hbWUiOiJXRUFUSEVSX1NUQVRJT05fR1VJRCIsIkZpZWxkVmFsdWUiOiIweEJBMjg5NzNBMDg1NDA0RUFFMDUzMUQwOTIyOEU4QzY0IiwiRGlyZWN0aW9uIjowfV0=' \
  

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