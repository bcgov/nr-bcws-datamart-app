import {
    AfterViewInit,
    ChangeDetectorRef,
    Directive,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { ConfigurationService, SnackbarUtilService } from '@bcgov/nr-ngx-component-lib';
import { CodeDescriptionHeading, CodeTableService } from '../../../services/code-table.service';
import { DatamartGraphqlApiService, Result } from '../../../services/datamart-graphql-api.service';
import { DatamartRestApiService } from '../../../services/datamart-rest-api.service';
import { SelectedWeatherStationsService } from '../../../services/selected-weather-stations.service';
import { WeatherStationService } from '../../../services/weather-station.service';
import { GENERIC_FAILURE } from '../../../util';

export interface DownloadList {
    refreshList(): Promise<void>
}

@Directive({})
export abstract class DataDownloadListBase<R> implements OnChanges, DownloadList, OnInit, AfterViewInit, OnDestroy {
    selectedWeatherStationsService = inject( SelectedWeatherStationsService )
    datamartRestApiService = inject( DatamartRestApiService )
    weatherStationService = inject( WeatherStationService )
    datamartGraphqlApiService = inject( DatamartGraphqlApiService )
    changeDetectorRef = inject( ChangeDetectorRef )
    elementRef = inject( ElementRef )
    configurationService = inject( ConfigurationService )
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
    }

    ngAfterViewInit(): void {
        // scroll events don't bubble, so listen in the capture phase to see <main> scrolling
        document.addEventListener( 'scroll', this.schedulePinHeader, true )
        window.addEventListener( 'resize', this.schedulePinHeader )
    }

    ngOnDestroy(): void {
        document.removeEventListener( 'scroll', this.schedulePinHeader, true )
        window.removeEventListener( 'resize', this.schedulePinHeader )
        cancelAnimationFrame( this.pinHeaderFrame )
    }

    private pinHeaderFrame = 0

    private schedulePinHeader = () => {
        if ( this.pinHeaderFrame ) return

        this.pinHeaderFrame = requestAnimationFrame( () => {
            this.pinHeaderFrame = 0
            this.pinHeader()
        } )
    }

    // On mobile the whole page scrolls, but the table sits inside a horizontally scrolling
    // container, so CSS sticky can't pin its header row to the screen. Instead, shift the
    // header row down to sit just below the (sticky) tab header. It stays inside the
    // horizontal scroller, so it still scrolls sideways with the columns.
    private pinHeader() {
        let host = this.elementRef.nativeElement as HTMLElement
        let header = host.querySelector<HTMLElement>( 'mat-header-row' )
        let table = host.querySelector<HTMLElement>( 'mat-table' )
        if ( !header || !table ) return

        let offset = 0

        if ( this.configurationService.configuration.displayMode == 'mobile' ) {
            let tabHeader = host.closest( '.mat-mdc-tab-group' )?.querySelector( ':scope > .mat-mdc-tab-header' )
            let pinTop = tabHeader?.getBoundingClientRect().bottom ?? 0
            let tableRect = table.getBoundingClientRect()

            // pinned once the table's top passes under the tab header, until the table's bottom reaches it
            offset = Math.max( 0, Math.min( pinTop - tableRect.top, tableRect.height - header.offsetHeight ) )
        }

        header.style.transform = offset > 0 ? `translateY( ${ offset }px )` : ''
        header.classList.toggle( 'pinned', offset > 0 )
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
                if ( first ) {
                    this.rows = res.items
                }
                else {
                    this.rows = this.rows.concat( res.items )
                }

                this.isMoreAvailable = res.hasNextPage
                this.endCursor = res.endCursor 

                this.sortRows()

                this.changeDetectorRef.detectChanges()

                // the header row is re-rendered with new data, so re-apply its pinned position
                this.schedulePinHeader()
            } )
            .catch( err => {
                console.warn( JSON.stringify(err, null, '  ') )
                this.snackbarUtilService.error( GENERIC_FAILURE )
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
