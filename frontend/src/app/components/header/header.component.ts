import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {
	private readonly routes: Record<string, string> = {
		home: '/',
		download: '/download-data'
	};

	private readonly externalLinks: Record<string, string> = {
		disclaimer: 'https://www2.gov.bc.ca/gov/content?id=79F93E018712422FBC8E674A67A70535',
		privacy: 'https://www2.gov.bc.ca/gov/content?id=9E890E16955E4FF4BF3B0E07B4722932',
		copyright: 'https://www2.gov.bc.ca/gov/content?id=1AAACC9C65754E4D89A118B875E0FBDA'
	};
  

	skipLabel = 'Skip to main content';
	logoAriaLabel = 'BC Wildfire Service logo';
	title = 'Wildfire DataMart';

	menuItems = [
		{
			id: 'home',
			label: 'Home',
			icon: 'home-outline'
		},
		{
			id: 'download',
			label: 'Station Selection',
			icon: 'get_app'
		},
		{
			id: 'list',
			label: 'Weather Station List',
			icon: 'format_list_bulleted'
		},
		{
			id: 'graph',
			label: 'Graph QL and API',
			icon: 'control_camera'
		},
		{
			id: 'server',
			label: 'MCP Server',
			icon: 'mcp-server'
		},
		{
			id: 'data',
			label: 'Data Information',
			icon: 'info'
		},
		{
			id: 'disclaimer',
			label: 'Disclaimer'
		},
		{
			id: 'privacy',
			label: 'Privacy'
		},
		{
			id: 'copyright',
			label: 'Copyright'
		}
	];

	constructor(private router: Router) {}

	clickLogo(): void {
		this.router.navigate(['/']);
	}

	clickSkip(): void {
		document.getElementById('main-content')?.focus();
	}


	onMenuItemClick(menuId: string): void {
		const route = this.routes[menuId];

		if (route) {
			this.router.navigate([route]);
			return;
		}

		const externalLink = this.externalLinks[menuId];

		if (externalLink) {
			window.open(externalLink, '_blank', 'noopener,noreferrer');
		}
	}

	}