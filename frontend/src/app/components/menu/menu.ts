import { Component, input } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class MenuComponent {
  readonly open = input(false);
}