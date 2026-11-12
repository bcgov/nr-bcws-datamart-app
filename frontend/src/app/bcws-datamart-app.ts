import { ChangeDetectionStrategy, Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ApplicationComponent, ApplicationHeaderComponent, ApplicationMenuComponent, ConfigurationService, IconService, SnackbarUtilService } from '@bcgov/nr-ngx-component-lib';
import { filter, Subscription } from 'rxjs';
import { ROUTE } from './bcws-datamart-app.routes';
import { DialogService } from './services/dialog.service';
import { WeatherStationService } from './services/weather-station.service';
import { DatamartRestApiService } from './services/datamart-rest-api.service';
import { ApplicationStateService } from './services/application-state.service';

const MENU = {
    HOME: 'home',
    STATION_SELECTION: 'station-selection',
    ABOUT_REST: 'about-rest',
    ABOUT_GRAPHQL: 'about-graphql',
    ABOUT_MCP: 'about-mcp',
    ABOUT_WEATHER_STATIONS: 'about-weather-stations',
    ABOUT_WEATHER_DATA: 'about-weather-data',
    DISCLAIMER: 'disclaimer',
    PRIVACY: 'privacy',
    COPYRIGHT: 'copyright',
}

@Component( {
    selector: 'bcws-datamart-app',
    templateUrl: './bcws-datamart-app.html',
    styleUrl: './bcws-datamart-app.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ApplicationComponent,
        ApplicationHeaderComponent,
        ApplicationMenuComponent,
        RouterModule,
    ]
} )
export class BcwsDatamartApp implements OnInit, OnDestroy {
    router = inject( Router )
    snackbarUtilService = inject( SnackbarUtilService )
    dialogService = inject( DialogService )
    configurationService = inject( ConfigurationService )
    weatherStationService = inject(WeatherStationService)
    datamartRestApiService = inject(DatamartRestApiService)
    applicationStateService = inject(ApplicationStateService)
    iconService = inject(IconService)

    title = 'Wildfire DataMart';
    logoAriaLabel = 'BC Wildfire Service logo';
    skipLabel = 'Skip to main content';

    menuItems = [
        {
            id: MENU.HOME,
            label: 'Home',
            icon: 'home-outline',
        },
        {
            id: MENU.STATION_SELECTION,
            label: 'View and download weather data',
            icon: 'get_app',
        },
        {
            id: MENU.ABOUT_REST,
            label: 'REST API',
            icon: 'code_xml',
        },
        {
            id: MENU.ABOUT_GRAPHQL,
            label: 'GraphQL API',
            icon: 'api',
        },
        {
            id: MENU.ABOUT_MCP,
            label: 'MCP server',
            icon: 'mcp-server',
        },
        {
            id: MENU.ABOUT_WEATHER_STATIONS,
            label: 'About weather stations',
            icon: 'weather-station',
        },
        {
            id: MENU.ABOUT_WEATHER_DATA,
            label: 'About weather data',
            icon: 'bar_chart',
        },
        {
            id: MENU.DISCLAIMER,
            label: 'Disclaimer',
        },
        {
            id: MENU.PRIVACY,
            label: 'Privacy',
        },
        {
            id: MENU.COPYRIGHT,
            label: 'Copyright',
        },
    ]

    routeSubscription!: Subscription
    currentItemId?: string

