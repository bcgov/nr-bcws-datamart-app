import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DailyWeatherDefs } from '../../../api-types';
import { DataMartMarkdownComponent, IndentPipe } from '../../../components/datamart-markdown/datamart-markdown.component';
import { ApplicationStateService } from '../../../services/application-state.service';

@Component( {
    selector: 'about-rest-daily-weather',
    templateUrl: './about-rest-daily-weather.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DataMartMarkdownComponent,
        JsonPipe,
        IndentPipe,
    ]
} )
export class AboutRestDailyWeatherComponent {
    applicationStateService = inject( ApplicationStateService )

    attributes = DailyWeatherDefs
        .filter( f => f.description )
        .map( f => `\`${ f.name }\` | ${ f.apiType } | ${ f.description }` )
        .join( '\n' )

    // curl --url 'https://nr-bcws-datamart-app-int-api.azurewebsites.net/api/daily_weather?$filter=WEATHER_STATION_GUID%20eq%20%270xBA28973A0BC804EAE0531D09228E8C64%27%20and%20WEATHER_TIMESTAMP%20ge%202026-11-15T07:00:00.000Z%20and%20WEATHER_TIMESTAMP%20le%202026-11-16T07:00:00.000Z' | jq . 
    example = {
        "value": [
            {
                "DAILY_WEATHER_MEAS_GUID": "0x76F7AF012BCD4996B0942A1E4CDC2D85",
                "WEATHER_STATION_GUID": "0xBA28973A0BC804EAE0531D09228E8C64",
                "WEATHER_TIMESTAMP_MSEC": 1794772800000,
                "WEATHER_TIMESTAMP": "2026-11-15 20:00:00.000000",
                "DAILY_MEASUREMENT_TYPE_CODE": "ACTUAL",
                "TEMPERATURE": 7.6,
                "TEMPERATURE_MIN": 6.6,
                "TEMPERATURE_MAX": 9.6,
                "RELATIVE_HUMIDITY": 82,
                "RELATIVE_HUMIDITY_MIN": 82,
                "RELATIVE_HUMIDITY_MAX": 99,
                "PRECIPITATION": 10.414,
                "WIND_SPEED": 6,
                "WIND_DIRECTION_DEGREES": 201,
                "ADJUSTED_WIND_SPEED": 6,
                "DAILY_SEVERITY_RATING": null,
                "DROUGHT_CODE": null,
                "DUFF_MOISTURE_CODE": null,
                "FINE_FUEL_MOISTURE_CODE": null,
                "GRASSLAND_CURING": null,
                "BUILD_UP_INDEX": null,
                "DANGER_FOREST_INDEX": null,
                "DANGER_GRASSLAND_INDEX": null,
                "DANGER_SCRUB_INDEX": null,
                "FIRE_WEATHER_INDEX": null,
                "INITIAL_SPREAD_INDEX": null,
                "MISSING_HOURLY_DATA_IND": "N",
                "OBSERVATION_VALID_IND": "Y",
                "OBSERVATION_VALID_COMMENT": null,
                "ARCHIVED_IND": "Y",
                "LAST_UPDATED_TIMESTAMP_MSEC": 1794837925316,
                "LAST_UPDATED_TIMESTAMP": "2026-11-16 14:05:25.316000",
                "CREATE_USER": "WFWX_FIREWEATHER_API",
                "CREATE_DATE": "2026-11-15 13:05:36.000000",
                "UPDATE_USER": "WFWX_WEATHER_API",
                "UPDATE_DATE": "2026-11-16 07:05:25.000000"
            }
        ]
    }
}
 