import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataMartMarkdownComponent } from '../../components/datamart-markdown/datamart-markdown.component';

@Component( {
    selector: 'about-weather-data-page',
    templateUrl: './about-weather-data.page.html',
    styleUrl: './about-weather-data.page.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DataMartMarkdownComponent
    ]
} )
export class AboutWeatherDataPage {}