    ngOnInit() {
        this.configurationService.update( { interfaceStyle: '2026' } )
        this.updateDisplayMode()

        this.routeSubscription = this.router.events
            .pipe(
                filter( event => event instanceof NavigationEnd )
            )
            .subscribe( ( event: NavigationEnd ) => {
                this.onRouteChanged( event.urlAfterRedirects )
            } )

        this.weatherStationService.initialize()
        // this.datamartRestApiService.getFireCentres()

        this.showDisclaimerDialog()

        this.iconService.defineIcon( 'weather-station', `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -3 30 30" fill="none" >
            <path d="M11.3928 12.7493L2.43967 22.7504C2.16401 23.0598 2.19073 23.5338 2.50014 23.8095C2.80815 24.0851 3.28212 24.0584 3.55917 23.7504L13.407 12.7477H14.2509V23.2496C14.2509 23.6631 14.587 23.9992 15.0005 23.9992C15.414 23.9992 15.7501 23.6631 15.7501 23.2496V12.7477H16.594L26.4419 23.7504C26.7189 24.0584 27.1929 24.0851 27.5009 23.8095C27.8103 23.5338 27.837 23.0599 27.5614 22.7504L18.6082 12.7493H19.5013C19.9148 12.7493 20.2509 12.4146 20.2509 11.9997V8.24873C20.2509 7.83525 19.9148 7.4991 19.5013 7.4991H15.7504V5.2488H17.649C18.0639 5.2488 18.3986 4.91406 18.3986 4.49917V3.74955H24.0945C24.4278 5.0435 25.6036 5.99986 27.0001 5.99986C28.6569 5.99986 30 4.65529 30 2.99993C30 1.34457 28.6555 0 27.0001 0C25.6036 0 24.4278 0.957802 24.0945 2.25031H18.3986V1.50068C18.3986 1.0872 18.0639 0.751062 17.649 0.751062H12.351C11.9361 0.751062 11.6014 1.0872 11.6014 1.50068V2.25031H5.90552C5.5722 0.957802 4.39644 0 2.99987 0C1.3431 0 0 1.34597 0 2.99993C0 4.65673 1.34454 5.99986 2.99987 5.99986C4.39644 5.99986 5.57219 5.0435 5.90552 3.74955H11.6014V4.49917C11.6014 4.91546 11.9361 5.2488 12.351 5.2488H14.2496V7.4991H10.4987C10.0852 7.4991 9.74911 7.83524 9.74911 8.24873V11.9997C9.74911 12.4146 10.0852 12.7493 10.4987 12.7493H11.3928ZM18.7514 8.99835V11.2487H11.251V8.99835H18.7514ZM2.99953 1.4978C3.82792 1.4978 4.50019 2.17009 4.50019 2.99849C4.50019 3.82689 3.82792 4.49917 2.99953 4.49917C2.17115 4.49917 1.49888 3.82689 1.49888 2.99849C1.49888 2.17009 2.17115 1.4978 2.99953 1.4978ZM27.0028 1.4978C27.8312 1.4978 28.5035 2.17009 28.5035 2.99849C28.5035 3.82689 27.8312 4.49917 27.0028 4.49917C26.1744 4.49917 25.5022 3.82689 25.5022 2.99849C25.5022 2.17009 26.1744 1.4978 27.0028 1.4978ZM16.9004 2.24743V3.74811H13.1016V2.24743H16.9004Z" fill-rule="evenodd" clip-rule="evenodd" fill="black"/>
            </svg>
        ` )
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe()
    }

    onLogoClick(): void {
        this.router.navigate( [ ROUTE.HOME ] );
    }

    onSkipClick(): void {
        document.getElementById( 'main-content' )?.focus();
    }

    onMenuItemClick( menuId: string ): void {
        switch ( menuId ) {
            case MENU.HOME: this.router.navigate( [ ROUTE.HOME ] ); break
            case MENU.STATION_SELECTION: this.router.navigate( [ ROUTE.STATION_SELECTION ] ); break
            case MENU.ABOUT_REST: this.router.navigate( [ ROUTE.ABOUT_REST ] ); break
            case MENU.ABOUT_GRAPHQL: this.router.navigate( [ ROUTE.ABOUT_GRAPHQL ] ); break
            case MENU.ABOUT_MCP: this.router.navigate( [ ROUTE.ABOUT_MCP ] ); break
            case MENU.ABOUT_WEATHER_STATIONS: this.router.navigate( [ ROUTE.ABOUT_WEATHER_STATIONS ] ); break
            case MENU.ABOUT_WEATHER_DATA: this.router.navigate( [ ROUTE.ABOUT_WEATHER_DATA ] ); break

            case MENU.DISCLAIMER: this.dialogService.openDisclaimerDialog({}); break
            case MENU.PRIVACY: openExternalLink( 'https://www2.gov.bc.ca/gov/content?id=9E890E16955E4FF4BF3B0E07B4722932' ); break
            case MENU.COPYRIGHT: openExternalLink( 'https://www2.gov.bc.ca/gov/content?id=1AAACC9C65754E4D89A118B875E0FBDA' ); break
            
            default: this.snackbarUtilService.information( menuId + ' is not implmented', 1000 ); break
        }
    }

    onRouteChanged( url: string ) {
        let route
        if ( url.startsWith( '/' ) ) route = url.substring( 1 )
        
        switch ( route ) {
            case ROUTE.HOME: this.currentItemId = MENU.HOME; break
            case ROUTE.STATION_SELECTION: this.currentItemId = MENU.STATION_SELECTION; break
            default: this.currentItemId = undefined
        }

        // console.log( 'Navigated to:', url, this.currentItemId );
    }

    showDisclaimerDialog() {
        if ( !this.applicationStateService.showDisclaimer ) return 

        return this.dialogService.openDisclaimerDialog({}).afterClosed().toPromise()
    }

    @HostListener("window:resize", [])
    onResize() {
        this.updateDisplayMode()
    }

    updateDisplayMode() {
        if ( window.innerWidth < 768 || ( window.innerWidth < 900 && window.innerHeight < 450 ) ) {
            this.configurationService.update( { displayMode: 'mobile' } )
        } 
        else {
            this.configurationService.update( { displayMode: 'desktop' } )
        }
    }
}

function openExternalLink( url: string ) {
    window.open( url, '_blank', 'noopener,noreferrer' )
}

