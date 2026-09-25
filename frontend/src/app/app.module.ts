import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { NgxPaginationModule } from 'ngx-pagination';

import { App } from './app';
import { HeaderComponent } from './components/header/header.component';

import { NrNgxComponentLibModule } from '@bcgov/nr-ngx-component-lib';
import { HomeComponent } from './components/home/home.component';
import { StationSelectionComponent } from './components/station-selection/station-selection.component';

import { routes } from './app.routes';
import { HomeCardComponent } from './components/home-card/home-card.component';
import { FooterComponent } from './components/footer/footer.component';
import { StationSelectionFiltersComponent } from './components/station-selection/station-selection-filters/station-selection-filters.component';
import { StationSelectionHeaderComponent } from './components/station-selection/station-selection-header/station-selection-header.component';
import { StationSelectionMapComponent } from './components/station-selection/station-selection-content/station-selection-map/station-selection-map.component';
import { StationSelectionStationListComponent } from './components/station-selection/station-selection-content/station-selection-station-list/station-selection-station-list.component';
import { StationSelectionContentComponent } from './components/station-selection/station-selection-content/station-selection-content.component';
import { StationInformationPanelComponent } from './components/station-selection/station-selection-content/station-selection-map/station-information-panel/station-information-panel.component';
import { DataDownloadComponent } from './components/data-download/data-download.component';

@NgModule({
  declarations: [
    App,
    HeaderComponent,
    HomeComponent,
    StationSelectionComponent,
    StationSelectionHeaderComponent,
    StationSelectionFiltersComponent,
    StationSelectionContentComponent,
    StationSelectionStationListComponent,
    StationSelectionMapComponent,
    StationInformationPanelComponent,
    DataDownloadComponent,
    HomeCardComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NrNgxComponentLibModule,
    MatTableModule,
    NgxPaginationModule,
    
    
  ],
  bootstrap: [App]
})
export class AppModule {}