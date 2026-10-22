import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DesktopViewDirective, DeviceViewComponent, IconComponent, MobileViewDirective, TabComponent, TabContentDirective, TabGroupComponent, TabLabelDirective } from '@bcgov/nr-ngx-component-lib';
import { StationSelectionContentListComponent } from './list/station-selection-content-list.component';
import { StationSelectionContentMapComponent } from './map/station-selection-content-map.component';

@Component({
    selector: 'station-selection-content',
    templateUrl: './station-selection-content.component.html',
    styleUrl: './station-selection-content.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        StationSelectionContentMapComponent,
        StationSelectionContentListComponent,
        IconComponent,
        DeviceViewComponent,
        DesktopViewDirective,
        MobileViewDirective,
        TabGroupComponent,
        TabComponent,
        TabContentDirective,
        TabLabelDirective,
    ]
})
export class StationSelectionContentComponent {}
