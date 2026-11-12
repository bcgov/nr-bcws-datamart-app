import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogService as NrclDialogService } from '@bcgov/nr-ngx-component-lib';
import { DisclaimerDialogComponent, DisclaimerDialogConfig, DisclaimerDialogResult } from '../dialogs/disclaimer/disclaimer.dialog';
import { MessageDialog, MessageDialogConfig, MessageDialogResult } from '../dialogs/message/message.dialog';
import { SelectedStationsDialog, SelectedStationsDialogConfig, SelectedStationsDialogResult } from '../dialogs/selected-stations/selected-stations.dialog';
import { DataDownloadFilterDailyWeatherDialog, DataDownloadFilterDailyWeatherDialogConfig, DataDownloadFilterDailyWeatherDialogResult } from '../pages/data-download/filters/daily-weather-dialog/data-download-filter-daily-weather.dialog';
import { DataDownloadFilterHourlyWeatherDialogConfig, DataDownloadFilterHourlyWeatherDialog, DataDownloadFilterHourlyWeatherDialogResult } from '../pages/data-download/filters/hourly-weather-dialog/data-download-filter-hourly-weather.dialog';
import { DataDownloadFilterStationMetadataDialogConfig, DataDownloadFilterStationMetadataDialog, DataDownloadFilterStationMetadataDialogResult } from '../pages/data-download/filters/station-metadata-dialog/data-download-filter-station-metadata.dialog';
import { DataDownloadAsyncDownloadDialogConfig, DataDownloadAsyncDownloadDialog, DataDownloadAsyncDownloadDialogResult } from '../pages/data-download/async-download-dialog/data-download-async-download.dialog';

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
            width: '600px',
            maxWidth: '95vw',
            maxHeight: '95vh',
        } )
    }   

    openSelectedStationsDialog( data: SelectedStationsDialogConfig ) {
        return this.nrclDialogService.openDialog<
            SelectedStationsDialog,
            SelectedStationsDialogConfig,
            SelectedStationsDialogResult
        >( SelectedStationsDialog, data, {
            minWidth: '95vw',
            maxWidth: '95vw',
            minHeight: '95vh',
            maxHeight: '95vh',
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
            maxWidth: '95vw',
            maxHeight: '95vh',
        } )
    }   

    openDataDownloadFilterHourlyWeatherDialog( data: DataDownloadFilterHourlyWeatherDialogConfig ) {
        return this.nrclDialogService.openDialog<
            DataDownloadFilterHourlyWeatherDialog,
            DataDownloadFilterHourlyWeatherDialogConfig,
            DataDownloadFilterHourlyWeatherDialogResult
        >( DataDownloadFilterHourlyWeatherDialog, data, {            
            maxWidth: '95vw',
            maxHeight: '95vh',
        } )
    }       

    openDataDownloadFilterStationMetadataDialog( data: DataDownloadFilterStationMetadataDialogConfig ) {
        return this.nrclDialogService.openDialog<
            DataDownloadFilterStationMetadataDialog,
            DataDownloadFilterStationMetadataDialogConfig,
            DataDownloadFilterStationMetadataDialogResult
        >( DataDownloadFilterStationMetadataDialog, data, {            
            maxWidth: '95vw',
            maxHeight: '95vh',
        } )
    }       

    openDataDownloadAsyncDownloadDialog( data: DataDownloadAsyncDownloadDialogConfig ) {
        return this.nrclDialogService.openDialog<
            DataDownloadAsyncDownloadDialog,
            DataDownloadAsyncDownloadDialogConfig,
            DataDownloadAsyncDownloadDialogResult
        >( DataDownloadAsyncDownloadDialog, data, {            
            maxWidth: '600px'
        } )
    }       
    
}

