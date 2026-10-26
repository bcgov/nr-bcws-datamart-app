import { Component, ChangeDetectionStrategy, Input, booleanAttribute } from '@angular/core';
import { IconComponent } from '@bcgov/nr-ngx-component-lib';

@Component({
    selector: 'collapsible-section',
    templateUrl: './collapsible-section.component.html',
    styleUrl: './collapsible-section.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        IconComponent
    ]
})
export class CollapsibleSectionComponent {
    @Input( { transform: booleanAttribute } ) open = true
}
