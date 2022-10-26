import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from '@app/services/bd/articles.service';
import { environment } from '@env/environment';

@Component({
    selector: 'app-preview-article',
    templateUrl: './preview-article.component.html',
    styleUrls: ['./preview-article.component.scss'],
})
export class PreviewArticleComponent implements OnInit {
    private _name = 'PreviewArticleComponent';
    public article!: any;

    articleUrlDefault = environment.urlApi + '/assets/images/images.jpg';
    articleSrcDefault = environment.urlApi + '/assets/images/images.jpg';

    date = new Date();
    currentDate = this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + ('00' + this.date.getDate()).slice(-2);

    loading = false;

    constructor(private _articlesService: ArticlesService, private _activatedRoute: ActivatedRoute) {
        console.log('Componente ' + this._name + ': constructor: queryParamMap ─> ', this._activatedRoute.snapshot.queryParamMap);
    }

    ngOnInit(): void {
        console.log(
            'Componente ' + this._name + ': ngOnInit: this._articlesService.articlePreview ─> ',
            this._articlesService.getSessionArticlePreview()
        );
        // const article = this._activatedRoute.snapshot.queryParamMap.get('state');
        const article = this._articlesService.getSessionArticlePreview();
        console.log('Componente ' + this._name + ': ngOnInit: article ─> ', article);
        if (article) {
            // this.article = JSON.parse(article);
            this.article = article;
        }
        console.log('Componente ' + this._name + ': ngOnInit: this.article ─> ', this.article);
    }
}
