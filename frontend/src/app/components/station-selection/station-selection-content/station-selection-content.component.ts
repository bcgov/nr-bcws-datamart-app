import { Component } from '@angular/core';

@Component({
  selector: 'app-station-selection-content',
  templateUrl: './station-selection-content.component.html',
  styleUrl: './station-selection-content.component.scss'
})
export class StationSelectionContentComponent {

  activeMobileTab: 'list' | 'map' = 'list';


}