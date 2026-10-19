import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogService as NrclDialogService } from '@bcgov/nr-ngx-component-lib';
import { DisclaimerDialogComponent, DisclaimerDialogConfig, DisclaimerDialogResult } from '../dialogs/disclaimer/disclaimer.dialog';
import { MessageDialog, MessageDialogConfig, MessageDialogResult } from '../dialogs/message/message.dialog';
import { SelectedStationsDialog, SelectedStationsDialogConfig, SelectedStationsDialogResult } from '../dialogs/selected-stations/selected-stations.dialog';

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

    openDisclaimerDialog( data: DisclaimerDialogConfig ) {
        return this.nrclDialogService.openDialog<
            DisclaimerDialogComponent,
            DisclaimerDialogConfig,
            DisclaimerDialogResult
        >( DisclaimerDialogComponent, data, {
            maxWidth: '600px'
        } )
    }   

    openSelectedStationsDialog( data: SelectedStationsDialogConfig ) {
        return this.nrclDialogService.openDialog<
            SelectedStationsDialog,
            SelectedStationsDialogConfig,
            SelectedStationsDialogResult
        >( SelectedStationsDialog, data, {
            minWidth: '95vw',
            minHeight: '95vh',
        } )
    }   

    openMessageDialog( data: MessageDialogConfig ) {
        return this.nrclDialogService.openDialog<
            MessageDialog,
            MessageDialogConfig,
            MessageDialogResult
        >( MessageDialog, data, {
        } )
    }   
}

