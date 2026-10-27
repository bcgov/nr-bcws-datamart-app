import { Routes } from '@angular/router';
import { DataDownloadPage } from './pages/data-download/data-download.page';
import { HomePage } from './pages/home/home.page';
import { StationSelectionPage } from './pages/station-selection/station-selection.page';
import { AboutWeatherStationsPage } from './pages/about-weather-stations/about-weather-stations.page';

export const ROUTE = {
    HOME: '',
    STATION_SELECTION: 'station-selection',
    DATA_DOWNLOAD: 'data-download',
    ABOUT_WEATHER_STATIONS: 'about-weather-stations'

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
        path: '**',
        redirectTo: ROUTE.HOME
    }
];
