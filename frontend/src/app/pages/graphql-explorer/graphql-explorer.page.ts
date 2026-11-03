import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ButtonComponent, DesktopViewDirective, DeviceViewComponent, GapComponent, MobileViewDirective, SnackbarUtilService } from '@bcgov/nr-ngx-component-lib';
import { DatamartGraphqlApiService, fetchGraphQL } from '../../services/datamart-graphql-api.service';

type Example = {
    label: string
    query: string
    name: string
}

@Component( {
    selector: 'graphql-explorer-page',
    templateUrl: './graphql-explorer.page.html',
    styleUrl: './graphql-explorer.page.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ButtonComponent,
        MatFormFieldModule,
        MatInputModule,
        GapComponent,
        FormsModule,
        MatMenuModule,
    ],
    host: {
        '[class.wide]': 'wide',
        '[class.narrow]': '!wide'
    }
} )
export class GraphqlExplorerPage implements OnInit {
    snackbarUtilService = inject(SnackbarUtilService)
    datamartGraphqlApiService = inject( DatamartGraphqlApiService )
    changeDetectorRef = inject(ChangeDetectorRef)

    examples: Example[] = [
        {
            label: 'Daily Weather, first 5',
            name: 'daily_weathers',
            query: `
                query {
                    daily_weathers(first: 5) {
                        items {
                            DAILY_WEATHER_MEAS_GUID
                            WEATHER_STATION_GUID
                            WEATHER_TIMESTAMP_MSEC
                            DAILY_MEASUREMENT_TYPE_CODE
                            TEMPERATURE
                            TEMPERATURE_MIN
                            TEMPERATURE_MAX
                            RELATIVE_HUMIDITY
                            PRECIPITATION
                            WIND_SPEED
                            WIND_DIRECTION_DEGREES
                            FIRE_WEATHER_INDEX
                        }
                    }
                }
            `
        },
        {
            label: 'Hourly Weather, first 5',
            name: 'hourly_weathers',
            query: `
                query {
                    hourly_weathers(first: 5) {
                        items {
                            HOURLY_WEATHER_MEAS_GUID
                            WEATHER_STATION_GUID
                            WEATHER_TIMESTAMP_MSEC
                            HOURLY_MEASUREMENT_TYPE_CODE
                            TEMPERATURE
                            RELATIVE_HUMIDITY
                            PRECIPITATION
                            WIND_SPEED
                            WIND_DIRECTION_DEGREES
                            WIND_GUST
                            BAROMETRIC_PRESSURE
                            FIRE_WEATHER_INDEX
                        }
                    }
                }
            `
        },
        {
            label: 'Weather Stations, first 10',
            name: 'weather_stations',
            query: `
                query {
                    weather_stations(first: 10) {
                        items {
                            weather_station_guid
                            station_name
                            station_acronym
                            station_status_code
                            site_type_desc
                            weather_zone_desc
                            latitude
                            longitude
                            elevation_m
                        }
                    }
                }
            `
        },
        {
            label: 'Org Units, first 10',
            name: 'org_units',
            query: `
                query {
                    org_units(first: 10) {
                        items {
                            FIRE_ZONE_ORG_UNIT_IDENTIFIER
                        }
                    }
                }
            `
        },
        {
            label: 'Daily Weather, first 10, filtered',
            name: 'daily_weathers',
            query: `
                query {
                    daily_weathers(
                        filter: {
                            TEMPERATURE: { gt: 20 }
                        },
                        first: 10
                    ) {
                        items {
                            WEATHER_STATION_GUID
                            TEMPERATURE
                            TEMPERATURE_MAX
                            PRECIPITATION
                            FIRE_WEATHER_INDEX
                        }
                    }
                }
            `
        },
    ]

    query = ''
    queryName = ''
    result = ''
    wide = true

    ngOnInit(): void {
        this.onResize()
    }

    onExampleClick( ex: Example ) {
        // this.query = '# ' + ex.label + '\n\n' + format( ex.query )
        this.query = format( ex.query )
        this.queryName = ex.name
    }

    onRunQueryClick() {
        this.result = 'Working...'
        this.changeDetectorRef.detectChanges()

        fetchGraphQL<any>( this.queryName, this.query )
            .then( res => {
                console.log(res)
                this.result = JSON.stringify( res, null, '  ' )
            } )
            .catch( err => {
                this.result = JSON.stringify( err, null, '  ' )
            } )
            .finally( () => {
                this.changeDetectorRef.detectChanges()
            } )
    }

    onClearQueryClick() {
        this.query = ''
        this.result = ''
    }

    @HostListener("window:resize", [])
    onResize() {
        let width = window.innerWidth 
        let height = window.innerHeight

        this.wide = width > height
    }


}

function format( text: string ): string {
    let lines = text.split('\n').filter( l => !!l ).filter( l => !/^\s+$/.test( l ) )
    let prefixes = lines.map( l => l.match( /^\s+/ )![0].length )
    let min = Math.min( ...prefixes )

    return lines.map( l => l.substring( min ) ).join( '\n' )
}
