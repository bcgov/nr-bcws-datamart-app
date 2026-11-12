import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { HomeCardComponent } from './card/home-card.component';
import { AppFooterComponent } from '../../components/app-footer/app-footer.component';
import { DataMartHeaderComponent } from '../../components/datamart-header/datamart-header.component';
import { ButtonComponent } from '@bcgov/nr-ngx-component-lib';
import { Router } from '@angular/router';
import { ROUTE } from '../../bcws-datamart-app.routes';

@Component( {
    selector: 'home-page',
    templateUrl: './home.page.html',
    styleUrl: './home.page.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        AppFooterComponent,
        HomeCardComponent,
        DataMartHeaderComponent,
        ButtonComponent,
    ]
} )
export class HomePage {
    router = inject( Router )

    onFindWeatherDataClick() {
        this.router.navigate( [ ROUTE.STATION_SELECTION ] )
    }
}
