import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: 'input,select',
    host: { '(blur)': 'onBlur()' },
})
export class BlurForwarderDirective {
    // private _name = 'BlurForwarderDirective';

    @Input('autofocus') onFocus: boolean = false;

    constructor(private elementRef: ElementRef) {}

    onBlur() {
        var evt = new Event('select-blur', { bubbles: true, cancelable: false });
        document.dispatchEvent(evt);
        // event can be dispatched from any element, not only the document
        this.elementRef.nativeElement.dispatchEvent(evt);
    }
}
