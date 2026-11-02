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
import { CodeDescriptionHeading } from '../../../services/code-table.service';
import { DailyWeather, DatamartRestApiService, WeatherStation } from '../../../services/datamart-rest-api.service';
import { SelectedWeatherStationsService } from '../../../services/selected-weather-stations.service';
import { formatApiDate, formatTableDate } from '../../../util';
import { WeatherStationService } from '../../../services/weather-station.service';
import { DownloadList } from '../data-download.page';

export type TableRow = { date?: string } & DailyWeather & WeatherStation
export type Filter = {}

@Component({
    selector: 'data-download-list-daily',
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
export class DataDownloadListDailyComponent extends RowListBase<Filter, TableRow, any> implements OnChanges, DownloadList {
    selectedWeatherStationsService = inject( SelectedWeatherStationsService )
    datamartRestApiService = inject( DatamartRestApiService )
    weatherStationService = inject( WeatherStationService )

    @Input() reportColumns: CodeDescriptionHeading[] = []
    @Input() startDate?: string
    @Input() endDate?: string    

    displayedColumns: string[] = []    
    paginationId = 'data-download-daily'

    ngOnChanges(changes: SimpleChanges<DataDownloadListDailyComponent>): void {
        if ( changes.reportColumns ) {
            this.displayedColumns = [
                'date',
                ...this.reportColumns.map( c => c.code )
            ]
        }
    }

    refreshList(): void {
        console.log('DataDownloadListDailyComponent')
    }

    override fetchRowListPage(): Observable<any> {
        if ( this.selectedWeatherStationsService.selectedStations.length == 0 ) return of([])

        let start = formatApiDate( this.startDate )
        let end = formatApiDate( this.endDate )
        let stationFilter = this.selectedWeatherStationsService.selectedStations.map( s => `WEATHER_STATION_GUID eq '${ s.properties.weather_station_guid }'` ).join( ' or ' ) 

        return of( 
            this.datamartRestApiService.getDailyWeather( { 
                filter: `WEATHER_TIMESTAMP ge ${ start } and WEATHER_TIMESTAMP le ${ end } and (${ stationFilter })` 
            } )
                .then( res => {
                    return res.reduce<Promise<TableRow[]>>( ( acc, row: any ) => {
                        return acc.then( ( res ) => {
                            return this.weatherStationService.getStationById( row.WEATHER_STATION_GUID )
                                .then( ( station ) => {
                                    return res.concat( {
                                        date: formatTableDate( row.WEATHER_TIMESTAMP ),
                                        ...row,
                                        ...station?.properties
                                    } )
                                } )
                        } )
                    }, Promise.resolve([]) )
                } )
        )
    }
    
    override parseRows(res: any): TableRow[] {
        return res
    }

    override parseTotalRowCount(res: any): number {
        return res.length
    }

    override getInitialPageState(): InitialState<Filter> {
        return {
            instance: '',
            filter: {},
            pageConfig: {
                pageSize: 10,
                pageNumber: 1,
                sortActive: 'date',
                sortDirection: 'asc',
            }
        }
    }
}