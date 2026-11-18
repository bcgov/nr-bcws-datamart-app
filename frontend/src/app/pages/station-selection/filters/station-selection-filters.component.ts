import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonComponent, FilterContainerComponent, FilterSearchComponent, FilterSelectComponent, FiltersPanelComponent, IconComponent } from "@bcgov/nr-ngx-component-lib";
import { WeatherStationService } from "../../../services/weather-station.service";
import { CodeDescription, CodeTableService } from "../../../services/code-table.service";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

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
        stationStatus: ['ACTIVE'],
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
        stationStatus: ['ACTIVE'],
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
        FilterSearchComponent,
        FiltersPanelComponent,
        FilterSelectComponent,
        FilterContainerComponent,
        FormsModule,
        ButtonComponent,
        MatInputModule,
        MatFormFieldModule,
    ]
})
export class StationSelectionFiltersComponent implements OnInit {
	codeTableService = inject(CodeTableService)
    weatherStationService = inject(WeatherStationService)
    changeDetectorRef = inject(ChangeDetectorRef)

    @Input() filter: Filter = emptyFilter()
	@Output() filterChange = new EventEmitter<Filter>()

	private _filterChangeTimeout: any
    filtersExpanded = false;

    fireZoneOptions?: CodeDescription[]

    ngOnInit(): void {
        this.codeTableService.FIRE_ZONES.isLoading
            .then( () => {
            	this.fireZoneOptions = this.codeTableService.FIRE_ZONES.items!
                this.changeDetectorRef.detectChanges()
            } )
    }

    onSearchTextChange( ev: any ) {
		this.filter.search = ev
		this.emitFilterChange()
	}

    onFireCentreChange( ev: any ) {
		this.filter.fireCentre = ev
		this.emitFilterChange()
        this.fireZoneOptions = this.codeTableService.zonesForCentres( this.filter.fireCentre )
        this.changeDetectorRef.detectChanges()
    }

    onFireZoneChange( ev: any ) {
		this.filter.fireZone = ev
		this.emitFilterChange()
    }

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

	onClearFilters() {
		this.filter = emptyFilter()
        this.fireZoneOptions = this.codeTableService.zonesForCentres( [] )
		this.emitFilterChange()
	}

	emitFilterChange() {
		if (this._filterChangeTimeout) clearTimeout(this._filterChangeTimeout)

		this._filterChangeTimeout = setTimeout(() => {
			this.filterChange.emit({...this.filter})
		}, 200)

        this.weatherStationService.filterStations( this.filter )
	}

    onFiltersClick(): void {
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
