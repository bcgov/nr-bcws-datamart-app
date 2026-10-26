import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogService as NrclDialogService } from '@bcgov/nr-ngx-component-lib';
import { DisclaimerDialogComponent, DisclaimerDialogConfig, DisclaimerDialogResult } from '../dialogs/disclaimer/disclaimer.dialog';
import { MessageDialog, MessageDialogConfig, MessageDialogResult } from '../dialogs/message/message.dialog';
import { SelectedStationsDialog, SelectedStationsDialogConfig, SelectedStationsDialogResult } from '../dialogs/selected-stations/selected-stations.dialog';
import { DataDownloadFilterDailyWeatherDialog, DataDownloadFilterDailyWeatherDialogConfig, DataDownloadFilterDailyWeatherDialogResult } from '../pages/data-download/filters/daily-weather-dialog/data-download-filter-daily-weather.dialog';
import { DataDownloadFilterHourlyWeatherDialogConfig, DataDownloadFilterHourlyWeatherDialog, DataDownloadFilterHourlyWeatherDialogResult } from '../pages/data-download/filters/hourly-weather-dialog/data-download-filter-hourly-weather.dialog';
import { DataDownloadFilterStationMetadataDialogConfig, DataDownloadFilterStationMetadataDialog, DataDownloadFilterStationMetadataDialogResult } from '../pages/data-download/filters/station-metadata-dialog/data-download-filter-station-metadata.dialog';

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

    openDataDownloadFilterDailyWeatherDialog( data: DataDownloadFilterDailyWeatherDialogConfig ) {
        return this.nrclDialogService.openDialog<
            DataDownloadFilterDailyWeatherDialog,
            DataDownloadFilterDailyWeatherDialogConfig,
            DataDownloadFilterDailyWeatherDialogResult
        >( DataDownloadFilterDailyWeatherDialog, data, {            
        } )
    }   

    openDataDownloadFilterHourlyWeatherDialog( data: DataDownloadFilterHourlyWeatherDialogConfig ) {
        return this.nrclDialogService.openDialog<
            DataDownloadFilterHourlyWeatherDialog,
            DataDownloadFilterHourlyWeatherDialogConfig,
            DataDownloadFilterHourlyWeatherDialogResult
        >( DataDownloadFilterHourlyWeatherDialog, data, {            
        } )
    }       

    openDataDownloadFilterStationMetadataDialog( data: DataDownloadFilterStationMetadataDialogConfig ) {
        return this.nrclDialogService.openDialog<
            DataDownloadFilterStationMetadataDialog,
            DataDownloadFilterStationMetadataDialogConfig,
            DataDownloadFilterStationMetadataDialogResult
        >( DataDownloadFilterStationMetadataDialog, data, {            
        } )
    }       
}

