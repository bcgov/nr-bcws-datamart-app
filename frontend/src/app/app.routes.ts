import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StationSelectionComponent } from './components/station-selection/station-selection.component';

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
    path: '**',
    redirectTo: ''
  }
];