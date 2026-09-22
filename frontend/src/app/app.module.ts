import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { App } from './app';
import { HeaderComponent } from './components/header/header.component';

import { NrNgxComponentLibModule } from '@bcgov/nr-ngx-component-lib';
import { HomeComponent } from './components/home/home.component';
import { DownloadDataComponent } from './components/download-data/download-data.component';

import { routes } from './app.routes';
import { HomeCardComponent } from './components/home-card/home-card.component';
import { FooterComponent } from './components/footer/footer.component';
import { DownloadDataFiltersComponent } from './components/download-data/download-data-filters/download-data-filters.component';
import { DownloadDataHeaderComponent } from './components/download-data/download-data-header/download-data-header.component';
import { DownloadDataMapComponent } from './components/download-data/download-data-map/download-data-map.component';
import { DownloadDataStationListComponent } from './components/download-data/download-data-station-list/download-data-station-list.component';

@NgModule({
  declarations: [
    App,
    HeaderComponent,
    HomeComponent,
    DownloadDataComponent,
    DownloadDataHeaderComponent,
    DownloadDataFiltersComponent,
    DownloadDataStationListComponent,
    DownloadDataMapComponent,
    HomeCardComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NrNgxComponentLibModule,
    
    
  ],
  bootstrap: [App]
})
export class AppModule {}