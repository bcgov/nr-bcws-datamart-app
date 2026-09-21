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

@NgModule({
  declarations: [
    App,
    HeaderComponent,
    HomeComponent,
    DownloadDataComponent,
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