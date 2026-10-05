import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { bcwsDatamartAppRoutes } from './bcws-datamart-app.routes';

export const bcwsDatamartAppConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter( bcwsDatamartAppRoutes )
    ]
};
