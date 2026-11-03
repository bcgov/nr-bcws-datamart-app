import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent, GapComponent, SnackbarUtilService, TabComponent, TabContentDirective, TabGroupComponent } from '@bcgov/nr-ngx-component-lib';
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
        DataDownloadListHourlyComponent
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

    @ViewChild( 'list' ) downloadList?: DownloadList

    filter: Filter = initialFilter( {
        dailyColumns: [ ...this.codeTableService.DAILY_WEATHER_OBSERVATIONS_COLUMNS.items.map( c => c.code ) ],
        metadataColumns: [ 'station_name', 'station_code' ]
    } )
    hourlyReportColumns: CodeDescriptionHeading[] = []
    dailyReportColumns: CodeDescriptionHeading[] = []
    selectedStationsSubscription?: Subscription

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
                this.codeTableService.STATION_COLUMNS.items.filter( c => {
                    return this.filter.metadataColumns.includes( c.code )
                } ),
                this.hourlyReportColumns = this.codeTableService.HOURLY_WEATHER_COLUMNS.items.filter( c => {
                    return this.filter.hourlyColumns.includes( c.code )
                } ),
                this.codeTableService.METADATA_COLUMNS.items.filter( c => {
                    return this.filter.metadataColumns.includes( c.code )
                } )
            )
        }

        this.dailyReportColumns = []
        if ( this.filter.dailyColumns.length > 0 ) {
            this.dailyReportColumns = this.dailyReportColumns.concat( 
                this.codeTableService.STATION_COLUMNS.items.filter( c => {
                    return this.filter.metadataColumns.includes( c.code )
                } ),
                this.codeTableService.DAILY_WEATHER_COLUMNS.items.filter( c => {
                    return this.filter.dailyColumns.includes( c.code )
                } ),                
                this.codeTableService.METADATA_COLUMNS.items.filter( c => {
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
    }

    onAddMoreStationsClick() {
        this.router.navigate( [ ROUTE.STATION_SELECTION ] )       
    }

    get enableCopyLink() {
        return this.selectedWeatherStationsService.count > 0 &&
            ( this.dailyReportColumns.length > 0 || this.hourlyReportColumns.length > 0 )
    }

    getQueryParams(): Record<string,string> {
        return {
            s: this.filter.startDate!,
            e: this.filter.endDate!,
            w: this.selectedWeatherStationsService.selectedStations.map( s => s.properties.station_code ).join(','),
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
                this.snackbarUtilService.successful( `Copied URL to clipboard:\n${ url }`, 2500 )
            } )
    }
}
