import { Routes } from '@angular/router';
import { DataDownloadPage } from './pages/data-download/data-download.page';
import { HomePage } from './pages/home/home.page';
import { StationSelectionPage } from './pages/station-selection/station-selection.page';

export const ROUTE = {
    HOME: '',
    STATION_SELECTION: 'station-selection',
    DATA_DOWNLOAD: 'data-download',
} 

export const bcwsDatamartAppRoutes: Routes = [
    {
        path: ROUTE.HOME,
        component: HomePage
    },
    {
        path: ROUTE.STATION_SELECTION,
        component: StationSelectionPage
    },
    {
        path: ROUTE.DATA_DOWNLOAD,
        component: DataDownloadPage
    },
    {
        path: '**',
        redirectTo: ROUTE.HOME
    }
];
