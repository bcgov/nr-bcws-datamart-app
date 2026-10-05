import { Routes } from '@angular/router';
import { DataDownloadPage } from './pages/data-download/data-download.page';
import { HomePage } from './pages/home/home.page';
import { StationSelectionPage } from './pages/station-selection/station-selection.page';

export const bcwsDatamartAppRoutes: Routes = [
    {
        path: '',
        component: HomePage
    },
    {
        path: 'station-selection',
        component: StationSelectionPage
    },
    {
        path: 'data-download',
        component: DataDownloadPage
    },
    {
        path: '**',
        redirectTo: ''
    }
];
