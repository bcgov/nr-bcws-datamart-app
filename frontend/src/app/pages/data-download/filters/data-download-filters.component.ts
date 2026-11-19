import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    Input,
    Output
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ConfigurationService, DATE_FORMATS, FilterContainerComponent, FilterDateComponent, FilterSelectComponent, FiltersPanelComponent, IconComponent } from "@bcgov/nr-ngx-component-lib";
import moment from "moment";
import { CodeTableService } from "../../../services/code-table.service";
import { DialogService } from "../../../services/dialog.service";

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

export function initialFilter( init: Partial<Filter> ): Filter {
    let e = moment(), s = e.clone().subtract( 1, 'day' )
	return {
        startDate: s.format( DATE_FORMATS.datePickerInput ),
        endDate: e.format( DATE_FORMATS.datePickerInput ),
        hourlyColumns: [],
        dailyColumns: [],
        metadataColumns: [],
        ...init
	}
}

@Component({
    selector: 'data-download-filters',
    templateUrl: './data-download-filters.component.html',
    styleUrl: './data-download-filters.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FiltersPanelComponent,
        // FilterSelectComponent,
        FilterDateComponent,
        FilterContainerComponent,
        IconComponent,
        FormsModule,
    ]
})
export class DataDownloadFiltersComponent {
    codeTableService = inject(CodeTableService)
    dialogService = inject(DialogService)
    configurationService = inject(ConfigurationService)

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

    onDailyWeatherClick() {
        this.dialogService.openDataDownloadFilterDailyWeatherDialog({
            columns: this.filter.dailyColumns
        }).afterClosed().toPromise()
            .then( res => {
                if ( res == 'cancel' ) return

                this.filter.dailyColumns = res!.columns
		        this.emitFilterChange()
            } )
    }

    get dailyWeatherFieldCount() {
        return this.fieldCount( this.filter.dailyColumns )
    }

    onHourlyWeatherClick() {
        this.dialogService.openDataDownloadFilterHourlyWeatherDialog({
            columns: this.filter.hourlyColumns
        }).afterClosed().toPromise()
            .then( res => {
                if ( res == 'cancel' ) return

                this.filter.hourlyColumns = res!.columns
		        this.emitFilterChange()
            } )
    }

    get hourlyWeatherFieldCount() {
        return this.fieldCount( this.filter.hourlyColumns )
    }

    onStationMetadataClick() {
        this.dialogService.openDataDownloadFilterStationMetadataDialog({
            columns: this.filter.metadataColumns
        }).afterClosed().toPromise()
            .then( res => {
                if ( res == 'cancel' ) return

                this.filter.metadataColumns = res!.columns
		        this.emitFilterChange()
            } )
    }

    get stationMetadataFieldCount() {
        return this.fieldCount( this.filter.metadataColumns )
    }

    get isMobile() {
        return this.configurationService.configuration.displayMode == 'mobile'
    }

    // mobile has less room, so use a shorter month name
    get dateDisplayFormat() {
        return this.isMobile ? 'MMM DD, YYYY' : 'MMMM D, YYYY'
    }

    // mobile has less room, so drop the word "field(s)"
    fieldCount( columns: string[] ): string {
        let n = columns.length

        if ( this.isMobile ) {
            return `${ n } selected`
        }

        return n == 1 ? '1 field selected' : `${ n } fields selected`
    }
}
