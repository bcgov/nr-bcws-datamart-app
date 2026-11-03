import {
    ChangeDetectorRef,
    Directive,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';
import { CodeDescriptionHeading } from '../../../services/code-table.service';
import { DailyWeather, DatamartRestApiService, WeatherStation } from '../../../services/datamart-rest-api.service';
import { SelectedWeatherStationsService } from '../../../services/selected-weather-stations.service';
import { WeatherStationService } from '../../../services/weather-station.service';
import { DatamartGraphqlApiService, Result } from '../../../services/datamart-graphql-api.service';
import { formatTableDate } from '../../../util';
import { SnackbarUtilService } from '@bcgov/nr-ngx-component-lib';

// export type TableRow = { date?: string } & DailyWeather & WeatherStation
// export type Filter = {}

@Directive()
export class DownloadList {
    refreshList() {}
}

@Directive({})
export abstract class DataDownloadListBase<R> implements OnChanges, DownloadList {
    selectedWeatherStationsService = inject( SelectedWeatherStationsService )
    datamartRestApiService = inject( DatamartRestApiService )
    weatherStationService = inject( WeatherStationService )
    datamartGraphqlApiService = inject( DatamartGraphqlApiService )
    changeDetectorRef = inject( ChangeDetectorRef )
    snackbarUtilService = inject( SnackbarUtilService )

    @Input() reportColumns: CodeDescriptionHeading[] = []
    @Input() startDate?: string
    @Input() endDate?: string    

    @Output() isLoadingChange = new EventEmitter<boolean>() 

    displayedColumns: string[] = []    
    isMoreAvailable = true
    endCursor?: string
    rows: R[] = []

    private _isLoading = false
    get isLoading() { return this._isLoading }
    set isLoading( val: boolean ) {
        this.isLoadingChange.emit( val )
        this._isLoading = val
        this.changeDetectorRef.detectChanges()
    }
    
    ngOnChanges( changes: SimpleChanges ): void {}

    refreshList(): Promise<void> {
        return this.fetchListPage( true )
    }

    nextListPage(): Promise<void> {
        return this.fetchListPage( false )
    }

    fetchListPage( first: boolean ): Promise<void> {
        if ( first ) {
            this.rows = []
            this.isMoreAvailable = false
            this.endCursor = undefined
            
            this.changeDetectorRef.detectChanges()
        }

        this.isLoading = true

        return this.getResourePage(
            this.startDate!,
            this.endDate!,
            this.selectedWeatherStationsService.selectedStations.map( s => s.properties.station_code ),
            this.reportColumns.map( c => c.code ),
            this.endCursor
        )
            .then( res => {
                this.rows = this.rows.concat( res.items )
                // // console.log(res)
                // this.rows = this.rows.concat( res.items.map( row => {
                //     return {
                //         ...row,
                //         date: formatTableDate( row.WEATHER_TIMESTAMP ),
                //         ...this.weatherStationService.getStationByCode( row.STATION_CODE )?.properties
                //     } as TableRow
                // } ) )

                this.isMoreAvailable = res.hasNextPage
                this.endCursor = res.endCursor 

                this.changeDetectorRef.detectChanges()
            } )
            .catch( err => {
                this.snackbarUtilService.error( 'failed to get page: ' + err )
            } )
            .finally( () => {
                this.isLoading = false
            } )
    }

    abstract getResourePage( startDate: string, endDate: string, stationCodes: number[], fields: string[], endCursor?: string ): Promise<Result<R>>

    onLoadMoreClick() {
        this.nextListPage()
    }
}