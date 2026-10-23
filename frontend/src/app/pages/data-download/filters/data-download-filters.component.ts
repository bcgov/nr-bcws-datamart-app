import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    Input,
    Output
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DATE_FORMATS, FilterDateComponent, FilterSelectComponent, FiltersPanelComponent } from "@bcgov/nr-ngx-component-lib";
import moment from "moment";
import { CodeTableService } from "../../../services/code-table.service";

export type Filter = {
	startDate: string|undefined
	endDate: string|undefined
	hourlyColumns: string[]
	dailyColumns: string[]
	metadataColumns: string[]
}

export function emptyFilter(): Filter {
	return {
        startDate: undefined,
        endDate: undefined,
        hourlyColumns: [],
        dailyColumns: [],
        metadataColumns: [],
	}
}

export function initialFilter( dailyColumns: string[] ): Filter {
    let e = moment(), s = e.clone().subtract( 1, 'day' )
	return {
        startDate: s.format( DATE_FORMATS.datePickerInput ),
        endDate: e.format( DATE_FORMATS.datePickerInput ),
        hourlyColumns: [],
        dailyColumns: dailyColumns,
        metadataColumns: [],
	}
}

@Component({
    selector: 'data-download-filters',
    templateUrl: './data-download-filters.component.html',
    styleUrl: './data-download-filters.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FiltersPanelComponent,
        FilterSelectComponent,
        FilterDateComponent,
        FormsModule,
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

    get endDateLess1() {
        return moment( this.filter.endDate ).subtract( 1, 'day' ).format( DATE_FORMATS.datePickerInput )
    }

    get startDatePlus1() {
        return moment( this.filter.startDate ).add( 1, 'day' ).format( DATE_FORMATS.datePickerInput )
    }
}
