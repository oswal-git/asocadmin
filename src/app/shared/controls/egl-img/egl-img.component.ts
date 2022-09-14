import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { faArrowRotateLeft, faCircleXmark, faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

export interface IEglImagen {
    src: string;
    nameFile: string;
    filePath: string;
    fileImage: any;
    isSelectedFile: boolean;
}

@Component({
    selector: 'egl-img',
    templateUrl: './egl-img.component.html',
    styleUrls: ['./egl-img.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EglImgComponent),
            multi: true,
        },
    ],
})
export class EglImgComponent implements OnInit, ControlValueAccessor {
    // private _name = 'EglImgComponent';

    value!: string;
    onChangefn = (_: any) => {};
    onTouchfn = () => {};
    isDisabled!: boolean;

    @Input() label!: string;
    @Input('readonly') readOnly: boolean = false;
    @Input('imagedefault') imgDefaultSrc: string = '';

    // icons
    faPhotoFilm = faPhotoFilm;
    faCircleXmark = faCircleXmark;
    faArrowRotateLeft = faArrowRotateLeft;

    // file image
    src: string | ArrayBuffer | null = null;
    fileBefore!: IEglImagen; // imagen inicial
    filePath: string = 'assets/';
    nameFile: string = '';
    fileImage: any = null;
    isSelectedFile: boolean = false;
    isImgDefault: boolean = true;

    fileWidth!: string;
    fileHeight!: string;

    canRestoreImage: boolean = false;

    constructor(
        // private sanitizer: DomSanitizer,
        private spinnerService: NgxSpinnerService
    ) {}

    ngOnInit(): void {}

    clickFile(_event: any) {
        // console.log('Componente ' + this._name + ': clickFile:  ─> ');
    }

