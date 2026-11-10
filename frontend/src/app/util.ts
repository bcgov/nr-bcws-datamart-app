import moment from "moment"
import { Moment } from "moment"

export const GENERIC_FAILURE = "We couldn't complete your request. Please try again later."

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

