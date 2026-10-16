import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    Input,
    Output
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonComponent, FilterSearchComponent, FilterSelectComponent, FiltersPanelComponent, IconComponent } from "@bcgov/nr-ngx-component-lib";
import { StationDataService } from "../../../services/station-data.service";

export type Filter = {
	search: string
	fireCentre: string[]
	fireZone: string[]
	stationStatus: string[]
	elevation: string[]
    latitude: string[]
	longitude: string[]
}

export function emptyFilter(): Filter {
	return {
		search: '',
        fireCentre: [],
        fireZone: [],
        stationStatus: [],
        elevation: [],
        latitude: [],
		longitude: [],
	}
}

export function initialFilter(): Filter {
	return {
		search: '',
        fireCentre: [],
        fireZone: [],
        stationStatus: [],
        elevation: [],
        latitude: [],
		longitude: [],
	}
}

@Component({
    selector: 'station-selection-filters',
    templateUrl: './station-selection-filters.component.html',
    styleUrl: './station-selection-filters.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        IconComponent,
        FilterSearchComponent,
        FiltersPanelComponent,
        FilterSelectComponent,
        FormsModule,
        ButtonComponent
    ]
})
export class StationSelectionFiltersComponent {
	// codeTableService = inject(CodeTableService)
    stationDataService = inject(StationDataService)

    @Input() filter: Filter = emptyFilter()
	@Output() filterChange = new EventEmitter<Filter>()

	private _filterChangeTimeout: any
    filtersExpanded = false;

	// fireZoneOptions = this.codeTableService.fireZoneWithNotAssigned.items

    onSearchTextChange( ev: any ) {
        if ( !this.filter ) return
		this.filter.search = ev
		this.emitFilterChange()
	}

	// onFireCentreChange(ev) {
	// 	this.filter.fireCentre = ev;

	// 	if (this.filter.fireCentre?.length > 0) {
	// 		this.fireZoneOptions = this.codeTableService.fireZone.forCentre( this.filter.fireCentre[0] )
	// 	} 
    //     else {
	// 		this.fireZoneOptions = this.codeTableService.fireZoneWithNotAssigned.items;
	// 	}

	// 	this.emitFilterChange();
	// }

	// onFireZoneChange(ev) {
	// 	this.filter.fireZone = ev
	// 	this.emitFilterChange()
	// }

	onStationStatusChange( ev:any ) {
		this.filter.stationStatus = ev
		this.emitFilterChange()
	}

	onElevationChange( min: any, max: any ) {
		this.filter.elevation = [ min, max ]
		this.emitFilterChange()
	}
	
	onLatitudeChange( min: any, max: any ) {
		this.filter.latitude = [ min, max ]
		this.emitFilterChange()
	}

	onLongitudeChange( min: any, max: any ) {
		this.filter.longitude = [ min, max ]
		this.emitFilterChange()
	}

	onClearSearchAndFilters() {
		this.filter = emptyFilter()
	    // this.fireZoneOptions = this.codeTableService.fireZoneWithNotAssigned.items;
		this.emitFilterChange()
	}

	emitFilterChange() {
		if (this._filterChangeTimeout) clearTimeout(this._filterChangeTimeout)

		this._filterChangeTimeout = setTimeout(() => {
			this.filterChange.emit({...this.filter})
		}, 200)

        this.stationDataService.filterStations( this.filter )
	}

    toggleFilters(): void {
        this.filtersExpanded = !this.filtersExpanded;
    }

    get activeFilterCount(): number {
        let count = 0;

        if ( this.filter.search?.trim() ) count++;
        if ( this.filter.elevation[0] || this.filter.elevation[1] ) count++;
        if ( this.filter.latitude[0] || this.filter.latitude[1] ) count++;
        if ( this.filter.longitude[0] || this.filter.longitude[1] ) count++;
        if ( this.filter.stationStatus[0] ) count++;

        return count;
    }

    async applyFilters(): Promise<void> {
    }

    get isMobileView(): boolean {
        return window.innerWidth <= 992;
    }

}
