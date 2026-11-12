import { JsonPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogBase, DialogComponent, FormFieldComponent, GapComponent } from '@bcgov/nr-ngx-component-lib';

export type DataDownloadAsyncDownloadDialogConfig = {
}
export type DataDownloadAsyncDownloadDialogResult = {
    email: string
}

@Component({
    selector: 'data-download-async-download-dialog',
    templateUrl: './data-download-async-download.dialog.html',
    styleUrl: './data-download-async-download.dialog.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DialogComponent,
        GapComponent,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule
    ]
})
export class DataDownloadAsyncDownloadDialog extends DialogBase<DataDownloadAsyncDownloadDialogConfig,DataDownloadAsyncDownloadDialogResult> {
    email = new FormControl<string>( '', [ Validators.required, Validators.email ] )

    override getResult(): DataDownloadAsyncDownloadDialogResult {
        return {
            email: this.email.value!
        }
    }

    override get saveEnabled() {
        return this.email.valid 
    }
}