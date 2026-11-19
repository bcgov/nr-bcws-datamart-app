import { inject, Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

// The app scrolls inside <main> rather than the window, so the browser's own scroll
// restoration doesn't apply. This remembers <main>'s scroll position for each history
// entry and restores it when the user goes back or forward.
@Injectable( {
    providedIn: 'root',
} )
export class ScrollRestorationService {
    router = inject( Router )

    private positions = new Map<number, number>()
    private currentIds: number[] = []
    private restoreId?: number

    static get container(): HTMLElement | null {
        return document.querySelector( 'nrcl-application > main' )
    }

    initialize() {
        this.router.events.subscribe( ev => {
            if ( ev instanceof NavigationStart ) {
                // remember where the page being left was scrolled to
                let top = ScrollRestorationService.container?.scrollTop ?? 0
                this.currentIds.forEach( id => this.positions.set( id, top ) )

                this.restoreId = ev.navigationTrigger == 'popstate' ? ev.restoredState?.navigationId : undefined
            }
            else if ( ev instanceof NavigationEnd ) {
                // when a back/forward navigation completes, the router rewrites that history entry's
                // state with the new navigation id, so the entry may later be restored under either id
                this.currentIds = this.restoreId != null ? [ ev.id, this.restoreId ] : [ ev.id ]

                if ( this.restoreId != null && this.positions.has( this.restoreId ) )
                    this.restore( this.positions.get( this.restoreId )! )
            }
        } )
    }

    // the page may still be rendering, so keep trying until it's tall enough to reach the position
    private restore( top: number, attempts = 30 ) {
        requestAnimationFrame( () => {
            let main = ScrollRestorationService.container
            if ( !main ) return

            main.scrollTo( 0, top )

            if ( main.scrollTop < top - 1 && attempts > 0 ) this.restore( top, attempts - 1 )
        } )
    }
}
