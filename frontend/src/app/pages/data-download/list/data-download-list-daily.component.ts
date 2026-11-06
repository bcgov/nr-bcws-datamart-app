import {
    ChangeDetectionStrategy,
    Component,
    SimpleChanges
} from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ButtonComponent, GapComponent, RowListDesktopComponent } from '@bcgov/nr-ngx-component-lib';
import { DailyWeatherStation } from '../../../api-types';
import { Result } from '../../../services/datamart-graphql-api.service';
import { formatTableDate } from '../../../util';
import { DataDownloadListBase } from './data-download-list.base';

export type TableRow = { date?: string } & DailyWeatherStation

@Component({
    selector: 'data-download-list-daily',
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
export class DataDownloadListDailyComponent extends DataDownloadListBase<TableRow> {
    override ngOnChanges(changes: SimpleChanges<DataDownloadListDailyComponent>): void {
        super.ngOnChanges( changes )

        if ( changes.reportColumns || changes.metadataColumns ) {
            let stationCols = this.codeTableService.STATION_COLUMNS.items.filter( c => this.metadataColumns.find( x => x.code == c.code ) ).map( c => c.code )
            let metadataCols =  this.codeTableService.METADATA_COLUMNS.items.filter( c => this.metadataColumns.find( x => x.code == c.code ) ).map( c => c.code )

            this.displayedColumns = [
                'date',
                ...stationCols,
                ...this.reportColumns.map( c => c.code ),   
                ...metadataCols,
            ]
        }
    }

    getResourcePage( startDate: string, endDate: string, stationCodes: number[], fields: string[], metadataFields: string[], endCursor?: string ): Promise<Result<TableRow>> {        
        return this.datamartGraphqlApiService.getDailyWeather( startDate, endDate, stationCodes, fields, metadataFields, endCursor )
            .then( res => {
                res.items = res.items.map( row => {
                    return {
                        ...row,
                        date: formatTableDate( row.WEATHER_TIMESTAMP ),
                    } 
                } )

                return res as Result<TableRow>
            } )
    }

    sortRows() {
        this.rows.sort( ( a, b ) => {
            let c1 = a.WEATHER_TIMESTAMP!.localeCompare( b.WEATHER_TIMESTAMP! ) 
            if ( c1 ) return c1

            let aCode = a.station!.STATION_CODE 
            let bCode = b.station!.STATION_CODE 
            let c2 = aCode == bCode ? 0 : aCode > bCode ? 1 : -1
            return c2
        } )
    }
}
