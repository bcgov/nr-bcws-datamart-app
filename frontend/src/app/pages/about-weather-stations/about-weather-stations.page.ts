import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataMartMarkdownComponent } from '../../components/datamart-markdown/datamart-markdown.component';

@Component( {
    selector: 'about-weather-stations-page',
    templateUrl: './about-weather-stations.page.html',
    styleUrl: './about-weather-stations.page.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DataMartMarkdownComponent
    ]
} )
export class AboutWeatherStationsPage {}
