import {
    ChangeDetectionStrategy,
    Component,
    SimpleChanges
} from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ButtonComponent, GapComponent, RowListDesktopComponent } from '@bcgov/nr-ngx-component-lib';
import { formatTableDate } from '../../../util';
import { DataDownloadListBase } from './data-download-list.base';
import { DailyWeather, Result, WeatherStation } from '../../../services/datamart-graphql-api.service';

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
        GapComponent,
        ButtonComponent,
    ]
})
export class DataDownloadListDailyComponent extends DataDownloadListBase<TableRow> {
    // selectedWeatherStationsService = inject( SelectedWeatherStationsService )
    // datamartRestApiService = inject( DatamartRestApiService )
    // weatherStationService = inject( WeatherStationService )

    // @Input() reportColumns: CodeDescriptionHeading[] = []
    // @Input() startDate?: string
    // @Input() endDate?: string    

    // displayedColumns: string[] = []    
    // paginationId = 'data-download-daily'
    // isMoreAvailable = true

    override ngOnChanges(changes: SimpleChanges<DataDownloadListDailyComponent>): void {
        super.ngOnChanges( changes )
        
        this.endCursor = undefined

        if ( changes.reportColumns ) {
            this.displayedColumns = [
                'date',
                ...this.reportColumns.map( c => c.code )
            ]
        }
    }

    // override refreshList(): void {
    //     this.fetchPage( true )
    // }

    // override nextListPage(): void {
    //     this.fetchPage( false )
    // }

    getResourePage( startDate: string, endDate: string, stationCodes: number[], fields: string[], endCursor?: string ): Promise<Result<TableRow>> {
        return this.datamartGraphqlApiService.getDailyWeather(
            this.startDate!,
            this.endDate!,
            this.selectedWeatherStationsService.selectedStations.map( s => s.properties.station_code ),
            this.reportColumns.map( c => c.code ),
            this.endCursor
        )
            .then( res => {
                // console.log(res)
                res.items = res.items.map( row => {
                    return {
                        ...row,
                        date: formatTableDate( row.WEATHER_TIMESTAMP ),
                        ...this.weatherStationService.getStationByCode( row.STATION_CODE )?.properties
                    } 
                } )

                return res as Result<TableRow>
            } )
    }

    // fetchPage( first: boolean ): void {
    //     if ( first ) {
    //         this.rows = []
    //         this.isMoreAvailable = false
    //         this.endCursor = undefined
    //         this.changeDetectorRef.detectChanges()
    //     }

    //     this.datamartGraphqlApiService.getDailyWeather(
    //         this.startDate!,
    //         this.endDate!,
    //         this.selectedWeatherStationsService.selectedStations.map( s => s.properties.station_code ),
    //         this.reportColumns.map( c => c.code ),
    //         this.endCursor
    //     )
    //         .then( res => {
    //             // console.log(res)
    //             this.rows = this.rows.concat( res.items.map( row => {
    //                 return {
    //                     ...row,
    //                     date: formatTableDate( row.WEATHER_TIMESTAMP ),
    //                     ...this.weatherStationService.getStationByCode( row.STATION_CODE )?.properties
    //                 } as TableRow
    //             } ) )

    //             this.isMoreAvailable = res.hasNextPage
    //             this.endCursor = res.endCursor 

    //             this.changeDetectorRef.detectChanges()
    //         } )
    // }

    // override fetchRowListPage(): Observable<any> {
    //     if ( this.selectedWeatherStationsService.selectedStations.length == 0 ) return of([])

    //     let start = formatApiDate( this.startDate )
    //     let end = formatApiDate( this.endDate )
    //     let stationFilter = this.selectedWeatherStationsService.selectedStations.map( s => `WEATHER_STATION_GUID eq '${ s.properties.weather_station_guid }'` ).join( ' or ' ) 

    //     return of( 
    //         this.datamartRestApiService.getDailyWeather( { 
    //             filter: `WEATHER_TIMESTAMP ge ${ start } and WEATHER_TIMESTAMP le ${ end } and (${ stationFilter })` 
    //         } )
    //             .then( res => {
    //                 return res.reduce<Promise<TableRow[]>>( ( acc, row: any ) => {
    //                     return acc.then( ( res ) => {
    //                         return this.weatherStationService.getStationById( row.WEATHER_STATION_GUID )
    //                             .then( ( station ) => {
    //                                 return res.concat( {
    //                                     date: formatTableDate( row.WEATHER_TIMESTAMP ),
    //                                     ...row,
    //                                     ...station?.properties
    //                                 } )
    //                             } )
    //                     } )
    //                 }, Promise.resolve([]) )
    //             } )
    //     )
    // }
    
    // override parseRows(res: any): TableRow[] {
    //     return res
    // }

    // override parseTotalRowCount(res: any): number {
    //     return res.length
    // }

    // override getInitialPageState(): InitialState<Filter> {
    //     return {
    //         instance: '',
    //         filter: {},
    //         pageConfig: {
    //             pageSize: 10,
    //             pageNumber: 1,
    //             sortActive: 'date',
    //             sortDirection: 'asc',
    //         }
    //     }
    // }

}