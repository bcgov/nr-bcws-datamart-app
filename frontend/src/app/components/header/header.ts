import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
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
      label: 'Download Data',
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
  }
}