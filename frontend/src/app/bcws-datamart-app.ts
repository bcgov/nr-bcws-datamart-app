import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ApplicationComponent, ApplicationHeaderComponent, ApplicationMenuComponent, SnackbarUtilService } from '@bcgov/nr-ngx-component-lib';
import { filter, Subscription } from 'rxjs';
import { ROUTE } from './bcws-datamart-app.routes';

const MENU = {
    HOME: 'home',
    STATION_SELECTION: 'station-selection',
    LIST: 'list',
    GRAPH: 'graph',
    SERVER: 'server',
    DATA: 'data',
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
            label: 'Station Selection',
            icon: 'get_app',
        },
        {
            id: MENU.LIST,
            label: 'Weather Station List',
            icon: 'format_list_bulleted',
        },
        {
            id: MENU.GRAPH,
            label: 'Graph QL and API',
            icon: 'control_camera',
        },
        {
            id: MENU.SERVER,
            label: 'MCP Server',
            icon: 'mcp-server',
        },
        {
            id: MENU.DATA,
            label: 'Data Information',
            icon: 'info;{"fill":false}',
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
        this.routeSubscription = this.router.events
            .pipe(
                filter( event => event instanceof NavigationEnd )
            )
            .subscribe( ( event: NavigationEnd ) => {
                this.onRouteChanged( event.urlAfterRedirects )
            } )
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
            case MENU.DISCLAIMER: openExternalLink( 'https://www2.gov.bc.ca/gov/content?id=79F93E018712422FBC8E674A67A70535' ); break
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
}

function openExternalLink( url: string ) {
    window.open( url, '_blank', 'noopener,noreferrer' )
}

