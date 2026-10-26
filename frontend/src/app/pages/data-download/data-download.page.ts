import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ButtonComponent, GapComponent, TabComponent, TabContentDirective, TabGroupComponent } from '@bcgov/nr-ngx-component-lib';
import { DataMartHeaderComponent } from '../../components/datamart-header/datamart-header.component';
import { DataDownloadFiltersComponent, Filter, initialFilter } from './filters/data-download-filters.component';
import { ROUTE } from '../../bcws-datamart-app.routes';
import { Router } from '@angular/router';
import { DataDownloadListDailyComponent } from './list/data-download-list-daily.component';
import { DataDownloadListHourlyComponent } from './list/data-download-list-hourly.component';
import { CodeDescriptionHeading, CodeTableService } from '../../services/code-table.service';

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
export class DataDownloadPage implements OnInit {
    router = inject(Router)
    codeTableService = inject(CodeTableService)

    filter: Filter = initialFilter( {
        dailyColumns: [ ...this.codeTableService.DAILY_WEATHER_OBSERVATIONS_COLUMNS.items.map( c => c.code ) ]
    } )
    hourlyReportColumns: CodeDescriptionHeading[] = []
    dailyReportColumns: CodeDescriptionHeading[] = []

    ngOnInit(): void {
        this.onFilterChange( this.filter )
    }

    onFilterChange( filter: Filter ) {
        this.filter = { ...filter }

        this.hourlyReportColumns = []
        if ( this.filter.hourlyColumns.length > 0 ) {
            this.codeTableService.HOURLY_WEATHER_OBSERVATIONS_COLUMNS.items.forEach( c => {
                if ( this.filter.hourlyColumns.includes( c.code ) )
                    this.hourlyReportColumns.push( c )
            } )

            this.codeTableService.HOURLY_WEATHER_CALCULATIONS_COLUMNS.items.forEach( c => {
                if ( this.filter.hourlyColumns.includes( c.code ) )
                    this.hourlyReportColumns.push( c )
            } )

            this.codeTableService.HOURLY_WEATHER_ADDITIONAL_COLUMNS.items.forEach( c => {
                if ( this.filter.hourlyColumns.includes( c.code ) )
                    this.hourlyReportColumns.push( c )
            } )

            this.codeTableService.STATIONS_METADATA_COLUMNS.items.forEach( c => {
                if ( this.filter.metadataColumns.includes( c.code ) )
                    this.hourlyReportColumns.push( c )
            } )
        }

        this.dailyReportColumns = []
        if ( this.filter.dailyColumns.length > 0 ) {
            this.codeTableService.DAILY_WEATHER_OBSERVATIONS_COLUMNS.items.forEach( c => {
                if ( this.filter.dailyColumns.includes( c.code ) )
                    this.dailyReportColumns.push( c )
            } )

            this.codeTableService.DAILY_WEATHER_CALCULATIONS_COLUMNS.items.forEach( c => {
                if ( this.filter.dailyColumns.includes( c.code ) )
                    this.dailyReportColumns.push( c )
            } )

            this.codeTableService.STATIONS_METADATA_COLUMNS.items.forEach( c => {
                if ( this.filter.metadataColumns.includes( c.code ) )
                    this.dailyReportColumns.push( c )
            } )
        }
    }

    onAddMoreStationsClick() {
        this.router.navigate( [ ROUTE.STATION_SELECTION ] )       
    }
}
