import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ButtonComponent, DialogBase, DialogComponent } from "@bcgov/nr-ngx-component-lib";

export type DisclaimerDialogConfig = {}

export type DisclaimerDialogResult = 'hide'

@Component({
    selector: "disclaimer-dialog",
    templateUrl: "./disclaimer.dialog.html",
    styleUrl: "./disclaimer.dialog.scss",
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DialogComponent,
        ButtonComponent,
        MatCheckboxModule,
        FormsModule
    ]
})
export class DisclaimerDialogComponent extends DialogBase<DisclaimerDialogConfig,DisclaimerDialogResult> {   
    dontShowAgain = false

    override getResult(): DisclaimerDialogResult {
        if ( this.dontShowAgain ) return 'hide'
        return super.getResult()       
    }
}
