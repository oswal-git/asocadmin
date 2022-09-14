import { Injectable } from '@angular/core';
import { distinctUntilChanged, Observable, Subject } from 'rxjs';
import { IScreenSize, screenSizes } from '../interfaces/screen-size';

@Injectable({
    providedIn: 'root',
})
export class MediaScreenService {
    // private _name = 'MediaScreenService';

    _sizes: IScreenSize[] = screenSizes;
    _size: IScreenSize = this._sizes[this._sizes.length - 1];

    get onResize$(): Observable<IScreenSize> {
        // console.log('Componente ' + this._name + ': onResize: ─> Observable ');
        return this.resizeSubject.asObservable().pipe(distinctUntilChanged());
    }

    private resizeSubject: Subject<IScreenSize>;

    constructor() {
        this.resizeSubject = new Subject();
        // console.log('Componente ' + this._name + ': constructor: resizeSubject ─> ', this.resizeSubject);
    }

    onResize(size: IScreenSize) {
        // console.log('Componente ' + this._name + ': onResize: size ─> ', size);
        // console.log('Componente ' + this._name + ': onResize: size ─> ', SCREEN_SIZE[size.size]);
        this._size = size;
        this.resizeSubject.next(size);
    }
}
