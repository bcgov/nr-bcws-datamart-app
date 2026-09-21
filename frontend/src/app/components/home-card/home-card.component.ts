import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-card',
  templateUrl: './home-card.component.html',
  styleUrl: './home-card.component.scss'
})
export class HomeCardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() icon = '';
  @Input() route?: string;
  @Input() externalUrl?: string;

  constructor(private router: Router) {}

  navigate(): void {
    if (this.route) {
      this.router.navigate([this.route]);
      return;
    }

    if (this.externalUrl) {
      window.open(this.externalUrl, '_blank', 'noopener,noreferrer');
    }
  }
}