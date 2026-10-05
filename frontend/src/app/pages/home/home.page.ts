import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HomeCardComponent } from './card/home-card.component';
import { AppFooterComponent } from '../../components/app-footer/app-footer.component';

@Component( {
    selector: 'home-page',
    templateUrl: './home.page.html',
    styleUrl: './home.page.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        AppFooterComponent,
        HomeCardComponent
    ]
} )
export class HomePage {}
