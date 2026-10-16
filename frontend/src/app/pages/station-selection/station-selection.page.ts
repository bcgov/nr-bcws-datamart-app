import { JsonPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnInit
} from '@angular/core';
import { StationDataService } from '../../services/station-data.service';
import { StationSelectionContentComponent } from './content/station-selection-content.component';
import { StationSelectionHeaderComponent } from './header/station-selection-header.component';
import { StationSelectionFiltersComponent } from './filters/station-selection-filters.component';

@Component({
    selector: 'station-selection-page',
    templateUrl: './station-selection.page.html',
    styleUrl: './station-selection.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        StationSelectionContentComponent,
        StationSelectionFiltersComponent,
        StationSelectionHeaderComponent,
        JsonPipe
    ]
})
export class StationSelectionPage implements OnInit {
    stationDataService = inject(StationDataService)
    changeDetectorRef = inject(ChangeDetectorRef)

    ngOnInit(): void {
        // hack to make page load properly
        setTimeout(() => {
            this.changeDetectorRef.detectChanges()
        }, 1000);

        this.stationDataService.initialize()
    }    
}