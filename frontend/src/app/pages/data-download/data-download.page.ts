import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent, FilterContainerComponent, GapComponent, IconComponent, SnackbarUtilService, TabComponent, TabContentDirective, TabGroupComponent } from '@bcgov/nr-ngx-component-lib';
import { ROUTE } from '../../bcws-datamart-app.routes';
import { DataMartHeaderComponent } from '../../components/datamart-header/datamart-header.component';
import { CodeDescriptionHeading, CodeTableService } from '../../services/code-table.service';
import { SelectedWeatherStationsService } from '../../services/selected-weather-stations.service';
import { WeatherStationService } from '../../services/weather-station.service';
import { DataDownloadFiltersComponent, Filter, initialFilter } from './filters/data-download-filters.component';
import { DataDownloadListDailyComponent } from './list/data-download-list-daily.component';
import { DataDownloadListHourlyComponent } from './list/data-download-list-hourly.component';
import { DownloadList } from './list/data-download-list.base';
import { ApplicationStateService } from '../../services/application-state.service';
import { Subscription } from 'rxjs';
import { DatamartGraphqlApiService } from '../../services/datamart-graphql-api.service';

@Component({
    selector: 'data-download-page',
    templateUrl: './data-download.page.html',
    styleUrl: './data-download.page.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        GapComponent,
        DataMartHeaderComponent,
        TabGroupComponent,
        TabComponent,
        TabContentDirective,
        ButtonComponent,
        DataDownloadFiltersComponent,
        DataDownloadListDailyComponent,
        DataDownloadListHourlyComponent,
        FilterContainerComponent,
        IconComponent,
    ]
})
export class DataDownloadPage implements OnInit, OnDestroy {
    router = inject(Router)
    codeTableService = inject(CodeTableService)
    activatedRoute = inject(ActivatedRoute)
    selectedWeatherStationsService = inject( SelectedWeatherStationsService )
    snackbarUtilService = inject(SnackbarUtilService)
    weatherStationService = inject(WeatherStationService)
    applicationStateService = inject(ApplicationStateService)
    changeDetectorRef = inject(ChangeDetectorRef)
    datamartGraphqlApiService = inject( DatamartGraphqlApiService )

    readonly MAX_TOTAL_ROW_COUNT = 10000

    @ViewChild( 'list' ) downloadList?: DownloadList

    filter: Filter = initialFilter( {
        dailyColumns: [ 
            'PRECIPITATION',
            'TEMPERATURE',
            'RELATIVE_HUMIDITY',
            'WIND_SPEED',
            'WIND_DIRECTION_DEGREES', 
        ],
        metadataColumns: [ 
            'STATION_NAME', 
            'STATION_CODE', 
            'STATION_ACRONYM', 
            'FIRE_CENTRE', 
            'ELEVATION_M' 
        ]
    } )
    hourlyReportColumns: CodeDescriptionHeading[] = []
    dailyReportColumns: CodeDescriptionHeading[] = []
    metadataColumns: CodeDescriptionHeading[] = []
    selectedStationsSubscription?: Subscription
    dailyRowCount = 0
    hourlyRowCount = 0

    showDownloadWarning = false

    loadingCount = 0

    get isLoading() {
        return this.loadingCount > 0
    }

    startLoading() {
        this.loadingCount += 1
        this.changeDetectorRef.detectChanges()
    }

    stopLoading() {
        this.loadingCount -= 1
        this.changeDetectorRef.detectChanges()
    }

    onIsLoadingChange( ev: boolean ) {
        if ( ev ) {
            this.startLoading()
        }
        else {
            this.stopLoading()
        }
    }

    ngOnInit(): void {
        if ( this.applicationStateService.hasDownloadFilterState ) {
            this.filter = this.applicationStateService.downloadFilterState
        }

        Promise.resolve()
            .then( () => {
                let param = this.activatedRoute.snapshot.queryParamMap
                
                if ( param.has( 's' ) ) 
                    this.filter.startDate = param.get( 's' ) || undefined

                if ( param.has( 'e' ) ) 
                    this.filter.endDate = param.get( 'e' ) || undefined

                if ( param.has( 'd' ) ) 
                    this.filter.dailyColumns = param.get( 'd' )!.split( ',' ).filter( i => i ).map( a => this.codeTableService.DAILY_WEATHER_COLUMNS.forAbbrev( a )!.code )

                if ( param.has( 'h' ) ) 
                    this.filter.hourlyColumns = param.get( 'h' )!.split( ',' ).filter( i => i ).map( a => this.codeTableService.HOURLY_WEATHER_COLUMNS.forAbbrev( a )!.code )

                if ( param.has( 'm' ) ) 
                    this.filter.metadataColumns = param.get( 'm' )!.split( ',' ).filter( i => i ).map( a => this.codeTableService.STATION_METADATA_COLUMNS.forAbbrev( a )!.code )
                
                if ( !param.has( 'w' ) ) return

                let stationCodes = param.get( 'w' )!.split( ',' ).map( v => Number( v) )
                return this.weatherStationService.getStationsByCode( stationCodes )
                    .then( ( stations ) => {
                        this.selectedWeatherStationsService.clearStations()
                        this.selectedWeatherStationsService.addStations( stations )
                    } )
            } )
            .then( () => {
                this.selectedStationsSubscription = this.selectedWeatherStationsService.selectedStations$.subscribe((stations) => {
                    this.onFilterChange( this.filter )
                } )
            } )
    }

    ngOnDestroy(): void {
        if ( this.selectedStationsSubscription ) this.selectedStationsSubscription.unsubscribe()
    }

