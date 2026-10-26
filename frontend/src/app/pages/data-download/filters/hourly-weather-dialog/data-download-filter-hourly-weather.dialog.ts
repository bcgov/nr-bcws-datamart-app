import {
    ChangeDetectionStrategy,
    Component,
    inject
} from '@angular/core';
import { ButtonComponent, DialogBase, DialogComponent, GapComponent } from '@bcgov/nr-ngx-component-lib';
import { CollapsibleSectionComponent } from '../../../../components/collapsible-section/collapsible-section.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DataDownloadFilterCheckBoxesComponent } from '../filter-checkboxes/data-download-filter-checkboxes.component';
import { CodeTableService } from '../../../../services/code-table.service';

export type DataDownloadFilterHourlyWeatherDialogConfig = {
    columns: string[]
}
export type DataDownloadFilterHourlyWeatherDialogResult = {
    columns: string[]
}

@Component({
    selector: 'data-download-filter-hourly-weather-dialog',
    templateUrl: './data-download-filter-hourly-weather.dialog.html',
    styleUrl: './data-download-filter-hourly-weather.dialog.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DialogComponent,
        ButtonComponent,
        GapComponent,
        MatCheckboxModule,
        DataDownloadFilterCheckBoxesComponent
    ]
})
export class DataDownloadFilterHourlyWeatherDialog extends DialogBase<DataDownloadFilterHourlyWeatherDialogConfig,DataDownloadFilterHourlyWeatherDialogResult> {
    codeTableService = inject( CodeTableService )

    observations: string[] = []
    calculations: string[] = []
    additionals: string[] = []

    override ngOnInit(): void {
        super.ngOnInit()
        
        this.observations = this.config.columns.filter( c => this.codeTableService.HOURLY_WEATHER_OBSERVATIONS_COLUMNS.forCode( c ) )
        this.calculations = this.config.columns.filter( c => this.codeTableService.HOURLY_WEATHER_CALCULATIONS_COLUMNS.forCode( c ) )
        this.additionals = this.config.columns.filter( c => this.codeTableService.HOURLY_WEATHER_ADDITIONAL_COLUMNS.forCode( c ) )
    }

    onObservationsChange( ev: string[] ) {
        this.observations = ev
    }

    onCalculationsChange( ev: string[] ) {
        this.calculations = ev
    }

    onAdditionalsChange( ev: string[] ) {
        this.additionals = ev
    }

    override getResult(): DataDownloadFilterHourlyWeatherDialogResult {
        return {
            columns: [ ...this.observations, ...this.calculations, ...this.additionals ]
        }
    }
}