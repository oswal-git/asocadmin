import { Component, forwardRef, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
    public htmlData: string = '';

    form!: UntypedFormGroup;

    // private onTouchfn: Function;
    // private onChangefn!: Function;

    // interface ControlValueAccessor - start
    writeValue(obj: any): void {
        console.log('Componente ' + this._name + ': changeHtml: obj ─> ', obj);
    }
    registerOnChange(_fn: any): void {
        // this.onChangefn = fn;
    }
    registerOnTouched(_fn: any): void {}
    // interface ControlValueAccessor - fin

    constructor(private _formBuilder: UntypedFormBuilder, private toastr: ToastrService) {
        this.buildForm();
    }

    ngOnInit(): void {}

    buildForm() {
        this.form = this._formBuilder.group({
            title: ['', [Validators.required, Validators.minLength(4)]],
            // category: ['', [Validators.required]],
            // subcategory: ['', [Validators.required]],
            // class: ['', [Validators.required]],
            abstract: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
            text: ['', [Validators.minLength(4), Validators.maxLength(500)]],
            stock: [10, [Validators.required, Validators.min(5)]],
        });
    }

    save() {
        if (this.form.valid) {
            console.log('Componente ' + this._name + ': save: this.form.value ─> ', this.form.value);
        } else {
            this.form.markAllAsTouched;
            this.toastr.error('Fields are required', 'Fill fields, please', {
                timeOut: 3000,
            });
        }
    }

    get titleField(): AbstractControl {
        return this.form.get('title')!;
    }

    get abstractField(): AbstractControl {
        return this.form.get('abstract')!;
    }

    get textField(): AbstractControl {
        return this.form.get('text')!;
    }

    get stockField(): AbstractControl {
        return this.form.get('stock')!;
    }
}
