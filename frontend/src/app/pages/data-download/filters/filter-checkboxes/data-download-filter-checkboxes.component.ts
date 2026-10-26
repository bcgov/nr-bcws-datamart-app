import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CodeDescription } from '@bcgov/nr-ngx-component-lib';
import { CollapsibleSectionComponent } from '../../../../components/collapsible-section/collapsible-section.component';

@Component({
    selector: 'data-download-filter-checkboxes',
    templateUrl: './data-download-filter-checkboxes.component.html',
    styleUrl: './data-download-filter-checkboxes.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatCheckboxModule,
        CollapsibleSectionComponent,
        FormsModule,
    ],
    host: {
        '[style.--rows]': 'rowCount'
    }
})
export class DataDownloadFilterCheckBoxesComponent implements OnInit {
    @Input() headerTitle?: string
    @Input() fields?: CodeDescription[]
    @Input() value: string[] = []
    
    @Output() valueChange = new EventEmitter<string[]>()

    rowCount?: number 
    checkbox: { [key:string]: boolean } = {}
    
    ngOnInit(): void {
        this.rowCount = Math.ceil( this.fields!.length / 2 )

        this.checkbox = this.fields!.reduce( (acc,f) => { 
            return { ...acc, [f.code]: this.value.includes( f.code ) } 
        }, {} )
    }

    onCheckboxChange() {
        this.value = this.fields!.reduce<string[]>( ( acc, f ) => {
            if ( !this.checkbox[ f.code ] ) return acc
            return acc.concat( f.code )
        }, [] )

        this.valueChange.emit( this.value )
    }

    onHeaderCheckboxChange( checked: boolean ) {
        this.fields?.forEach( f => this.checkbox[ f.code ] = checked )
        this.onCheckboxChange()
    }

    get allHeaderChecked() {
        return this.fields?.every( f => this.checkbox[ f.code ] )
    }

    get someHeaderChecked() {
        if ( this.allHeaderChecked ) return false
        return this.fields?.some( f => this.checkbox[ f.code ] )
    }
}
