import { Component } from '@angular/core';

@Component({
  selector: 'app-download-data-filters',
  templateUrl: './download-data-filters.component.html',
  styleUrl: './download-data-filters.component.scss'
})
export class DownloadDataFiltersComponent {

  filtersExpanded = false;

  toggleFilters(): void {
        this.filtersExpanded = !this.filtersExpanded;
    }
}