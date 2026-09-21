import { Component, Input } from '@angular/core';

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
}