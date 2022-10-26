export class HelperClass {
    static _name = 'HelperClass';
    static _log = false;

    static getDay() {
        let day: string = '';

        switch (new Date().getDay()) {
            case 0:
                day = 'Sunday';
                break;
            case 1:
                day = 'Monday';
                break;
            case 2:
                day = 'Tuesday';
                break;
            case 3:
                day = 'Wednesday';
                break;
            case 4:
                day = 'Thursday';
                break;
            case 5:
                day = 'Friday';
                break;
            case 6:
                day = 'Saturday';
        }

        return day;
    }

    static consoleLog(
        log: boolean,
        component: string,
        funct: string,
        statment: string,
        variable_name: string,
        sentence: string,
        variable: any = ''
    ): void {
        statment = statment === '' ? statment : ' ' + statment;
        if (log) {
            console.log(`Componente ${component}: ${funct}${statment}: ${variable_name} ─> ${sentence}`, variable);
        }
    }

    static compareObj(a: any, b: any): boolean {
        if (typeof a === 'object' && typeof b === 'object') {
            var aKeys = Object.keys(a).sort();
            var bKeys = Object.keys(b).sort();

            if (aKeys.length !== bKeys.length) {
                this.consoleLog(this._log, this._name, 'compareObj', '', 'aKeys', 'different length');
                // console.log('Componente ' + this._name + ': compareObj: aKeys ─> different length');
                return false;
            }
            if (aKeys.join('') !== bKeys.join('')) {
                this.consoleLog(this._log, this._name, 'compareObj', '', 'aKeys', 'different content');
                // console.log('Componente ' + this._name + ': compareObj: aKeys ─> different content');
                return false;
            }
            for (var i = 0; i < aKeys.length; i++) {
                if (typeof a[aKeys[i]] === 'object' && typeof b[bKeys[i]] === 'object' && a[aKeys[i]] !== null && b[bKeys[i]] !== null) {
                    this.consoleLog(this._log, this._name, 'compareObj', '', 'a[aKeys[i]]', '', a[aKeys[i]]);
                    // console.log('Componente ' + this._name + ': compareObj: a[aKeys[i]] ─> ', a[aKeys[i]]);
                    this.consoleLog(this._log, this._name, 'compareObj', '', 'aKeys', 'objects');
                    // console.log('Componente ' + this._name + ': compareObj: aKeys ─> objects');
                    let dif = this.compareObj(a[aKeys[i]], b[bKeys[i]]);
                    this.consoleLog(this._log, this._name, 'compareObj', '', 'dif', '', dif);
                    // console.log('Componente ' + this._name + ': compareObj: dif ─> ', dif);
                    if (!dif) {
                        // console.log('Componente ' + this._name + ': compareObj dif: aKeys[i] ─> ', aKeys[i]);
                        // console.log('Componente ' + this._name + ': compareObj dif: a[aKeys[i]] ─> ', a[aKeys[i]]);
                        // console.log('Componente ' + this._name + ': compareObj dif: bKeys[i] ─> ', bKeys[i]);
                        // console.log('Componente ' + this._name + ': compareObj dif: b[bKeys[i]] ─> ', b[bKeys[i]]);
                        return false;
                    }
                } else {
                    let A: string = a[aKeys[i]] === null ? '' : a[aKeys[i]].toString();
                    let B: string = b[bKeys[i]] === null ? '' : b[bKeys[i]].toString();
                    if (A !== B) {
                        // console.log('Componente ' + this._name + ': compareObj: aKeys[i] ─> ', aKeys[i]);
                        // console.log('Componente ' + this._name + ': compareObj: bKeys[i] ─> ', bKeys[i]);
                        // console.log('Componente ' + this._name + ': compareObj:  a[aKeys[i]].toString() ─> ', a[aKeys[i]].toString());
                        // console.log('Componente ' + this._name + ': compareObj: b[bKeys[i]].toString() ─> ', b[bKeys[i]].toString());
                        return false;
                    }
                }
            }

            this.consoleLog(this._log, this._name, 'compareObj', '', 'aKeys', 'equals');
            // console.log('Componente ' + this._name + ': compareObj: aKeys ─> equals');
            return true;
        } else {
            return a === b;
        }
    }

    static imageToBase64 = async (urlImage: string) =>
        new Promise((resolve, reject) => {
            try {
                console.log('Componente ' + this._name + ': extractBase64: urlImage ─> ', urlImage);
                var img = new Image();
                img.src = urlImage;

                img.onload = () => {
                    // alert(img.width + ' ' + img.height);
                    console.log('Componente ' + this._name + ': extractBase64: img.width  img.height ─> ', img.width + ' ' + img.height);
                    var blob = new Blob([urlImage]);
                    let reader = new FileReader();

                    console.log('Componente img.onload: : blob ─> ', blob);
                    reader.readAsDataURL(blob); // read file as data url

                    reader.onload = (_event) => {
                        const imageElement: any = document.createElement('img');
                        imageElement.src = reader.result;
                        console.log('Componente ' + this._name + ': extractBase64: reader.result ─> ', reader.result);
                        // console.log('Componente ' + this._name + ': extractBase64: imageElement.src ─> ', imageElement.src);
                        imageElement.onload = (e: any) => {
                            const canvas = document.createElement('canvas');
                            const MAX_WIDTH = 600;
                            const MAX_HEIGTH = 500;

                            console.log('Componente ' + this._name + ': extractBase64: imageElement.onload e ─> ', e);
                            console.log('Componente ' + this._name + ': extractBase64: imageElement.onload e.target ─> ', e.target);
                            console.log('Componente ' + this._name + ': extractBase64: imageElement.onload e.target.width ─> ', e.target.width);
                            console.log('Componente ' + this._name + ': extractBase64: imageElement.onload e.target.height ─> ', e.target.height);
                            const fileWidth = e.target.width;
                            const fileHeight = e.target.height;

                            if (e.target.width >= e.target.height) {
                                const scaleSize = MAX_WIDTH / e.target.width;
                                canvas.width = MAX_WIDTH;
                                canvas.height = e.target.height * scaleSize;
                            } else {
                                const scaleSize = MAX_HEIGTH / e.target.height;
                                canvas.width = e.target.width * scaleSize;
                                canvas.height = MAX_HEIGTH;
                            }

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
                            console.log('Componente ' + this._name + ': extractBase64: srcEncoded ─> ', oGrayImg.src);
                            resolve({
                                status: 'ok',
                                // base: reader.result,
                                base: oGrayImg.src,
                                // base: srcEncoded,
                                fileWidth,
                                fileHeight,
                            });
                        };
                        imageElement.onerror = (error: any) => {
                            console.log('Componente ' + this._name + ': imageElement: resolve ─> KO', error);
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
                };
            } catch (error: any) {
                // console.log('Componente ' + this._name + ': reader: reject ─> ', error);
                reject({
                    status: error,
                    base: null,
                });
            }
        });

    // static extractBase64 = async (urlImage: string) =>
    //     new Promise((resolve, reject) => {
    //         try {
    //             console.log('Componente ' + this._name + ': extractBase64: blobImage ─> ', blobImage);

    //             const reader = new FileReader();
    //             // let srcEncoded: any = null;
    //             reader.readAsDataURL(blobImage);
    //             reader.onload = (_event) => {
    //                 const imageElement: any = document.createElement('img');
    //                 imageElement.src = reader.result;
    //                 // console.log('Componente ' + this._name + ': extractBase64: imageElement.src ─> ', imageElement.src);
    //                 imageElement.onload = (e: any) => {
    //                     const canvas = document.createElement('canvas');
    //                     const MAX_WIDTH = 600;
    //                     const MAX_HEIGTH = 500;

    //                     // console.log('Componente ' + this._name + ': extractBase64: imageElement.onload e ─> ', e);
    //                     // console.log('Componente ' + this._name + ': extractBase64: imageElement.onload e.target ─> ', e.target);
    //                     // console.log('Componente ' + this._name + ': extractBase64: imageElement.onload e.target.width ─> ', e.target.width);
    //                     // console.log('Componente ' + this._name + ': extractBase64: imageElement.onload e.target.height ─> ', e.target.height);
    //                     const fileWidth = e.target.width;
    //                     const fileHeight = e.target.height;

    //                     if (e.target.width >= e.target.height) {
    //                         const scaleSize = MAX_WIDTH / e.target.width;
    //                         canvas.width = MAX_WIDTH;
    //                         canvas.height = e.target.height * scaleSize;
    //                     } else {
    //                         const scaleSize = MAX_HEIGTH / e.target.height;
    //                         canvas.width = e.target.width * scaleSize;
    //                         canvas.height = MAX_HEIGTH;
    //                     }

    //                     const ctx: any = canvas.getContext('2d');

    //                     // console.log(
    //                     //     'Componente ' + this._name + ': extractBase64: typeof ctx.canvas.toDataURL ─> ',
    //                     //     typeof ctx.canvas.toDataURL(e.target, 'image/jpeg')
    //                     // );

    //                     ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);

    //                     // ctx.drawImage(e.target, 0, 0);
    //                     let oImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    //                     ctx.putImageData(oImgData, 0, 0);
    //                     let oGrayImg = new Image();

    //                     // srcEncoded = ctx.canvas.toDataURL(e.target, 'image/jpeg');
    //                     // oGrayImg = ctx.canvas.toDataURL(e.target, 'image/jpeg');
    //                     oGrayImg.src = canvas.toDataURL('image/jpeg', 1.0);
    //                     // console.log('Componente ' + this._name + ': extractBase64: srcEncoded ─> ', oGrayImg.src);
    //                     resolve({
    //                         status: 'ok',
    //                         // base: reader.result,
    //                         base: oGrayImg.src,
    //                         // base: srcEncoded,
    //                         fileWidth,
    //                         fileHeight,
    //                     });
    //                 };
    //                 imageElement.onerror = (error: any) => {
    //                     // console.log('Componente ' + this._name + ': imageElement: resolve ─> KO');
    //                     resolve({
    //                         status: error,
    //                         base: null,
    //                     });
    //                 };
    //             };
    //             reader.onerror = (error) => {
    //                 // console.log('Componente ' + this._name + ': reader: resolve ─> KO');
    //                 resolve({
    //                     status: error,
    //                     base: null,
    //                 });
    //             };
    //         } catch (error: any) {
    //             // console.log('Componente ' + this._name + ': reader: reject ─> ', error);
    //             reject({
    //                 status: error,
    //                 base: null,
    //             });
    //         }
    //     });

    static dataURItoBlob = (dataURI: string) => {
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
}
