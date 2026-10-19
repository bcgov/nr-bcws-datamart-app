import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ButtonComponent, DialogBase, DialogComponent } from "@bcgov/nr-ngx-component-lib";

export type MessageDialogConfig = {
    title: string
    message: string
}

export type MessageDialogResult = void

@Component({
    selector: "message-dialog",
    templateUrl: "./message.dialog.html",
    styleUrl: "./message.dialog.scss",
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DialogComponent,
        ButtonComponent,
    ]
})
export class MessageDialog extends DialogBase<MessageDialogConfig,MessageDialogResult> {}
