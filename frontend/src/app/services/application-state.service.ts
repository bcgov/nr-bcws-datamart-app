import { Injectable } from '@angular/core';
import { emptyFilter, Filter } from '../pages/data-download/filters/data-download-filters.component';

@Injectable( {
    providedIn: 'root',
} )
export class ApplicationStateService {
    private _downloadFilterState?: Filter 

    get hasDownloadFilterState() { return !!this._downloadFilterState }

    get downloadFilterState(): Filter { 
        if ( this.hasDownloadFilterState ) 
            return this._downloadFilterState! 

        return emptyFilter()
    }
    
    set downloadFilterState( f: Partial<Filter> ) {
        if ( !this.hasDownloadFilterState ) this._downloadFilterState = emptyFilter()

        if ( f.startDate ) this._downloadFilterState!.startDate = f.startDate
        if ( f.endDate ) this._downloadFilterState!.endDate = f.endDate
        if ( f.dailyColumns ) this._downloadFilterState!.dailyColumns = f.dailyColumns
        if ( f.hourlyColumns ) this._downloadFilterState!.hourlyColumns = f.hourlyColumns
        if ( f.metadataColumns ) this._downloadFilterState!.metadataColumns = f.metadataColumns
    }

    get showDisclaimer(): boolean {
        return localStorage.getItem( 'hideDisclaimer' ) != 'hide'
    }

    set showDisclaimer( val: boolean ) {        
        if ( val ) {
            localStorage.setItem( 'hideDisclaimer', '' )
        }
        else {
            localStorage.setItem( 'hideDisclaimer','hide' )
        }
    }
}