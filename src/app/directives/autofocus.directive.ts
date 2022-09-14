import { OnChanges, Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[autofocus]',
})
export class AutofocusDirective implements OnChanges {
    private _name = 'AutofocusDirective';

    @Input('autofocus') onFocus: boolean = false;

    constructor(
        private elementRef: ElementRef // , private viewContainer: ViewContainerRef
    ) {}

    ngOnChanges() {
        // console.log('Componente ' + this._name + ': ngOnChanges: this.onFocus ─> ', this.onFocus);
        // console.log('Componente ' + this._name + ': ngOnChanges: this.elementRef ─> ', this.elementRef.nativeElement);
        // console.log(
        //     'Componente ' + this._name + ': ngOnChanges: this.viewContainer.element.nativeElement.value ─> ',
        //     this.viewContainer.element.nativeElement.value
        // );
        // console.log(
        //     'Componente ' + this._name + ': ngOnChanges: this..querySelector(h2) ─> ',
        //     this.elementRef.querySelector('.component--text-input')
        // );
        if (this.onFocus) {
            console.log('Componente ' + this._name + ': ngOnChanges: this.onFocus in ─> ', this.onFocus);
            setTimeout(() => {
                this.elementRef.nativeElement.focus();
            });
        }
    }

    // ngOnInit(): void {
    // }
}
