import {
  Component,
  ViewChild,
  TemplateRef,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-no-stations-selected-dialog',
  templateUrl: './no-stations-selected-dialog.component.html',
  styleUrl: './no-stations-selected-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class NoStationsSelectedDialogComponent {
  @ViewChild('content', { static: true })
  content!: TemplateRef<unknown>;
}