import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface ISelectValues {
    url?: string;
    caption: string;
    id: number;
}
@Component({
    selector: 'egl-select',
    templateUrl: './egl-select.component.html',
    styleUrls: ['./egl-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EglSelectComponent),
            multi: true,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EglSelectComponent implements OnInit, ControlValueAccessor {
    // private _name = 'EglSelectComponent';

    @Input() type: 'id' | 'txt' = 'txt';
    @Input() label: string = 'Selector';
    listValues: ISelectValues[] = [];
    @Input() set valores(value: ISelectValues[]) {
        this.listValues = value;
        this.onChangeOptions();
    }
    @Input('placeholder') placeHolder: string = 'Selecciona una opción';
    @Input('showthumbnails') showThumbnails: boolean = false;
    @Input('imgdefault') imgDefault: string = '';
    @Input('imgctrl') imgCtrl: string = '';
    @Input('isvalid') isValid: boolean = false;
    @Input('isinvalid') isInvalid: boolean = false;
    @Input('disabled') isDisabled: boolean = false;
    // @Input('isDisabled') isDisabled: boolean = false;

    onChangefn = (_: any) => {};
    onTouchfn = () => {};
    // isDisabled!: boolean;

    icon: 'chevron' = 'chevron';

    imgSelect: string = '';

    selectedText: boolean = false;
    selectId!: number; // model
    selectText!: string; // model
    selectImg!: string; // model
    expandValues: boolean = false;

    lngTextSelected: number = 0;

    typeofUrl: any;

    constructor() {}

    onBlur(_event: Event) {
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : onBlur:  ─> ', event);
        this.expandValues = false;
    }

    writeValue(value: any): void {
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : writeValue: value  ─> ', value);
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : writeValue: this.listValues  ─> ', this.listValues);
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : writeValue: this.imgCtrl  ─> ', this.imgCtrl);
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : writeValue: this.selectImg  ─> ', this.selectImg);
        if (this.showThumbnails) this.selectImg = this.imgCtrl;
        if (value) {
            if (this.type === 'txt') {
                this.selectText = value;
                this.getTxtSelect();
            } else {
                this.selectId = value;
                this.getIdSelect();
            }

            this.lngTextSelected = this.selectText.length;
            this.selectedText = true;
            if (this.showThumbnails) this.imgSelect = this.selectImg;
            this.isValid = true;
            this.onTouchfn();
        }
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : writeValue: this.typeofUrl  ─> ', this.typeofUrl);
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : writeValue: this.selectImg  ─> ', this.selectImg);
    }
    registerOnChange(fn: any): void {
        this.onChangefn = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouchfn = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    ngOnInit(): void {
        // this.selectText = this.placeHolder;
        if (this.showThumbnails) this.imgSelect = this.imgCtrl;
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : ngOnInit: this.imgSelect ─> ', this.imgSelect);
    }

    expandOptions(): void {
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : expandOptions: this.expandValues 1   ─> ', this.expandValues);
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : expandOptions: this.selectedText 1   ─> ', this.selectedText);
        if (this.isDisabled) return;
        if (this.expandValues && !this.selectedText) {
            this.isValid = false;
            this.isInvalid = true;
        }
        this.expandValues = !this.expandValues;
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : expandOptions: this.expandValues  2  ─> ', this.expandValues);
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : expandOptions: this.selectedText  2  ─> ', this.selectedText);
    }

    onChangeOptions() {
        this.selectId = 0;
        this.selectText = '';
        this.lngTextSelected = this.selectText.length;
        if (this.showThumbnails) this.imgSelect = this.imgCtrl;
        this.expandValues = false;
        this.selectedText = false;
        this.isValid = false;
        this.isInvalid = false;

        if (this.type === 'txt') {
            this.onChangefn(this.selectText);
        } else {
            this.onChangefn(this.selectId);
        }
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : optionsClick: this.imgCtrl  ─> ', this.imgCtrl);
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : optionsClick: this.selectImg  ─> ', this.selectImg);
    }

    optionsClick(value: any) {
        this.selectId = value.id;
        this.selectText = value.caption;
        this.lngTextSelected = this.selectText.length;
        if (this.showThumbnails) this.imgSelect = value.url !== null && value.url !== '' ? value.url : this.imgCtrl;
        this.expandValues = false;
        this.selectedText = true;
        this.isValid = true;
        this.isInvalid = false;
        this.onTouchfn();
        if (this.type === 'txt') {
            this.onChangefn(this.selectText);
        } else {
            this.onChangefn(this.selectId);
        }
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : optionsClick: this.imgCtrl  ─> ', this.imgCtrl);
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : optionsClick: this.selectImg  ─> ', this.selectImg);
    }

    getIdSelect(): void {
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : getIdSelect: this.selectedText ─> ', this.selectedText);
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : getIdSelect: this.selectText ─> ', this.selectText);
        if (this.selectId) {
            // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : getIdgSelect: this.listValues ─> ', this.listValues);
            // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : getIdgSelect: this.selectId ─> ', this.selectId);
            const val = this.listValues.filter((ele) => ele.id.toString() === this.selectId.toString());
            if (val) {
                // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : getIdgSelect: val ─> ', val);
                this.selectText = val[0].caption;
                if (val[0].url !== null && val[0].url !== '') {
                    this.selectImg + val[0].url;
                } else {
                    this.selectImg + this.imgCtrl;
                }
            } else {
                this.selectText = '';
                this.selectImg = this.imgCtrl;
            }
        } else {
            this.selectText = '';
            this.selectImg = this.imgCtrl;
        }
        this.lngTextSelected = this.selectText.length;
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : getIdSelect: this.imgCtrl  ─> ', this.imgCtrl);
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : getIdSelect: this.selectImg  ─> ', this.selectImg);
    }

    getTxtSelect(): void {
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : getTxtSelect: this.selectedText ─> ', this.selectedText);
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : getTxtSelect: this.selectText ─> ', this.selectText);
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : getTxtSelect: this.listValues ─> ', this.listValues);
        if (this.selectedText) {
            const val: ISelectValues[] = this.listValues.filter((val: ISelectValues) => val.caption === this.selectText);
            if (val) {
                // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : getImgSelect: val ─> ', val);
                this.selectId = val[0].id;
                if (val[0].url !== null && val[0].url !== '') {
                    this.selectImg + val[0].url;
                } else {
                    this.selectImg + this.imgCtrl;
                }
            } else {
                this.selectId = 0;
                this.selectImg + this.imgCtrl;
            }
        } else {
            this.selectId = 0;
            this.selectImg + this.imgCtrl;
        }
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : getTxtSelect: this.imgCtrl  ─> ', this.imgCtrl);
        // console.log('Componente ' + this._name + ' (' + this.showThumbnails + ') : getTxtSelect: this.selectImg  ─> ', this.selectImg);
    }
}
