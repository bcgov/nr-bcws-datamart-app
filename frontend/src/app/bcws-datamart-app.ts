import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApplicationComponent, ApplicationHeaderComponent, ApplicationMenuComponent, SnackbarUtilService } from '@bcgov/nr-ngx-component-lib';

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
export class BcwsDatamartApp {
    router = inject( Router )
    snackbarUtilService = inject( SnackbarUtilService )

    title = 'Wildfire DataMart';
    logoAriaLabel = 'BC Wildfire Service logo';
    skipLabel = 'Skip to main content';

    menuItems = [
        {
            id: 'home',
            label: 'Home',
            icon: 'home-outline',
        },
        {
            id: 'download',
            label: 'Station Selection',
            icon: 'get_app',
        },
        {
            id: 'list',
            label: 'Weather Station List',
            icon: 'format_list_bulleted',
        },
        {
            id: 'graph',
            label: 'Graph QL and API',
            icon: 'control_camera',
        },
        {
            id: 'server',
            label: 'MCP Server',
            icon: 'mcp-server',
        },
        {
            id: 'data',
            label: 'Data Information',
            icon: 'info',
        },
        {
            id: 'disclaimer',
            label: 'Disclaimer',
        },
        {
            id: 'privacy',
            label: 'Privacy',
        },
        {
            id: 'copyright',
            label: 'Copyright',
        },
    ];

    onLogoClick(): void {
        this.router.navigate( [ '/' ] );
    }

    onSkipClick(): void {
        document.getElementById( 'main-content' )?.focus();
    }

    onMenuItemClick( menuId: string ): void {
        switch ( menuId ) {
            case 'home':        this.router.navigate( [ '/' ] ); break
            case 'download':    this.router.navigate( [ '/station-selection' ] ); break
            case 'list':        this.snackbarUtilService.information( 'Unimplmented', 1000 ); break
            case 'graph':       this.snackbarUtilService.information( 'Unimplmented', 1000 ); break
            case 'server':      this.snackbarUtilService.information( 'Unimplmented', 1000 ); break
            case 'data':        this.snackbarUtilService.information( 'Unimplmented', 1000 ); break
            case 'disclaimer':  openExternalLink( 'https://www2.gov.bc.ca/gov/content?id=79F93E018712422FBC8E674A67A70535' ); break
            case 'privacy':     openExternalLink( 'https://www2.gov.bc.ca/gov/content?id=9E890E16955E4FF4BF3B0E07B4722932' ); break
            case 'copyright':   openExternalLink( 'https://www2.gov.bc.ca/gov/content?id=1AAACC9C65754E4D89A118B875E0FBDA' ); break
        }
    }

}

function openExternalLink( url: string ) {
    window.open( url, '_blank', 'noopener,noreferrer' )
}

