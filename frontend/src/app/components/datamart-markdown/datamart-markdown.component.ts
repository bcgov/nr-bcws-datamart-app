import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    inject,
    OnInit,
    Pipe,
    PipeTransform
} from '@angular/core';
import { Router } from '@angular/router';
import { Parser } from 'marked';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';
import { ScrollRestorationService } from '../../services/scroll-restoration.service';

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
    router = inject( Router )

    // Markdown links render as plain <a href>, which makes the browser reload the whole app.
    // Route links to other pages in this app through the router instead.
    @HostListener( 'click', [ '$event' ] )
    onClick( ev: MouseEvent ) {
        // leave modified clicks (new tab/window, etc.) to the browser
        if ( ev.defaultPrevented || ev.button != 0 || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey ) return

        let anchor = ( ev.target as HTMLElement ).closest( 'a' )
        if ( !anchor || !anchor.href || anchor.hasAttribute( 'download' ) ) return
        if ( anchor.target && anchor.target != '_self' ) return

        let url = new URL( anchor.href )
        let base = new URL( document.baseURI )
        if ( url.origin != location.origin || !url.pathname.startsWith( base.pathname ) ) return

        ev.preventDefault()

        // same-page anchor links (e.g. "On this page") go through the router too, so they get
        // a history entry whose scroll position can be restored with the back button
        let appUrl = '/' + url.pathname.substring( base.pathname.length ) + url.search
        let fragment = decodeURIComponent( url.hash.substring( 1 ) )

        this.router.navigateByUrl( appUrl + url.hash )
            .then( navigated => {
                if ( navigated === false ) return

                // the app scrolls inside <main>, which keeps its position across routes, so reset it
                // like a fresh page load would: to the linked heading, or to the top
                setTimeout( () => {
                    let target = fragment ? document.getElementById( fragment ) : null
                    if ( target ) {
                        target.scrollIntoView()
                    }
                    else {
                        ScrollRestorationService.container?.scrollTo( 0, 0 )
                    }
                } )
            } )
    }

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


@Pipe({
    name: 'indent'
})
export class IndentPipe implements PipeTransform {
    transform( value: string, ...args: any[] ): string {
        return value.split( '\n' ).map( v => `    ${ v }` ).join( '\n' )
    }
}
