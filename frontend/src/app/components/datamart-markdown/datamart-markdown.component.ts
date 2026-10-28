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
            // console.log(tokens)
            const parsed = Parser.parseInline( tokens );

            let text = (tokens[0] as any).text
            // Create a clean slug ID (lowercase, replace non-alphanumeric with dashes)
            const slug = text
                .toLowerCase()
                .trim()
                .replace( /[^a-z0-9\-]/g, '-' )
                .replace( /[-]+/g, '-' )
                .replace( /^[-]|[-]$/g, '' )

            return `<h${ depth } id="${ slug }">${ parsed }</h${ depth }>\n`
        };

        let tableInner = this.markdownService.renderer.table
        this.markdownService.renderer.table = function ( tokens ) {
            let table = tableInner.call( this, tokens )

            let sep = tokens.raw.split( '\n' )[ 1 ]
            let colWidth = sep.split( '|' ).map( s => s.trim().length )
            let total = colWidth.reduce( (a,v) => a+v, 0 )
            let styles = colWidth.map( (w,i) => `--col${ i + 1 }-width: ${ Math.floor(w/total*100) }%;`).join( '' )

            return `<div style="${ styles }">${ table }</div>`
        }

        this.markdownService.renderer.tablerow = function ( tokens ) {
            if ( /@@@/.test( tokens.text ) )
                return ''

            return '<tr>' + tokens.text + '</tr>\n'
        }
    }
}
