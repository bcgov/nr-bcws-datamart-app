import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StationSelectionComponent } from './components/station-selection/station-selection.component';
import { DataDownloadComponent } from './components/data-download/data-download.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
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

