import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '@bcgov/nr-ngx-component-lib';

@Component({
  selector: 'app-home-card',
  templateUrl: './home-card.component.html',
  styleUrl: './home-card.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    IconComponent,
    RouterLink
  ]
})
export class HomeCardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() icon = '';
  @Input() route?: string;
  @Input() externalUrl?: string;
}
