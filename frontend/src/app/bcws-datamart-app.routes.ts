import { Routes } from '@angular/router';
import { DataDownloadPage } from './pages/data-download/data-download.page';
import { HomePage } from './pages/home/home.page';
import { StationSelectionPage } from './pages/station-selection/station-selection.page';
import { AboutWeatherStationsPage } from './pages/about-weather-stations/about-weather-stations.page';
import { AboutWeatherDataPage } from './pages/about-weather-data/about-weather-data.page';
import { AboutGraphqlPage } from './pages/about-graphql/about-graphql.page';
import { AboutMcpPage } from './pages/about-mcp/about-mcp.page';

export const ROUTE = {
    HOME: '',
    STATION_SELECTION: 'station-selection',
    DATA_DOWNLOAD: 'data-download',
    ABOUT_WEATHER_STATIONS: 'about-weather-stations',
    ABOUT_WEATHER_DATA: 'about-weather-data',
    ABOUT_GRAPHQL: 'about-graphql',
    ABOUT_MCP: 'about-mcp',
} 

export const bcwsDatamartAppRoutes: Routes = [
    {
        path: ROUTE.HOME,
        component: HomePage
    },
    {
        path: ROUTE.STATION_SELECTION,
        component: StationSelectionPage
    },
    {
        path: ROUTE.DATA_DOWNLOAD,
        component: DataDownloadPage
    },
    {
        path: ROUTE.ABOUT_WEATHER_STATIONS,
        component: AboutWeatherStationsPage
    },
    {
        path: ROUTE.ABOUT_WEATHER_DATA,
        component: AboutWeatherDataPage
    },
    {
        path: ROUTE.ABOUT_GRAPHQL,
        component: AboutGraphqlPage
    },
    {
        path: ROUTE.ABOUT_MCP,
        component: AboutMcpPage
    },
    {
        path: '**',
        redirectTo: ROUTE.HOME
    }
];
