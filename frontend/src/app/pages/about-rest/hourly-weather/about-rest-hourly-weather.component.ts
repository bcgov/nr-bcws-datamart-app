import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Pipe, PipeTransform } from '@angular/core';
import { HourlyWeatherDefs } from '../../../api-types';
import { DataMartMarkdownComponent } from '../../../components/datamart-markdown/datamart-markdown.component';
import { ApplicationStateService } from '../../../services/application-state.service';

@Pipe( {
    name: 'indent'
} )
export class IndentPipe implements PipeTransform {
    transform( value: string, ...args: any[] ): string {
        return value.split( '\n' ).map( v => `    ${ v }` ).join( '\n' )
    }
}

@Component( {
    selector: 'about-rest-hourly-weather',
    templateUrl: './about-rest-hourly-weather.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DataMartMarkdownComponent,
        JsonPipe,
        IndentPipe,
    ]
} )
export class AboutRestHourlyWeatherComponent {
    applicationStateService = inject( ApplicationStateService )

    attributes = HourlyWeatherDefs
        .filter( f => f.description )
        .map( f => `\`${ f.name }\` | ${ f.apiType } | ${ f.description }` )
        .join( '\n' )

    // curl --url 'https://nr-bcws-datamart-app-int-api.azurewebsites.net/api/hourly_weather?$filter=WEATHER_STATION_GUID%20eq%20%270xBA28973A0BC804EAE0531D09228E8C64%27%20and%20WEATHER_TIMESTAMP%20ge%202026-11-15T07:00:00.000Z%20and%20WEATHER_TIMESTAMP%20le%202026-11-16T07:00:00.000Z' | jq . 
    example = {
        "value": [
            {
                "HOURLY_WEATHER_MEAS_GUID": "0x0D2F026BA80D4335BF9FEE2BD9F08C82",
                "WEATHER_STATION_GUID": "0xBA28973A0BC804EAE0531D09228E8C64",
                "WEATHER_TIMESTAMP_MSEC": 1794769200000,
                "WEATHER_TIMESTAMP": "2026-11-15 19:00:00.000000",
                "HOURLY_MEASUREMENT_TYPE_CODE": "ACTUAL",
                "HOURLY_MEASUREMENT_TYPE_DESC": "Actual",
                "TEMPERATURE": 7.2,
                "BAROMETRIC_PRESSURE": null,
                "RELATIVE_HUMIDITY": 84,
                "PRECIPITATION": 0,
                "WIND_SPEED": 6.9,
                "WIND_DIRECTION_DEGREES": 233,
                "FINE_FUEL_MOISTURE_CODE": 80.687,
                "FIRE_WEATHER_INDEX": null,
                "INITIAL_SPREAD_INDEX": 1.733,
                "OBSERVATION_VALID_IND": "Y",
                "OBSERVATION_VALID_COMMENT": null,
                "ADJUSTED_WIND_SPEED": 6.9,
                "BATTERY_SUPPLY_CURRENT": null,
                "BATTERY_SUPPLY_VOLTAGE": null,
                "FUEL_STICK_MOISTURE": null,
                "FUEL_STICK_TEMPERATURE": null,
                "PRECIP_PLUVIO_1_STATUS": null,
                "PRECIP_PLUVIO_1_TOTAL": null,
                "PRECIP_PLUVIO_2_STATUS": null,
                "PRECIP_PLUVIO_2_TOTAL": null,
                "PRECIP_RIT_STATUS": null,
                "PRECIP_RIT_TOTAL": null,
                "PRECIP_RGT": null,
                "PRECIP_PC2_STATUS": null,
                "PRECIP_PC2_TOTAL": null,
                "RELATIVE_HUMIDITY_HOURLY_AVG": null,
                "RN_1_PLUVIO_1": null,
                "RN_1_PLUVIO_2": null,
                "RN_1_RIT": null,
                "RN_1_PC2": null,
                "SNOW_DEPTH": null,
                "SNOW_DEPTH_QUALITY": null,
                "SOLAR_RADIATION_CM3": null,
                "SOLAR_RADIATION_LICOR": null,
                "SOLAR_SUPPLY_CURRENT": null,
                "SOLAR_SUPPLY_VOLTAGE": null,
                "TEMPERATURE_HOURLY_AVERAGE": null,
                "WIND_SPEED_HOURLY_AVERAGE": null,
                "WIND_DIRECTION_HOURLY_AVERAGE": null,
                "WIND_SPEED_MAX_10_MINUTE": null,
                "WIND_GUST": null,
                "SOIL_MOISTURE_PROBE_1": null,
                "SOIL_MOISTURE_PROBE_2": null,
                "SOIL_MOISTURE_PROBE_3": null,
                "SOIL_TEMPERATURE_PROBE_1": null,
                "SOIL_TEMPERATURE_PROBE_2": null,
                "SOIL_TEMPERATURE_PROBE_3": null,
                "ARCHIVED_IND": "N",
                "LAST_UPDATED_TIMESTAMP_MSEC": 1794852326409,
                "LAST_UPDATED_TIMESTAMP": "2026-11-16 18:05:26.409000",
                "CREATE_USER": "WFWX_WEATHER_API",
                "CREATE_DATE": "2026-11-15 12:05:35.000000",
                "UPDATE_USER": "WFWX_WEATHER_API",
                "UPDATE_DATE": "2026-11-16 11:05:26.000000"
            },
            "...The rest of results have been clipped..."
        ]
    }
}
