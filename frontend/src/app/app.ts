import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { ApplicationComponent } from '@bcgov/nr-ngx-component-lib';
import { RouterModule } from '@angular/router';

@Component( {
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ApplicationComponent,
        HeaderComponent,
        RouterModule
    ]
} )
export class App { }
