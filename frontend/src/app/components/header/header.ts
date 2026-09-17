import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  menuOpen = false;
  title = 'Wildfire DataMart'
  homeUrl = '/'
  skipLinksEnabled = true
  skipLinkTarget = 'main-content'
  skipLinkLabel = 'Skip to main content'
  showMenu = false
  menuTitle = "-"

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  navigateHome(event: KeyboardEvent): void {
    event.preventDefault();
    this.router.navigate(['/']);
  }
  
}