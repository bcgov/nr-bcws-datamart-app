import {
    Directive,
    inject,
    Input
} from '@angular/core';
import { RowListBase } from '@bcgov/nr-ngx-component-lib';
import { CodeDescriptionHeading } from '../../../services/code-table.service';
import { SelectedWeatherStationsService } from '../../../services/selected-weather-stations.service';
import { WeatherStationFeature } from '../../../services/weather-station.service';

export type TableRow = WeatherStationFeature
export type Filter = {}

@Directive()
export abstract class DataDownloadListBase extends RowListBase<Filter, TableRow, any> {
    selectedWeatherStationsService = inject( SelectedWeatherStationsService )

    @Input() reportColumns: CodeDescriptionHeading[] = []
    @Input() startDate?: string
    @Input() endDate?: string    

    displayedColumns: string[] = []    
    paginationId?: string
}
