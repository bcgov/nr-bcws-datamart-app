import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit
} from '@angular/core';
import { Parser } from 'marked';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';

@Component( {
    selector: 'datamart-markdown',
    templateUrl: './datamart-markdown.component.html',
    styleUrl: './datamart-markdown.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MarkdownComponent
    ]
} )
export class DataMartMarkdownComponent implements OnInit {
    markdownService = inject( MarkdownService )

    ngOnInit(): void {
        this.markdownService.renderer.heading = ( { tokens, depth } ) => {
            const text = Parser.parseInline( tokens );

            // Create a clean slug ID (lowercase, replace non-alphanumeric with dashes)
            const slugId = text
                .toLowerCase()
                .trim()
                .replace( /[^\w\s\-]/g, '' ) // Remove special characters
                .replace( /\s+/g, '-' );     // Replace spaces with dashes

            return `<h${ depth } id="${ slugId }">${ text }</h${ depth }>\n`
        };
    }
}
