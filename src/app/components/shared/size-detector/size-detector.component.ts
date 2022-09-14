// import { Platform } from '@angular/cdk/platform';
import { Component, HostListener, OnInit } from '@angular/core';
import { screenSizes } from 'src/app/interfaces/screen-size';
import { MediaScreenService } from 'src/app/services/mediascreen.service';

@Component({
    selector: 'app-size-detector',
    templateUrl: './size-detector.component.html',
    styleUrls: ['./size-detector.component.scss'],
})
export class SizeDetectorComponent implements OnInit {
    // private _name = 'SizeDetectorComponent';

    public getScreenWidth: any;
    public getScreenHeight: any;

    sizes = screenSizes;

    constructor(
        // private elementRef: ElementRef,
        private mediaScreenService: MediaScreenService // platform: Platform, // private _usersService: UsersService
    ) {
        this.getScreenWidth = window.innerWidth;
        this.getScreenHeight = window.innerHeight;
    }

    ngOnInit(): void {
        // console.log('Componente ' + this._name + ': ngOnInit: this.getScreenWidth ─> ', this.getScreenWidth);
    }

    @HostListener('window:resize', [])
    onResize() {
        this.detectScreenSize();
        // console.log('Componente ' + this._name + ': onResize: this.getScreenWidth ─> ', this.getScreenWidth);
    }

    ngAfterViewInit() {
        this.detectScreenSize();
        // console.log('Componente ' + this._name + ': ngAfterViewInit: this.getScreenWidth ─> ', this.getScreenWidth);
    }

    private detectScreenSize() {
        this.getScreenWidth = window.innerWidth;
        this.getScreenHeight = window.innerHeight;
        // console.log('Componente ' + this._name + ': detectScreenSize: this.getScreenWidth ─> ', this.getScreenWidth);
        // console.log('Componente ' + this._name + ': detectScreenSize: this.getScreenHeight ─> ', this.getScreenHeight);

        let currentSize = this.sizes[this.sizes.length - 1];

        for (let i = 0; i < this.sizes.length; i++) {
            // console.log('Componente ' + this._name + ': detectScreenSize: i ─> ', i);
            // console.log('Componente ' + this._name + ': detectScreenSize: this.sizes[i] ─> ', this.sizes[i]);
            // console.log('Componente ' + this._name + ': detectScreenSize: this.getScreenWidth ─> ', this.getScreenWidth);
            if (this.sizes[i].size > this.getScreenWidth) {
                currentSize = this.sizes[i];
                break;
            }
        }

        if (currentSize) {
            this.mediaScreenService.onResize(currentSize);
        }
    }
}
