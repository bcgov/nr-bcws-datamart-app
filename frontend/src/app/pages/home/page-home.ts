// components/home/home.component.ts

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HomeCardComponent } from '../home-card/home-card.component';

@Component( {
    selector: 'page-home',
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: [ './home.component.scss' ],
    imports: [
        FooterComponent,
        HomeCardComponent
    ]
} )
export class PageHomeComponent {
    cards = [
        {
            title: 'Search and download',
            description: 'Select the weather stations you want data from, a date range, and the data you want to download.',
            icon: 'download',
            route: '/station-selection',
        },
        {
            title: 'API options',
            description: 'Available in GraphQL and REST API.',
            icon: 'api',
            route: '/api',
        },
        {
            title: 'MCP server',
            description: 'Use your own AI tools to ask for things and get answers.',
            icon: 'mcp-server',
            route: '/mcp-server',
        },
        {
            title: 'Weather stations',
            description: 'Explore the list of weather stations across British Columbia.',
            icon: 'format_list_bulleted',
            route: '/weather-stations',
        },
        {
            title: 'Data limitations',
            description: 'Important limitations, assumptions, and interpretation notes for BC Wildfire Service weather station data.',
            icon: 'info',
            route: '/data-limitations',
        },
    ];
}