    onFilterChange( filter: Filter ) {
        this.filter = { ...filter }
        this.applicationStateService.downloadFilterState = filter

        this.hourlyReportColumns = []
        if ( this.filter.hourlyColumns.length > 0 ) {
            this.hourlyReportColumns = this.hourlyReportColumns.concat( 
                this.codeTableService.HOURLY_WEATHER_COLUMNS.items.filter( c => {
                    return this.filter.hourlyColumns.includes( c.code )
                } ),
            )
        }

        this.dailyReportColumns = []
        if ( this.filter.dailyColumns.length > 0 ) {
            this.dailyReportColumns = this.dailyReportColumns.concat( 
                this.codeTableService.DAILY_WEATHER_COLUMNS.items.filter( c => {
                    return this.filter.dailyColumns.includes( c.code )
                } ),                
            )
        }

        this.metadataColumns = []
        if ( this.filter.metadataColumns.length > 0 ) {
            this.metadataColumns = this.metadataColumns.concat( 
                this.codeTableService.STATION_METADATA_COLUMNS.items.filter( c => {
                    return this.filter.metadataColumns.includes( c.code )
                } )
            )
        }

        let p = this.getQueryParams()
        delete p['s']
        delete p['e']

        this.router.navigate([], {
            relativeTo: this.activatedRoute, 
            queryParams: p,
            replaceUrl: true
        });

        this.changeDetectorRef.detectChanges()

        setTimeout(() => {
            this.downloadList?.refreshList()        
        },1000)

        this.updateTotalRowCount()
    }

    onAddMoreStationsClick() {
        this.router.navigate( [ ROUTE.STATION_SELECTION ] )       
    }

    get enableDownload() {
        let t = this.dailyRowCount + this.hourlyRowCount
        return t > 0 && t < this.MAX_TOTAL_ROW_COUNT
    }

    onDownloadClick() {
        this.startLoading()

        let daily: string[] = []
        if ( this.filter.dailyColumns.length > 0 ) daily = this.dailyReportColumns.map( c => c.code )

        let hourly: string[] = []
        if ( this.filter.hourlyColumns.length > 0 ) hourly = this.hourlyReportColumns.map( c => c.code )

        let metadata: string[] = []
        if ( this.filter.metadataColumns.length > 0 ) metadata = this.metadataColumns.map( c => c.code )

        this.datamartGraphqlApiService.downloadWeatherData( 
            this.filter.startDate!, 
            this.filter.endDate!, 
            this.selectedWeatherStationsService.selectedStations.map( s => s.properties.STATION_CODE ),
            daily,
            hourly,
            metadata
        )
            .catch( err => {
                console.warn( JSON.stringify( err, null, '  ' ) )
                this.snackbarUtilService.error( 'Failed to download data' )
            } )
            .finally( () => {
                this.stopLoading()
            } )
    }

    onEmailClick() {

    }

    getQueryParams(): Record<string,string> {
        return {
            s: this.filter.startDate!,
            e: this.filter.endDate!,
            w: this.selectedWeatherStationsService.selectedStations.map( s => s.properties.STATION_CODE ).join(','),
            d: this.filter.dailyColumns.map( c => this.codeTableService.DAILY_WEATHER_COLUMNS.forCode( c )?.abbrev ).join(','),
            h: this.filter.hourlyColumns.map( c => this.codeTableService.HOURLY_WEATHER_COLUMNS.forCode( c )?.abbrev ).join(','),
            m: this.filter.metadataColumns.map( c => this.codeTableService.STATION_METADATA_COLUMNS.forCode( c )?.abbrev ).join(','),
        }        
    }

    onCopyLinkClick() {
        const urlTree = this.router.createUrlTree([], {
            relativeTo: this.activatedRoute,
            queryParams: this.getQueryParams(),
            queryParamsHandling: 'merge',            
        });

        let url = location.origin + this.router.serializeUrl( urlTree )

        navigator.clipboard.writeText( url )
            .then( () => {
                this.snackbarUtilService.successful( `Copied URL to clipboard`, 2500 )
            } )
    }

    updateTotalRowCount() {
        let stationCodes = this.selectedWeatherStationsService.selectedStations.map( s => s.properties.STATION_CODE )
        this.dailyRowCount = 0
        this.hourlyRowCount = 0
        this.showDownloadWarning = false
        this.startLoading()

        return Promise.resolve()
            .then( () => {
                if ( this.filter.dailyColumns.length == 0 ) return 
                return this.datamartGraphqlApiService.getDailyWeatherCount( this.filter.startDate!, this.filter.endDate!, stationCodes )
                    .then( res => {
                        this.dailyRowCount = res
                    } )
            } )
            .then( () => {
                if ( this.filter.hourlyColumns.length == 0 ) return 
                return this.datamartGraphqlApiService.getHourlyWeatherCount( this.filter.startDate!, this.filter.endDate!, stationCodes )
                    .then( res => {
                        this.hourlyRowCount = res
                    } )
            } )
            .then( ( sum ) => {
                this.showDownloadWarning = ( this.dailyRowCount + this.hourlyRowCount ) > this.MAX_TOTAL_ROW_COUNT 
            } )
            .catch( err => {
                console.warn( JSON.stringify( err, null, '  ' ) )
                this.snackbarUtilService.error( 'Failed to get row count' )
            } )            
            .finally( () => {
                this.stopLoading()
            } )
    }
    
    onCloseWarningClick() {
        this.showDownloadWarning = false
    }

    get dailyTabHeader() {
        let c = this.dailyRowCount
        return `Daily weather data (${ c == 0 ? 'no records' : c == 1 ? '1 record' : c + ' records' })`
    }

    get hourlyTabHeader() {
        let c = this.hourlyRowCount
        return `Hourly weather data (${ c == 0 ? 'no records' : c == 1 ? '1 record' : c + ' records' })`
    }
}
