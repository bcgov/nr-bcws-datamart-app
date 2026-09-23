import { AfterViewInit, Component } from '@angular/core';

declare const SMK: any;

@Component({
    selector: 'app-station-selection-map',
    templateUrl: './station-selection-map.component.html',
    styleUrl: './station-selection-map.component.scss'
})

export class StationSelectionMapComponent implements AfterViewInit {

    async ngAfterViewInit(): Promise<void> {

        await SMK.INIT({
            containerSel: '#station-map',
            config: [
                './assets/smk/station-selection-config.json',
                '?'
            ]
        });

    }

}