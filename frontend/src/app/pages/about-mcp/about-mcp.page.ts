import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataMartMarkdownComponent } from '../../components/datamart-markdown/datamart-markdown.component';

@Component( {
    selector: 'about-mcp-page',
    templateUrl: './about-mcp.page.html',
    styleUrl: './about-mcp.page.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DataMartMarkdownComponent,
    ]
} )
export class AboutMcpPage {}
