import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { App } from './app';
import { HeaderComponent } from './components/header/header';

import { NrNgxComponentLibModule } from '@bcgov/nr-ngx-component-lib';

@NgModule({
  declarations: [
    App,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    NrNgxComponentLibModule,
    
    
  ],
  bootstrap: [App]
})
export class AppModule {}