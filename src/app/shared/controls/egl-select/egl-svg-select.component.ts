import { Component, Input } from '@angular/core';

@Component({
    selector: 'egl-svg-select',
    template: `
        <svg id="chevron" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" *ngIf="icon === 'chevron'">
            <path [attr.fill]="fillColor" d="m6.293 13.293 1.414 1.414L12 10.414l4.293 4.293 1.414-1.414L12 7.586z" />
        </svg>
    `,
    styles: [],
})
export class EglSvgSelectComponent {
    @Input() icon!: 'chevron';

    @Input() fillColor = 'rgb(255, 0, 0)';

    // changeColor() {
    //   const r = Math.floor(Math.random() * 256);
    //   const g = Math.floor(Math.random() * 256);
    //   const b = Math.floor(Math.random() * 256);
    //   this.fillColor = `rgb(${r}, ${g}, ${b})`;
    // }
}
