import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'egl-svg-button',
    template: `
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" [attr.fill]="fillColor" *ngIf="icon === 'folder-save'">
            <g id="Folder">
                <path
                    d="M54,16H32.667l-6.4-4.8a6.0309,6.0309,0,0,0-3.6-1.2H10a6.0066,6.0066,0,0,0-6,6V48a6.0066,6.0066,0,0,0,6,6H54a6.0066,6.0066,0,0,0,6-6V22A6.0066,6.0066,0,0,0,54,16Zm2,32a2.0027,2.0027,0,0,1-2,2H10a2.0027,2.0027,0,0,1-2-2V16a2.0027,2.0027,0,0,1,2-2H22.667a2.01,2.01,0,0,1,1.1992.3994L30.8,19.6A2.0014,2.0014,0,0,0,32,20H54a2.0027,2.0027,0,0,1,2,2Z"
                />
                <path d="M44.9824,26.7783,24.5254,38.8662,19.6,32.3A2,2,0,0,0,16.4,34.7l6,8a2,2,0,0,0,2.6172.5215l22-13a2,2,0,1,0-2.0352-3.4434Z" />
            </g>
        </svg>
    `,
    styles: ['svg { fill: fillColor; }'],
})
export class EglSvgButtonComponent implements OnInit {
    @Input() icon!: string;

    @Input() fillColor: string = 'rgb(255, 0, 0)';

    ngOnInit(): void {
        console.log('fillColor: ' + this.fillColor);
    }

    // changeColor() {
    //   const r = Math.floor(Math.random() * 256);
    //   const g = Math.floor(Math.random() * 256);
    //   const b = Math.floor(Math.random() * 256);
    //   this.fillColor = `rgb(${r}, ${g}, ${b})`;
    // }
}
