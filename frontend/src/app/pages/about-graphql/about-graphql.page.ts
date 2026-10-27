import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppFooterComponent } from '../../components/app-footer/app-footer.component';
import { DataMartMarkdownComponent } from '../../components/datamart-markdown/datamart-markdown.component';

@Component( {
    selector: 'about-graphql-page',
    templateUrl: './about-graphql.page.html',
    styleUrl: './about-graphql.page.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        DataMartMarkdownComponent,
    ]
} )
export class AboutGraphqlPage {}
