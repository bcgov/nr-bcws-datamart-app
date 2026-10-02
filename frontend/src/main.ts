import { bootstrapApplication } from '@angular/platform-browser';
import { BcwsDatamartApp } from './app/bcws-datamart-app';
import { bcwsDatamartAppConfig } from './app/bcws-datamart-app.config';

bootstrapApplication(BcwsDatamartApp, bcwsDatamartAppConfig)
  .catch((err) => console.error(err));
