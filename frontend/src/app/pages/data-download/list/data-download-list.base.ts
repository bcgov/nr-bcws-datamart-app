import {
    ChangeDetectorRef,
    Directive,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { SnackbarUtilService } from '@bcgov/nr-ngx-component-lib';
import { CodeDescriptionHeading, CodeTableService } from '../../../services/code-table.service';
import { DatamartGraphqlApiService, Result } from '../../../services/datamart-graphql-api.service';
import { DatamartRestApiService } from '../../../services/datamart-rest-api.service';
import { SelectedWeatherStationsService } from '../../../services/selected-weather-stations.service';
import { WeatherStationService } from '../../../services/weather-station.service';

export interface DownloadList {
    refreshList(): Promise<void>
}

@Directive({})
export abstract class DataDownloadListBase<R> implements OnChanges, DownloadList, OnInit {
    selectedWeatherStationsService = inject( SelectedWeatherStationsService )
    datamartRestApiService = inject( DatamartRestApiService )
    weatherStationService = inject( WeatherStationService )
    datamartGraphqlApiService = inject( DatamartGraphqlApiService )
    changeDetectorRef = inject( ChangeDetectorRef )
    snackbarUtilService = inject( SnackbarUtilService )
    codeTableService = inject( CodeTableService )

    @Input() reportColumns: CodeDescriptionHeading[] = []
    @Input() metadataColumns: CodeDescriptionHeading[] = []
    @Input() startDate?: string
    @Input() endDate?: string    

    @Output() isLoadingChange = new EventEmitter<boolean>() 

    displayedColumns: string[] = []    
    isMoreAvailable = true
    endCursor?: string
    rows: Partial<R>[] = []
    totalRowCount?: number

    private _isLoading = false
    get isLoading() { return this._isLoading }
    set isLoading( val: boolean ) {
        this.isLoadingChange.emit( val )
        this._isLoading = val
        this.changeDetectorRef.detectChanges()
    }
    
    ngOnChanges( changes: SimpleChanges ): void {}

    ngOnInit(): void {
        this.refreshList()
    }

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

        return this.getResourcePage(
            this.startDate!,
            this.endDate!,
            this.selectedWeatherStationsService.selectedStations.map( s => s.properties.STATION_CODE ),
            this.reportColumns.map( c => c.code ),
            this.metadataColumns.map( c => c.code ),
            this.endCursor
        )
            .then( res => {
                this.rows = this.rows.concat( res.items )

                this.isMoreAvailable = res.hasNextPage
                this.endCursor = res.endCursor 

                this.sortRows()

                this.changeDetectorRef.detectChanges()
            } )
            .catch( err => {
                console.warn( JSON.stringify(err, null, '  ') )
                this.snackbarUtilService.error( 'Failed to get page' )
            } )
            .finally( () => {
                this.isLoading = false
            } )
    }

    abstract getResourcePage( startDate: string, endDate: string, stationCodes: number[], fields: string[], metadataFields: string[], endCursor?: string ): Promise<Result<R>>

    abstract sortRows(): void

    onLoadMoreClick() {
        this.nextListPage()
    }
}
