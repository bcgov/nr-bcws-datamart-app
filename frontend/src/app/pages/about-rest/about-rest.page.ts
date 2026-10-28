import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataMartMarkdownComponent } from '../../components/datamart-markdown/datamart-markdown.component';

@Component( {
    selector: 'about-rest-page',
    templateUrl: './about-rest.page.html',
    styleUrl: './about-rest.page.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DataMartMarkdownComponent,
    ]
} )
export class AboutRestPage {}
