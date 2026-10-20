import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent, GapComponent, TabComponent, TabContentDirective, TabGroupComponent } from '@bcgov/nr-ngx-component-lib';
import { DataMartHeaderComponent } from '../../components/datamart-header/datamart-header.component';
import { DataDownloadFiltersComponent } from './filters/data-download-filters.component';
import { DataDownloadListComponent } from './list/data-download-list.component';
import { ROUTE } from '../../bcws-datamart-app.routes';
import { Router } from '@angular/router';

@Component({
    selector: 'data-download-page',
    templateUrl: './data-download.page.html',
    styleUrl: './data-download.page.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        // RowListDesktopComponent,
        // NgxPaginationModule,
        // RowListPaginationComponent,
        // MatTableModule,
        GapComponent,
        DataMartHeaderComponent,
        TabGroupComponent,
        TabComponent,
        TabContentDirective,
        ButtonComponent,
        DataDownloadFiltersComponent,
        DataDownloadListComponent,
    ]
})
export class DataDownloadPage {
    router = inject(Router)

    onAddMoreStationsClick() {
        this.router.navigate( [ ROUTE.STATION_SELECTION ] )       
    }

    // columns = ['stationName', 'stationCode', 'status'];

    // rows = Array.from({ length: 250 }, (_, index) => ({
    //     stationName: `Weather Station ${index + 1}`,
    //     stationCode: `${1000 + index}`,
    //     status: ['ACTIVE', 'TEST', 'PROJECT'][index % 3],
    // }));

    // pageSize = 25;
    // pageNumber = 1;

    // onPageNumberChange(page: number): void {
    //     this.pageNumber = page;
    // }

    // onPageSizeChange(size: number): void {
    //     this.pageSize = size;
    //     this.pageNumber = 1;
    // }

}
