import {
    Directive,
    inject,
    Input
} from '@angular/core';
import { RowListBase } from '@bcgov/nr-ngx-component-lib';
import { CodeDescriptionHeading } from '../../../services/code-table.service';
import { SelectedStationsService } from '../../../services/selected-stations.service';
import { GeoJsonPoint, WeatherStation } from '../../../services/station-data.service';

export type TableRow = GeoJsonPoint<WeatherStation>
export type Filter = {}

@Directive()
export abstract class DataDownloadListBase extends RowListBase<Filter, TableRow, any> {
    selectedStationsService = inject( SelectedStationsService )

    @Input() reportColumns: CodeDescriptionHeading[] = []
    @Input() startDate?: string
    @Input() endDate?: string    

    displayedColumns: string[] = []    
    paginationId?: string
}
