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

    filter: Filter = initialFilter(  [ ...this.codeTableService.DAILY_WEATHER_COLUMNS.items.map( c => c.code ) ] )
    hourlyReportColumns: CodeDescriptionHeading[] = []
    dailyReportColumns: CodeDescriptionHeading[] = []

    ngOnInit(): void {
        this.onFilterChange( this.filter )
    }

    onFilterChange( filter: Filter ) {
        this.filter = { ...filter }

        if ( this.filter.hourlyColumns.length == 0 ) {
            this.hourlyReportColumns = []
        }
        else {
            this.hourlyReportColumns = [
                ...this.filter.hourlyColumns.map( c => this.codeTableService.HOURLY_WEATHER_COLUMNS.forCode( c )! ),
                ...this.filter.metadataColumns.map( c => this.codeTableService.STATIONS_METADATA_COLUMNS.forCode( c )! )
            ]
        }

        if ( this.filter.dailyColumns.length == 0 ) {
            this.dailyReportColumns = []
        }
        else {
            this.dailyReportColumns = [
                ...this.filter.dailyColumns.map( c => this.codeTableService.DAILY_WEATHER_COLUMNS.forCode( c )! ),
                ...this.filter.metadataColumns.map( c => this.codeTableService.STATIONS_METADATA_COLUMNS.forCode( c )! )
            ]
        }
    }

    onAddMoreStationsClick() {
        this.router.navigate( [ ROUTE.STATION_SELECTION ] )       
    }
}
