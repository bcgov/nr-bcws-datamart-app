import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ButtonComponent, GapComponent, IconComponent, SnackbarUtilService, TabComponent, TabContentDirective, TabGroupComponent } from '@bcgov/nr-ngx-component-lib';
import { DataMartHeaderComponent } from '../../components/datamart-header/datamart-header.component';
import { DataDownloadFiltersComponent, Filter, initialFilter } from './filters/data-download-filters.component';
import { ROUTE } from '../../bcws-datamart-app.routes';
import { ActivatedRoute, Router } from '@angular/router';
import { DataDownloadListDailyComponent } from './list/data-download-list-daily.component';
import { DataDownloadListHourlyComponent } from './list/data-download-list-hourly.component';
import { CodeDescriptionHeading, CodeTableService } from '../../services/code-table.service';
import { SelectedStationsService } from '../../services/selected-stations.service';
import { StationDataService } from '../../services/station-data.service';

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
        IconComponent
    ]
})
export class DataDownloadPage implements OnInit {
    router = inject(Router)
    codeTableService = inject(CodeTableService)
    activatedRoute = inject(ActivatedRoute)
    selectedStationsService = inject(SelectedStationsService)
    snackbarUtilService = inject(SnackbarUtilService)
    stationDataService = inject(StationDataService)

    filter: Filter = initialFilter( {
        dailyColumns: [ ...this.codeTableService.DAILY_WEATHER_OBSERVATIONS_COLUMNS.items.map( c => c.code ) ],
        metadataColumns: [ 'stationName', 'stationCode' ]
    } )
    hourlyReportColumns: CodeDescriptionHeading[] = []
    dailyReportColumns: CodeDescriptionHeading[] = []

    readonly threshold: number = 10
    showDownloadWarning = true

    ngOnInit(): void {
        Promise.resolve(  )
            .then( () => {
                let param = this.activatedRoute.snapshot.queryParamMap
                
                if ( param.has( 'start' ) ) 
                    this.filter.startDate = param.get( 'start' ) || undefined

                if ( param.has( 'end' ) ) 
                    this.filter.endDate = param.get( 'end' ) || undefined

                if ( param.has( 'dailyFields' ) ) 
                    this.filter.dailyColumns = param.get( 'dailyFields' )!.split( ',' ).map( a => this.codeTableService.DAILY_WEATHER_COLUMNS.forAbbrev( a )!.code )

                if ( param.has( 'hourlyFields' ) ) 
                    this.filter.hourlyColumns = param.get( 'hourlyFields' )!.split( ',' ).map( a => this.codeTableService.HOURLY_WEATHER_COLUMNS.forAbbrev( a )!.code )

                if ( param.has( 'metadataFields' ) ) 
                    this.filter.metadataColumns = param.get( 'metadataFields' )!.split( ',' ).map( a => this.codeTableService.STATIONS_METADATA_COLUMNS.forAbbrev( a )!.code )
                
                if ( !param.has( 'stations' ) ) return

                let stationCodes = param.get( 'stations' )!.split( ',' ).map( v => Number( v) )
                return this.stationDataService.getStationsByCode( stationCodes )
                    .then( ( stations ) => {
                        this.selectedStationsService.clearStations()
                        this.selectedStationsService.addStations( stations )
                    } )
            } )
            .then( () => {
                this.onFilterChange( this.filter )

                this.router.navigate([], {
                    relativeTo: this.activatedRoute, // Clears within the current route context
                    queryParams: {},        // Overwrites all parameters with an empty object
                    replaceUrl: true        // Overwrites history state so 'Back' doesn't re-apply parameters
                });
            } )
    }

    onFilterChange( filter: Filter ) {
        this.filter = { ...filter }

        this.hourlyReportColumns = []
        if ( this.filter.hourlyColumns.length > 0 ) {
            this.hourlyReportColumns = this.codeTableService.HOURLY_WEATHER_COLUMNS.items.filter( c => {
                return this.filter.hourlyColumns.includes( c.code )
            } )

            this.hourlyReportColumns = this.hourlyReportColumns.concat( 
                this.codeTableService.STATIONS_METADATA_COLUMNS.items.filter( c => {
                    return this.filter.metadataColumns.includes( c.code )
                } )
            )
        }

        this.dailyReportColumns = []
        if ( this.filter.dailyColumns.length > 0 ) {
            this.dailyReportColumns = this.codeTableService.DAILY_WEATHER_COLUMNS.items.filter( c => {
                return this.filter.dailyColumns.includes( c.code )
            } )

            this.dailyReportColumns = this.dailyReportColumns.concat( 
                this.codeTableService.STATIONS_METADATA_COLUMNS.items.filter( c => {
                    return this.filter.metadataColumns.includes( c.code )
                } )
            )
        }
    }

    onAddMoreStationsClick() {
        this.router.navigate( [ ROUTE.STATION_SELECTION ] )       
    }

    get enableCopyLink() {
        return this.selectedStationsService.count > 0 &&
            ( this.dailyReportColumns.length > 0 || this.hourlyReportColumns.length > 0 )
    }

    onCopyLinkClick() {
        let dailyFields = this.filter.dailyColumns.map( c => this.codeTableService.DAILY_WEATHER_COLUMNS.forCode( c )?.abbrev )
        let hourlyFields = this.filter.hourlyColumns.map( c => this.codeTableService.HOURLY_WEATHER_COLUMNS.forCode( c )?.abbrev )
        let metadataFields = this.filter.metadataColumns.map( c => this.codeTableService.STATIONS_METADATA_COLUMNS.forCode( c )?.abbrev )
        
        const urlTree = this.router.createUrlTree([], {
            relativeTo: this.activatedRoute,
            queryParams: {
                start: this.filter.startDate,
                end: this.filter.endDate,
                stations: this.selectedStationsService.selectedStations.map( s => s.properties.STATION_CODE ).join(','),
                dailyFields: dailyFields.join(','),
                hourlyFields: hourlyFields.join(','),
                metadataFields: metadataFields.join(','),
            },
            queryParamsHandling: 'merge',            
        });

        let url = location.origin + this.router.serializeUrl( urlTree )

        navigator.clipboard.writeText( url )
            .then( () => {
                this.snackbarUtilService.successful( `Copied URL to clipboard:\n${ url }`, 2500 )
            } )
    }

    onCloseWarningClick() {
        this.showDownloadWarning = false
    }
}
