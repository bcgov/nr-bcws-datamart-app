import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnInit,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { StationDataService } from '../../services/station-data.service';
import { StationSelectionContentComponent } from './content/station-selection-content.component';
import { StationSelectionFiltersComponent } from './filters/station-selection-filters.component';
import { StationSelectionHeaderComponent } from './header/station-selection-header.component';
import { DataMartHeaderComponent } from '../../components/datamart-header/datamart-header.component';
import { ButtonComponent } from '@bcgov/nr-ngx-component-lib';
import { SelectedStationsService } from '../../services/selected-stations.service';
import { DialogService } from '../../services/dialog.service';
import { Router } from '@angular/router';
import { ROUTE } from '../../bcws-datamart-app.routes';

@Component({
    selector: 'station-selection-page',
    templateUrl: './station-selection.page.html',
    styleUrl: './station-selection.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        StationSelectionContentComponent,
        StationSelectionFiltersComponent,
        StationSelectionHeaderComponent,
        DataMartHeaderComponent,
        ButtonComponent
    ]
})
export class StationSelectionPage implements OnInit {
    stationDataService = inject(StationDataService)
    changeDetectorRef = inject(ChangeDetectorRef)
    selectedStationsService = inject(SelectedStationsService)
    dialogService = inject(DialogService)
    router = inject(Router)

    ngOnInit(): void {
        // hack to make page load properly
        setTimeout(() => {
            this.changeDetectorRef.detectChanges()
        }, 1000);

        this.stationDataService.initialize()
    }    

    onViewDataClick() {
        if ( this.selectedStationsService.count == 0 ) {
            this.dialogService.openMessageDialog( {
                title: 'Select a Weather Station',
                message: 'To view data, select at least one weather station from the map or list.'
            } )
            return;
        }

        this.router.navigate( [ ROUTE.DATA_DOWNLOAD ] )       
    }
}