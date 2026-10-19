import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogService as NrclDialogService } from '@bcgov/nr-ngx-component-lib';
import { DisclaimerDialogComponent, DisclaimerDialogConfig, DisclaimerDialogResult } from '../dialogs/disclaimer/disclaimer.dialog';

const DEFAULT_CONFIG = {
    autoFocus: false,
    closeOnNavigation: false,
    panelClass: 'wf-dialog',
    disableClose: true
}

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    dialog = inject( MatDialog )
    nrclDialogService =inject( NrclDialogService )
    // applicationStateService =inject( ApplicationStateService )

    openDisclaimerDialog( data: DisclaimerDialogConfig ) {
        return this.nrclDialogService.openDialog<
            DisclaimerDialogComponent,
            DisclaimerDialogConfig,
            DisclaimerDialogResult
        >( DisclaimerDialogComponent, data, {
            maxWidth: '600px'
        } )
    }   
}
