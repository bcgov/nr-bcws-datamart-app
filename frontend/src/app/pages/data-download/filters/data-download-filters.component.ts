import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    Input,
    Output
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonComponent, FilterDateComponent, FilterSearchComponent, FilterSelectComponent, FiltersPanelComponent, IconComponent } from "@bcgov/nr-ngx-component-lib";
import { CodeTableService } from "../../../services/code-table.service";

export type Filter = {
	startDate: string|null
	endDate: string|null
	hourlyColumns: string[]
	dailyColumns: string[]
	metadataColumns: string[]
}

export function emptyFilter(): Filter {
	return {
        startDate: null,
        endDate: null,
        hourlyColumns: [],
        dailyColumns: [],
        metadataColumns: [],
	}
}

export function initialFilter(): Filter {
	return {
        startDate: null,
        endDate: null,
        hourlyColumns: [],
        dailyColumns: [],
        metadataColumns: [],
	}
}

@Component({
    selector: 'data-download-filters',
    templateUrl: './data-download-filters.component.html',
    styleUrl: './data-download-filters.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        IconComponent,
        FilterSearchComponent,
        FiltersPanelComponent,
        FilterSelectComponent,
        FilterDateComponent,
        FormsModule,
        ButtonComponent
    ]
})
export class DataDownloadFiltersComponent {
    codeTableService = inject(CodeTableService)

    @Input() filter: Filter = emptyFilter()
    
	@Output() filterChange = new EventEmitter<Filter>()

	private _filterChangeTimeout: any
    filtersExpanded = false;

    onStartDateChange( ev:any ) {
		this.filter.startDate = ev
		this.emitFilterChange()
	}

    onEndDateChange( ev:any ) {
		this.filter.endDate = ev
		this.emitFilterChange()
	}

    onDailyColumnsChange( ev:any ) {
		this.filter.dailyColumns = ev
		this.emitFilterChange()
	}

    onHourlyColumnsChange( ev:any ) {
		this.filter.hourlyColumns = ev
		this.emitFilterChange()
	}

    onMetadataColumnsChange( ev:any ) {
		this.filter.metadataColumns = ev
		this.emitFilterChange()
	}

   	onClearSearchAndFilters() {
		this.filter = emptyFilter()
		this.emitFilterChange()
	}

	emitFilterChange() {
		if (this._filterChangeTimeout) clearTimeout(this._filterChangeTimeout)

		this._filterChangeTimeout = setTimeout(() => {
			this.filterChange.emit({...this.filter})
		}, 200)
	}
}
