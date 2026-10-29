import {
    ChangeDetectionStrategy,
    Component,
    inject
} from '@angular/core';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ButtonComponent, GapComponent, InitialState, RowListBase, RowListDesktopComponent, RowListPaginationComponent } from '@bcgov/nr-ngx-component-lib';
import { NgxPaginationModule } from 'ngx-pagination';
import { Observable, of } from 'rxjs';
import { SelectedStationsService } from '../../../services/selected-stations.service';
import { GeoJsonPoint, WeatherStation } from '../../../services/station-data.service';

export type TableRow = GeoJsonPoint<WeatherStation>
export type Filter = {}

@Component({
    selector: 'selected-stations-list',
    templateUrl: './selected-stations-list.component.html',
    styleUrl: './selected-stations-list.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ButtonComponent,
        RowListDesktopComponent,
        MatTableModule,
        MatSortModule,
        NgxPaginationModule,
        RowListPaginationComponent,
        GapComponent
    ]
})
export class SelectedStationsListComponent extends RowListBase<Filter, TableRow, any> {
    selectedStationsService = inject( SelectedStationsService )

    displayedColumns = [
        'stationName',
        'stationCode',
        'stationAcronym',
        'fireCentre',
        'fireZone',
        'latitude',
        'longitude',
        'elevation',
        'status',
        'remove',
    ];

    fetchRowListPage(): Observable<GeoJsonPoint<WeatherStation>[]> {
        return of( this.selectedStationsService.selectedStations )
    }
    
    parseRows(res: GeoJsonPoint<WeatherStation>[]): TableRow[] {
        return this.sortRows( res )
    }

    override parseTotalRowCount(res: any): number {
        return this.selectedStationsService.selectedStations.length
    }

    getInitialPageState(): InitialState<Filter> {
        return {
            instance: 'selected-stations',
            filter: {},
            pageConfig: {
                pageSize: 10,
                pageNumber: 1,
                sortActive: 'stationName',
                sortDirection: 'asc',
            }
        }
    }

    onRemoveStationClick( station: GeoJsonPoint<WeatherStation> ) {
        this.selectedStationsService.removeStation( station )
        this.refreshRowList()
    }

    override onSortChange(ev: Sort): Promise<void> {
        let res = super.onSortChange( ev )
        this.sortRows( this.rows )
        return res
    }

    sortRows( rows: TableRow[] ): TableRow[] {
        let sortFn: ( d: SortDirection ) => ( a: TableRow, b: TableRow ) => number 
        let sortDir = ( d: SortDirection, sort: number ) => d == 'asc' ? sort : -1 * sort
        let stringSort = ( field: keyof WeatherStation ) => ( d: SortDirection ) => ( a: TableRow, b: TableRow ) => sortDir( d, (a.properties[field] as string || '').localeCompare( b.properties[field] as string || '') )
        let numericSort = ( field: keyof WeatherStation ) => ( d: SortDirection ) => ( a: TableRow, b: TableRow ) => sortDir( d, (a.properties[field] as number) - ( b.properties[field] as number ) )

        switch ( this.sortActive ) {
            case 'stationName':     sortFn = stringSort( 'STATION_NAME' ); break
            case 'stationCode':     sortFn = numericSort( 'STATION_CODE' ); break
            case 'stationAcronym':  sortFn = stringSort( 'STATION_ACRONYM' ); break
            case 'fireCentre':      sortFn = numericSort( 'FIRE_CENTRE_ORG_UNIT_IDENT' ); break
            case 'fireZone':        sortFn = numericSort( 'ZONE_ORG_UNIT_IDENTIFIER' ); break
            case 'latitude':        sortFn = numericSort( 'LATITUDE' ); break
            case 'longitude':       sortFn = numericSort( 'LONGITUDE' ); break
            case 'elevation':       sortFn = numericSort( 'ELEVATION_M' ); break
            case 'status':          sortFn = stringSort( 'STATION_STATUS_CODE' ); break
        }

        return rows.sort( sortFn!( this.sortDirection ) )
    }
}
