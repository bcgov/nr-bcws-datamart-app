import {
    ChangeDetectionStrategy,
    Component,
    inject
} from '@angular/core';
import { StationDataService } from '../../services/station-data.service';
import { StationSelectionContentComponent } from './content/station-selection-content.component';
import { StationSelectionFiltersComponent } from './filters/station-selection-filters.component';
import { StationSelectionHeaderComponent } from './header/station-selection-header.component';

@Component({
    selector: 'station-selection-page',
    templateUrl: './station-selection.page.html',
    styleUrl: './station-selection.page.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        StationSelectionContentComponent,
        StationSelectionFiltersComponent,
        StationSelectionHeaderComponent
    ]
})
export class StationSelectionPage {
    stationDataService = inject(StationDataService)
}