import {
    ChangeDetectionStrategy,
    Component,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ButtonComponent, GapComponent, InitialState, RowListDesktopComponent, RowListPaginationComponent } from '@bcgov/nr-ngx-component-lib';
import { NgxPaginationModule } from 'ngx-pagination';
import { Observable, of } from 'rxjs';
import { GeoJsonPoint, WeatherStation } from '../../../services/station-data.service';
import { DataDownloadListBase } from './data-download-list.base';

export type TableRow = GeoJsonPoint<WeatherStation>
export type Filter = {}

@Component({
    selector: 'data-download-list-hourly',
    templateUrl: './data-download-list.component.html',
    styleUrl: './data-download-list.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        RowListDesktopComponent,
        MatTableModule,
        MatSortModule,
        NgxPaginationModule,
        RowListPaginationComponent,
        GapComponent
    ]
})
export class DataDownloadListHourlyComponent extends DataDownloadListBase implements OnChanges {
    ngOnChanges(changes: SimpleChanges<DataDownloadListHourlyComponent>): void {
        if ( changes.reportColumns ) {
            this.displayedColumns = [
                'date',
                'time',
                ...this.reportColumns.map( c => c.code )
            ]
        }
    }

    override ngOnInit(): void {
        super.ngOnInit()
        this.paginationId = 'data-download-hourly'
    }

    fetchRowListPage(): Observable<GeoJsonPoint<WeatherStation>[]> {
        return of( this.selectedStationsService.selectedStations )
    }
    
    parseRows(res: GeoJsonPoint<WeatherStation>[]): TableRow[] {
        return res
    }

    override parseTotalRowCount(res: any): number {
        return this.selectedStationsService.selectedStations.length
    }

    getInitialPageState(): InitialState<Filter> {
        return {
            instance: '',
            filter: {},
            pageConfig: {
                pageSize: 10,
                pageNumber: 1,
                sortActive: 'stationName',
                sortDirection: 'asc',
            }
        }
    }
}