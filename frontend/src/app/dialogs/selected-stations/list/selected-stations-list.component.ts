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
import { SelectedWeatherStationsService } from '../../../services/selected-weather-stations.service';
import { WeatherStation } from '../../../services/datamart-rest-api.service';
import { WeatherStationFeature } from '../../../services/weather-station.service';

export type TableRow = WeatherStationFeature
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
    selectedWeatherStationsService = inject( SelectedWeatherStationsService )

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

    fetchRowListPage(): Observable<WeatherStationFeature[]> {
        return of( this.selectedWeatherStationsService.selectedStations )
    }
    
    parseRows(res: WeatherStationFeature[]): TableRow[] {
        return this.sortRows( res )
    }

    override parseTotalRowCount(res: any): number {
        return this.selectedWeatherStationsService.selectedStations.length
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

    onRemoveStationClick( station: WeatherStationFeature ) {
        this.selectedWeatherStationsService.removeStation( station )
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
            case 'stationName':     sortFn = stringSort( 'station_name' ); break
            case 'stationCode':     sortFn = numericSort( 'station_code' ); break
            case 'stationAcronym':  sortFn = stringSort( 'station_acronym' ); break
            case 'fireCentre':      sortFn = numericSort( 'fire_centre_org_unit_ident' ); break
            case 'fireZone':        sortFn = numericSort( 'zone_org_unit_identifier' ); break
            case 'latitude':        sortFn = numericSort( 'latitude' ); break
            case 'longitude':       sortFn = numericSort( 'longitude' ); break
            case 'elevation':       sortFn = numericSort( 'elevation_m' ); break
            case 'status':          sortFn = stringSort( 'station_status_code' ); break
        }

        return rows.sort( sortFn!( this.sortDirection ) )
    }
}
