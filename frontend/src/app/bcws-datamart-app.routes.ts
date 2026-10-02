import { Routes } from '@angular/router';
import { StationSelectionComponent } from './components/station-selection/station-selection.component';
import { DataDownloadComponent } from './components/data-download/data-download.component';
import { PageHomeComponent } from './pages/home/home.component';

export const bcwsDatamartAppRoutes: Routes = [
    {
        path: '',
        component: PageHomeComponent
    },
    {
        path: 'station-selection',
        component: StationSelectionComponent
    },
    {
        path: 'data-download',
        component: DataDownloadComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
