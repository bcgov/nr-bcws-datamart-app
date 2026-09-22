import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { App } from './app';
import { HeaderComponent } from './components/header/header.component';

import { NrNgxComponentLibModule } from '@bcgov/nr-ngx-component-lib';
import { HomeComponent } from './components/home/home.component';
import { DownloadDataComponent } from './components/download-data/download-data.component';

import { routes } from './app.routes';

@NgModule({
  declarations: [
    App,
    HeaderComponent,
    HomeComponent,
    DownloadDataComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NrNgxComponentLibModule,
    
    
  ],
  bootstrap: [App]
})
export class AppModule {}