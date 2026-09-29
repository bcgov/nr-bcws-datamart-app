import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-home-card',
  templateUrl: './home-card.component.html',
  styleUrl: './home-card.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HomeCardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() icon = '';
  @Input() route?: string;
  @Input() externalUrl?: string;
}
