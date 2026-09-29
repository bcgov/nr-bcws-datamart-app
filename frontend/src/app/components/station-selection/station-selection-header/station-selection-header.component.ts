import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Router } from '@angular/router';

import { DialogService } from '@bcgov/nr-ngx-component-lib';

import { SelectedStationsService } from '../../../services/selected-stations.service';
import { NoStationsSelectedDialogComponent } from '../no-stations-selected-dialog/no-stations-selected-dialog.component';

@Component({
  selector: 'app-station-selection-header',
  templateUrl: './station-selection-header.component.html',
  styleUrl: './station-selection-header.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class StationSelectionHeaderComponent implements OnInit {
  @ViewChild(NoStationsSelectedDialogComponent)
  noStationsSelectedDialog!: NoStationsSelectedDialogComponent;

  selectedCount = 0;

  constructor(
    private readonly selectedStationsService: SelectedStationsService,
    private readonly dialogService: DialogService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.selectedStationsService.selectedStations$.subscribe(
      (stations) => (this.selectedCount = stations.length),
    );
  }

  viewData(): void {
    if (this.selectedCount === 0) {
      this.dialogService.openConfirmDialog(
      {
        title: 'Select a Weather Station',
        saveLabel: 'OK',
        template: this.noStationsSelectedDialog.content,
      },
      {
        disableClose: false,
        panelClass: ['no-stations-selected-dialog'],
      },
    );

      return;
    }

    this.router.navigate(['/data-download']);
  }
}