import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { IBDAsociacion } from '@app/interfaces/api/iapi-asociation.metadata';
import { IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';
import { IOptionsDialog, IResponseActionsAsociations } from '@app/interfaces/ui/dialogs.interface';
// import { BdmysqlService } from '@app/services/bd/bdmysql.service';
import { UsersService } from '@app/services/bd/users.service';
import { environment } from '@env/environment';

@Component({
    selector: 'app-form-asociacion',
    templateUrl: './form-asociacion.component.html',
    styleUrls: ['./form-asociacion.component.scss'],
})
export class FormAsociacionComponent implements OnInit, OnChanges {
    private _name = 'FormAsociacionComponent';
    private userProfile!: IUserConnected;

    @Input() options!: IOptionsDialog;
    @Output() salir = new EventEmitter<IResponseActionsAsociations>();

    loading = false;
    form!: UntypedFormGroup;
    createForm = false;
    browseForm = true;
    asocResp: IResponseActionsAsociations = { action: '', data: '', replay: { status: '', message: '' } };
    logoUrlDefault = './assets/img/images.jpg';

    oldRecord: IBDAsociacion = {
        id_asociation: 0,
        long_name_asociation: '',
        short_name_asociation: '',
        logo_asociation: '',
        email_asociation: '',
        name_contact_asociation: '',
        phone_asociation: '',
        date_deleted_asociation: '',
        date_created_asociation: this.logoUrlDefault,
        date_updated_asociation: '',
    };

    isSuper = false;

    isLogoUrlDefault = true;
    logoUrl = this.logoUrlDefault;
    logoImg = '';
    selectedFile: File | null = null;

    durationInSeconds = 2;
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _usersService: UsersService,
        // private _bd: BdmysqlService,
        private _snackBar: MatSnackBar,
        private http: HttpClient
    ) {
        this.isSuper = _usersService.userProfile.profile_user === 'superadmin' ? true : false;

        console.log('Componente ' + this._name + ': constructor: userPerfil ─> ', this.userProfile);
        console.log('Componente ' + this._name + ': constructor: oldRecord ─> ', this.oldRecord);

        this.loading = true;
    }

    ngOnInit(): void {}

    ngOnChanges(): void {
        console.log('Componente ' + this._name + ': ngOnChanges: this.options in ─> ', this.options);

        if (this.options) {
            this.asocResp.action = this.options.id;
            if (this.options.id !== 'create') {
                this.oldRecord = this.options.record;
                if (this.oldRecord.logo_asociation === '') {
                    this.logoUrl = this.logoUrlDefault;
                    this.oldRecord.logo_asociation = this.logoUrlDefault;
                } else {
                    this.logoUrl = this.oldRecord.logo_asociation;
                }
            }

            if (this.userProfile.id_asociation_user !== 0) {
                this.oldRecord.id_asociation = this.userProfile.id_asociation_user;
            }

            this.createForm = this.options.id === 'create';
            this.browseForm = this.options.id === 'browse';
            console.log('Componente ' + this._name + ': ngOnChanges: this.options out ─> ', this.options);

            this.fillFormData();
            this.loading = false;
        }
    }

    fillFormData() {
        this.form = this._formBuilder.group({
            long_name_asociation: new UntypedFormControl(
                { value: this.oldRecord.long_name_asociation, disabled: this.browseForm ? true : false },
                Validators.compose([Validators.required])
            ),
            short_name_asociation: new UntypedFormControl(
                { value: this.oldRecord.short_name_asociation, disabled: this.browseForm ? true : false },
                Validators.compose([Validators.required, Validators.maxLength(20)])
            ),
            email_asociation: new UntypedFormControl(
                { value: this.oldRecord.email_asociation, disabled: this.browseForm ? true : false },
                Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])
            ),
            phone_asociation: new UntypedFormControl(
                { value: this.oldRecord.phone_asociation, disabled: this.browseForm ? true : false },
                Validators.compose([Validators.pattern('')])
            ),
        });
    }

    async manageAsociation() {
        console.log('Componente ' + this._name + ': manageAsociation:  this.form.value ─> ', this.form.value);
        console.log('Componente ' + this._name + ': manageAsociation:  this.oldRecord ─> ', this.oldRecord);
        try {
            if (this.options.id === 'create') {
                console.log('Componente ' + this._name + ': manageAsociation: ─> createAsociation');
                await this.createAsociacion();
                return;
            } else if (this.options.id === 'edit') {
                console.log('Componente ' + this._name + ': manageAsociation: ─> edit');
                if (
                    this.oldRecord.email_asociation === this.form.value.email_asociation &&
                    this.oldRecord.long_name_asociation === this.form.value.long_name_asociation &&
                    this.oldRecord.short_name_asociation === this.form.value.short_name_asociation &&
                    this.oldRecord.phone_asociation === this.form.value.phone_asociation &&
                    this.logoUrl === this.oldRecord.logo_asociation
                ) {
                    console.log('Componente ' + this._name + ': manageAsociation: error ─> not data changed');
                    this.msg('Not data changed');
                    this.loading = false;
                    return;
                } else {
                    console.log('Componente ' + this._name + ': manageAsociation: updateUser ─> updateUser()');
                    await this.updateAsociacion();
                    return;
                }
            } else {
                console.log('Componente ' + this._name + ': manageAsociation: error ─> not options expected');
                this.msg('Not options expected');
            }
        } catch (err: any) {
            console.log('Componente ' + this._name + ': manageAsociation: err ─> ', err);
            this.loading = false;
            this.msg(err);
        }
    }

    async createAsociacion() {
        console.log('Componente ' + this._name + ': updateAsociacion: ─> *********************************************************');

        this.validations()
            .then(async (res) => {
                try {
                    if (res.error) {
                        console.log('Componente ' + this._name + ': createAsociacion: existemail_asociation: res ─> ', res);
                        throw new Error(
                            '* email_asociation ' + this.form.value.email_asociation + ', ya existe en la asociacion ' + res.long_name_asociation
                        );
                        // reject('email_asociation ' + this.form.value.email_asociation + ', ya existe en la asociacion ' + res);
                    } else {
                        try {
                            const ulrCreateAsociation = environment.urlApi + '/asocs';
                            const authHeaders = await this._usersService.getAuthHeaders();
                            console.log('Componente ' + this._name + ': createAsociation: logoImg ─> ', this.logoImg);
                            const data = {
                                logo_img: this.logoImg,
                                data: {
                                    id_asociacion: '',
                                    long_name_asociation: this.form.value.long_name_asociation,
                                    short_name_asociation: this.form.value.short_name_asociation,
                                    email_asociation: this.form.value.email_asociation,
                                    logo: this.logoUrl,
                                    phone_asociation: this.form.value.phone_asociation,
                                    fecha_alta: '',
                                    date_updated_asociation: '',
                                    fecha_baja: '',
                                },
                            };
                            console.log('Componente ' + this._name + ': createAsociation: data ─> ', data);
                            try {
                                this.loading = true;
                                this.http.post(ulrCreateAsociation, data, authHeaders.headers).subscribe({
                                    next: async (asoc: any) => {
                                        console.log('Componente ' + this._name + ': createAsociation: asoc ─> ', asoc);
                                        console.log('Componente ' + this._name + ': createAsociation: asoc.id_asociacion ─> ', asoc.id_asociacion);
                                        if (asoc.id_asociacion) {
                                            data.data.id_asociacion = asoc.id_asociacion;
                                            data.data.fecha_alta = asoc.fecha_alta;
                                            data.data.date_updated_asociation = asoc.date_updated_asociation;
                                            this.asocResp.data = data;
                                            try {
                                                console.log('Componente ' + this._name + ': createAsociation: uploadlogo ─> ');

                                                console.log('Componente ' + this._name + ': createAsociation: uploadlogo () ─> ');
                                                const respUpload = await this.uploadLogo(asoc.id_asociacion);
                                                console.log('Componente ' + this._name + ': createAsociation: uploadlogo respUpload ─> ', respUpload);
                                                this.loading = false;
                                                this.asocResp.replay = { status: 'ok', message: 'asoc created with logo' };
                                                this.exitForm(this.asocResp);
                                            } catch (error) {
                                                this.loading = false;
                                                console.log('Componente ' + this._name + ': createAsociation: uploadlogo error ─> ', error);
                                                this.msg('asoc created. Unexpected error uploading logo');
                                                this.asocResp.replay = {
                                                    status: 'error',
                                                    message: 'asoc created. Unexpected error uploading logo',
                                                };
                                                this.exitForm(this.asocResp);
                                            }
                                        } else {
                                            console.log(
                                                'Componente ' + this._name + ': createAsociation: ulrCreateAsociation error ─> not user created'
                                            );
                                            this.msg('User not created. Unexpected error');
                                            this.loading = false;
                                            // this.exitForm({ accion: 'create', data: data.profile });
                                        }
                                    },
                                    error: (err: any) => {
                                        this.loading = false;
                                        console.log('Componente ' + this._name + ': createAsociation: error ─> ', err);
                                        this.msg('Unexpected error creando el usuario');
                                    },
                                    complete: () => {
                                        console.log('Componente ' + this._name + ': createAsociation: complete ─> post');
                                    },
                                });
                            } catch (error: any) {
                                this.loading = false;
                                console.log('Componente ' + this._name + ': createAsociation: catch error ─> ', error);
                                this.msg(error);
                            }
                        } catch (error: any) {
                            this.msg(error.message);
                            console.log('Componente ' + this._name + ': createAsociacion: error.message 1 ─> ', error.message);
                        }
                    }
                } catch (error: any) {
                    this.msg(error.message);
                    console.log('Componente ' + this._name + ': createAsociacion: error.message 2 ─> ', error.message);
                }
            })
            .catch((reject) => {
                console.log('Componente ' + this._name + ': createAsociacion: reject 2 ─> ', reject);
                this.msg(reject);
            });
    }

    async updateAsociacion() {
        console.log('Componente ' + this._name + ': updateAsociacion: ─> *********************************************************');
        console.log('Componente ' + this._name + ': updateAsociacion: this.oldRecord.email_asociation ─> ', this.oldRecord.email_asociation);
        console.log('Componente ' + this._name + ': updateAsociacion: this.form.value.email_asociation ─> ', this.form.value.email_asociation);
        let validate: any;
        if (this.oldRecord.email_asociation === this.form.value.email_asociation) {
            console.log('Componente ' + this._name + ': updateAsociacion: existemail_asociation: validate igual ─> ', validate);
            validate = { error: false };
        } else {
            console.log('Componente ' + this._name + ': updateAsociacion: existemail_asociation: validate diff ─> ¿?');
            validate = await this.validations();
            console.log('Componente ' + this._name + ': updateAsociacion: existemail_asociation: validate diff ─> ', validate);
        }

        try {
            if (validate.error) {
                console.log('Componente ' + this._name + ': updateAsociacion: existemail_asociation: res ─> ', validate.asoc);
                throw new Error('* email_asociation ' + this.form.value.email_asociation + ', ya existe en la asociacion ' + validate.asoc);
                // reject('email_asociation ' + this.form.value.email_asociation + ', ya existe en la asociacion ' + res);
            } else {
                const ulrUpdateAsociation = environment.urlApi + '/asocs';
                const authHeaders = await this._usersService.getAuthHeaders();
                console.log('Componente ' + this._name + ': updateUser: logoImg ─> ', this.logoImg);
                console.log('Componente ' + this._name + ': updateUser: this.form.value ─> ', this.form.value);
                const data = {
                    logo_img: this.logoImg,
                    data: {
                        id_asociacion: this.userProfile.id_asociation_user === 0 ? this.oldRecord.id_asociation : this.userProfile.id_asociation_user,
                        long_name_asociation: this.form.value.long_name_asociation,
                        short_name_asociation: this.form.value.short_name_asociation,
                        email_asociation: this.form.value.email_asociation,
                        phone_asociation: this.form.value.phone_asociation,
                        logo: this.logoUrl,
                        date_updated_asociation: this.oldRecord.date_updated_asociation,
                    },
                };
                console.log('Componente ' + this._name + ': updateUser: data ─> ', data);
                try {
                    this.loading = true;
                    this.http.put(ulrUpdateAsociation, data, authHeaders.headers).subscribe({
                        next: async (fechas: any) => {
                            data.data.date_updated_asociation = fechas.date_updated_asociation;
                            this.asocResp.data = data.data;
                            if (this.logoUrl !== this.oldRecord.logo_asociation) {
                                console.log('Componente ' + this._name + ': updateUser: logo ─> changed');
                                const updateAvatarResp = await this.updateLogo(this.oldRecord.id_asociation);
                                console.log('Componente ' + this._name + ': manageUser: updateAvatarResp ─> ', updateAvatarResp.body);
                                this.asocResp.replay = { status: 'ok', message: 'Updated user and logo' };
                                if (!updateAvatarResp) {
                                    this.msg('Unexpected error updating logo');
                                    this.asocResp.replay = { status: 'ok', message: 'Updated user. Unexpected error updating logo' };
                                }
                                console.log('Componente ' + this._name + ': updateUser: this.asocResp ─> ', this.asocResp);
                                if (typeof updateAvatarResp !== 'boolean') {
                                    this.asocResp.data.logo = updateAvatarResp.body.url;
                                }
                                this.loading = false;
                                this.exitForm(this.asocResp);
                            } else {
                                console.log('Componente ' + this._name + ': updateUser: logo ─> not changed');
                                console.log('Componente ' + this._name + ': updateUser: this.asocResp ─> ', this.asocResp);
                                this.loading = false;
                                this.asocResp.replay = { status: 'ok', message: 'Updated user. Avatar not changed' };
                                this.exitForm(this.asocResp);
                            }
                        },
                        error: (err: any) => {
                            this.loading = false;
                            console.log('Componente ' + this._name + ': updateUser: error ─> ', err);
                            this.msg('Unexpected error creando el usuario: "' + err + '"');
                        },
                        complete: () => {
                            console.log('Componente ' + this._name + ': updateUser: complete ─> post');
                        },
                    });
                } catch (error: any) {
                    this.loading = false;
                    console.log('Componente ' + this._name + ': updateUser: catch error ─> ', error);
                    this.msg(error);
                }
            }
        } catch (error: any) {
            this.msg(error);
            console.log('Componente ' + this._name + ': updateAsociacion: error 2 ─> ', error);
        }
    }

    getLogo(event: any) {
        console.log('Componente ' + this._name + ': getLogo: event.target.files ─> ', event.target.files);
        // var n = Date.now();
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            console.log('Componente ' + this._name + ': getLogo: reader ─> ', reader);
            this.selectedFile = <File>event.target.files[0];
            this.logoImg = this.selectedFile.name;
            this.isLogoUrlDefault = false;
            console.log('Componente ' + this._name + ': getLogo: logoImg ─> ', this.logoImg);
            reader.readAsDataURL(this.selectedFile);
            reader.onload = (event: any) => {
                console.log('Componente ' + this._name + ': getLogo: event ─> ', event);
                this.logoUrl = event.target.result as string;
                console.log('Componente ' + this._name + ': getLogo: this.logoUrl ─> ', this.logoUrl);
                this.form.value.logo = this.logoUrl;
            };
        }
    }

    defaultLogo() {
        this.selectedFile = null;
        this.logoImg = '';
        this.logoUrl = this.logoUrlDefault;
        this.form.value.logo = this.logoUrl;
        this.isLogoUrlDefault = true;
        console.log('Componente ' + this._name + ': getLogo: logoImg ─> ', this.logoImg);
    }

    validations(): Promise<any> {
        const response = { error: true, asoc: '' };
        return new Promise((_resolve, _reject) => {
            // try {
            // this._bd.existemail_asociationAsociation(this.form.value.email_asociation, 'Asociaciones').subscribe({
            //     next: (res: any) => {
            //         console.log('Componente ' + this._name + ': validations: existemail_asociationAsociation: res ─> ', res);
            //         if (res.length > 0) {
            //             console.log('Componente ' + this._name + ': validations: existemail_asociationAsociation: res[0] ─> ', res[0]);
            //             const doc = res[0];
            //             console.log('Componente ' + this._name + ': validations: existemail_asociationAsociation: doc ─> ', doc);
            //             console.log('Componente ' + this._name + ': validations: existemail_asociationAsociation: doc.email_asociation ─> ', doc.long_name_asociation);
            //             response.error = true;
            //             response.asoc = doc.long_name_asociation;
            //         } else {
            //             console.log('Componente ' + this._name + ': validations: existemail_asociationAsociation: doc.email_asociation ─> false');
            //             response.error = false;
            //         }
            //         resolve(response);
            //         return response;
            //     },
            //     error: (err: any) => {
            //         console.log('Componente ' + this._name + ': validations: existemail_asociationAsociation: err ─> ', err);
            //         response.error = false;
            //         reject(response);
            //         return response;
            //     },
            //     completed: () => {
            //         console.log('Componente ' + this._name + ': validations: existemail_asociationAsociation: completed ─> ');
            //         // return true;
            //     },
            // });

            // .subscribe({
            //     next: (res: any) => {
            //         resolve(res);
            //         return;
            //     },
            //     error: (err: any) => {
            //         reject('email_asociation ' + this.form.value.email_asociation + ', ya existe en la asociacion ' + err.long_name_asociation);
            //         console.log('Componente ' + this._name + ': validations: existemail_asociation: err ─> ', err);
            //         // throw new Error('email_asociation ' + this.form.value.email_asociation + ', ya existe en la asociacion ' + err.long_name_asociation);
            //         return;
            //     },
            //     completed: () => {
            //         valemail_asociation.unsubscribe();
            return response;
            //     }
            // })
        });
    }

    async updateLogo(uid: number) {
        if (this.logoUrl === this.logoUrlDefault && this.oldRecord.logo_asociation !== this.logoUrlDefault) {
            try {
                const resp = await this.deleteLogos(uid);
                if (resp.status === 'success') {
                    console.log('Componente ' + this._name + ': updateLogo: deleteLogos ok ─> ', resp);
                    return true;
                } else {
                    console.log('Componente ' + this._name + ': updateLogo: deleteLogos error ─> ', resp.message, resp.code);
                    this.msg('User created. Unexpected error uploading logo');
                    return false;
                }
            } catch (error) {
                console.log('Componente ' + this._name + ': updateLogo: deleteLogos error ─> ', error);
                this.msg('User created. Unexpected error uploading logo');
                return false;
            }
        } else {
            try {
                console.log('Componente ' + this._name + ': updateLogo: uploadLogo () ─> ');
                const respUpload = await this.uploadLogo(uid);
                console.log('Componente ' + this._name + ': updateLogo: uploadLogo respUpload ─> ', respUpload);
                return respUpload;
            } catch (error) {
                console.log('Componente ' + this._name + ': updateLogo: uploadLogo error ─> ', error);
                this.msg('User created. Unexpected error uploading logo');
                return false;
            }
        }
    }

    async uploadLogo(asoc_id: number): Promise<any> {
        const authHeaders = ''; // await this._usersService.getAuthHeaders();

        return new Promise(async (resolve, _reject) => {
            const ulrUploadFile = environment.urlApi + '/common/uploadFile';
            const fd = new FormData();
            const token = authHeaders; //  .headers.headers.Authorization;
            console.log('Componente ' + this._name + ': uploadLogo: asoc_id ─> ', asoc_id);
            console.log('Componente ' + this._name + ': uploadLogo: token ─> ', token);
            if (this.selectedFile) {
                fd.append('token', token);
                fd.append('asoc_id', asoc_id.toString());
                fd.append('prefix', 'asociaciones' + '/' + asoc_id + '/logos/');
                fd.append('image', this.selectedFile, this.selectedFile.name);
                this.http
                    .post(ulrUploadFile, fd, {
                        reportProgress: true,
                        observe: 'events',
                    })
                    .subscribe({
                        next: (event) => {
                            if (event.type === HttpEventType.UploadProgress) {
                                console.log(
                                    'Componente ' + this._name + ': uploadLogo: Upload progress ─> ',
                                    event.total ? Math.round(event.loaded / event.total) * 100 + ' %' : '--'
                                );
                            } else if (event.type === HttpEventType.Response) {
                                console.log('Componente ' + this._name + ': uploadLogo: event ─> ', event);
                                resolve(event);
                            }
                        },
                        error: (err: any) => {
                            console.log('Componente ' + this._name + ': uploadLogo: error ─> ', err);
                            resolve(err);
                        },
                        complete: () => {
                            console.log('Componente ' + this._name + ': uploadLogo: complete ─> post ulrUploadFile');
                        },
                    });
            } else {
                resolve(null);
            }
        });
    }

    async deleteLogos(asoc_id: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const ulrDeleteFolder = environment.urlApi + '/common/deleteFolder';
            const authHeaders = await this._usersService.getAuthHeaders();
            console.log('Componente ' + this._name + ': deleteLogos: uid ─> ', asoc_id);
            const data = {
                module: 'asociation',
                asoc_id: asoc_id,
                prefix: 'asociaciones' + '/' + asoc_id + '/logos/',
            };
            console.log('Componente ' + this._name + ': deleteLogos: data ─> ', data);
            try {
                this.http.post(ulrDeleteFolder, data, authHeaders.headers).subscribe({
                    next: (resp: any) => {
                        if (resp.status === 'success') {
                            console.log('Componente ' + this._name + ': deleteLogos: ulrDeleteFile success ─> ', resp);
                            resolve(resp);
                        } else {
                            console.log('Componente ' + this._name + ': deleteLogos: ulrDeleteFile error ─> ', resp);
                            this.msg('Logo no deleted. Unexpected error');
                            reject(resp);
                        }
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': deleteLogos: error ─> ', err);
                        this.msg('Unexpected error borrando el logo');
                        reject(err);
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': deleteLogos: complete ─> post');
                    },
                });
            } catch (error: any) {
                this.loading = false;
                console.log('Componente ' + this._name + ': deleteLogos: catch error ─> ', error);
                return error;
            }
        });
    }

    exitForm(datosSalida: IResponseActionsAsociations | any) {
        if (datosSalida === null) {
            datosSalida = { action: 'exit', data: '', replay: { status: '', message: '' } };
        }
        console.log('Componente ' + this._name + ': exitForm:  ─> this.salir.emit: ', datosSalida);
        this.salir.emit(datosSalida);
    }

    msg(msg: string) {
        this._snackBar.open(msg, '', {
            duration: this.durationInSeconds * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
}
