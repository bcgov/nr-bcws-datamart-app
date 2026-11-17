import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WeatherStationDefs } from '../../../api-types';
import { DataMartMarkdownComponent, IndentPipe } from '../../../components/datamart-markdown/datamart-markdown.component';
import { ApplicationStateService } from '../../../services/application-state.service';

@Component( {
    selector: 'about-rest-weather-stations',
    templateUrl: './about-rest-weather-stations.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DataMartMarkdownComponent,
        JsonPipe,
        IndentPipe,
    ]
} )
export class AboutRestWeatherStationsComponent {
    applicationStateService = inject( ApplicationStateService )

    attributes = WeatherStationDefs
        .filter( f => f.description )
        .map( f => `\`${ f.name }\` | ${ f.apiType } | ${ f.description }` )
        .join( '\n' )

    //  curl --url 'https://nr-bcws-datamart-app-int-api.azurewebsites.net/api/weather_stations?$filter=STATION_CODE%20eq%201142' | jq .  
    example = {
        "value": [
            {
                "WEATHER_STATION_GUID": "0xBA28973A0BC804EAE0531D09228E8C64",
                "STATION_STATUS_CODE": "ACTIVE",
                "STATION_STATUS_DESC": "Active",
                "STATION_CODE": 1142,
                "STATION_ACRONYM": "14G",
                "STATION_NAME": "14G (CRD)",
                "STATION_COMMENT": "1st Daily 20120827; CRD station",
                "CRD_STATION_NAME": "14g",
                "STATION_RANKING": 1,
                "STATION_ACCESS_TYPE_CODE": "4WD",
                "STATION_ACCESS_TYPE_DESC": "4 Wheel Drive",
                "SITE_TYPE_CODE": "EXTERNAL",
                "SITE_TYPE_DESC": "External",
                "INFLUENCING_ASPECT_CODE": "FLAT",
                "INFLUENCING_ASPECT_DESC": "Flat",
                "WEATHER_STATION_OWNER_GUID": "0x89FDE3E53BBC4FCBB3AFD7048A22395C",
                "OWNER_NAME": "CRD",
                "OWNER_DISPLAY_NAME": "Capital Regional District",
                "OWNER_COMMENT": null,
                "DATA_LOGGER_TYPE_CODE": "NONE",
                "DATA_LOGGER_TYPE_DESC": "None",
                "WEATHER_ZONE": 3,
                "WEATHER_ZONE_DESC": "Zone 3",
                "DANGER_REGION": 1,
                "STATION_ACCESS_DESCRIPTION": "Station is located in the south part of rural Houston on Frontier Avenue.  Station is on the Pproperty of Gordon Gould (845-3108) (Bill Dungate passeed away in winter of 1993).  From Hwy 16, turn right on Butler Ave. Proceed 1 block South and turn left onto 11th .At the T junction turn left. Go aprox 1.5km and turn Right (South West) onto Frontier Avenue and go aprox 1km to the Dungate Farm.  The station is visible from the road along the Dungates driveway. - Try calling before going to site.",
                "FIRE_CENTRE_ORG_UNIT_IDENT": 50,
                "FIRE_CENTRE": "Coastal Fire Centre",
                "ZONE_ORG_UNIT_IDENTIFIER": 54,
                "FIRE_ZONE": "South Island Zone",
                "DATA_SOURCE": "CRD",
                "INSTALLATION_TIMESTAMP_MSEC": 1345964400000,
                "DECOMMISSION_TIMESTAMP_MSEC": null,
                "HOURLY_IND": "Y",
                "OVER_WINTER_PRECIP_ADJ_IND": "N",
                "PLUVIO_SNOW_GUAGE_IND": "N",
                "AUTO_UPDATE_LAT_LON_IND": "N",
                "LATITUDE": 50.0167,
                "LONGITUDE": -128.1,
                "ELEVATION_M": 1,
                "INFLUENCING_SLOPE": 0,
                "SURFACE_TYPE_CODE": null,
                "SURFACE_TYPE_DESC": null,
                "WINDSPEED_ADJUSTMENT_HEIGHT": "9.0_11.9",
                "WINDSPEED_ADJUSTMENT_ROUGHNESS": 1,
                "ECCC_FILE_BASE_URL_TEMPLATE": null,
                "LAST_PROCESSED_SOURCE_TIME": "2026-11-16T00:00:00",
                "LAST_UPDATED_TIMESTAMP_MSEC": 1794814236552,
                "CREATE_USER": "LEGACY_DATA_LOAD",
                "CREATE_DATE": "2021-01-30 16:48:07.000000",
                "UPDATE_USER": "WFWX_WEATHER_API",
                "UPDATE_DATE": "2026-11-16 00:30:36.000000"
            }
        ]
    }
}
 