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

export type DataDownloadFilterDailyWeatherDialogConfig = {
    columns: string[]
}
export type DataDownloadFilterDailyWeatherDialogResult = {
    columns: string[]
}

@Component({
    selector: 'data-download-filter-daily-weather-dialog',
    templateUrl: './data-download-filter-daily-weather.dialog.html',
    styleUrl: './data-download-filter-daily-weather.dialog.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DialogComponent,
        ButtonComponent,
        GapComponent,
        MatCheckboxModule,
        DataDownloadFilterCheckBoxesComponent
    ]
})
export class DataDownloadFilterDailyWeatherDialog extends DialogBase<DataDownloadFilterDailyWeatherDialogConfig,DataDownloadFilterDailyWeatherDialogResult> {
    codeTableService = inject( CodeTableService )

    observations: string[] = []
    calculations: string[] = []

    override ngOnInit(): void {
        super.ngOnInit()
        
        this.observations = this.config.columns.filter( c => this.codeTableService.DAILY_WEATHER_OBSERVATIONS_COLUMNS.forCode( c ) )
        this.calculations = this.config.columns.filter( c => this.codeTableService.DAILY_WEATHER_CALCULATIONS_COLUMNS.forCode( c ) )
    }

    onObservationsChange( ev: string[] ) {
        this.observations = ev
    }

    onCalculationsChange( ev: string[] ) {
        this.calculations = ev
    }

    override getResult(): DataDownloadFilterDailyWeatherDialogResult {
        return {
            columns: [ ...this.observations, ...this.calculations ]
        }
    }
}