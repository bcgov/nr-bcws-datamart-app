import {
    ChangeDetectionStrategy,
    Component,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { GapComponent, InitialState, RowListDesktopComponent, RowListPaginationComponent } from '@bcgov/nr-ngx-component-lib';
import { NgxPaginationModule } from 'ngx-pagination';
import { Observable, of } from 'rxjs';
import { DataDownloadListBase, Filter, TableRow } from './data-download-list.base';
import { WeatherStationFeature } from '../../../services/weather-station.service';

@Component({
    selector: 'data-download-list-daily',
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
export class DataDownloadListDailyComponent extends DataDownloadListBase implements OnChanges {
    ngOnChanges(changes: SimpleChanges<DataDownloadListDailyComponent>): void {
        if ( changes.reportColumns ) {
            this.displayedColumns = [
                'date',
                ...this.reportColumns.map( c => c.code )
            ]
        }
    }

    override ngOnInit(): void {
        super.ngOnInit()
        this.paginationId = 'data-download-daily'
    }

    override fetchRowListPage(): Observable<WeatherStationFeature[]> {
        return of( this.selectedWeatherStationsService.selectedStations )
    }
    
    override parseRows(res: WeatherStationFeature[]): TableRow[] {
        return res
    }

    override parseTotalRowCount(res: any): number {
        return this.selectedWeatherStationsService.selectedStations.length
    }

    override getInitialPageState(): InitialState<Filter> {
        return {
            instance: '',
            filter: {},
            pageConfig: {
                pageSize: 10,
                pageNumber: 1,
                sortActive: 'date',
                sortDirection: 'asc',
            }
        }
    }
}