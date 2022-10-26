import { HttpEventType } from '@angular/common/http';
import { Component, DoCheck, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { IBDAsociation, ICreateAsociation } from '@app/interfaces/api/iapi-asociation.metadata';
import { IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';
import { IOptionsDialog, IReplay, IResponseActionsUsers } from '@app/interfaces/ui/dialogs.interface';
import { AsociationsService } from '@app/services/bd/asociations.service';
import { UsersService } from '@app/services/bd/users.service';
import { IEglImagen } from '@app/shared/controls';
import { environment } from '@env/environment';
import { faCalendarPlus, faCircleXmark, faClockRotateLeft, faEnvelope, faKey, faKeyboard, faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-form-asociacion',
    templateUrl: './form-asociacion.component.html',
    styleUrls: ['./form-asociacion.component.scss'],
})
export class FormAsociacionComponent implements OnInit, OnChanges, DoCheck {
    private _name = 'FormAsociacionComponent';
    private userProfile!: IUserConnected;

    @Input('options') optionsDialog!: IOptionsDialog;
    @Output() salir = new EventEmitter<IResponseActionsUsers>();

    @ViewChild('eglmain') eglMain!: ElementRef;

    loading = false;
    form!: UntypedFormGroup;
    createForm = false;
    profileForm = false;
    browseForm = true;
    editForm = false;
    asocResp: IResponseActionsUsers = { action: '', data: '', replay: { status: '', message: '' } };

    // logo
    logoSrcDefault = environment.urlApi + '/assets/images/asociation_default.png';
    logoUrlDefault = environment.urlApi + '/assets/images/asociation_default.png';

    src = this.logoSrcDefault;
    logoImg: IEglImagen = {
        src: this.src,
        nameFile: '',
        filePath: '',
        fileImage: null,
        isSelectedFile: false,
        isDefault: this.logoSrcDefault === this.src,
        isChange: false,
    };
    isLogoUrlDefault = true;
    imgReadonly = false;

    oldRecord: IBDAsociation = {
        id_asociation: 0,
        long_name_asociation: '',
        short_name_asociation: '',
        logo_asociation: this.logoUrlDefault,
        email_asociation: '',
        name_contact_asociation: '',
        phone_asociation: '',
        date_deleted_asociation: '',
        date_created_asociation: '',
        date_updated_asociation: '',
    };

    checkOpts = true;
    isSuper = false;
    isAdmin = false;

    // icons
    faCircleXmark = faCircleXmark;
    faKeyboard = faKeyboard;
    faEnvelope = faEnvelope;
    faKey = faKey;
    faMobileScreen = faMobileScreen;
    faCalendarPlus = faCalendarPlus;
    faClockRotateLeft = faClockRotateLeft;

    shortNameAsociationMaxLength: number = 20;
    emailAsociationMaxLength: number = 30;

    longNameAsociationMinLength: number = 5;
    shortNameAsociationMinLength: number = 5;
    nameContactAsociationMinLength: number = 5;
    passwordMinLength: number = 4;

    durationInSeconds = 2;
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _usersService: UsersService,
        private _asociationsService: AsociationsService,
        private _toastr: ToastrService
    ) {
        this.loading = true;
        this.isSuper = _usersService.userProfile.profile_user === 'superadmin' ? true : false;
        this.isAdmin = _usersService.userProfile.id_asoc_admin === 0 ? false : true;
    }

    ngOnInit(): void {
        (async () => {
            // console.log('Componente ' + this._name + ': ngOnInit:  ─> ');
            console.log('Componente ' + this._name + ': ngOnInit: this.optionsDialog  ─>', this.optionsDialog);
            if (this.optionsDialog.id === 'profile') {
                this.checkOpts = false;
                this.asocResp.action = this.optionsDialog.id;
                console.log('Componente ' + this._name + ': ngOnInit: this.optionsDialog.id   ─>', this.optionsDialog.id);
                await this.getAsocUserConnected();
                // console.log('Componente ' + this._name + ': ngOnInit: this.oldRecord ─> ', this.oldRecord);
                if (this.oldRecord.logo_asociation === '') {
                    // this.avatarUrl = this.avatarUrlDefault;
                    this.oldRecord.logo_asociation = this.logoUrlDefault;
                }
                this.logoImg = {
                    src: this.oldRecord.logo_asociation,
                    nameFile: this.oldRecord.logo_asociation.split(/[\\/]/).pop() || '',
                    filePath: '',
                    fileImage: null,
                    isSelectedFile: false,
                    isDefault: this.logoSrcDefault === this.oldRecord.logo_asociation,
                    isChange: false,
                };

                this.asocResp.data = this.oldRecord;
                console.log('Componente ' + this._name + ': ngOnInit: this.asocResp ─> ', this.asocResp);
                this.browseForm = false;
                this.profileForm = true;
                // console.log('Componente ' + this._name + ': ngOnInit: this.optionsDialog ─> ', this.optionsDialog);

                this.fillFormData();
                this.loading = false;
            } else {
                this.checkOpts = true;
            }
            // this.checkOptions();
        })();
    }

    ngOnChanges(): void {
        console.log('Componente ' + this._name + ': ngOnChanges: this.optionsDialog in ─> ', this.optionsDialog);
        console.log('Componente ' + this._name + ': ngOnChanges: this.oldRecord in ─> ', this.oldRecord);

        if (this.optionsDialog.options.fin === undefined) {
            console.log('Componente ' + this._name + ': ngOnChanges: this.optionsDialog.options 2  ─> ', this.optionsDialog.options);
            this.optionsDialog.options['fin'] = true;
        }
    }

    ngDoCheck() {
        // console.log('Componente ' + this._name + ': ngDoCheck:  ─> ');
        // console.log('Componente ' + this._name + ': ngDoCheck: this.optionsDialog ─> ', this.optionsDialog);
        if (this.checkOpts) {
            this.checkOptions();
        }
    }

    checkOptions() {
        if (this.checkOpts) {
            if (this.optionsDialog) {
                this.asocResp.action = this.optionsDialog.id;
                if (this.optionsDialog.id !== 'create' && this.optionsDialog.id !== 'profile') {
                    this.oldRecord = this.optionsDialog.record;
                    this.oldRecord.logo_asociation =
                        this.optionsDialog.record.logo_asociation !== '' ? this.optionsDialog.record.logo_asociation : this.logoSrcDefault;
                    console.log('Componente ' + this._name + ': ngOnChanges: this.optionsDialog in ─> ', this.optionsDialog);
                    console.log('Componente ' + this._name + ': ngOnChanges: this.oldRecord in ─> ', this.oldRecord);
                    this.logoImg = {
                        src: this.oldRecord.logo_asociation,
                        nameFile: this.oldRecord.logo_asociation.split(/[\\/]/).pop() || '',
                        filePath: '',
                        fileImage: null,
                        isSelectedFile: false,
                        isDefault: this.logoSrcDefault === this.oldRecord.logo_asociation,
                        isChange: false,
                    };
                }

                if (this._usersService.userProfile.id_asociation_user !== 0) {
                    this.oldRecord.id_asociation = this._usersService.userProfile.id_asociation_user;
                }

                this.createForm = this.optionsDialog.id === 'create';
                this.editForm = this.optionsDialog.id === 'edit';
                this.browseForm = this.optionsDialog.id === 'browse';

                if (this.createForm) console.log('Componente ' + this._name + ': checkOptions: this.createForm ─> ', this.createForm);
                if (this.editForm) console.log('Componente ' + this._name + ': checkOptions: this.editForm ─> ', this.editForm);
                if (this.browseForm) console.log('Componente ' + this._name + ': checkOptions: this.browseForm ─> ', this.browseForm);

                console.log('Componente ' + this._name + ': ngOnChanges: this.optionsDialog out ─> ', this.optionsDialog);

                if (this.optionsDialog.options.fin) {
                    console.log('Componente ' + this._name + ': checkOptions: this.checkOpts ─> ', this.checkOpts, ' -> false');
                    this.checkOpts = false;
                    this.asocResp.data = this.oldRecord;
                    console.log('Componente ' + this._name + ': checkOptions: this.userResp.data ─> ', this.asocResp.data);
                    this.fillFormData();
                    this.loading = false;
                }
            }
        }
    }

    getAsocUserConnected(): Promise<boolean> {
        console.log(
            'Componente ' + this._name + ': getAsocUserConnected: this.userProfile.id_asociation_user: ',
            this._usersService.userProfile.id_asociation_user
        );
        return new Promise((resolve, reject) => {
            try {
                this._asociationsService.getAllAsociations().subscribe({
                    next: (resp: any) => {
                        console.log('Componente ' + this._name + ': getAsocUserConnected: ─> resp', resp);
                        if (resp.status === 200) {
                            this.oldRecord = resp.result.records[0];
                            console.log('Componente ' + this._name + ': getAsocUserConnected: ─> this.asociations', this.oldRecord);
                        } else {
                            console.log('Componente ' + this._name + ': getAsocUserConnected: ─> resp.message', resp.message);
                        }
                        this.loading = false;
                        resolve(true);
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': getAsocUserConnected: error ─> ', err);
                        reject(true);
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': getAsocUserConnected: complete ─> ');
                    },
                });
            } catch (err: any) {
                console.log('Componente ' + this._name + ': getAsocUserConnected: err ─> ', err);
                reject(true);
            }
        });
    }

    fillFormData() {
        this.form = this._formBuilder.group({
            logo_asociation: new UntypedFormControl({ value: this.logoImg, disabled: false }, Validators.compose([])),
            long_name_asociation: new UntypedFormControl(
                { value: this.oldRecord.long_name_asociation, disabled: false },
                Validators.compose([Validators.required])
            ),
            short_name_asociation: new UntypedFormControl(
                { value: this.oldRecord.short_name_asociation, disabled: false },
                Validators.compose([Validators.required, Validators.maxLength(20)])
            ),
            email_asociation: new UntypedFormControl(
                { value: this.oldRecord.email_asociation, disabled: false },
                Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])
            ),
            name_contact_asociation: new UntypedFormControl(
                { value: this.oldRecord.name_contact_asociation, disabled: false },
                Validators.compose([Validators.maxLength(100)])
            ),
            phone_asociation: new UntypedFormControl(
                { value: this.oldRecord.phone_asociation, disabled: false },
                Validators.compose([Validators.pattern('')])
            ),
        });

        if (!this.isSuper && this._usersService.userProfile.id_asoc_admin.toString() !== this.oldRecord.id_asociation.toString()) {
            console.log('Componente ' + this._name + ': fillFormData: data ─> disable');
            this.logoAsociationField.disable();
            this.emailAsociationField.disable();
            this.phoneAsociationField.disable();
            this.nameContactAsociationField.disable();
            this.shortNameAsociationField.disable();
            this.longNameAsociationField.disable();

            this.imgReadonly = false;
        } else if (this.browseForm) {
            this.logoAsociationField.disable();
            this.longNameAsociationField.disable();
            this.shortNameAsociationField.disable();
            this.nameContactAsociationField.disable();
            this.emailAsociationField.disable();
            this.phoneAsociationField.disable();

            this.imgReadonly = true;
        } else {
            this.logoAsociationField.enable();
            this.longNameAsociationField.enable();
            this.shortNameAsociationField.enable();
            this.nameContactAsociationField.enable();
            this.emailAsociationField.enable();
            this.phoneAsociationField.enable();

            this.imgReadonly = false;
        }

        console.log('Componente ' + this._name + ': fillFormData: fin ─> ');
    }

    async manageAsociation() {
        console.log('Componente ' + this._name + ': manageAsociation:  this.form.value ─> ', this.form.value);
        console.log('Componente ' + this._name + ': manageAsociation:  this.oldRecord ─> ', this.oldRecord);
        if (this.form.valid) {
            try {
                if (this.optionsDialog.id === 'create') {
                    console.log('Componente ' + this._name + ': manageAsociation: this.optionsDialog.id ─> ', this.optionsDialog.id);
                    console.log('Componente ' + this._name + ': manageAsociation: this.oldRecord ─> ', this.oldRecord);

                    if (
                        this.form.value.long_name_asociation === '' ||
                        this.form.value.short_name_asociation === '' ||
                        this.form.value.email_asociation === ''
                    ) {
                        console.log('Componente ' + this._name + ': manageAsociation: error ─> not all data filled');
                        this._toastr.error('Missing required fields to fill.<br> Fill it in, please.', 'Not all data filled');
                        this.loading = false;
                        return;
                    }

                    let message = '';
                    let msgCreate = { status: '', message: '' };
                    let msgCreateLogo = { status: '', message: '' };

                    msgCreate = await this.createAsociation();
                    message = msgCreate.message;

                    if (msgCreate.status === 'ok') {
                        console.log('Componente ' + this._name + ': manageAsociation: msgCreate ─> ', msgCreate.status);
                        // console.log('Componente ' + this._name + ': manageAsociation: this.logoImg.src ─> ', this.logoImg.src);
                        console.log('Componente ' + this._name + ': manageAsociation: this.oldRecord ─> ', this.oldRecord);
                        // if (this.logoImg.src !== this.oldRecord.logo_asociation) {
                        console.log(
                            'Componente ' + this._name + ': manageAsociation: this.oldRecord.logo_asociation ─> ',
                            this.oldRecord.logo_asociation
                        );
                        console.log(
                            'Componente ' + this._name + ': manageAsociation: this.form.value.logo_asociation.src ─> ',
                            this.form.value.logo_asociation.src
                        );
                        if (this.oldRecord.logo_asociation !== this.form.value.logo_asociation.src) {
                            console.log('Componente ' + this._name + ': manageAsociation: ─> manageLogo');
                            msgCreateLogo = await this.manageLogo();
                            console.log('Componente ' + this._name + ': manageAsociation: msgCreateLogo ─> ', msgCreateLogo);
                            message += message === '' ? msgCreateLogo.message : ' <br>' + msgCreateLogo.message;
                        }
                    }

                    if (msgCreate.status === 'ok' && msgCreateLogo.status === 'ok') {
                        this.loading = false;
                        this._toastr.success(message, 'Asociation created ').onHidden.subscribe(() => {
                            console.log('Componente ' + this._name + ': manageAsociation createAsociation 1: this.asocResp ─> ', this.asocResp);
                            this.exitForm(this.asocResp);
                        });
                    } else if (msgCreate.status === 'ok' && msgCreateLogo.status === '') {
                        this.loading = false;
                        this._toastr.info(message, 'Asociation created').onHidden.subscribe(() => {
                            console.log('Componente ' + this._name + ': manageAsociation createAsociation 2: this.asocResp ─> ', this.asocResp);
                            this.exitForm(this.asocResp);
                        });
                    } else {
                        this.loading = false;
                        console.log('Componente ' + this._name + ': manageAsociation: error message ─> ', message);
                        this._toastr.error(message, 'Error creating Asociation');
                    }
                } else if (this.optionsDialog.id === 'edit') {
                    console.log('Componente ' + this._name + ': manageAsociation: this.optionsDialog.id ─> ', this.optionsDialog.id);
                    console.log('Componente ' + this._name + ': manageAsociation: this.oldRecord ─> ', this.oldRecord);

                    if (
                        this.oldRecord.long_name_asociation === this.form.value.long_name_asociation &&
                        this.oldRecord.short_name_asociation === this.form.value.short_name_asociation &&
                        this.oldRecord.email_asociation === this.form.value.email_asociation &&
                        this.oldRecord.phone_asociation === this.form.value.phone_asociation &&
                        this.oldRecord.logo_asociation === this.form.value.logo_asociation.src
                        // this.logoImg.src === this.oldRecord.logo_asociation
                    ) {
                        console.log('Componente ' + this._name + ': manageAsociation: error ─> not data changed');
                        this._toastr.error('Nothing for update.<br> No action made.', 'Not data changed');
                        this.loading = false;
                        return;
                    }

                    let message = '';
                    let msgEdit = { status: '', message: '' };
                    let msgEditLogo = { status: '', message: '' };

                    if (
                        this.oldRecord.long_name_asociation !== this.form.value.long_name_asociation ||
                        this.oldRecord.short_name_asociation !== this.form.value.short_name_asociation ||
                        this.oldRecord.email_asociation !== this.form.value.email_asociation ||
                        this.oldRecord.phone_asociation !== this.form.value.phone_asociation
                    ) {
                        msgEdit = await this.updateAsociacion();
                        message = msgEdit.message;
                    }

                    if (msgEdit.status === '' || msgEdit.status === 'ok') {
                        console.log('Componente ' + this._name + ': manageAsociation: msgEdit ─> ', msgEdit.status);
                        // console.log('Componente ' + this._name + ': manageAsociation: this.logoImg.src ─> ', this.logoImg.src);
                        console.log(
                            'Componente ' + this._name + ': manageAsociation: this.oldRecord.logo_asociation ─> ',
                            this.oldRecord.logo_asociation
                        );
                        // if (this.logoImg.src !== this.oldRecord.logo_asociation) {
                        if (this.oldRecord.logo_asociation !== this.form.value.logo_asociation.src) {
                            console.log('Componente ' + this._name + ': manageAsociation: ─> manageLogo');
                            msgEditLogo = await this.manageLogo();
                            console.log('Componente ' + this._name + ': manageAsociation: msgEditLogo ─> ', msgEditLogo);
                            message += message === '' ? msgEditLogo.message : ' <br>' + msgEditLogo.message;
                        }
                    }

                    if (msgEdit.status === 'ok' && msgEditLogo.status === 'ok') {
                        this.loading = false;
                        this._toastr.success(message, 'Updated asociation').onHidden.subscribe(() => {
                            console.log('Componente ' + this._name + ': manageAsociation updateAsociacion 1: this.asocResp ─> ', this.asocResp);
                            this.exitForm(this.asocResp);
                        });
                    } else if ((msgEdit.status === 'ok' && msgEditLogo.status === '') || (msgEdit.status === '' && msgEditLogo.status === 'ok')) {
                        this.loading = false;
                        this._toastr.info(message, 'Updated asociation').onHidden.subscribe(() => {
                            console.log('Componente ' + this._name + ': manageAsociation updateAsociacion 2: this.asocResp ─> ', this.asocResp);
                            this.exitForm(this.asocResp);
                        });
                    } else {
                        this.loading = false;
                        console.log('Componente ' + this._name + ': manageAsociation: error message ─> ', message);
                        this._toastr.error(message, 'Error Asociation Updated');
                    }
                } else if (this.optionsDialog.id === 'profile') {
                    console.log('Componente ' + this._name + ': manageAsociation: this.optionsDialog.id ─> ', this.optionsDialog.id);
                    console.log('Componente ' + this._name + ': manageAsociation: this.oldRecord ─> ', this.oldRecord);

                    if (
                        this.oldRecord.long_name_asociation === this.form.value.long_name_asociation &&
                        this.oldRecord.short_name_asociation === this.form.value.short_name_asociation &&
                        this.oldRecord.email_asociation === this.form.value.email_asociation &&
                        this.oldRecord.name_contact_asociation === this.form.value.name_contact_asociation &&
                        this.oldRecord.phone_asociation === this.form.value.phone_asociation &&
                        this.oldRecord.logo_asociation === this.form.value.logo_asociation.src
                        // this.logoImg.src === this.oldRecord.logo_asociation
                    ) {
                        console.log('Componente ' + this._name + ': manageAsociation: error ─> not data changed');
                        this._toastr.error('Nothing for update.<br> No action made.', 'Not data changed');
                        this.loading = false;
                        return;
                    }

                    let message = '';
                    let msgEdit = { status: '', message: '' };
                    let msgEditLogo = { status: '', message: '' };

                    if (
                        this.oldRecord.long_name_asociation !== this.form.value.long_name_asociation ||
                        this.oldRecord.name_contact_asociation !== this.form.value.name_contact_asociation ||
                        this.oldRecord.short_name_asociation !== this.form.value.short_name_asociation ||
                        this.oldRecord.email_asociation !== this.form.value.email_asociation ||
                        this.oldRecord.phone_asociation !== this.form.value.phone_asociation
                    ) {
                        msgEdit = await this.updateAsociacion();
                        message = msgEdit.message;
                    }

                    if (msgEdit.status === '' || msgEdit.status === 'ok') {
                        console.log('Componente ' + this._name + ': manageAsociation: msgEdit ─> ', msgEdit.status);
                        // console.log('Componente ' + this._name + ': manageAsociation: this.logoImg.src ─> ', this.logoImg.src);
                        console.log(
                            'Componente ' + this._name + ': manageAsociation: this.oldRecord.logo_asociation ─> ',
                            this.oldRecord.logo_asociation
                        );
                        // if (this.logoImg.src !== this.oldRecord.logo_asociation) {
                        if (this.oldRecord.logo_asociation !== this.form.value.logo_asociation.src) {
                            console.log('Componente ' + this._name + ': manageAsociation: ─> manageLogo');
                            msgEditLogo = await this.manageLogo();
                            console.log('Componente ' + this._name + ': manageAsociation: msgEditLogo ─> ', msgEditLogo);
                            message += message === '' ? msgEditLogo.message : ' <br>' + msgEditLogo.message;
                        }
                    }

                    if (msgEdit.status === 'ok' && msgEditLogo.status === 'ok') {
                        this.loading = false;
                        this._toastr.success(message, 'Updated asociation').onHidden.subscribe(() => {
                            console.log('Componente ' + this._name + ': manageAsociation updateAsociacion 1: this.asocResp ─> ', this.asocResp);
                            this.exitForm(this.asocResp);
                        });
                    } else if ((msgEdit.status === 'ok' && msgEditLogo.status === '') || (msgEdit.status === '' && msgEditLogo.status === 'ok')) {
                        this.loading = false;
                        this._toastr.info(message, 'Updated asociation').onHidden.subscribe(() => {
                            console.log('Componente ' + this._name + ': manageAsociation updateAsociacion 2: this.asocResp ─> ', this.asocResp);
                            this.exitForm(this.asocResp);
                        });
                    } else {
                        this.loading = false;
                        console.log('Componente ' + this._name + ': manageAsociation: error message ─> ', message);
                        this._toastr.error(message, 'Error Asociation Updated');
                    }
                } else {
                    this._toastr.info('Not options expected', 'Error updating asociation').onHidden.subscribe(() => {
                        console.log('Componente ' + this._name + ': manageAsociation: error ─> not options expected');
                        this.loading = false;
                    });
                }
            } catch (err: any) {
                this._toastr.info(err, 'Error updating asociation').onHidden.subscribe(() => {
                    console.log('Componente ' + this._name + ': manageAsociation: err ─> ', err);
                    this.loading = false;
                });
            }
        } else {
            this.loading = false;
            this.form.markAllAsTouched();
            this._toastr.error('Faltan datos por rellenar', 'Error data asociation', {
                timeOut: 3000,
            });
        }
    }

    async createAsociation(): Promise<IReplay> {
        console.log('Componente ' + this._name + ': createAsociation: ─> *********************************************************');

        return new Promise((resolve) => {
            const data: ICreateAsociation = {
                long_name_asociation: this.form.value.long_name_asociation,
                short_name_asociation: this.form.value.short_name_asociation,
                email_asociation: this.form.value.email_asociation,
                name_contact_asociation: this.form.value.name_contact_asociation,
                phone_asociation: this.form.value.phone_asociation,
            };

            console.log('Componente ' + this._name + ': createAsociation: data ─> ', data);
            try {
                this.loading = true;
                this._asociationsService.createAsociation(data).subscribe({
                    next: async (resp: any) => {
                        console.log('Componente ' + this._name + ': createAsociation: resp ─> ', resp);
                        if (resp.status === 200) {
                            this.asocResp.data = resp.result.records[0];
                            resolve({ status: 'ok', message: 'La asociación se actualizó con exito' });
                        } else {
                            // this.userProfile = this._usersService.resetStoredProfile();
                            // this.msg(resp.message);
                            resolve({ status: 'error', message: resp.message });
                        }
                        // this.loading = false;
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': createAsociation: error ─> perfil', err.message);
                        // this.userProfile = this._usersService.resetStoredProfile();
                        resolve({ status: 'error', message: err.message });
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': createAsociation: complete ─> perfil');
                    },
                });
            } catch (error: any) {
                // this.loading = false;
                console.log('Componente ' + this._name + ': createAsociation: catch error ─> ', error);
                // this.msg(error);
                resolve({ status: 'abort', message: error });
            }
        });
    }

    async updateAsociacion(): Promise<IReplay> {
        console.log('Componente ' + this._name + ': updateAsociacion: this.form.value ─> ', this.form.value);
        return new Promise((resolve) => {
            const data = {
                id_asociation: this.oldRecord.id_asociation,
                long_name_asociation: this.form.value.long_name_asociation,
                short_name_asociation: this.form.value.short_name_asociation,
                email_asociation: this.form.value.email_asociation,
                name_contact_asociation: this.form.value.name_contact_asociation,
                phone_asociation: this.form.value.phone_asociation,
                date_updated_asociation: this.oldRecord.date_updated_asociation ? this.oldRecord.date_updated_asociation : '',
            };

            console.log('Componente ' + this._name + ': updateAsociacion: data ─> ', data);
            try {
                this.loading = true;
                this._asociationsService.modifyAsociation(data).subscribe({
                    next: async (resp: any) => {
                        console.log('Componente ' + this._name + ': updateAsociacion: resp ─> ', resp);
                        if (resp.status === 200) {
                            this.asocResp.data = resp.result.records[0];
                            if (this.asocResp.data.id_asociation === this._usersService.userProfile.id_asoc_admin) {
                                this.userProfile = this._usersService.modifyDataAsociationStoreProfile(this.asocResp.data);
                            }
                            resolve({ status: 'ok', message: 'La asociación se actualizó con exito' });
                        } else {
                            // this.userProfile = this._usersService.resetStoredProfile();
                            // this.msg(resp.message);
                            resolve({ status: 'error', message: resp.message });
                        }
                        // this.loading = false;
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': updateAsociacion: error ─> perfil', err);
                        // this.userProfile = this._usersService.resetStoredProfile();
                        console.log('Componente ' + this._name + ': updateAsociacion: ─> this.userProfile', this.userProfile);
                        resolve({ status: 'error', message: err });
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': updateAsociacion: complete ─> perfil');
                    },
                });
            } catch (error: any) {
                // this.loading = false;
                console.log('Componente ' + this._name + ': updateAsociacion: catch error ─> ', error);
                // this.msg(error);
                resolve({ status: 'abort', message: error });
            }
        });
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

    async manageLogo() {
        // if (this.logoImg.src === this.logoUrlDefault && this.oldRecord.logo_asociation !== this.logoUrlDefault) {
        if (this.form.value.logo_asociation.src === this.logoUrlDefault && this.oldRecord.logo_asociation !== this.logoUrlDefault) {
            try {
                const respDelete: any = await this.deleteLogo();
                console.log('Componente ' + this._name + ': manageLogo: deleteLogo ─> ', respDelete);
                if (respDelete.message === 'ok') {
                    this.asocResp.data = respDelete.result.records[0];
                    console.log('Componente ' + this._name + ': manageLogo: deleteLogo ok ─> ', respDelete);
                    return { status: 'ok', message: 'Logo deleted successfully' };
                } else {
                    console.log('Componente ' + this._name + ': manageLogo: deleteLogo error ─> ', respDelete.message, respDelete.code);
                    return { status: 'error', message: respDelete.body.message };
                }
            } catch (error: any) {
                console.log('Componente ' + this._name + ': manageLogo: deleteLogo error ─> ', error);
                return { status: 'abort', message: 'Unexpected error deleting logo' };
            }
        } else {
            // if (this.oldRecord.logo_asociation !== this.logoImg.src) {
            if (this.oldRecord.logo_asociation !== this.form.value.logo_asociation.src) {
                try {
                    console.log('Componente ' + this._name + ': manageLogo: uploadLogo () ─> ');
                    const respUpload: any = await this.uploadLogo();
                    console.log('Componente ' + this._name + ': manageLogo: uploadLogo respUpload ─> ', respUpload);
                    if (respUpload.body.message === 'ok') {
                        this.asocResp.data = respUpload.body.result.records[0];
                        console.log('Componente ' + this._name + ': manageLogo: uploadLogo this.asocResp ─> ', this.asocResp);
                        return { status: 'ok', message: 'Logo modified successfully' };
                    } else {
                        console.log('Componente ' + this._name + ': manageLogo: uploadLogo respUpload.body.message ─> ', respUpload.body.message);
                        return { status: 'error', message: respUpload.body.message };
                    }
                } catch (error: any) {
                    console.log('Componente ' + this._name + ': manageLogo: uploadLogo error ─> ', error);
                    return { status: 'error', message: 'Unknown error uploading logo' };
                }
            } else {
                console.log('Componente ' + this._name + ': manageLogo: uploadLogo  ─> ', 'Nothing to upload.');
                return { status: 'error', message: 'Nothing to upload.' };
            }
        }
    }

    uploadLogo(): Promise<any> {
        // const authHeaders = ''; // await this._usersService.getAuthHeaders();

        return new Promise(async (resolve, _reject) => {
            console.log('Componente ' + this._name + ': uploadLogo: this.asocResp.data ─> ', this.asocResp.data);
            console.log('Componente ' + this._name + ': uploadLogo: this.logoImg.isSelectedFile ─> ', this.logoImg.isSelectedFile);
            console.log(
                'Componente ' + this._name + ': uploadLogo: this.form.value.logo_asociation.isSelectedFile ─> ',
                this.form.value.logo_asociation.isSelectedFile
            );
            // if (this.logoImg.isSelectedFile) {
            if (this.form.value.logo_asociation.isSelectedFile) {
                const fd = new FormData();
                fd.append('action', 'asociation');
                fd.append('token', this._usersService.userProfile.token_user);
                fd.append('user_id', this.asocResp.data.id_asociation.toString());
                fd.append('module', 'asociations');
                fd.append('prefix', 'logos' + '/asociation-' + this.asocResp.data.id_asociation);
                // fd.append('name', this.logoImg.nameFile);
                fd.append('name', this.form.value.short_name_asociation.replace(' ', '_') + '.png');
                fd.append('date_updated', this.asocResp.data.date_updated_asociation);
                fd.append('file', this.form.value.logo_asociation.fileImage, this.asocResp.data.short_name_asociation.replace(' ', '_') + '.png');
                // if (this.logoImg.fileImage !== null) {
                // }
                this._asociationsService.uploadLogo(fd).subscribe({
                    next: (event: any) => {
                        console.log('Componente ' + this._name + ': uploadLogo: event ─> ', event);
                        if (event.type === HttpEventType.UploadProgress) {
                            console.log(
                                'Componente ' + this._name + ': uploadLogo: Upload progress ─> ',
                                event.total ? Math.round(event.loaded / event.total) * 100 + ' %' : '--'
                            );
                        } else if (event.type === HttpEventType.Response) {
                            console.log('Componente ' + this._name + ': uploadLogo: response event ─> ', event);
                            resolve(event);
                        }
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': uploadLogo: error ─> ', err);
                        resolve(err);
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': uploadLogo: complete ─> post uploadLogo');
                    },
                });
            } else {
                resolve(null);
            }
        });
    }

    deleteLogo(): Promise<any> {
        return new Promise((resolve, _reject) => {
            const fd = new FormData();
            fd.append('action', 'delete');
            fd.append('token', this._usersService.userProfile.token_user);
            fd.append('user_id', this.oldRecord.id_asociation.toString());
            fd.append('module', 'asociations');
            fd.append('prefix', 'logos' + '/asociation-' + this.oldRecord.id_asociation);
            fd.append('name', this.logoImg.nameFile);
            fd.append('date_updated', this.asocResp.data.date_updated_asociation);
            this._asociationsService.deleteLogo(fd).subscribe({
                next: (event: any) => {
                    console.log('Componente ' + this._name + ': deleteLogo: event ─> ', event);
                    resolve(event);
                },
                error: (err: any) => {
                    console.log('Componente ' + this._name + ': deleteLogo: error ─> ', err);
                    resolve(err);
                },
                complete: () => {
                    console.log('Componente ' + this._name + ': deleteLogo: complete ─> post ulrUploadFile');
                },
            });
        });
    }

    exitForm(datosSalida: IResponseActionsUsers | any) {
        if (datosSalida === null) {
            datosSalida = { action: 'exit', data: '', replay: { status: '', message: '' } };
        }
        console.log('Componente ' + this._name + ': exitForm:  ─> this.salir.emit: ', datosSalida);
        this.salir.emit(datosSalida);
    }

    get logoAsociationField(): any {
        return this.form.get('logo_asociation');
    }

    get logoAsociationIsValid(): boolean {
        return this.form.get('logo_asociation')!.valid && this.form.get('logo_asociation')!.touched;
    }

    get logoAsociationIsInvalid(): boolean {
        return this.form.get('logo_asociation')!.invalid && this.form.get('logo_asociation')!.touched;
    }

    get longNameAsociationField(): any {
        return this.form.get('long_name_asociation');
    }

    get longNameAsociationIsValid(): boolean {
        return this.form.get('long_name_asociation')!.valid && this.form.get('long_name_asociation')!.touched;
    }

    get longNameAsociationIsInvalid(): boolean {
        return this.form.get('long_name_asociation')!.invalid && this.form.get('long_name_asociation')!.touched;
    }

    get shortNameAsociationField(): any {
        return this.form.get('short_name_asociation');
    }

    get shortNameAsociationIsValid(): boolean {
        return this.form.get('short_name_asociation')!.valid && this.form.get('short_name_asociation')!.touched;
    }

    get shortNameAsociationIsInvalid(): boolean {
        return this.form.get('short_name_asociation')!.invalid && this.form.get('short_name_asociation')!.touched;
    }

    get nameContactAsociationField(): any {
        return this.form.get('name_contact_asociation');
    }

    get nameContactAsociationIsValid(): boolean {
        return this.form.get('name_contact_asociation')!.valid && this.form.get('name_contact_asociation')!.touched;
    }

    get nameContactAsociationIsInvalid(): boolean {
        return this.form.get('name_contact_asociation')!.invalid && this.form.get('name_contact_asociation')!.touched;
    }

    get phoneAsociationField(): any {
        return this.form.get('phone_asociation');
    }

    get phoneAsociationIsValid(): boolean {
        return this.form.get('phone_asociation')!.valid && this.form.get('phone_asociation')!.touched;
    }

    get phoneAsociationIsInvalid(): boolean {
        return this.form.get('phone_asociation')!.invalid && this.form.get('phone_asociation')!.touched;
    }

    get emailAsociationField(): any {
        return this.form.get('email_asociation');
    }

    get emailAsociationIsValid(): boolean {
        return this.form.get('email_asociation')!.valid && this.form.get('email_asociation')!.touched;
    }

    get emailAsociationIsInvalid(): boolean {
        return this.form.get('email_asociation')!.invalid && this.form.get('email_asociation')!.touched;
    }
}
