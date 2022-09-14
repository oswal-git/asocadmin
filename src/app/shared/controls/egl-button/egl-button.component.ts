import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'egl-button',
    templateUrl: './egl-button.component.html',
    styleUrls: ['./egl-button.component.scss'],
})
export class EglButtonComponent implements OnInit, OnChanges {
    @Input() type: string = 'button';
    @Input() title: string = 'botón';
    @Input() icon!: string;
    @Input() class: string = 'success';
    @Input() disabled: boolean = false;

    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges) {
        if (!changes['disabled'].firstChange) {
            console.log(changes['disabled'].currentValue);
        }
    }
}
