import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { App } from './app';
import { HeaderComponent } from './components/header/header.component';

import { NrNgxComponentLibModule } from '@bcgov/nr-ngx-component-lib';
import { HomeComponent } from './components/home/home.component';

import { routes } from './app.routes';

@NgModule({
  declarations: [
    App,
    HeaderComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NrNgxComponentLibModule,
    
    
  ],
  bootstrap: [App]
})
export class AppModule {}