import { forwardRef, Input, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
// import * as customBuild from '../../../build/ckeditor';
import * as customBuild from '@app/ckCustomBuildEditor/build/ckEditor';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EditorComponent),
            multi: true,
        },
    ],
})
export class EditorComponent implements OnInit, ControlValueAccessor {
    private _name = 'EditorComponent';

    @Input() readOnly: boolean = false;
    @Input('title') title: string = 'Editor';
    @Input() config: any = {
        toolbar: {
            items: [
                'heading',
                '|',
                'undo',
                'redo',
                '|',
                'fontfamily',
                'fontsize',
                'alignment',
                'fontColor',
                'fontBackgroundColor',
                '|',
                'bold',
                'italic',
                // 'strikethrough',
                'underline',
                'subscript',
                'superscript',
                '|',
                'link',
                '|',
                'outdent',
                'indent',
                '|',
                'todoList',
                // '|',
                // 'code',
                // 'codeBlock',
                '|',
                'imageUpload',
            ],
            shouldNotGroupWhenFull: true,
        },
        image: {
            resizeUnit: 'px',
            styles: ['alignLeft', 'alignCenter', 'alignRight'],
            resizeOptions: [
                {
                    name: 'resizeImage:original',
                    value: null,
                    label: 'Original',
                },
                {
                    name: 'resizeImage:100',
                    value: '100',
                    label: '100px',
                },
                {
                    name: 'resizeImage:200',
                    value: '200',
                    label: '200px',
                },
                {
                    name: 'resizeImage:300',
                    value: '300',
                    label: '300px',
                },
                {
                    name: 'resizeImage:400',
                    value: '400',
                    label: '400px',
                },
            ],
            toolbar: [
                'imageStyle:alignLeft',
                'imageStyle:alignCenter',
                'imageStyle:alignRight',
                '|',
                'resizeImage',
                '|',
                'toggleImageCaption',
                '|',
                'imageTextAlternative',
            ],
        },
        // This value must be kept in sync with the language defined in webpack.config.js.
        language: 'es',
    };
    @ViewChild( 'editor' ) editorComponent!: CKEditorComponent;

    public Editor = customBuild;

    private _value!: string;

    get value() {
        return this._value;
    }

    set value(v: string) {
        if (v !== this._value) {
            this._value = v;
            // this.onChange(v);
        }
    }

    constructor() {}

    writeValue(obj: any): void {
        console.log('Componente ' + this._name + ': writeValue: obj ─> ', obj);
        this.value = obj;
    }
    registerOnChange(fn: any): void {
        console.log('Componente ' + this._name + ': registerOnChange: fn ─> ', fn);
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        console.log('Componente ' + this._name + ': registerOnTouched: fn ─> ', fn);
        this.onTouch = fn;
    }

    ngOnInit(): void {
        this.value = '<p>Hello, guys</p>';
    }

    onReady(editor: any) {
        console.log('Componente ' + this._name + ': onReady:' + editor.id + ' editor ─> ' );
        this.title = this.title + ': ' + editor.id
        console.log('Componente ' + this._name + ': onReady:' + editor.id + ' editor ─> ', editor);
        console.log('Componente ' + this._name + ': onReady:' + editor.id + ' editor.model.schema:', editor.model.schema);
        if (editor.model.schema.isRegistered('image')) {
            console.log('Componente ' + this._name + ': onReady:' + editor.id + ' isRegistered("image") ─> ' );
            editor.model.schema.extend('image', { allowAttributes: 'blockindent' });
        }

        if (this.readOnly) {
            console.log('Componente ' + this._name + ': onReady:' + editor.id + ' editor.ui.view.toolbar.items ─> ', editor.ui.view.toolbar.items);
            console.log('Componente ' + this._name + ': onReady:' + editor.id + ' editor.ui.view.toolbar.items.get(0) ─> ', editor.ui.view.toolbar.items.get(0));
            console.log('Componente ' + this._name + ': onReady:' + editor.id + ' editor.ui.view.toolbar.items.get(0).isEnabled ─> ', editor.ui.view.toolbar.items.get(0).isEnabled);
            editor.ui.view.toolbar.items.get(0).isEnabled = false;

        }

        console.log('Componente ' + this._name + ': onReady:' + editor.id + ' editor.ui.getEditableElement() ─> ', editor.ui.getEditableElement());
        console.log('Componente ' + this._name + ': onReady:' + editor.id + ' editor.ui.getEditableElement().parentElement ─> ', editor.ui.getEditableElement().parentElement);
        console.log('Componente ' + this._name + ': onReady:' + editor.id + ' editor.ui.view.toolbar.element ─> ', editor.ui.view.toolbar.element);

        // editor.ui.getEditableElement().parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
    }

    onChange() {
        // console.log('v:', v);
    }

    onTouch() {
        // console.log('v:', v);
    }
}
