import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { GapComponent, InitialState, RowListBase, RowListDesktopComponent, RowListPaginationComponent } from '@bcgov/nr-ngx-component-lib';
import { NgxPaginationModule } from 'ngx-pagination';
import { Observable, of } from 'rxjs';
import { DailyWeather, DatamartRestApiService } from '../../../services/datamart-rest-api.service';
import { WeatherStationFeature, WeatherStationService } from '../../../services/weather-station.service';
import { CodeDescriptionHeading } from '../../../services/code-table.service';
import { SelectedWeatherStationsService } from '../../../services/selected-weather-stations.service';
import { formatApiDate, formatTableDate, formatTableTime } from '../../../util';
import { DownloadList } from '../data-download.page';

export type TableRow = DailyWeather
export type Filter = {}

@Component({
    selector: 'data-download-list-hourly',
    templateUrl: './data-download-list.component.html',
    styleUrl: './data-download-list.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        RowListDesktopComponent,
        MatTableModule,
        MatSortModule,
        NgxPaginationModule,
        RowListPaginationComponent,
        GapComponent
    ]
})
export class DataDownloadListHourlyComponent extends RowListBase<Filter, TableRow, any> implements OnChanges, DownloadList {
    selectedWeatherStationsService = inject( SelectedWeatherStationsService )
    datamartRestApiService = inject( DatamartRestApiService )
    weatherStationService = inject( WeatherStationService )

    @Input() reportColumns: CodeDescriptionHeading[] = []
    @Input() startDate?: string
    @Input() endDate?: string    

    displayedColumns: string[] = []    
    paginationId = 'data-download-hourly'

    ngOnChanges(changes: SimpleChanges<DataDownloadListHourlyComponent>): void {
        if ( changes.reportColumns ) {
            this.displayedColumns = [
                'date',
                'time',
                ...this.reportColumns.map( c => c.code )
            ]
        }
    }

    refreshList(): void {
        console.log('DataDownloadListHourlyComponent')
    }

    override fetchRowListPage(): Observable<any> {
        if ( this.selectedWeatherStationsService.selectedStations.length == 0 ) return of([])

        let start = formatApiDate( this.startDate )
        let end = formatApiDate( this.endDate )
        let stationFilter = this.selectedWeatherStationsService.selectedStations.map( s => `WEATHER_STATION_GUID eq '${ s.properties.weather_station_guid }'` ).join( ' or ' ) 

        return of( 
            this.datamartRestApiService.getHourlyWeather( { 
                filter: `WEATHER_TIMESTAMP ge ${ start } and WEATHER_TIMESTAMP le ${ end } and (${ stationFilter })` 
            } )
                .then( res => {
                    return res.reduce<Promise<TableRow[]>>( ( acc, row: any ) => {
                        return acc.then( ( res ) => {
                            return this.weatherStationService.getStationById( row.WEATHER_STATION_GUID )
                                .then( ( station ) => {
                                    return res.concat( {
                                        date: formatTableDate( row.WEATHER_TIMESTAMP ),
                                        time: formatTableTime( row.WEATHER_TIMESTAMP ),
                                        ...row,
                                        ...station?.properties
                                    } )
                                } )
                        } )
                    }, Promise.resolve([]) )
                } )
        )
    }
    
    parseRows(res: any): TableRow[] {
        return res
    }

    override parseTotalRowCount(res: any): number {
        return res.length
    }

    getInitialPageState(): InitialState<Filter> {
        return {
            instance: '',
            filter: {},
            pageConfig: {
                pageSize: 10,
                pageNumber: 1,
                sortActive: 'stationName',
                sortDirection: 'asc',
            }
        }
    }
}