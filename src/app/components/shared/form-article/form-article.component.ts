import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-form-article',
    templateUrl: './form-article.component.html',
    styleUrls: ['./form-article.component.scss'],
})
export class FormArticleComponent implements OnInit {
    private _name = 'FormArticleComponent';
    public itemArticle: string = '';

    constructor() {
        setInterval(() => {
            console.log('Componente ' + this._name + ': constructor: itemArticle  ─> ', this.itemArticle);

        }, 2000);
    }

    ngOnInit(): void {}
}
