import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'egl-input',
    templateUrl: './egl-input.component.html',
    styleUrls: ['./egl-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EglInputComponent),
            multi: true,
        },
    ],
})
export class EglInputComponent implements ControlValueAccessor {
    // private _name = 'EglInputComponent';

    value!: string;
    onChangefn!: (value: string) => void;
    onTouchfn!: () => void;
    isDisabled!: boolean;

    focus: boolean = false;

    @Input() label!: string;
    @Input() type!: 'text' | 'email' | 'password' | 'tel';
    @Input('maxlength') maxLength: number = 0;
    @Input() placeholder!: string;
    @Input('aria-labelledby') ariaLabelledby?: string;
    @Input() img: string = '/assets/';
    @Input() isValid: boolean | null = false;
    @Input() isInvalid: boolean | null = false;

    imgDefault = '/assets/option1.jpg';

    constructor() {}

    writeValue(obj: any): void {
        this.value = obj;
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
}
