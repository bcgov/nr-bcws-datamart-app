import {
    ChangeDetectionStrategy,
    Component,
    SimpleChanges
} from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ButtonComponent, GapComponent, RowListDesktopComponent } from '@bcgov/nr-ngx-component-lib';
import { HourlyWeather, Result, WeatherStation } from '../../../services/datamart-graphql-api.service';
import { formatTableDate } from '../../../util';
import { DataDownloadListBase } from './data-download-list.base';

export type TableRow = { date?: string, time?: string } & HourlyWeather & WeatherStation

@Component({
    selector: 'data-download-list-hourly',
    templateUrl: './data-download-list.component.html',
    styleUrl: './data-download-list.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        RowListDesktopComponent,
        MatTableModule,
        MatSortModule,
        GapComponent,
        ButtonComponent,
    ]
})
export class DataDownloadListHourlyComponent extends DataDownloadListBase<TableRow> {
    override ngOnChanges(changes: SimpleChanges<DataDownloadListHourlyComponent>): void {
        super.ngOnChanges( changes )

        if ( changes.reportColumns ) {
            this.displayedColumns = [
                'date',
                'time',
                ...this.reportColumns.map( c => c.code )
            ]
        }
    }

    getResourePage( startDate: string, endDate: string, stationCodes: number[], fields: string[], endCursor?: string ): Promise<Result<TableRow>> {
        return this.datamartGraphqlApiService.getHourlyWeather( startDate, endDate, stationCodes, fields, endCursor )
            .then( res => {
                res.items = res.items.map( row => {
                    return {
                        ...row,
                        date: formatTableDate( row.WEATHER_TIMESTAMP ),
                        ...this.weatherStationService.getStationByCode( row.STATION_CODE! )?.properties
                    } 
                } )

                return res as Result<TableRow>
            } )
    }
}
