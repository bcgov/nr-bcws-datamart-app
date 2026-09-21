// components/home/home.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {





cards = [
  {
    title: 'Search and download',
    description:
      'Select the weather stations you want data from, a date range, and the data you want to download.',
    icon: 'search'
  },
  {
    title: 'API options',
    description: 'Available in GraphQL and REST API.',
    icon: 'api'
  },
  {
    title: 'MCP server',
    description: 'Use your own AI tools to ask for things and get answers.',
    icon: 'mcp-server'
  },
  {
    title: 'Weather stations',
    description: 'Explore the list of weather stations across British Columbia.',
    icon: 'location_on'
  },
  {
    title: 'Data limitations',
    description:
      'Important limitations, assumptions, and interpretation notes for BC Wildfire Service weather station data.',
    icon: 'info'
  }
];







}