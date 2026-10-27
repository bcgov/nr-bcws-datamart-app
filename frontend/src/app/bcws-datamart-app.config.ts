import { ApplicationConfig, provideBrowserGlobalErrorListeners, SecurityContext } from '@angular/core';
import { provideRouter } from '@angular/router';
import { bcwsDatamartAppRoutes } from './bcws-datamart-app.routes';
import { provideMarkdown, SANITIZE } from 'ngx-markdown';

export const bcwsDatamartAppConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter( bcwsDatamartAppRoutes ),
        provideMarkdown( {
            sanitize: {
                provide: SANITIZE,
                useValue: SecurityContext.NONE
            }
        } )
    ]
};