    async selectFile(event: any) {
        if (this.readOnly) return;

        this.spinnerService.show();

        // console.log('Componente ' + this._name + ': selectFile: event.target.files ─> ', event.target.files);
        // console.log('Componente ' + this._name + ': selectFile: event.target.files[0] ─> ', event.target.files[0]);
        if (!event.target.files[0] || event.target.files[0].length === 0) {
            this.spinnerService.hide();
            return;
        }
        let mimeType = event.target.files[0].type;
        if (mimeType.match(/image\/*/) === null) {
            this.spinnerService.hide();
            return;
        }

        const selectedFile = event.target.files[0];
        this.nameFile = event.target.files[0].name;
        // console.log('Componente ' + this._name + ': selectFile: this.nameFile ─> ', this.nameFile);
        this.fileWidth = event.target.files[0].width;

        const image: any = await this.extractBase64(selectedFile);
        if (image.status === 'ok') {
            // console.log('Componente ' + this._name + ': selectFile extractBase64: image ok ─> ', image);
            this.src = image.base;
            this.fileImage = this.dataURItoBlob(image.base);
            this.isSelectedFile = true;
            // this.isImgDefault = false;
            this.canRestoreImage = true;

            this.onTouchfn();
            this.onChangefn({
                src: this.src,
                nameFile: this.nameFile,
                fileImage: this.fileImage,
                isSelectedFile: this.isSelectedFile,
                filePath: '',
            });
            this.spinnerService.hide();
        } else {
            // console.log('Componente ' + this._name + ': selectFile extractBase64: error ─> ', image.status);
            this.spinnerService.hide();
        }
    }

    defaultImage() {
        // console.log('Componente ' + this._name + ': defaultImage:imgDefaultSrc  ─> ', this.imgDefaultSrc);
        if (this.readOnly) return;

        this.src = this.imgDefaultSrc;
        this.isSelectedFile = false;
        this.fileImage = null;
        this.nameFile = '';
        this.filePath = '';
        this.canRestoreImage = true;

        this.onTouchfn();
        this.onChangefn({
            src: this.src,
            nameFile: this.nameFile,
            filePath: '',
            fileImage: this.fileImage,
            isSelectedFile: this.isSelectedFile,
        });
    }

    restoreImage() {
        // console.log('Componente ' + this._name + ': restoreImage: imgDefaultSrc ─> ', this.imgDefaultSrc);
        if (this.readOnly) return;

        this.src = this.fileBefore.src;
        this.isSelectedFile = false;
        this.fileImage = null;
        this.filePath = '';
        this.nameFile = this.fileBefore.nameFile;
        this.canRestoreImage = false;

        // console.log('Componente ' + this._name + ': restoreImage: src ─> ', this.src);
        this.onTouchfn();
        this.onChangefn({
            src: this.src,
            nameFile: this.nameFile,
            fileImage: this.fileImage,
            isSelectedFile: this.isSelectedFile,
        });
    }

    // Metodes Interface ControlValueAccessor ->
    writeValue(imgValue: IEglImagen): void {
        // console.log('Componente ' + this._name + ': writeValue: imgValue ─> ', imgValue);
        if (imgValue) {
            // console.log('Componente ' + this._name + ': writeValue: imgValue 2 ─> ', imgValue);
            this.src = imgValue.src;
            this.nameFile = imgValue.nameFile;
            this.fileBefore = imgValue;
            this.isSelectedFile = false;
            if (this.src === '') {
                this.isImgDefault = true;
            }
            this.fileImage = null;
        }
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
    // Metodes Interface ControlValueAccessor <-

    extractBase64 = async ($event: any) =>
        new Promise((resolve, reject) => {
            try {
                // console.log('Componente ' + this._name + ': extractBase64: $event ─> ', $event);

                const reader = new FileReader();
                // let srcEncoded: any = null;
                reader.readAsDataURL($event);
                reader.onload = (_event) => {
                    const imageElement: any = document.createElement('img');
                    imageElement.src = reader.result;
                    // console.log('Componente ' + this._name + ': extractBase64: imageElement.src ─> ', imageElement.src);
                    imageElement.onload = (e: any) => {
                        const canvas = document.createElement('canvas');
                        const MAX_WIDTH = 600;
                        // const MAX_HEIGTH = 112.5;

                        // console.log('Componente ' + this._name + ': extractBase64: imageElement.onload e ─> ', e);
                        // console.log('Componente ' + this._name + ': extractBase64: imageElement.onload e.target ─> ', e.target);
                        // console.log('Componente ' + this._name + ': extractBase64: imageElement.onload e.target.width ─> ', e.target.width);
                        // console.log('Componente ' + this._name + ': extractBase64: imageElement.onload e.target.height ─> ', e.target.height);
                        // if (e.target.width >= e.target.height) {
                        this.fileWidth = e.target.width;
                        this.fileHeight = e.target.height;

                        const scaleSize = MAX_WIDTH / e.target.width;
                        canvas.width = MAX_WIDTH;
                        canvas.height = e.target.height * scaleSize;
                        // } else {
                        //     const scaleSize = MAX_HEIGTH / e.target.height;
                        //     canvas.width = e.target.width * scaleSize;
                        //     canvas.height = MAX_HEIGTH;
                        // }

                        const ctx: any = canvas.getContext('2d');

                        // console.log(
                        //     'Componente ' + this._name + ': extractBase64: typeof ctx.canvas.toDataURL ─> ',
                        //     typeof ctx.canvas.toDataURL(e.target, 'image/jpeg')
                        // );

                        ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);

                        // ctx.drawImage(e.target, 0, 0);
                        let oImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                        ctx.putImageData(oImgData, 0, 0);
                        let oGrayImg = new Image();

                        // srcEncoded = ctx.canvas.toDataURL(e.target, 'image/jpeg');
                        // oGrayImg = ctx.canvas.toDataURL(e.target, 'image/jpeg');
                        oGrayImg.src = canvas.toDataURL('image/jpeg', 1.0);
                        // console.log('Componente ' + this._name + ': extractBase64: srcEncoded ─> ', oGrayImg.src);
                        resolve({
                            status: 'ok',
                            // base: reader.result,
                            base: oGrayImg.src,
                            // base: srcEncoded,
                        });
                    };
                    imageElement.onerror = (error: any) => {
                        // console.log('Componente ' + this._name + ': imageElement: resolve ─> KO');
                        resolve({
                            status: error,
                            base: null,
                        });
                    };
                };
                reader.onerror = (error) => {
                    // console.log('Componente ' + this._name + ': reader: resolve ─> KO');
                    resolve({
                        status: error,
                        base: null,
                    });
                };
            } catch (error: any) {
                // console.log('Componente ' + this._name + ': reader: reject ─> ', error);
                reject({
                    status: error,
                    base: null,
                });
            }
        });

    dataURItoBlob = (dataURI: string) => {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString: string;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);
        else byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    };

    public showSpinner(): void {
        this.spinnerService.show();

        setTimeout(() => {
            this.spinnerService.hide();
        }, 5000); // 5 seconds
    }
}
