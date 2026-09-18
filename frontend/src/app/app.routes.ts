import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DownloadDataComponent } from './components/download-data/download-data.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'download-data',
    component: DownloadDataComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];