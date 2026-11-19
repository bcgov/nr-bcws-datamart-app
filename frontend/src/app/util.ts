import moment from "moment"
import { Moment } from "moment"

export const GENERIC_FAILURE = "We couldn't complete your request. Please try again later."

// e.g. [ 'weather stations', 'fire zones' ] -> "We couldn't load the weather stations and fire zones. ..."
export function loadFailureMessage( resources: string[] ): string {
    let list = resources.length <= 1
        ? resources.join( '' )
        : resources.slice( 0, -1 ).join( ', ' ) + ' and ' + resources[ resources.length - 1 ]

    return `We couldn't load the ${ list }. Some features may not work. Please try again later.`
}

export function formatApiDate( val: Moment|string|undefined ): string|undefined {
    if ( !val ) return

    return moment( val ).toISOString()
} 

export function formatTableDate( val: Moment|string|undefined ): string|undefined {
    if ( !val ) return

    return moment( val ).format( 'MMM D, y' )
} 

export function formatTableTime( val: Moment|string|undefined ): string|undefined {
    if ( !val ) return

    return moment( val ).format( 'HH:mm' )
} 

export function formatNumber( v: number ): string {
    let sv = String( v )
    let c = Math.floor( (sv.length - 1) / 3 )         
    for ( let i = c; i > 0; i -= 1 ) {
        let st = sv.length - i * 3 
        sv = sv.substring( 0, st ) + ',' + sv.substring( st )
    }
    return sv
}
