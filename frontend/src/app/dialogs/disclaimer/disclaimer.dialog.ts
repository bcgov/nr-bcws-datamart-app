import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ButtonComponent, DialogBase, DialogComponent } from "@bcgov/nr-ngx-component-lib";
import { ApplicationStateService } from "../../services/application-state.service";

export type DisclaimerDialogConfig = {}

export type DisclaimerDialogResult = void

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
    applicationStateService = inject( ApplicationStateService )

    dontShowAgain = !this.applicationStateService.showDisclaimer

    override onSaveClick(): void {
        this.applicationStateService.showDisclaimer = !this.dontShowAgain
        super.onSaveClick()
    }
}
