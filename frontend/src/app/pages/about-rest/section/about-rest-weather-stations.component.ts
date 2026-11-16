import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WeatherStationDefs } from '../../../api-types';
import { DataMartMarkdownComponent } from '../../../components/datamart-markdown/datamart-markdown.component';
import { ApplicationStateService } from '../../../services/application-state.service';

@Component( {
    selector: 'about-rest-weather-stations',
    templateUrl: './about-rest-weather-stations.component.html',
    styleUrl: './about-rest-weather-stations.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DataMartMarkdownComponent,
    ]
} )
export class AboutRestWeatherStationsComponent {
    applicationStateService = inject( ApplicationStateService )

    attributes = WeatherStationDefs
        .filter( f => f.description )
        .map( f => `\`${ f.name }\` | ${ f.apiType } | ${ f.description }` )
        .join( '\n' )
}


