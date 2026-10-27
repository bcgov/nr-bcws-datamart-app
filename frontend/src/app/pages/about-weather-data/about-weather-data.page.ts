import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppFooterComponent } from '../../components/app-footer/app-footer.component';
import { DataMartMarkdownComponent } from '../../components/datamart-markdown/datamart-markdown.component';

@Component( {
    selector: 'about-weather-data-page',
    templateUrl: './about-weather-data.page.html',
    styleUrl: './about-weather-data.page.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        AppFooterComponent,
        DataMartMarkdownComponent
    ]
} )
export class AboutWeatherDataPage {}
