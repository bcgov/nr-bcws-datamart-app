import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { ApplicationComponent } from '@bcgov/nr-ngx-component-lib';
import { RouterModule } from '@angular/router';

@Component( {
    selector: 'bcws-datamart-app',
    templateUrl: './bcws-datamart-app.html',
    styleUrl: './bcws-datamart-app.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ApplicationComponent,
        HeaderComponent,
        RouterModule
    ]
} )
export class BcwsDatamartApp { }
