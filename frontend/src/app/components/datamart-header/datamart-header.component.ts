import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@bcgov/nr-ngx-component-lib';
import { Subscription } from 'rxjs';
import { DialogService } from '../../services/dialog.service';
import { SelectedStationsService } from '../../services/selected-stations.service';

@Component({
    selector: 'datamart-header',
    templateUrl: './datamart-header.component.html',
    styleUrl: './datamart-header.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ButtonComponent,
    ]
})
export class DataMartHeaderComponent implements OnInit, OnDestroy {
    selectedStationsService = inject( SelectedStationsService )
    dialogService = inject( DialogService )
    router = inject( Router )
    changeDetectorRef = inject( ChangeDetectorRef )

    selectedCount = 0;
    selectedStationsSubscription?: Subscription

    ngOnInit(): void {
        this.selectedStationsSubscription = this.selectedStationsService.selectedStations$.subscribe(
            (stations) => {
                this.selectedCount = stations.length;
                this.changeDetectorRef.markForCheck();
            },
        );
    }

    ngOnDestroy(): void {
        if ( this.selectedStationsSubscription ) this.selectedStationsSubscription.unsubscribe()
    }

    get selectedStationsLabel() {
        if ( this.selectedCount == 0 ) {
            return 'No stations selected'
        }
        else if ( this.selectedCount == 1 ) {
            return '1 station selected'
        }
        else {
            return this.selectedCount + ' stations selected'
        }
    }

    onStationsSelectedClick() {        
        if (this.selectedCount == 0) {
            this.dialogService.openMessageDialog( {
                title: 'No Stations Selected',
                message: 'Select stations from the map or station list. Your selections will appear here.'
            } )
            return;
        }

        this.dialogService.openSelectedStationsDialog({})
    }    
}