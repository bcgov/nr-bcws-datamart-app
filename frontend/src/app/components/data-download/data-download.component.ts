import { Component } from '@angular/core';


@Component({
    selector: 'app-data-download',
    templateUrl: './data-download.component.html',
    styleUrl: './data-download.component.scss'
})
export class DataDownloadComponent {

    columns = [
        'stationName',
        'stationCode',
        'status'
    ];

    rows = Array.from({ length: 250 }, (_, index) => ({
        stationName: `Weather Station ${index + 1}`,
        stationCode: `${1000 + index}`,
        status: ['ACTIVE', 'TEST', 'PROJECT'][index % 3]
    }));

    pageSize = 25;
    pageNumber = 1;

    onPageNumberChange(page: number): void {
        this.pageNumber = page;
    }

    onPageSizeChange(size: number): void {
        this.pageSize = size;
        this.pageNumber = 1;
    }
}