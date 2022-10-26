import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { environment } from '@env/environment';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { IItemArticle } from '@app/interfaces/api/iapi-articles.metadata';
import { IEglImagen } from '@app/shared/controls';

@Component({
    selector: 'app-form-item-article',
    templateUrl: './form-item-article.component.html',
    styleUrls: ['./form-item-article.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormItemArticleComponent),
            multi: true,
        },
    ],
})
export class FormItemArticleComponent implements OnInit, ControlValueAccessor {
    private _name = 'FormItemArticleComponent';

    @Input('item') item: number = 0;
    id!: string;

    itemArticleModel!: IItemArticle;
    onChangefn!: (value: IItemArticle) => void;
    onTouchfn!: () => void;

    image_item_article!: IEglImagen;
    text_item_article: String = '';

    textItemArticleMinLength: number = 5;

    itemArticleUrlDefault = environment.urlApi + '/assets/images/images.jpg';
    imgReadonly = false;

    faKeyboard = faKeyboard;

    // interface ControlValueAccessor - start
    writeValue(obj: IItemArticle): void {
        console.log('Componente ' + this._name + ': writeValue: obj ─> ', obj);
        this.image_item_article = obj.image_item_article;
        this.text_item_article = obj.text_item_article;
        this.itemArticleModel = obj;
    }
    registerOnChange(fn: any): void {
        this.onChangefn = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouchfn = fn;
    }
    // interface ControlValueAccessor - fin

    constructor() {}

    ngOnInit(): void {
        this.id = 'itemArticleImg' + this.item;
    }

    onChangeImg(event: any) {
        // console.log('Componente ' + this._name + ': onChangeImg: event ─> ', event);
        this.itemArticleModel.image_item_article = event;
        this.onTouchfn();
        this.onChangefn(this.itemArticleModel);
    }
    onChangeText(event: any) {
        // console.log('Componente ' + this._name + ': onChangeText: event ─> ', event);
        this.itemArticleModel.text_item_article = event;
        this.onTouchfn();
        this.onChangefn(this.itemArticleModel);
    }
}
