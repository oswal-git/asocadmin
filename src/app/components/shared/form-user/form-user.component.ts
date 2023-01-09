import { AsociationsService } from '@app/services/bd/asociations.service';
import { Component, DoCheck, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { faCalendarPlus, faCircleXmark, faClockRotateLeft, faEnvelope, faKey, faKeyboard, faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import { HttpEventType } from '@angular/common/http';
import { ACTION_AVATAR, ICreateUser, IOptionsDialog, IReplay, IResponseActionsUsers } from '@app/interfaces/ui/dialogs.interface';
import { IEglImagen, ISelectValues } from '@app/shared/controls';
import { IProfileUsuario, IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { USERS_CONST } from '@app/data/constants/users.const';
import { UsersService } from '@app/services/bd/users.service';
import { IListAsociationData } from '@app/interfaces/api/iapi-asociation.metadata';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-form-user',
    templateUrl: './form-user.component.html',
    styleUrls: ['./form-user.component.scss'],
})
export class FormUserComponent implements OnInit, OnChanges, DoCheck {
    private _name = 'FormUserComponent';
    private userProfile!: IUserConnected;
    userProfileOSubscription!: Subscription;
    isLogin: boolean = false;

    @Input('options') optionsDialog!: IOptionsDialog;
    @Output() salir = new EventEmitter<IResponseActionsUsers>();

    loading = false;
    form!: UntypedFormGroup;
    loginForm = false;
    createForm = false;
    browseForm = true;
    profileForm = false;
    registerForm = false;
    editForm = false;
    userResp: IResponseActionsUsers = { action: '', data: null, replay: { status: '', message: '' } };

    // avatar
    logoUrlDefault = environment.urlApi2 + '/assets/img/images.jpg';
    avatarUrlDefault = environment.urlApi2 + '/assets/img/user.png';
    avatarScrDefault = environment.urlApi2 + '/assets/img/user.png';
    avatarImg: IEglImagen = {
        src: this.avatarScrDefault,
        nameFile: '',
        filePath: '',
        fileImage: null,
        isSelectedFile: false,
        isDefault: this.avatarUrlDefault === this.avatarScrDefault,
        isChange: false,
    };
    avatarIniImg: IEglImagen = {
        src: this.avatarScrDefault,
        nameFile: '',
        filePath: '',
        fileImage: null,
        isSelectedFile: false,
        isDefault: this.avatarUrlDefault === this.avatarScrDefault,
        isChange: false,
    };
    isAvatarUrlDefault = true;
    // avatarUrl = this.avatarUrlDefault;
    iconCtrlDefault: string = environment.urlApi2 + '/assets/img/option1.jpg';

    oldRecord: IProfileUsuario = {
        id_user: 0,
        id_asociation_user: 0,
        user_name_user: '',
        email_user: '',
        token_user: '',
        recover_password_user: 0,
        token_exp_user: 0,
        profile_user: 'asociado',
        status_user: 'nuevo',
        name_user: '',
        last_name_user: '',
        avatar_user: this.avatarUrlDefault,
        phone_user: '',
        date_deleted_user: '',
        date_created_user: '',
        date_updated_user: '',
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

    // select control
    listAsociations: IListAsociationData[] = [];
    asociations: ISelectValues[] = [];
    asociationImgCtrl: string = environment.urlApi2 + '/assets/img/asociation.jpg';
    status: any[] = [];
    statusImgCtrl: string = environment.urlApi2 + '/assets/img/status.jpg';
    profiles: any[] = [];
    profileImgCtrl: string = environment.urlApi2 + '/assets/img/status.jpg';

    emailMaxLength: number = 30;
    userNamUserMaxLength: number = 15;
    phoneUserMaxLength: number = 15;

    userNameUserMinLength: number = 4;
    nameUserMinLength: number = 4;
    lastNameUserMinLength: number = 4;
    passwordMinLength: number = 4;

    durationInSeconds = 2;

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    hasUser = false;
    hasAsociations = false;

    count = 0;
    countInit = 0;
    countCheck = 0;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private router: Router,
        private _snackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _usersService: UsersService,
        private _asociationsService: AsociationsService
    ) {
        this.loading = true;
        this.isSuper = false;
        this.isAdmin = false;

        console.log('Componente ' + this._name + ': constructor: subscribe user ─> ');
        if (!this.userProfileOSubscription) {
            this.userProfileOSubscription = this._usersService.userProfile.subscribe({
                next: (user: IUserConnected) => {
                    console.log('Componente ' + this._name + ': constructor: subscribe user ─> ', user);
                    this.isLogin = user.token_user !== '' ? true : false;
                    this.userProfile = user;
                    if (user.profile_user === 'superadmin') {
                        this.isSuper = true;
                    } else if (user.id_asoc_admin !== 0) {
                        this.isAdmin = true;
                    }
                },
                error: (err: any) => {
                    console.log('Componente ' + this._name + ': constructor: error ─> ', err);
                },
                complete: () => {
                    console.log('Componente ' + this._name + ': constructor: complete ─> ');
                },
            });
        }
    }

    ngOnChanges(): void {
        ++this.count;
        console.log('Componente ' + this._name + ': ngOnChanges:  ─> ');
        // console.log('Componente ' + this._name + ': ngOnChanges: this.optionsDialog 1 (' + this.count + ') ─> ', this.optionsDialog);
        // console.log('Componente ' + this._name + ': ngOnChanges: this.count ─> ', this.count);
        // console.log(
        //     'Componente ' + this._name + ': ngOnChanges: typeof this.optionsDialog.options (' + this.count + ') ─> ',
        //     typeof this.optionsDialog.options
        // );
        // console.log('Componente ' + this._name + ': ngOnChanges: this.optionsDialog.options (' + this.count + ') ─> ', this.optionsDialog.options);

        if (this.optionsDialog.options.fin === undefined) {
            // console.log(
            //     'Componente ' + this._name + ': ngOnChanges: this.optionsDialog.options 2 (' + this.count + ') ─> ',
            //     this.optionsDialog.options
            // );
            // console.log('Componente ' + this._name + ': ngOnChanges: this.optionsDialog.options.fin ─> ', this.optionsDialog.options.fin);
            this.optionsDialog.options['fin'] = true;
            // console.log('Componente ' + this._name + ': ngOnChanges: this.optionsDialog.options.fin 2 ─> ', this.optionsDialog.options.fin);
        }
    }

    ngOnInit() {
        ++this.countInit;
        console.log('Componente ' + this._name + ': ngOnInit:  ─> ');
        (async () => {
            this.getStatusAndProfiles();
            await this.getAsociations();
        })();

        // console.log('Componente ' + this._name + ': ngOnInit: this.optionsDialog(' + this.countInit + ')  ─>', this.optionsDialog);
        if (this.optionsDialog.id === 'profile') {
            this.checkOpts = false;
            this.userResp.action = this.optionsDialog.id;
            // console.log('Componente ' + this._name + ': ngOnInit: this.optionsDialog.id (' + this.countInit + ')  ─>', this.optionsDialog.id);
            this.getDataUserConnected();
            // console.log('Componente ' + this._name + ': ngOnInit: this.oldRecord(' + this.countInit + ') ─> ', this.oldRecord);
            if (this.oldRecord.avatar_user === '') {
                // this.avatarUrl = this.avatarUrlDefault;
                this.oldRecord.avatar_user = this.avatarUrlDefault;
            } else {
                // this.avatarUrl = this.oldRecord.avatar_user;
            }

            this.userResp.data = this.oldRecord;
            // console.log('Componente ' + this._name + ': ngOnInit: this.userResp(' + this.countInit + ') ─> ', this.userResp);
            this.browseForm = false;
            this.profileForm = this.optionsDialog.id === 'profile';
            // console.log('Componente ' + this._name + ': ngOnInit: this.optionsDialog(' + this.countInit + ') ─> ', this.optionsDialog);

            // this.fillFormData();
            // this.loading = false;
        } else {
            this.checkOpts = true;
        }
        // this.checkOptions();
    }

    ngDoCheck() {
        ++this.countCheck;
        // console.log('Componente ' + this._name + ': ngDoCheck:  ─> ');
        // console.log('Componente ' + this._name + ': ngDoCheck: this.optionsDialog(' + this.countCheck + ') ─> ', this.optionsDialog);
        if (this.checkOpts) {
            this.checkOptions();
        }
    }

    checkOptions() {
        // console.log('Componente ' + this._name + ': checkOptions: this.checkOpts(' + this.countCheck + ') ─> ', this.checkOpts);
        if (this.checkOpts) {
            // console.log('Componente ' + this._name + ': checkOptions: this.optionsDialog(' + this.countCheck + ') ─> ', this.optionsDialog);

            if (this.optionsDialog) {
                // console.log('Componente ' + this._name + ': checkOptions: this.optionsDialog(' + this.countCheck + ') ─> ');
                this.userResp.action = this.optionsDialog.id;
                this.hasUser = true;
                if (this.optionsDialog.id !== 'create' && this.optionsDialog.id !== 'register' && this.optionsDialog.id !== 'profile') {
                    this.oldRecord = this.optionsDialog.record;
                    // console.log('Componente ' + this._name + ': checkOptions: this.oldRecord(' + this.countCheck + ') ─> ', this.oldRecord);
                    this.oldRecord.avatar_user = this.oldRecord.avatar_user !== '' ? this.oldRecord.avatar_user : this.avatarScrDefault;
                    this.avatarImg = {
                        src: this.oldRecord.avatar_user,
                        nameFile: this.oldRecord.avatar_user.split(/[\\/]/).pop() || '',
                        filePath: '',
                        fileImage: null,
                        isSelectedFile: false,
                        isDefault: this.avatarUrlDefault === this.oldRecord.avatar_user,
                        isChange: false,
                    };
                }

                // console.log('Componente ' + this._name + ': checkOptions: this.oldRecord2(' + this.countCheck + ') ─> ', this.oldRecord);
                // console.log(
                //     'Componente ' + this._name + ': checkOptions: this._usersService.userProfile (' + this.countCheck + ') ─> ',
                //     this._usersService.userProfile
                // );

                if (this.userProfile.id_asociation_user !== 0) {
                    this.oldRecord.id_asociation_user = this.userProfile.id_asociation_user;
                }

                // console.log('Componente ' + this._name + ': checkOptions: this.oldRecord3(' + this.countCheck + ') ─> ', this.oldRecord);

                this.createForm = this.optionsDialog.id === 'create';
                this.editForm = this.optionsDialog.id === 'edit';
                this.browseForm = this.optionsDialog.id === 'browse';
                this.registerForm = this.optionsDialog.id === 'register';
                this.profileForm = this.optionsDialog.id === 'profile';
                this.loginForm = this.optionsDialog.id === 'login';

                if (this.createForm) console.log('Componente ' + this._name + ': checkOptions: this.createForm ─> ', this.createForm);
                if (this.editForm) console.log('Componente ' + this._name + ': checkOptions: this.editForm ─> ', this.editForm);
                if (this.browseForm) console.log('Componente ' + this._name + ': checkOptions: this.browseForm ─> ', this.browseForm);
                if (this.registerForm) console.log('Componente ' + this._name + ': checkOptions: this.registerForm ─> ', this.registerForm);
                if (this.profileForm) console.log('Componente ' + this._name + ': checkOptions: this.profileForm ─> ', this.profileForm);
                if (this.loginForm) console.log('Componente ' + this._name + ': checkOptions: this.loginForm ─> ', this.loginForm);

                // console.log('Componente ' + this._name + ': checkOptions: this.optionsDialog(' + this.countCheck + ') ─> ', this.optionsDialog);
            }

            if (this.optionsDialog.options.fin) {
                // console.log('Componente ' + this._name + ': checkOptions: this.checkOpts(' + this.countCheck + ') ─> ', this.checkOpts, ' -> false');
                this.checkOpts = false;
                this.userResp.data = this.oldRecord;
                // console.log('Componente ' + this._name + ': checkOptions: this.userResp.data(' + this.countCheck + ') ─> ', this.userResp.data);
                if (this.hasAsociations && this.hasUser) {
                    // console.log('Componente ' + this._name + ': checkOptions: fillFormData(' + this.countCheck + ') ─> ');
                    this.fillFormData();
                    this.loading = false;
                }
            }
        }
    }

    fillFormData() {
        // console.log('Componente ' + this._name + ': fillFormData: this.oldRecord(' + this.count + ') ─> ', this.oldRecord);
        // console.log('Componente ' + this._name + ': fillFormData: this.userResp(' + this.count + ') ─> ', this.userResp);

        this.form = this._formBuilder.group({
            user_name_user: new UntypedFormControl(this.oldRecord.user_name_user, Validators.compose([Validators.required])),
            name_user: new UntypedFormControl({ value: this.oldRecord.name_user, disabled: false }, Validators.compose([Validators.required])),
            last_name_user: new UntypedFormControl(
                { value: this.oldRecord.last_name_user, disabled: false },
                Validators.compose([Validators.required])
            ),
            status_user: new UntypedFormControl(this.oldRecord.status_user, Validators.compose([Validators.required])),
            id_asociation_user: new UntypedFormControl(
                {
                    value: this.oldRecord.id_asociation_user === 0 ? 0 : this.oldRecord.id_asociation_user,
                    disabled: false,
                    // disabled: this.isSuper || this.registerForm || this.profileForm ? false : !this.createForm ? true : true,
                },
                Validators.compose([Validators.required])
            ),
            email_user: new UntypedFormControl(
                { value: this.oldRecord.email_user, disabled: false },
                Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])
            ),
            // avatar: new FormControl({ value: this.avatarUrl, disabled: this.browseForm ? true : false }, Validators.compose([])),
            profile_user: new UntypedFormControl(
                {
                    value: this.oldRecord.profile_user,
                    disabled: false,
                },
                Validators.compose([Validators.required])
            ),
            phone_user: new UntypedFormControl({ value: this.oldRecord.phone_user, disabled: false }, Validators.compose([Validators.pattern('')])),
            password_user: new UntypedFormControl(
                { value: '', disabled: false },
                Validators.compose([Validators.required, Validators.minLength(this.passwordMinLength)])
            ),
        });

        if (this.createForm || this.registerForm) {
            this.form.get('email_user')!.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]);
            this.form.get('id_asociation_user')!.setValidators(Validators.required);
            this.form.get('password_user')!.setValidators(Validators.required);
            this.form.get('password_user')!.addValidators(Validators.minLength(this.passwordMinLength));
            this.form.get('status_user')!.clearValidators();
        } else {
            this.form.get('email_user')!.clearValidators();
            this.form.get('id_asociation_user')!.clearValidators();
            this.form.get('password_user')!.clearValidators();
        }
        // console.log('Componente ' + this._name + ': fillFormData: this.form.value(' + this.count + ') ─> ', this.form.value);

        // console.log('Componente ' + this._name + ': fillFormData: this.isAdmin(' + this.count + ') ─> ', this.isAdmin);
        // console.log(
        //     'Componente ' + this._name + ': fillFormData: this._usersService.userProfile.id_user(' + this.count + ') ─> ',
        //     this._usersService.userProfile.id_user
        // );
        // console.log(
        //     'Componente ' + this._name + ': fillFormData: typeof this._usersService.userProfile.id_user(' + this.count + ') ─> ',
        //     typeof this._usersService.userProfile.id_user
        // );
        // console.log('Componente ' + this._name + ': fillFormData: this.oldRecord.id_user(' + this.count + ') ─> ', this.oldRecord.id_user);
        // console.log(
        //     'Componente ' + this._name + ': fillFormData: typeof this.oldRecord.id_user(' + this.count + ') ─> ',
        //     typeof this.oldRecord.id_user
        // );

        switch (true) {
            case this.browseForm:
                this.idAsociationUserField.disable();
                this.userNameUserField.disable();
                this.nameUserField.disable();
                this.lastNameUserField.disable();
                this.emailField.disable();
                this.passwordField.disable();
                this.phoneUserField.disable();
                this.profileUserField.disable();
                this.statusUserField.disable();

                break;

            case this.registerForm:
                this.idAsociationUserField.enable();
                this.userNameUserField.enable();
                this.nameUserField.enable();
                this.lastNameUserField.enable();
                this.emailField.enable();
                this.profileUserField.disable();
                this.statusUserField.disable();
                this.phoneUserField.enable();
                this.passwordField.enable();

                break;

            case this.profileForm:
                if (this.isAdmin) {
                    this.idAsociationUserField.disable();
                } else {
                    this.idAsociationUserField.enable();
                }
                this.userNameUserField.enable();
                this.nameUserField.enable();
                this.lastNameUserField.enable();
                this.emailField.disable();
                this.passwordField.disable();
                this.profileUserField.disable();
                this.statusUserField.disable();
                this.phoneUserField.enable();

                break;

            case this.createForm:
                if (this.isSuper) {
                    this.idAsociationUserField.enable();
                } else {
                    this.idAsociationUserField.disable();
                }
                this.userNameUserField.enable();
                this.nameUserField.enable();
                this.lastNameUserField.enable();
                this.emailField.enable();
                this.passwordField.enable();
                this.phoneUserField.enable();
                this.profileUserField.enable();
                this.statusUserField.enable();

                break;

            case this.editForm:
                if (this.isAdmin && this.userProfile.id_user.toString() === this.oldRecord.id_user.toString()) {
                    this.idAsociationUserField.disable();
                    this.profileUserField.disable();
                    this.statusUserField.disable();
                } else {
                    this.idAsociationUserField.enable();
                    this.profileUserField.enable();
                    this.statusUserField.enable();
                }
                this.userNameUserField.enable();
                this.nameUserField.enable();
                this.lastNameUserField.enable();
                this.emailField.disable();
                this.passwordField.disable();
                this.phoneUserField.enable();

                break;

            default:
                break;
        }

        // if (this.isAdmin && this.userProfile.id_user.toString() === this.oldRecord.id_user.toString()) {
        //     console.log('Componente ' + this._name + ': fillFormData: userProfile(' + this.count + ') ─> disable');
        //     this.idAsociationUserField.disable();
        //     this.profileUserField.disable();
        //     this.statusUserField.disable();
        // }
    }

    // funciones validadoras a incluir en el array Validators
    conditionallyRequiredValidator(formGroup: UntypedFormGroup) {
        if (this.createForm) {
            return Validators.required(formGroup.get('email_user')!)
                ? {
                      myemail_userFieldConditionallyRequired: true,
                  }
                : null;
        }
        return null;
    }

    passwordMatchValidator(g: UntypedFormGroup) {
        return g.get('password_user')!.value === g.get('password_userRepeat')!.value ? null : { mismatch: true };
    }

    async getAsociations(): Promise<boolean> {
        // console.log(
        //     'Componente ' + this._name + ': getAsociations: this.userProfile.asociation_id(' + this.count + '): ',
        //     this._usersService.userProfile.id_asociation_user
        // );
        return new Promise((resolve, reject) => {
            try {
                this._asociationsService.getListAsociations().subscribe({
                    next: (resp: any) => {
                        // console.log('Componente ' + this._name + ': getAsociations:(' + this.count + ') ─> resp', resp);
                        if (resp.status === 200) {
                            this.listAsociations = resp.result.records;
                            // console.log(
                            //     'Componente ' + this._name + ': getAsociations:(' + this.count + ') ─> this.listAsociations',
                            //     this.listAsociations
                            // );
                            this.asociations = this.listAsociations.map((record: any) => {
                                return {
                                    url: record.logo_asociation === '' ? this.logoUrlDefault : record.logo_asociation,
                                    caption: record.long_name_asociation,
                                    id: record.id_asociation,
                                };
                            });
                            // console.log('Componente ' + this._name + ': getAsociations:(' + this.count + ') ─> this.asociations', this.asociations);
                        } else {
                            console.log('Componente ' + this._name + ': getAsociations: resp.message(' + this.count + ') ─> ', resp.message);
                            this.msg(resp.message);
                        }
                        this.hasAsociations = true;
                        // console.log(
                        //     'Componente ' + this._name + ': getAsociations: this.hasAsociations(' + this.countCheck + ') ─> ',
                        //     this.hasAsociations
                        // );
                        if (this.hasAsociations && this.hasUser) {
                            // console.log('Componente ' + this._name + ': getAsociations: fillFormData(' + this.countCheck + ') ─> ');
                            this.fillFormData();
                            this.loading = false;
                        }
                        // console.log('Componente ' + this._name + ': getAsociations: resolve(' + this.countCheck + ') ─> ');
                        resolve(true);
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': getAsociations: error(' + this.count + ') ─> ', err);
                        reject(err);
                    },
                    complete: () => {
                        // console.log('Componente ' + this._name + ': getAsociaciones: complete(' + this.count + ') ─> ');
                    },
                });
            } catch (err: any) {
                this.msg(err);
                console.log('Componente ' + this._name + ': getAsociaciones: err(' + this.count + ') ─> ', err);
                reject(err);
            }
        });
    }

    getNameAsociation(asoc_id: number): string {
        // console.log('Componente ' + this._name + ': getNameAsociation: asoc_id ─> ', asoc_id);
        // console.log('Componente ' + this._name + ': getNameAsociation: ─> this.asociations', this.asociations);
        const asoc: IListAsociationData[] = this.listAsociations.filter(
            (asoc: IListAsociationData) => asoc.id_asociation.toString() === asoc_id.toString()
        );
        if (asoc.length === 1) {
            // console.log('Componente ' + this._name + ': getNameAsociation: asoc[0].short_name_asociation ─> ', asoc[0].short_name_asociation);
            return asoc[0].short_name_asociation;
        } else {
            // console.log('Componente ' + this._name + ': getNameAsociation: asoc[0].short_name_asociation ─> ', '--');
            return ' -- ';
        }
    }

    getDataAsociation(asoc_id: number): IListAsociationData | null {
        // console.log('Componente ' + this._name + ': getNameAsociation: asoc_id ─> ', asoc_id);
        // console.log('Componente ' + this._name + ': getNameAsociation: ─> this.asociations', this.asociations);
        const asoc: IListAsociationData[] = this.listAsociations.filter(
            (asoc: IListAsociationData) => asoc.id_asociation.toString() === asoc_id.toString()
        );
        if (asoc.length === 1) {
            // console.log('Componente ' + this._name + ': getNameAsociation: asoc[0].short_name_asociation ─> ', asoc[0].short_name_asociation);
            return asoc[0];
        } else {
            // console.log('Componente ' + this._name + ': getNameAsociation: asoc[0].short_name_asociation ─> ', '--');
            return null;
        }
    }

    getStatusAndProfiles() {
        this.profiles = USERS_CONST.USERS_PROFILES;
        this.status = USERS_CONST.USERS_SITUATION;
        return '';
    }

    getDataUserConnected() {
        if (this.userProfile.token_user !== '') {
            console.log(
                'Componente ' + this._name + ': getDataUserConnected: this._usersService.userProfile (' + this.count + ') ─> ',
                this._usersService.userProfile
            );
            try {
                this.oldRecord = {
                    id_user: this.userProfile.id_user,
                    id_asociation_user: this.userProfile.id_asociation_user,
                    user_name_user: this.userProfile.user_name_user,
                    email_user: this.userProfile.email_user,
                    token_user: this.userProfile.token_user,
                    recover_password_user: this.userProfile.recover_password_user,
                    token_exp_user: this.userProfile.token_exp_user,
                    profile_user: this.userProfile.profile_user,
                    status_user: this.userProfile.status_user,
                    name_user: this.userProfile.name_user,
                    last_name_user: this.userProfile.last_name_user,
                    avatar_user: this.userProfile.avatar_user,
                    phone_user: this.userProfile.phone_user,
                    date_deleted_user: this.userProfile.date_deleted_user,
                    date_created_user: this.userProfile.date_created_user,
                    date_updated_user: this.userProfile.date_updated_user,
                };
                const src = this.userProfile.avatar_user !== '' ? this.userProfile.avatar_user : this.avatarScrDefault;
                this.avatarImg = {
                    src: src,
                    nameFile: src.split(/[\\/]/).pop() || '',
                    filePath: '',
                    fileImage: null,
                    isSelectedFile: false,
                    isDefault: this.avatarUrlDefault === src,
                    isChange: false,
                };
                console.log('Componente ' + this._name + ': getDataUserConnected: this.avatarImg ─> ', this.avatarImg);

                this.hasUser = true;
                console.log('Componente ' + this._name + ': getDataUserConnected: this.hasUser(' + this.countCheck + ') ─> ', this.hasUser);
                if (this.hasAsociations && this.hasUser) {
                    console.log('Componente ' + this._name + ': getDataUserConnected: fillFormData(' + this.countCheck + ') ─> ');
                    this.fillFormData();
                    this.loading = false;
                }
            } catch (err: any) {
                console.log('Componente ' + this._name + ': getDataUserConnected: err ─> ', err);
            }
        } else {
            console.log('Componente ' + this._name + ': getDataUserConnected: ─> ', 'user no logged');
        }
    }

    async manageUser(event: Event) {
        event.preventDefault();

        console.log('Componente ' + this._name + ': manageUser:  this.form.value ─> ', this.form.value);
        console.log('Componente ' + this._name + ': manageUser:  this.avatarImg ─> ', this.avatarImg);
        console.log('Componente ' + this._name + ': manageUser:  this.oldRecord ─> ', this.oldRecord);
        console.log('Componente ' + this._name + ': manageUser:  this.optionsDialog ─> ', this.optionsDialog);
        if (this.form.valid) {
            try {
                if (this.optionsDialog.id === 'register') {
                    if (
                        this.form.value.id_asociation_user === 0 &&
                        this.form.value.user_name_user === '' &&
                        this.form.value.name_user === '' &&
                        this.form.value.last_name_user === '' &&
                        this.form.value.email_user === '' &&
                        this.form.value.password_user === ''
                    ) {
                        console.log('Componente ' + this._name + ': manageUser: error ─> not all data filled');
                        this._toastr.error('Missing fields to fill.<br> Fill it in, please.', 'Not all data filled');
                        this.loading = false;
                        return;
                    }

                    let message = '';
                    let msgRegisterProfile = { status: '', message: '' };
                    // let msgRegisterAvatar = { status: 'ok', message: '' };

                    msgRegisterProfile = await this.registerUser();
                    console.log('Componente ' + this._name + ': manageUser: msgRegisterProfile ─> ', msgRegisterProfile);
                    message = msgRegisterProfile.message;

                    // if (this.avatarImg.isSelectedFile) {
                    //     console.log('Componente ' + this._name + ': manageUser: manageAvatar ─> manageAvatar');
                    //     msgRegisterAvatar = await this.manageAvatar();
                    //     message += message === '' ? msgRegisterAvatar.message : ' \n' + msgRegisterAvatar.message;
                    // }

                    if (msgRegisterProfile.status === 'ok') {
                        this.loading = false;
                        this._toastr.success(message, 'Profile created successfully').onHidden.subscribe(() => {
                            this.router.navigateByUrl('/login');
                        });
                        // } else if (msgRegisterProfile.status === 'ok' ) {
                        //     this.loading = false;
                        //     this._toastr.info(message, 'Profile created successfully').onHidden.subscribe(() => {
                        //         this.router.navigateByUrl('/login');
                        //     });
                    } else {
                        this.loading = false;
                        this._toastr.error(message, 'Error creating profile');
                    }
                } else if (this.optionsDialog.id === 'create') {
                    console.log('Componente ' + this._name + ': manageUser: ─> createUser');

                    if (
                        (!this.isSuper && this.form.value.id_asociation_user === 0) ||
                        this.form.value.user_name_user === '' ||
                        this.form.value.name_user === '' ||
                        this.form.value.last_name_user === '' ||
                        this.form.value.email_user === '' ||
                        this.form.value.password_user === '' ||
                        this.form.value.profile_user === '' ||
                        this.form.value.status_user === ''
                    ) {
                        console.log('Componente ' + this._name + ': manageUser: error ─> not all data filled');
                        this._toastr.error('Missing required fields to fill.<br> Fill it in, please.', 'Not all data filled');
                        this.loading = false;
                        return;
                    }

                    let message = '';
                    let msgCreateUser = { status: 'ok', message: '' };
                    let msgCreateAvatar = { status: '', message: '' };

                    // if (
                    //     this.form.value.id_asociation_user !== 0 ||
                    //     this.form.value.user_name_user !== '' ||
                    //     this.form.value.name_user !== '' ||
                    //     this.form.value.last_name_user !== '' ||
                    //     this.form.value.email_user !== '' ||
                    //     this.form.value.password_user !== '' ||
                    //     this.form.value.phone_user !== '' ||
                    //     this.form.value.profile_user !== '' ||
                    //     this.form.value.status_user !== ''
                    // ) {
                    msgCreateUser = await this.createUser();
                    message = msgCreateUser.message;
                    // }

                    if (msgCreateUser.status === 'ok') {
                        console.log('Componente ' + this._name + ': manageUser: msgCreateUser ─> ok');
                        // console.log('Componente ' + this._name + ': manageUser: this.avatarImg.src ─> ', this.avatarImg.src);
                        console.log('Componente ' + this._name + ': manageUser: this.oldRecord.avatar_user ─> ', this.oldRecord.avatar_user);
                        if (this.avatarImg.src !== this.oldRecord.avatar_user) {
                            console.log('Componente ' + this._name + ': manageUser: manageAvatar ─> manageAvatar');
                            msgCreateAvatar = await this.manageAvatar(ACTION_AVATAR.user);
                            message += message === '' ? msgCreateAvatar.message : ' <br>' + msgCreateAvatar.message;
                        }
                    }

                    if (msgCreateUser.status === 'ok' && msgCreateAvatar.status === 'ok') {
                        this.userResp.data.avatar_user = '';
                        this.oldRecord.avatar_user = this.avatarUrlDefault;
                        this.loading = false;
                        this._toastr.success(message, 'User create successfully').onHidden.subscribe(() => {
                            console.log('Componente ' + this._name + ': manageUser createUser 1: this.userResp ─> ', this.userResp);
                            this.exitForm(this.userResp);
                        });
                    } else if (msgCreateUser.status === 'ok' && msgCreateAvatar.status === '') {
                        this.loading = false;
                        this._toastr.info(message, 'User create successfully').onHidden.subscribe(() => {
                            console.log('Componente ' + this._name + ': manageUser createUser 2: this.userResp ─> ', this.userResp);
                            this.exitForm(this.userResp);
                        });
                    } else {
                        this.loading = false;
                        console.log('Componente ' + this._name + ': manageUser: error message ─> ', message);
                        this._toastr.error(message, 'Error Creating User');
                    }
                } else if (this.optionsDialog.id === 'edit') {
                    console.log('Componente ' + this._name + ': manageUser: ─> ', this.optionsDialog.id);

                    if (
                        this.oldRecord.id_asociation_user === this.form.value.id_asociation_user &&
                        this.oldRecord.user_name_user === this.form.value.user_name_user &&
                        this.oldRecord.name_user === this.form.value.name_user &&
                        this.oldRecord.last_name_user === this.form.value.last_name_user &&
                        this.oldRecord.profile_user === this.form.value.profile_user &&
                        this.oldRecord.status_user === this.form.value.status_user &&
                        this.oldRecord.phone_user === this.form.value.phone_user &&
                        this.avatarImg.src === this.oldRecord.avatar_user
                    ) {
                        console.log('Componente ' + this._name + ': manageUser: error ─> not data changed');
                        this._toastr.error('Nothing for update.<br> No action made.', 'Not data changed');
                        this.loading = false;
                        return;
                    }

                    let message = '';
                    let msgEdit = { status: '', message: '' };
                    let msgEditAvatar = { status: '', message: '' };

                    if (
                        this.oldRecord.id_asociation_user !== this.form.value.id_asociation_user ||
                        this.oldRecord.user_name_user !== this.form.value.user_name_user ||
                        this.oldRecord.name_user !== this.form.value.name_user ||
                        this.oldRecord.last_name_user !== this.form.value.last_name_user ||
                        this.oldRecord.profile_user !== this.form.value.profile_user ||
                        this.oldRecord.status_user !== this.form.value.status_user ||
                        this.oldRecord.phone_user !== this.form.value.phone_user
                    ) {
                        msgEdit = await this.updateUser();
                        message = msgEdit.message;
                    }

                    if (msgEdit.status === '' || msgEdit.status === 'ok') {
                        console.log('Componente ' + this._name + ': manageUser: msgEdit ─> ', msgEdit.status);
                        // console.log('Componente ' + this._name + ': manageUser: this.avatarImg.src ─> ', this.avatarImg.src);
                        console.log('Componente ' + this._name + ': manageUser: this.oldRecord.avatar_user ─> ', this.oldRecord.avatar_user);
                        if (this.avatarImg.src !== this.oldRecord.avatar_user) {
                            console.log('Componente ' + this._name + ': manageUser: ─> manageAvatar');
                            msgEditAvatar = await this.manageAvatar(ACTION_AVATAR.user);
                            console.log('Componente ' + this._name + ': manageUser: msgEditAvatar ─> ', msgEditAvatar);
                            message += message === '' ? msgEditAvatar.message : ' <br>' + msgEditAvatar.message;
                        }
                    }

                    if (msgEdit.status === 'ok' && msgEditAvatar.status === 'ok') {
                        this.loading = false;
                        this._toastr.success(message, 'Updated user').onHidden.subscribe(() => {
                            console.log('Componente ' + this._name + ': manageUser editUser 1: this.userResp ─> ', this.userResp);
                            this.exitForm(this.userResp);
                        });
                    } else if ((msgEdit.status === 'ok' && msgEditAvatar.status === '') || (msgEdit.status === '' && msgEditAvatar.status === 'ok')) {
                        this.loading = false;
                        this._toastr.info(message, 'Updated user').onHidden.subscribe(() => {
                            console.log('Componente ' + this._name + ': manageUser editUser 1: this.userResp ─> ', this.userResp);
                            this.exitForm(this.userResp);
                        });
                    } else {
                        this.loading = false;
                        console.log('Componente ' + this._name + ': manageUser: error message ─> ', message);
                        this._toastr.error(message, 'Error User Updated');
                    }
                } else if (this.optionsDialog.id === 'profile') {
                    console.log('Componente ' + this._name + ': manageUser: profile: this.avatarImg.isChange ─> ', this.avatarImg.isChange);
                    if (
                        this.oldRecord.user_name_user === this.form.value.user_name_user &&
                        this.oldRecord.name_user === this.form.value.name_user &&
                        this.oldRecord.last_name_user === this.form.value.last_name_user &&
                        this.oldRecord.phone_user === this.form.value.phone_user &&
                        this.oldRecord.id_asociation_user ===
                            (this.isAdmin ? this.oldRecord.id_asociation_user : this.form.value.id_asociation_user) &&
                        this.avatarImg.src === this.oldRecord.avatar_user
                    ) {
                        console.log('Componente ' + this._name + ': manageUser: error ─> not data changed');
                        this._toastr.error('Nothing for update.<br> No action made.', 'Not data changed');
                        this.loading = false;
                        return;
                    }

                    let message = '';
                    let msgUpdateProfile = { status: 'ok', message: '' };
                    let msgmanageAvatar = { status: 'ok', message: '' };

                    if (
                        this.oldRecord.user_name_user !== this.form.value.user_name_user ||
                        this.oldRecord.name_user !== this.form.value.name_user ||
                        this.oldRecord.last_name_user !== this.form.value.last_name_user ||
                        this.oldRecord.phone_user !== this.form.value.phone_user ||
                        this.oldRecord.id_asociation_user !== (this.isAdmin ? this.oldRecord.id_asociation_user : this.form.value.id_asociation_user)
                    ) {
                        msgUpdateProfile = await this.updateProfile();
                        console.log('Componente ' + this._name + ': manageUser: msgUpdateProfile ─> ', msgUpdateProfile);
                        message = msgUpdateProfile.message;
                    }

                    if (msgUpdateProfile.status === 'ok' || msgUpdateProfile.status === 'success') {
                        console.log('Componente ' + this._name + ': manageUser: msgUpdateProfile ─> ok');
                        // console.log('Componente ' + this._name + ': manageUser: this.avatarImg.src ─> ', this.avatarImg.src);
                        console.log('Componente ' + this._name + ': manageUser: this.oldRecord.avatar_user ─> ', this.oldRecord.avatar_user);

                        if (this.avatarImg.src !== this.oldRecord.avatar_user) {
                            console.log('Componente ' + this._name + ': manageUser: ─> manageAvatar');
                            msgmanageAvatar = await this.manageAvatar(ACTION_AVATAR.profile);
                            console.log('Componente ' + this._name + ': manageUser: msgmanageAvatar ─> ', msgmanageAvatar);
                            message += message === '' ? msgmanageAvatar.message : ' <br>' + msgmanageAvatar.message;
                        }
                    }

                    if (msgUpdateProfile.status === 'ok' && msgmanageAvatar.status === 'ok') {
                        this.loading = false;
                        this._toastr.success(message, 'Updated profile').onHidden.subscribe(() => {
                            this.exitForm(this.userResp);
                            // window.location.reload();
                        });
                    } else if (msgUpdateProfile.status === 'ok' || msgmanageAvatar.status === 'ok') {
                        this.loading = false;
                        this._toastr.info(message, 'Updated profile').onHidden.subscribe(() => {
                            this.exitForm(this.userResp);
                            // window.location.reload();
                        });
                    } else {
                        this.loading = false;
                        console.log('Componente ' + this._name + ': manageUser: error message ─> ', message);
                        this._toastr.error(message, 'Error Profile Updated');
                    }
                } else {
                    console.log('Componente ' + this._name + ': manageUser: error ─> not options expected');
                    this.loading = false;
                    this._toastr.error('Not options expected', 'Error Profile Updated');
                }
            } catch (err: any) {
                console.log('Componente ' + this._name + ': manageUser: err ─> ', err);
                this.loading = false;
                this._toastr.error(err, 'Error Profile Updated');
            }
        } else {
            this.loading = false;
            this.form.markAllAsTouched();
            this._toastr.error('Faltan datos por rellenar', 'Error Profile Updated', {
                timeOut: 3000,
            });
        }
    }

    async registerUser(): Promise<IReplay> {
        return new Promise((resolve) => {
            console.log('Componente ' + this._name + ': registerUser:  this.form.value ─> ', this.form.value);
            console.log('Componente ' + this._name + ': registerUser: avatarImg ─> ', this.avatarImg);
            const data = {
                id_asociation_user: this.form.value.id_asociation_user,
                user_name_user: this.form.value.user_name_user,
                email_user: this.form.value.email_user,
                password_user: this.form.value.password_user,
                profile_user: 'asociado',
                status_user: 'nuevo',
                name_user: this.form.value.name_user,
                last_name_user: this.form.value.last_name_user,
                phone_user: this.form.value.phone_user,
            };
            console.log('Componente ' + this._name + ': registerUser: data ─> ', data);
            try {
                this.loading = true;
                this._usersService.registerUser(data).subscribe({
                    next: async (resp: any) => {
                        console.log('Componente ' + this._name + ': registerUser: ─> resp', resp);
                        if (resp.status === 200) {
                            resolve({ status: 'ok', message: 'El perfil se creó con exito' });
                        } else {
                            console.log('Componente ' + this._name + ': registerUser: error ─> resp', resp);
                            resolve({ status: 'error', message: resp.message });
                        }
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': registerUser: error ─> perfil', err);
                        resolve({ status: 'error', message: err });
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': registerUser: complete ─> perfil');
                    },
                });
            } catch (error: any) {
                // this.loading = false;
                console.log('Componente ' + this._name + ': registerUser: catch error ─> ', error);
                // this.msg(error);
                resolve({ status: 'abort', message: error });
            }
        });
    }

    async updateProfile(): Promise<IReplay> {
        console.log('Componente ' + this._name + ': updateProfile: this.form.value ─> ', this.form.value);
        return new Promise((resolve) => {
            const data = {
                id_user: this.oldRecord.id_user,
                id_asociation_user: this.isAdmin ? this.oldRecord.id_asociation_user : this.form.value.id_asociation_user,
                user_name_user: this.form.value.user_name_user,
                name_user: this.form.value.name_user,
                last_name_user: this.form.value.last_name_user,
                phone_user: this.form.value.phone_user,
                date_updated_user: this.oldRecord.date_updated_user ? this.oldRecord.date_updated_user : '',
            };

            console.log('Componente ' + this._name + ': updateProfile: data ─> ', data);
            try {
                this.loading = true;
                this._usersService.updateProfile(data).subscribe({
                    next: async (resp: any) => {
                        if (resp.status === 200) {
                            this.userResp.data = resp.result.data_user;
                            this.updateOldRecord(this.userResp.data);
                            this.userProfile = this._usersService.modifyStoreProfile(this.userResp.data);
                            this.oldRecord.date_updated_user = resp.result.data_user.date_updated_user;
                            console.log('Componente ' + this._name + ': updateProfile: ─> this.userProfile', this.userProfile);
                            //TODO: upload image
                            // this.msg('El perfil se actualizao con exito');
                            // this.router.navigateByUrl('/dashboard');
                            resolve({ status: 'ok', message: 'El perfil se actualizó con exito' });
                        } else {
                            // this.userProfile = this._usersService.resetStoredProfile();
                            // this.msg(resp.message);
                            resolve({ status: 'error', message: resp.message });
                        }
                        // this.loading = false;
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': updateProfile: error ─> perfil', err.error);
                        // this.userProfile = this._usersService.resetStoredProfile();
                        console.log('Componente ' + this._name + ': updateProfile: ─> this.userProfile', this.userProfile);
                        resolve({ status: 'error', message: err.error.message });
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': updateProfile: complete ─> perfil');
                    },
                });
            } catch (error: any) {
                // this.loading = false;
                console.log('Componente ' + this._name + ': updateProfile: catch error ─> ', error);
                // this.msg(error);
                resolve({ status: 'abort', message: error });
            }
        });
    }

    async createUser(): Promise<IReplay> {
        console.log('Componente ' + this._name + ': createUser: avatarImg ─> ', this.avatarImg);
        return new Promise((resolve) => {
            const data: ICreateUser = {
                id_asociation_user:
                    this.userProfile.id_asociation_user === 0 ? this.form.value.id_asociation_user : this.userProfile.id_asociation_user,
                user_name_user: this.form.value.user_name_user,
                name_user: this.form.value.name_user,
                last_name_user: this.form.value.last_name_user,
                email_user: this.form.value.email_user,
                password_user: this.form.value.password_user,
                phone_user: this.form.value.phone_user,
                profile_user: this.form.value.profile_user,
                status_user: this.form.value.status_user,
            };
            console.log('Componente ' + this._name + ': createUser: data ─> ', data);
            try {
                this.loading = true;
                this._usersService.createUser(data).subscribe({
                    next: async (resp: any) => {
                        console.log('Componente ' + this._name + ': createUser: resp ─> ', resp);
                        if (resp.status === 200) {
                            this.userResp.data = resp.result.records[0];
                            this.updateOldRecord(this.userResp.data);
                            console.log('Componente ' + this._name + ': createUser: this.userResp ─> ', this.userResp);
                            resolve({ status: 'ok', message: 'El usuario se creó con exito' });
                        } else {
                            console.log('Componente ' + this._name + ': createUser: error ─> resp.message', resp.message);
                            resolve({ status: 'error', message: resp.message });
                        }
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': createUser: error ─> create', err.error);
                        resolve({ status: 'error', message: err.error.message });
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': createUser: complete ─> create');
                    },
                });
            } catch (error: any) {
                this.loading = false;
                console.log('Componente ' + this._name + ': createUser: catch error ─> ', error);
                this.msg(error);
            }
        });
    }

    async updateUser(): Promise<IReplay> {
        console.log('Componente ' + this._name + ': updateUser: this.form.value ─> ', this.form.value);
        return new Promise((resolve) => {
            const data = {
                id_user: this.oldRecord.id_user,
                id_asociation_user: this.form.value.id_asociation_user,
                user_name_user: this.form.value.user_name_user,
                name_user: this.form.value.name_user,
                last_name_user: this.form.value.last_name_user,
                profile_user: this.form.value.profile_user,
                status_user: this.form.value.status_user,
                phone_user: this.form.value.phone_user,
                date_updated_user: this.oldRecord.date_updated_user ? this.oldRecord.date_updated_user : '',
            };

            console.log('Componente ' + this._name + ': updateUser: data ─> ', data);
            try {
                this.loading = true;
                this._usersService.editUser(data).subscribe({
                    next: async (resp: any) => {
                        if (resp.status === 200) {
                            this.userResp.data = resp.result.data_user;
                            if (this.userResp.data.id_asociation_user !== this.oldRecord.id_asociation_user) {
                                const dataAsoc = this.getDataAsociation(this.userResp.data.id_asociation_user);
                                if (dataAsoc) {
                                    this.userResp.data.short_name_asociation = dataAsoc.short_name_asociation;
                                    this.userResp.data.long_name_asociation = dataAsoc.long_name_asociation;
                                    this.userResp.data.logo_asociation = dataAsoc.logo_asociation;
                                } else {
                                    this.userResp.data.short_name_asociation = '';
                                    this.userResp.data.long_name_asociation = '';
                                    this.userResp.data.logo_asociation = '';
                                }
                            }
                            if (this.userResp.data.id_user === this.userProfile.id_user) {
                                this.userProfile = this._usersService.modifyStoreProfile(this.userResp.data);
                            }
                            this.updateOldRecord(this.userResp.data);
                            resolve({ status: 'ok', message: 'El usuario se actualizó con exito' });
                        } else {
                            // this.userProfile = this._usersService.resetStoredProfile();
                            // this.msg(resp.message);
                            resolve({ status: 'error', message: resp.message });
                        }
                        // this.loading = false;
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': updateUser: error ─> perfil', err);
                        // this.userProfile = this._usersService.resetStoredProfile();
                        console.log('Componente ' + this._name + ': updateUser: ─> this.userProfile', this.userProfile);
                        resolve({ status: 'error', message: err });
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': updateUser: complete ─> perfil');
                    },
                });
            } catch (error: any) {
                // this.loading = false;
                console.log('Componente ' + this._name + ': updateUser: catch error ─> ', error);
                // this.msg(error);
                resolve({ status: 'abort', message: error });
            }
        });
    }

    // Gestión de los avatares
    async manageAvatar(action: ACTION_AVATAR) {
        console.log('Componente ' + this._name + ': manageAvatar: this.avatarUrlDefault ─> ', this.avatarUrlDefault);
        console.log('Componente ' + this._name + ': manageAvatar: this.oldRecord.avatar_user ─> ', this.oldRecord.avatar_user);
        // console.log('Componente ' + this._name + ': manageAvatar: this.avatarImg.src ─> ', this.avatarImg.src);
        console.log('Componente ' + this._name + ': manageAvatar: this.avatarImg.isChange ─> ', this.avatarImg.isChange);
        if (this.avatarImg.src === this.avatarUrlDefault && this.oldRecord.avatar_user !== this.avatarUrlDefault) {
            try {
                console.log('Componente ' + this._name + ': manageAvatar: deleteAvatars () ─> ');
                const respDelete: any = await this.deleteAvatars(action);
                console.log('Componente ' + this._name + ': manageAvatar: deleteAvatars respDelete ─> ', respDelete);
                if (respDelete.status === 'success') {
                    // this._usersService.updateProfileAvatar(this.avatarUrlDefault);
                    // this.userResp.data.avatar_user = '';
                    // this.userResp.data.date_updated_user = '';
                    // this.oldRecord.avatar_user = this.avatarUrlDefault;
                    console.log('Componente ' + this._name + ': manageAvatar: deleteAvatars this.userResp ─> ', this.userResp);
                    this.userResp.data = respDelete.result[0];
                    if (action === ACTION_AVATAR.profile || this.userResp.data.id_user.toString() === this.userProfile.id_user.toString()) {
                        this._usersService.modifyStoreProfile(respDelete.result[0]);
                    }
                    this.updateOldRecord(this.userResp.data);
                    console.log('Componente ' + this._name + ': manageAvatar: deleteAvatars this.oldRecord ─> ', this.oldRecord);
                    return { status: 'ok', message: 'Avatar modified successfully' };
                } else {
                    console.log('Componente ' + this._name + ': manageAvatar: uploadAvatar respUpload.message ─> ', respDelete.message);
                    // this.msg(respDelete.body.message);
                    return { status: 'error', message: respDelete.message };
                }
            } catch (error) {
                console.log('Componente ' + this._name + ': manageAvatar: deleteAvatars error ─> ', error);
                // this.msg('Unexpected error uploading avatar');
                return { status: 'abort', message: 'Unexpected error uploading avatar' };
            }
        } else {
            if (this.oldRecord.avatar_user !== this.avatarImg.src) {
                try {
                    console.log('Componente ' + this._name + ': manageAvatar: uploadAvatar () ─> ');
                    const respUpload = await this.uploadAvatar(action);
                    console.log('Componente ' + this._name + ': manageAvatar: uploadAvatar respUpload ─> ', respUpload);
                    if (respUpload.status === 'success') {
                        console.log('Componente ' + this._name + ': manageAvatar: uploadAvatar this.userResp ─> ', this.userResp);
                        this.userResp.data = respUpload.result[0];
                        // console.log(
                        //     'Componente ' + this._name + ': manageAvatar: uploadAvatar respUpload.body.result.url ─> ',
                        //     respUpload.body.result.url
                        // );
                        if (action === ACTION_AVATAR.profile || this.userResp.data.id_user.toString() === this.userProfile.id_user.toString()) {
                            this._usersService.modifyStoreProfile(respUpload.result[0]);
                        }
                        this.updateOldRecord(this.userResp.data);
                        console.log('Componente ' + this._name + ': manageAvatar: uploadAvatar this.oldRecord ─> ', this.oldRecord);
                        return { status: 'ok', message: 'Avatar modified successfully' };
                    } else {
                        console.log('Componente ' + this._name + ': manageAvatar: uploadAvatar respUpload.message ─> ', respUpload.message);
                        // this.msg(respUpload.body.message);
                        return { status: 'error', message: respUpload.message };
                    }
                } catch (error) {
                    console.log('Componente ' + this._name + ': manageAvatar: uploadAvatar error ─> ', error);
                    // this.msg('User created. Unexpected error uploading avatar');
                    return { status: 'abort', message: 'Unexpected error uploading avatar' };
                }
            } else {
                console.log('Componente ' + this._name + ': manageAvatar: uploadAvatar  ─> ', 'Nothing to upload.');
                // this.msg(respUpload.body.message);
                return { status: 'error', message: 'Nothing to upload.' };
            }
        }
    }

    async uploadAvatar(action: ACTION_AVATAR): Promise<any> {
        // console.log('Componente ' + this._name + ': uploadAvatar: ─> init');
        return new Promise((resolve, _reject) => {
            const id_user = action === ACTION_AVATAR.user ? this.userResp.data.id_user : this.userProfile.id_user.toString();
            const user_name_user = action === ACTION_AVATAR.user ? this.userResp.data.user_name_user : this.userProfile.user_name_user;

            const fd = new FormData();
            // console.log('Componente ' + this._name + ': uploadAvatar: this.avatarImg.isSelectedFile ─> ', this.avatarImg.isSelectedFile);
            if (this.avatarImg.isSelectedFile) {
                fd.append('action', action);
                fd.append('token', this.userProfile.token_user);
                fd.append('user_id', id_user);
                fd.append('module', 'users');
                fd.append('prefix', 'avatars' + '/user-' + id_user); // delete
                // fd.append('name', this.avatarImg.nameFile);
                fd.append('user_name', user_name_user);
                fd.append('name', user_name_user + '.png');
                fd.append('date_updated', this.userResp.data.date_updated_user);
                // console.log('Componente ' + this._name + ': uploadAvatar: this.avatarImg!.fileImage ─> ', typeof this.avatarImg!.fileImage);
                // fd.append('file', this.avatarImg.fileImage, this.avatarImg.nameFile);
                fd.append('file', this.avatarImg.fileImage, user_name_user + '.png');
                // if (this.avatarImg.fileImage !== null) {
                // }
                this._usersService.uploadAvatar(fd).subscribe({
                    next: (event: any) => {
                        if (event.type === HttpEventType.UploadProgress) {
                            console.log(
                                'Componente ' + this._name + ': uploadAvatar: Upload progress ─> ',
                                event.total ? Math.round(event.loaded / event.total) * 100 + ' %' : '--'
                            );
                        } else if (event.type === HttpEventType.Response) {
                            console.log('Componente ' + this._name + ': uploadAvatar: event ─> ', event);

                            resolve({ status: 'success', message: '', result: event.body.result.records });
                        }
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': uploadAvatar: error ─> ', err.error);
                        resolve({ status: 'error', message: err.error.message, result: null });
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': uploadAvatar: complete ─> post ulrUploadFile');
                    },
                });
            } else {
                resolve(null);
            }
        });
    }

    async deleteAvatars(action: ACTION_AVATAR): Promise<any> {
        return new Promise((resolve, _reject) => {
            const fd = new FormData();
            const id_user = action === ACTION_AVATAR.user ? this.userResp.data.id_user : this.userProfile.id_user.toString();
            fd.append('action', 'delete');
            fd.append('token', this.userProfile.token_user);
            fd.append('user_id', id_user);
            fd.append('module', 'users');
            fd.append('prefix', 'avatars' + '/user-' + id_user);
            fd.append('name', this.avatarImg.nameFile);
            fd.append('date_updated', this.userResp.data.date_updated_user);
            // console.log('Componente ' + this._name + ': uploadAvatar: this.avatarImg!.fileImage ─> ', typeof this.avatarImg!.fileImage);
            // fd.append('file', this.avatarImg.fileImage, this.avatarImg.nameFile);
            // if (this.avatarImg.fileImage !== null) {
            // }
            this._usersService.deleteAvatar(fd).subscribe({
                next: (event: any) => {
                    console.log('Componente ' + this._name + ': deleteAvatars: event ─> ', event);
                    resolve({ status: 'success', message: '', result: event.result.records });
                },
                error: (err: any) => {
                    console.log('Componente ' + this._name + ': deleteAvatars: error ─> ', err.error);
                    resolve({ status: 'error', message: err.error.message, result: null });
                },
                complete: () => {
                    console.log('Componente ' + this._name + ': deleteAvatars: complete ─> post ulrUploadFile');
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

    msg(msg: string, action: string = '') {
        this._snackBar.open(this.toNewLineString(msg), action, {
            duration: this.durationInSeconds * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            panelClass: 'snack-bar',
        });
    }

    toNewLineString(input: string) {
        var lines = input.split('\\n');
        var output = '';
        lines.forEach((element) => {
            output += element + '\n';
        });
        return output;
    }

    get userNameUserField(): any {
        return this.form.get('user_name_user');
    }

    get userNameUserIsValid(): boolean {
        return this.form.get('user_name_user')!.valid && this.form.get('user_name_user')!.touched;
    }

    get userNameUserIsInvalid(): boolean {
        return this.form.get('user_name_user')!.invalid && this.form.get('user_name_user')!.touched;
    }

    get nameUserField(): any {
        return this.form.get('name_user');
    }

    get nameUserIsValid(): boolean {
        return this.form.get('name_user')!.valid && this.form.get('name_user')!.touched;
    }

    get nameUserIsInvalid(): boolean {
        return this.form.get('name_user')!.invalid && this.form.get('name_user')!.touched;
    }

    get lastNameUserField(): any {
        return this.form.get('last_name_user');
    }

    get lastNameUserIsValid(): boolean {
        return this.form.get('last_name_user')!.valid && this.form.get('last_name_user')!.touched;
    }

    get lastNameUserIsInvalid(): boolean {
        return this.form.get('last_name_user')!.invalid && this.form.get('last_name_user')!.touched;
    }

    get idAsociationUserField(): any {
        return this.form.get('id_asociation_user');
    }

    get idAsociationUserIsValid(): boolean {
        return this.form.get('id_asociation_user')!.valid && this.form.get('id_asociation_user')!.touched;
    }

    get idAsociationUserIsInvalid(): boolean {
        return this.form.get('id_asociation_user')!.invalid && this.form.get('id_asociation_user')!.touched;
    }

    get emailField(): any {
        return this.form.get('email_user');
    }

    get emailIsValid(): boolean {
        return this.form.get('email_user')!.valid && this.form.get('email_user')!.touched;
    }

    get emailIsInvalid(): boolean {
        return this.form.get('email_user')!.invalid && this.form.get('email_user')!.touched;
    }

    get passwordField(): any {
        return this.form.get('password_user');
    }

    get passwordIsValid(): boolean {
        return this.form.get('password_user')!.valid && this.form.get('password_user')!.touched;
    }

    get passwordIsInvalid(): boolean {
        return this.form.get('password_user')!.invalid && this.form.get('password_user')!.touched;
    }

    get phoneUserField(): any {
        return this.form.get('phone_user');
    }

    get phoneUserIsValid(): boolean {
        return this.form.get('phone_user')!.valid && this.form.get('phone_user')!.touched;
    }

    get phoneUserIsInvalid(): boolean {
        return this.form.get('phone_user')!.invalid && this.form.get('phone_user')!.touched;
    }

    get profileUserField(): any {
        return this.form.get('profile_user');
    }

    get profileUserIsValid(): boolean {
        return this.form.get('profile_user')!.valid && this.form.get('profile_user')!.touched;
    }

    get profileUserIsInvalid(): boolean {
        return this.form.get('profile_user')!.invalid && this.form.get('profile_user')!.touched;
    }

    get statusUserField(): any {
        return this.form.get('status_user');
    }

    get statusUserIsValid(): boolean {
        return this.form.get('status_user')!.valid && this.form.get('status_user')!.touched;
    }

    get statusUserIsInvalid(): boolean {
        return this.form.get('status_user')!.invalid && this.form.get('status_user')!.touched;
    }

    async createUserAndAvatar() {
        console.log('Componente ' + this._name + ': createUserAndAvatar:  this.form.value ─> ', this.form.value);
        console.log('Componente ' + this._name + ': createUserAndAvatar:  this.avatarImg ─> ', this.avatarImg);
        console.log('Componente ' + this._name + ': createUserAndAvatar:  this.oldRecord ─> ', this.oldRecord);
        console.log('Componente ' + this._name + ': createUserAndAvatar:  this.optionsDialog ─> ', this.optionsDialog);
        if (this.form.valid) {
            console.log('Componente ' + this._name + ': createUserAndAvatar: ─> createUser');

            if (
                (!this.isSuper && this.form.value.id_asociation_user === 0) ||
                this.form.value.user_name_user === '' ||
                this.form.value.name_user === '' ||
                this.form.value.last_name_user === '' ||
                this.form.value.email_user === '' ||
                this.form.value.password_user === '' ||
                this.form.value.profile_user === '' ||
                this.form.value.status_user === ''
            ) {
                console.log('Componente ' + this._name + ': createUserAndAvatar: error ─> not all data filled');
                this._toastr.error('Missing required fields to fill.<br> Fill it in, please.', 'Not all data filled');
                this.loading = false;
                return;
            }

            let isDataUserModify = false;
            let isAvatarUserModify = false;
            if (
                this.form.value.id_asociation_user !== 0 ||
                this.form.value.user_name_user !== '' ||
                this.form.value.name_user !== '' ||
                this.form.value.last_name_user !== '' ||
                this.form.value.email_user !== '' ||
                this.form.value.password_user !== '' ||
                this.form.value.phone_user !== '' ||
                this.form.value.profile_user !== '' ||
                this.form.value.status_user !== ''
            ) {
                isDataUserModify = true;
            }

            if (this.avatarImg.src !== this.oldRecord.avatar_user) {
                isAvatarUserModify = true;
            }

            // create User ==> isDataUserModify = true
            if (isDataUserModify && isAvatarUserModify) {
                //createUserAndAvatar
            } else if (isDataUserModify && !isAvatarUserModify) {
                //createUser
            }

            console.log('Componente ' + this._name + ': createUserAndAvatar: isDataUserModify ─>', isDataUserModify);
            console.log('Componente ' + this._name + ': createUserAndAvatar: manageAvatar ─> manageAvatar');

            if (this.avatarImg.isSelectedFile) {
                const fd = new FormData();
                fd.append('title', 'Título');
                fd.append('description', 'Description image');
                fd.append('action', ACTION_AVATAR.user);
                fd.append('token', this.userProfile.token_user);
                fd.append('module', 'users');
                // fd.append('name', this.avatarImg.nameFile);
                fd.append('name', this.form.value.name_user);
                fd.append('date_updated', this.userResp.data.date_updated_user);
                // console.log('Componente ' + this._name + ': uploadAvatar: this.avatarImg!.fileImage ─> ', typeof this.avatarImg!.fileImage);
                // fd.append('file', this.avatarImg.fileImage, this.avatarImg.nameFile);
                fd.append('file', this.avatarImg.fileImage, this.form.value.name_user);

                this._usersService.uploadAvatar(fd).subscribe({
                    next: (event: any) => {
                        if (event.type === HttpEventType.UploadProgress) {
                            console.log(
                                'Componente ' + this._name + ': uploadAvatar: Upload progress ─> ',
                                event.total ? Math.round(event.loaded / event.total) * 100 + ' %' : '--'
                            );
                        } else if (event.type === HttpEventType.Response) {
                            console.log('Componente ' + this._name + ': uploadAvatar: event ─> ', event);
                            // resolve(event);
                        }
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': uploadAvatar: error ─> ', err);
                        // resolve(err);
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': uploadAvatar: complete ─> post ulrUploadFile');
                    },
                });
            }
        } else {
            this.loading = false;
            this.form.markAllAsTouched();
            this._toastr.error('Faltan datos por rellenar', 'Error Profile Updated', {
                timeOut: 3000,
            });
        }
    }

    updateOldRecord(user: any) {
        // this.oldRecord.id_user = user.id_user;
        this.oldRecord.id_asociation_user = user.id_asociation_user;
        this.oldRecord.user_name_user = user.user_name_user;
        this.oldRecord.email_user = user.email_user;
        this.oldRecord.token_user = user.token_user;
        this.oldRecord.recover_password_user = user.recover_password_user;
        this.oldRecord.token_exp_user = user.token_exp_user;
        this.oldRecord.profile_user = user.profile_user;
        this.oldRecord.status_user = user.status_user;
        this.oldRecord.name_user = user.name_user;
        this.oldRecord.last_name_user = user.last_name_user;
        this.oldRecord.avatar_user = user.avatar_user === '' ? this.avatarUrlDefault : user.avatar_user;
        this.oldRecord.phone_user = user.phone_user;
        this.oldRecord.date_deleted_user = user.date_deleted_user;
        this.oldRecord.date_created_user = user.date_created_user;
        this.oldRecord.date_updated_user = user.date_updated_user;
    }
}
