import moment from "moment"
import { Moment } from "moment"

export function formatApiDate( val: Moment|string|undefined ): string|undefined {
    if ( !val ) return

    return moment( val ).toISOString()
} 

export function formatTableDate( val: Moment|string|undefined ): string|undefined {
    if ( !val ) return

    return moment( val ).format( 'MMM d, y' )
} 

export function formatTableTime( val: Moment|string|undefined ): string|undefined {
    if ( !val ) return

    return moment( val ).format( 'HH:mm' )
} 

