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
import { WeatherStationFeature } from '../../../services/weather-station.service';
import { DataDownloadListBase, Filter, TableRow } from './data-download-list.base';

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

    fetchRowListPage(): Observable<WeatherStationFeature[]> {
        return of( this.selectedWeatherStationsService.selectedStations )
    }
    
    parseRows(res: WeatherStationFeature[]): TableRow[] {
        return res
    }

    override parseTotalRowCount(res: any): number {
        return this.selectedWeatherStationsService.selectedStations.length
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