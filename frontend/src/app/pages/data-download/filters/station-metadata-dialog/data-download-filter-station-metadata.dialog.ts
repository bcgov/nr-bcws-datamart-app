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

export type DataDownloadFilterStationMetadataDialogConfig = {
    columns: string[]
}
export type DataDownloadFilterStationMetadataDialogResult = {
    columns: string[]
}

@Component({
    selector: 'data-download-filter-station-metadata-dialog',
    templateUrl: './data-download-filter-station-metadata.dialog.html',
    styleUrl: './data-download-filter-station-metadata.dialog.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DialogComponent,
        ButtonComponent,
        GapComponent,
        MatCheckboxModule,
        DataDownloadFilterCheckBoxesComponent
    ]
})
export class DataDownloadFilterStationMetadataDialog extends DialogBase<DataDownloadFilterStationMetadataDialogConfig,DataDownloadFilterStationMetadataDialogResult> {
    codeTableService = inject( CodeTableService )

    metadata: string[] = []

    override ngOnInit(): void {
        super.ngOnInit()
        
        this.metadata = this.config.columns.filter( c => this.codeTableService.STATIONS_METADATA_COLUMNS.forCode( c ) )
    }

    onMetadataChange( ev: string[] ) {
        this.metadata = ev
    }

    override getResult(): DataDownloadFilterStationMetadataDialogResult {
        return {
            columns: [ ...this.metadata ]
        }
    }
}