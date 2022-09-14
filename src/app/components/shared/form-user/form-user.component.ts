import { EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
// import { Router } from '@angular/router';
import { USERS_CONST } from '@app/data/constants/users.const';
// import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { UsersService } from '@app/services/bd/users.service';
import { environment } from '@env/environment';
import { ICreateUser, IOptionsDialog, IReplay, IResponseActionsUsers } from '@app/interfaces/ui/dialogs.interface';
import { IProfileUsuario, IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';
import { IEglImagen } from '@app/shared/controls';
import { AsociationsService } from '@app/services/bd/asociations.service';
import { faCalendarPlus, faCircleXmark, faClockRotateLeft, faEnvelope, faKey, faKeyboard, faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
    selector: 'app-form-user',
    templateUrl: './form-user.component.html',
    styleUrls: ['./form-user.component.scss'],
})
export class FormUserComponent implements OnChanges {
    private _name = 'FormUserComponent';
    private userProfile!: IUserConnected;

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
    avatarUrlDefault = environment.urlApi + '/assets/images/user.png';
    avatarScrDefault = environment.urlApi + '/assets/images/user.png';
    avatarImg: IEglImagen = {
        src: this.avatarScrDefault,
        nameFile: '',
        filePath: '',
        fileImage: null,
        isSelectedFile: false,
    };
    isAvatarUrlDefault = true;
    // avatarUrl = this.avatarUrlDefault;
    iconCtrlDefault: string = environment.urlApi + '/assets/images/option1.jpg';

    oldRecord: IProfileUsuario = {
        id_user: 0,
        id_asociation_user: 0,
        user_name_user: '',
        email_user: '',
        token_user: '',
        recover_password_user: 0,
        token_exp_user: '',
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

    // icons
    faCircleXmark = faCircleXmark;
    faKeyboard = faKeyboard;
    faEnvelope = faEnvelope;
    faKey = faKey;
    faMobileScreen = faMobileScreen;
    faCalendarPlus = faCalendarPlus;
    faClockRotateLeft = faClockRotateLeft;

    // select control
    asociations: any[] = [];
    asociationImgCtrl: string = environment.urlApi + '/assets/images/asociation.jpg';
    status: any[] = [];
    statusImgCtrl: string = environment.urlApi + '/assets/images/status.jpg';
    profiles: any[] = [];
    profileImgCtrl: string = environment.urlApi + '/assets/images/status.jpg';

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

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private router: Router,
        private _snackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _usersService: UsersService,
        private _asociationsService: AsociationsService,
        // private _fns: AngularFireFunctions,
        private http: HttpClient
    ) {
        this.loading = true;
        this.isSuper = _usersService.userProfile.profile_user === 'superadmin' ? true : false;

        // console.log('Componente ' + this._name + ': constructor: userPerfil(' + this.count + ') ─> ', this._usersService.userProfile);
        // console.log('Componente ' + this._name + ': constructor: oldRecord(' + this.count + ') ─> ', this.oldRecord);
    }

    ngOnChanges(): void {
        ++this.count;
        // console.log('Componente ' + this._name + ': ngOnChanges:  ─> ');
        console.log('Componente ' + this._name + ': ngOnChanges: this.optionsDialog 1 (' + this.count + ') ─> ', this.optionsDialog);
        console.log('Componente ' + this._name + ': ngOnChanges: this.count ─> ', this.count);
        console.log('Componente ' + this._name + ': ngOnChanges: typeof this.optionsDialog.options (' + this.count + ') ─> ', typeof this.optionsDialog.options);
        console.log('Componente ' + this._name + ': ngOnChanges: this.optionsDialog.options (' + this.count + ') ─> ', this.optionsDialog.options);

        if (this.optionsDialog.options.fin === undefined) {
            console.log('Componente ' + this._name + ': ngOnChanges: this.optionsDialog.options 2 (' + this.count + ') ─> ', this.optionsDialog.options);
            // console.log('Componente ' + this._name + ': ngOnChanges: this.optionsDialog.options.fin ─> ', this.optionsDialog.options.fin);
            this.optionsDialog.options['fin'] = true;
            // console.log('Componente ' + this._name + ': ngOnChanges: this.optionsDialog.options.fin 2 ─> ', this.optionsDialog.options.fin);
        }
    }

    async ngOnInit() {
        // console.log('Componente ' + this._name + ': ngOnInit:  ─> ');
        ++this.countInit;
        await this.getAsociations();
        this.getUserProfiles();
        console.log('Componente ' + this._name + ': ngOnInit: this.optionsDialog(' + this.countInit + ')  ─>', this.optionsDialog);
        if (this.optionsDialog.id === 'profile') {
            this.checkOpts = false;
            this.userResp.action = this.optionsDialog.id;
            console.log('Componente ' + this._name + ': ngOnInit: this.optionsDialog.id (' + this.countInit + ')  ─>', this.optionsDialog.id);
            this.getDataUserConnected();
            // console.log('Componente ' + this._name + ': ngOnInit: this.oldRecord(' + this.countInit + ') ─> ', this.oldRecord);
            if (this.oldRecord.avatar_user === '') {
                // this.avatarUrl = this.avatarUrlDefault;
                this.oldRecord.avatar_user = this.avatarUrlDefault;
            } else {
                // this.avatarUrl = this.oldRecord.avatar_user;
            }

            this.userResp.data = this.oldRecord;
            console.log('Componente ' + this._name + ': ngOnInit: this.userResp(' + this.countInit + ') ─> ', this.userResp);
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
        // console.log('Componente ' + this._name + ': ngDoCheck:  ─> ');
        // console.log('Componente ' + this._name + ': ngDoCheck: this.optionsDialog(' + this.count + ') ─> ', this.optionsDialog);
        if (this.checkOpts) {
            this.checkOptions();
        }
    }

    checkOptions() {
        // console.log('Componente ' + this._name + ': checkOptions: this.checkOpts(' + this.count + ') ─> ', this.checkOpts);
        if (this.checkOpts) {
            console.log('Componente ' + this._name + ': checkOptions: this.optionsDialog(' + this.count + ') ─> ', this.optionsDialog);

            if (this.optionsDialog) {
                console.log('Componente ' + this._name + ': checkOptions: this.optionsDialog(' + this.count + ') ─> ');
                this.userResp.action = this.optionsDialog.id;
                if (this.optionsDialog.id !== 'create' && this.optionsDialog.id !== 'register' && this.optionsDialog.id !== 'profile') {
                    this.oldRecord = this.optionsDialog.record;
                    console.log('Componente ' + this._name + ': checkOptions: this.oldRecord(' + this.count + ') ─> ', this.oldRecord);
                    if (this.oldRecord.avatar_user === '') {
                        // this.avatarUrl = this.avatarUrlDefault;
                        this.oldRecord.avatar_user = this.avatarUrlDefault;
                    } else {
                        // this.avatarUrl = this.oldRecord.avatar_user;
                    }
                }
                console.log('Componente ' + this._name + ': checkOptions: this.oldRecord2(' + this.count + ') ─> ', this.oldRecord);
                console.log(
                    'Componente ' + this._name + ': checkOptions: this._usersService.userProfile (' + this.count + ') ─> ',
                    this._usersService.userProfile
                );

                if (this._usersService.userProfile.id_asociation_user !== 0) {
                    this.oldRecord.id_asociation_user = this._usersService.userProfile.id_asociation_user;
                }

                console.log('Componente ' + this._name + ': checkOptions: this.oldRecord3(' + this.count + ') ─> ', this.oldRecord);

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

                console.log('Componente ' + this._name + ': checkOptions: this.optionsDialog(' + this.count + ') ─> ', this.optionsDialog);
            }

            if (this.optionsDialog.options.fin) {
                this.checkOpts = false;
                this.userResp.data = this.oldRecord;
                console.log('Componente ' + this._name + ': checkOptions: this.userResp.data(' + this.count + ') ─> ', this.userResp.data);
                this.fillFormData();
                this.loading = false;
            }
        }
    }

    fillFormData() {
        console.log('Componente ' + this._name + ': fillFormData: this.oldRecord(' + this.count + ') ─> ', this.oldRecord);

        this.form = this._formBuilder.group({
            user_name_user: new UntypedFormControl(
                { value: this.oldRecord.user_name_user, disabled: this.browseForm ? true : false },
                Validators.compose([Validators.required])
            ),
            name_user: new UntypedFormControl(
                { value: this.oldRecord.name_user, disabled: this.browseForm ? true : false },
                Validators.compose([Validators.required])
            ),
            last_name_user: new UntypedFormControl(
                { value: this.oldRecord.last_name_user, disabled: this.browseForm ? true : false },
                Validators.compose([Validators.required])
            ),
            status_user: new UntypedFormControl(
                { value: this.oldRecord.status_user, disabled: this.browseForm || this.registerForm || this.profileForm ? true : false },
                Validators.compose([Validators.required])
            ),
            id_asociation_user: new UntypedFormControl(
                {
                    value: this.oldRecord.id_asociation_user === 0 ? 0 : this.oldRecord.id_asociation_user,
                    disabled: this.isSuper || this.registerForm || this.profileForm ? false : !this.createForm ? true : true,
                },
                Validators.compose([Validators.required])
            ),
            email_user: new UntypedFormControl(
                { value: this.oldRecord.email_user, disabled: this.createForm || this.registerForm ? false : true },
                Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])
            ),
            // avatar: new FormControl({ value: this.avatarUrl, disabled: this.browseForm ? true : false }, Validators.compose([])),
            profile_user: new UntypedFormControl(
                {
                    value: this.oldRecord.profile_user,
                    disabled: this.browseForm || this.registerForm || this.profileForm ? true : false,
                },
                Validators.compose([Validators.required])
            ),
            phone_user: new UntypedFormControl(
                { value: this.oldRecord.phone_user, disabled: this.browseForm ? true : false },
                Validators.compose([Validators.pattern('')])
            ),
            password_user: new UntypedFormControl('', Validators.compose([Validators.required, Validators.minLength(this.passwordMinLength)])),
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
        console.log('Componente ' + this._name + ': fillFormData: this.form.value(' + this.count + ') ─> ', this.form.value);
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

    async getAsociations(): Promise<void> {
        console.log(
            'Componente ' + this._name + ': getAsociations: this.userProfile.asociation_id(' + this.count + '): ',
            this._usersService.userProfile.id_asociation_user
        );
        return new Promise(() => {
            try {
                this._asociationsService.getListAsociations().subscribe({
                    next: (resp: any) => {
                        console.log('Componente ' + this._name + ': getAsociations:(' + this.count + ') ─> resp', resp);
                        if (resp.status === 200) {
                            this.asociations = resp.result.records.map((record: any) => {
                                return { url: record.logo_asociation, caption: record.long_name_asociation, id: record.id_asociation };
                            });
                            console.log('Componente ' + this._name + ': getAsociations:(' + this.count + ') ─> this.asociations', this.asociations);
                        } else {
                            this.msg(resp.message);
                        }
                        this.hasAsociations = true;
                        if (this.hasAsociations && this.hasUser) {
                            this.fillFormData();
                            this.loading = false;
                        }
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': getAsociations: error(' + this.count + ') ─> ', err);
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': getAsociaciones: complete(' + this.count + ') ─> ');
                    },
                });
            } catch (err: any) {
                this.msg(err);
                console.log('Componente ' + this._name + ': getAsociaciones: err(' + this.count + ') ─> ', err);
            }
        });
    }

    getUserProfiles() {
        this.profiles = USERS_CONST.USERS_PROFILES;
        this.status = USERS_CONST.USERS_SITUATION;
        return '';
    }

    getDataUserConnected() {
        if (this._usersService.userProfile.token_user !== '') {
            console.log('Componente ' + this._name + ': getDataUserConnected: data(' + this.count + ') ─> ');
            try {
                this.oldRecord = {
                    id_user: this._usersService.userProfile.id_user,
                    id_asociation_user: this._usersService.userProfile.id_asociation_user,
                    user_name_user: this._usersService.userProfile.user_name_user,
                    email_user: this._usersService.userProfile.email_user,
                    token_user: this._usersService.userProfile.token_user,
                    recover_password_user: this._usersService.userProfile.recover_password_user,
                    token_exp_user: this._usersService.userProfile.token_exp_user,
                    profile_user: this._usersService.userProfile.profile_user,
                    status_user: this._usersService.userProfile.status_user,
                    name_user: this._usersService.userProfile.name_user,
                    last_name_user: this._usersService.userProfile.last_name_user,
                    avatar_user: this._usersService.userProfile.avatar_user,
                    phone_user: this._usersService.userProfile.phone_user,
                    date_deleted_user: this._usersService.userProfile.date_deleted_user,
                    date_created_user: this._usersService.userProfile.date_created_user,
                    date_updated_user: this._usersService.userProfile.date_updated_user,
                };
                const src = this._usersService.userProfile.avatar_user !== '' ? this._usersService.userProfile.avatar_user : this.avatarScrDefault;
                this.avatarImg = {
                    src: src,
                    nameFile: src.split(/[\\/]/).pop() || '',
                    filePath: '',
                    fileImage: null,
                    isSelectedFile: false,
                };
                console.log('Componente ' + this._name + ': getDataUserConnected: this.avatarImg ─> ', this.avatarImg);

                this.hasUser = true;
                if (this.hasAsociations && this.hasUser) {
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
                    let message = '';
                    let msgRegisterProfile = { status: '', message: '' };
                    // let msgRegisterAvatar = { status: 'ok', message: '' };

                    msgRegisterProfile = await this.registerUser();
                    console.log('Componente ' + this._name + ': manageUser: msgRegisterProfile ─> ', msgRegisterProfile);
                    message = msgRegisterProfile.message;

                    // if (this.avatarImg.isSelectedFile) {
                    //     console.log('Componente ' + this._name + ': manageUser: updateAvatar ─> updateAvatar');
                    //     msgRegisterAvatar = await this.updateAvatar();
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
                        this.form.value.id_asociation_user === 0 &&
                        this.form.value.user_name_user === '' &&
                        this.form.value.name_user === '' &&
                        this.form.value.last_name_user === '' &&
                        this.form.value.email_user === '' &&
                        this.form.value.password_user === '' &&
                        this.form.value.phone_user === '' &&
                        this.form.value.profile_user === '' &&
                        this.form.value.status_user === '' &&
                        this.avatarImg.src === ''
                    ) {
                        console.log('Componente ' + this._name + ': manageUser: error ─> not all data filled');
                        this._toastr.error('Missing fields to fill.<br> Fill it in, please.', 'Not all data filled');
                        this.loading = false;
                        return;
                    }

                    let message = '';
                    let msgCreateUser = { status: 'ok', message: '' };
                    let msgCreateAvatar = { status: '', message: '' };

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
                        msgCreateUser = await this.createUser();
                        message = msgCreateUser.message;
                    }

                    if (msgCreateUser.status === 'ok') {
                        console.log('Componente ' + this._name + ': manageUser: msgCreateUser ─> ok');
                        // console.log('Componente ' + this._name + ': manageUser: this.avatarImg.src ─> ', this.avatarImg.src);
                        console.log('Componente ' + this._name + ': manageUser: this.oldRecord.avatar_user ─> ', this.oldRecord.avatar_user);
                        if (this.avatarImg.src !== this.oldRecord.avatar_user) {
                            console.log('Componente ' + this._name + ': manageUser: updateAvatar ─> updateAvatar');
                            msgCreateAvatar = await this.updateAvatar();
                            message += message === '' ? msgCreateAvatar.message : ' <br>' + msgCreateAvatar.message;
                        }
                    }

                    if (msgCreateUser.status === 'ok' && msgCreateAvatar.status === 'ok') {
                        this.userResp.data.avatar_user = '';
                        this.loading = false;
                        this._toastr.success(message, 'User create successfully').onHidden.subscribe(() => {
                            console.log('Componente ' + this._name + ': manageUser createUser 1: this.userResp ─> ', this.userResp);
                            this.exitForm(this.userResp);
                        });
                    } else if (msgCreateUser.status === 'ok' || msgCreateAvatar.status === 'ok') {
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
                        this.oldRecord.user_name_user === this.form.value.nombre_usuario &&
                        this.oldRecord.profile_user === this.form.value.profile_user &&
                        this.oldRecord.status_user === this.form.value.status_user &&
                        this.oldRecord.name_user === this.form.value.nombre &&
                        this.oldRecord.last_name_user === this.form.value.last_name_user &&
                        this.oldRecord.phone_user === this.form.value.phone_user &&
                        this.avatarImg.src === this.oldRecord.avatar_user
                    ) {
                        console.log('Componente ' + this._name + ': manageUser: error ─> not data changed');
                        this.msg('Not data changed');
                        this.loading = false;
                        return;
                    } else {
                        console.log('Componente ' + this._name + ': manageUser: updateUser ─> updateUser()');
                        await this.updateUser();
                        return;
                    }
                } else if (this.optionsDialog.id === 'profile') {
                    if (
                        this.oldRecord.user_name_user === this.form.value.user_name_user &&
                        this.oldRecord.name_user === this.form.value.name_user &&
                        this.oldRecord.last_name_user === this.form.value.last_name_user &&
                        this.oldRecord.phone_user === this.form.value.phone_user &&
                        this.oldRecord.id_asociation_user === this.form.value.id_asociation_user &&
                        this.avatarImg.src === this.oldRecord.avatar_user
                    ) {
                        console.log('Componente ' + this._name + ': manageUser: error ─> not data changed');
                        this._toastr.error('Nothing for update.<br> No action made.', 'Not data changed');
                        this.loading = false;
                        return;
                    }

                    let message = '';
                    let msgUpdateProfile = { status: 'ok', message: '' };
                    let msgUpdateAvatar = { status: 'ok', message: '' };

                    if (
                        this.oldRecord.user_name_user !== this.form.value.user_name_user ||
                        this.oldRecord.name_user !== this.form.value.name_user ||
                        this.oldRecord.last_name_user !== this.form.value.last_name_user ||
                        this.oldRecord.phone_user !== this.form.value.phone_user ||
                        this.oldRecord.id_asociation_user !== this.form.value.id_asociation_user
                    ) {
                        msgUpdateProfile = await this.updateProfile();
                        message = msgUpdateProfile.message;
                    }

                    if (msgUpdateProfile.status === 'ok') {
                        console.log('Componente ' + this._name + ': manageUser: msgUpdateProfile ─> ok');
                        // console.log('Componente ' + this._name + ': manageUser: this.avatarImg.src ─> ', this.avatarImg.src);
                        console.log('Componente ' + this._name + ': manageUser: this.oldRecord.avatar_user ─> ', this.oldRecord.avatar_user);
                        if (this.avatarImg.src !== this.oldRecord.avatar_user) {
                            console.log('Componente ' + this._name + ': manageUser: ─> updateAvatar');
                            msgUpdateAvatar = await this.updateAvatar();
                            console.log('Componente ' + this._name + ': manageUser: msgUpdateAvatar ─> ', msgUpdateAvatar);
                            message += message === '' ? msgUpdateAvatar.message : ' <br>' + msgUpdateAvatar.message;
                        }
                    }

                    if (msgUpdateProfile.status === 'ok' && msgUpdateAvatar.status === 'ok') {
                        this.loading = false;
                        this._toastr.success(message, 'Updated profile').onHidden.subscribe(() => {
                            // window.location.reload();
                        });
                    } else if (msgUpdateProfile.status === 'ok' || msgUpdateAvatar.status === 'ok') {
                        this.loading = false;
                        this._toastr.info(message, 'Updated profile').onHidden.subscribe(() => {
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
                id_asociation_user: this.form.value.id_asociation_user,
                user_name_user: this.form.value.user_name_user,
                name_user: this.form.value.name_user,
                last_name_user: this.form.value.last_name_user,
                phone_user: this.form.value.phone_user,
                date_updated_user: this.oldRecord.date_updated_user,
            };

            console.log('Componente ' + this._name + ': updateProfile: data ─> ', data);
            try {
                this.loading = true;
                this._usersService.updateProfile(data).subscribe({
                    next: async (resp: any) => {
                        if (resp.status === 200) {
                            this.userProfile = this._usersService.actualizeStoreProfile(resp.result.data_user, resp.result.data_asoc);
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
                        console.log('Componente ' + this._name + ': updateProfile: error ─> perfil', err);
                        // this.userProfile = this._usersService.resetStoredProfile();
                        console.log('Componente ' + this._name + ': updateProfile: ─> this.userProfile', this.userProfile);
                        resolve({ status: 'error', message: err });
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
                    this._usersService.userProfile.id_asociation_user === 0
                        ? this.form.value.id_asociation_user
                        : this._usersService.userProfile.id_asociation_user,
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
                            this.userResp.data.id_user = resp.last_insertId;
                            this.userResp.data.id_asociation_user = resp.result.id_asociation_user;
                            this.userResp.data.user_name_user = resp.result.user_name_user;
                            this.userResp.data.name_user = resp.result.name_user;
                            this.userResp.data.last_name_user = resp.result.last_name_user;
                            this.userResp.data.email_user = resp.result.email_user;
                            this.userResp.data.password_user = resp.result.password_user;
                            this.userResp.data.phone_user = resp.result.phone_user;
                            this.userResp.data.profile_user = resp.result.profile_user;
                            this.userResp.data.status_user = resp.result.status_user;
                            this.userResp.data.date_updated_user = resp.result.date_updated_user;
                            console.log('Componente ' + this._name + ': createUser: this.userResp ─> ', this.userResp);
                            resolve({ status: 'ok', message: 'El usuario se creó con exito' });
                        } else {
                            console.log('Componente ' + this._name + ': createUser: error ─> resp.message', resp.message);
                            resolve({ status: 'error', message: resp.message });
                        }
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': createUser: error ─> create', err);
                        resolve({ status: 'error', message: err });
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

    async updateUser(): Promise<void> {
        const ulrUpdateUser = environment.urlApi + '/users';
        const authHeaders = await this._usersService.getAuthHeaders();
        console.log('Componente ' + this._name + ': updateUser: avatarImg ─> ', this.avatarImg);
        console.log('Componente ' + this._name + ': updateUser: this.form.value ─> ', this.form.value);
        const data = {
            avatar_img: this.avatarImg.nameFile,
            profile: {
                id_user: this.oldRecord.id_user,
                id_asociation_user:
                    this._usersService.userProfile.id_asociation_user === 0
                        ? this.oldRecord.id_asociation_user
                        : this._usersService.userProfile.id_asociation_user,
                user_name_user: this.form.value.user_name_user,
                email_user_user: this.oldRecord.email_user,
                profile_user: this.form.value.profile_user,
                status_user: this.form.value.status_user,
                name_user: this.form.value.name_user,
                last_name_user: this.form.value.last_name_user,
                avatar_user: 'this.avatarUrl',
                phone_user: this.form.value.phone_user,
                date_updated_user: this.oldRecord.date_updated_user,
            },
        };
        console.log('Componente ' + this._name + ': updateUser: data ─> ', data);
        try {
            this.loading = true;
            this.updateAvatar();
            this.http.put(ulrUpdateUser, data, authHeaders.headers).subscribe({
                next: async (fechas: any) => {
                    data.profile.date_updated_user = fechas.fecha_modificacion;
                    this.userResp.data = data.profile;
                    if ('this.avatarUrl' !== this.oldRecord.avatar_user) {
                        console.log('Componente ' + this._name + ': updateUser: avatar ─> changed');
                        const updateAvatarResp: any = await this.updateAvatar();
                        console.log('Componente ' + this._name + ': manageUser: updateAvatarResp ─> ', updateAvatarResp.body);
                        this.userResp.replay = { status: 'ok', message: 'Updated user and avatar' };
                        if (!updateAvatarResp) {
                            this.msg('Unexpected error updating avatar');
                            this.userResp.replay = { status: 'ok', message: 'Updated user. Unexpected error updating avatar' };
                        }
                        console.log('Componente ' + this._name + ': updateUser: this.userResp ─> ', this.userResp);
                        if (typeof updateAvatarResp !== 'boolean') {
                            this.userResp.data.avatar = updateAvatarResp.body.url;
                        }
                        this.loading = false;
                        this.exitForm(this.userResp);
                    } else {
                        console.log('Componente ' + this._name + ': updateUser: avatar ─> not changed');
                        console.log('Componente ' + this._name + ': updateUser: this.userResp ─> ', this.userResp);
                        this.loading = false;
                        this.userResp.replay = { status: 'ok', message: 'Updated user. Avatar not changed' };
                        this.exitForm(this.userResp);
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

    // Gestión de los avatares
    async updateAvatar() {
        // console.log('Componente ' + this._name + ': updateAvatar: this.avatarUrlDefault ─> ', this.avatarUrlDefault);
        // console.log('Componente ' + this._name + ': updateAvatar: this.oldRecord.avatar_user ─> ', this.oldRecord.avatar_user);
        // console.log('Componente ' + this._name + ': updateAvatar: this.avatarImg.src ─> ', this.avatarImg.src);
        if (this.avatarImg.src === this.avatarUrlDefault && this.oldRecord.avatar_user !== this.avatarUrlDefault) {
            try {
                const respDelete: any = await this.deleteAvatars();
                // console.log('Componente ' + this._name + ': updateAvatar: deleteAvatars respDelete ─> ', respDelete);
                if (respDelete.message === 'ok') {
                    this._usersService.updateProfileAvatar(this.avatarUrlDefault);
                    this.userResp.data.avatar_user = '';
                    return { status: 'ok', message: 'Avatar modified successfully' };
                } else {
                    console.log('Componente ' + this._name + ': updateAvatar: uploadAvatar respUpload.body.message ─> ', respDelete.body.message);
                    // this.msg(respDelete.body.message);
                    return { status: 'error', message: respDelete.body.message };
                }
            } catch (error) {
                console.log('Componente ' + this._name + ': updateAvatar: deleteAvatars error ─> ', error);
                // this.msg('Unexpected error uploading avatar');
                return { status: 'abort', message: 'Unexpected error uploading avatar' };
            }
        } else {
            if (this.oldRecord.avatar_user !== this.avatarImg.src) {
                try {
                    // console.log('Componente ' + this._name + ': updateAvatar: uploadAvatar () ─> ');
                    const respUpload = await this.uploadAvatar();
                    console.log('Componente ' + this._name + ': updateAvatar: uploadAvatar respUpload ─> ', respUpload);
                    if (respUpload.body.message === 'ok') {
                        // console.log(
                        //     'Componente ' + this._name + ': updateAvatar: uploadAvatar respUpload.body.result.url ─> ',
                        //     respUpload.body.result.url
                        // );
                        this._usersService.updateProfileAvatar(respUpload.body.result.url);
                        console.log('Componente ' + this._name + ': updateAvatar: uploadAvatar this.userResp ─> ', this.userResp);
                        this.userResp.data.avatar_user = respUpload.body.result.url;
                        console.log('Componente ' + this._name + ': updateAvatar: uploadAvatar this.userResp ─> ', this.userResp);
                        return { status: 'ok', message: 'Avatar modified successfully' };
                    } else {
                        console.log('Componente ' + this._name + ': updateAvatar: uploadAvatar respUpload.body.message ─> ', respUpload.body.message);
                        // this.msg(respUpload.body.message);
                        return { status: 'error', message: respUpload.body.message };
                    }
                } catch (error) {
                    console.log('Componente ' + this._name + ': updateAvatar: uploadAvatar error ─> ', error);
                    // this.msg('User created. Unexpected error uploading avatar');
                    return { status: 'abort', message: 'Unexpected error uploading avatar' };
                }
            } else {
                console.log('Componente ' + this._name + ': updateAvatar: uploadAvatar  ─> ', 'Nothing to upload.');
                // this.msg(respUpload.body.message);
                return { status: 'error', message: 'Nothing to upload.' };
            }
        }
    }

    async uploadAvatar(): Promise<any> {
        // console.log('Componente ' + this._name + ': uploadAvatar: ─> init');
        return new Promise((resolve, _reject) => {
            const fd = new FormData();
            // console.log('Componente ' + this._name + ': uploadAvatar: this.avatarImg.isSelectedFile ─> ', this.avatarImg.isSelectedFile);
            if (this.avatarImg.isSelectedFile) {
                fd.append('action', 'update');
                fd.append('token', this._usersService.userProfile.token_user);
                fd.append('user_id', this._usersService.userProfile.id_user.toString());
                fd.append('module', 'users');
                fd.append('prefix', 'avatars' + '/user-' + this._usersService.userProfile.id_user);
                fd.append('name', this.avatarImg.nameFile);
                // console.log('Componente ' + this._name + ': uploadAvatar: this.avatarImg!.fileImage ─> ', typeof this.avatarImg!.fileImage);
                fd.append('file', this.avatarImg.fileImage, this.avatarImg.nameFile);
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
                            resolve(event);
                        }
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': uploadAvatar: error ─> ', err);
                        resolve(err);
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

    async deleteAvatars(): Promise<any> {
        return new Promise((resolve, _reject) => {
            const fd = new FormData();
            fd.append('action', 'delete');
            fd.append('token', this._usersService.userProfile.token_user);
            fd.append('user_id', this._usersService.userProfile.id_user.toString());
            fd.append('module', 'users');
            fd.append('prefix', 'avatars' + '/user-' + this._usersService.userProfile.id_user);
            fd.append('name', this.avatarImg.nameFile);
            // console.log('Componente ' + this._name + ': uploadAvatar: this.avatarImg!.fileImage ─> ', typeof this.avatarImg!.fileImage);
            // fd.append('file', this.avatarImg.fileImage, this.avatarImg.nameFile);
            // if (this.avatarImg.fileImage !== null) {
            // }
            this._usersService.deleteAvatar(fd).subscribe({
                next: (event: any) => {
                    console.log('Componente ' + this._name + ': deleteAvatars: event ─> ', event);
                    resolve(event);
                },
                error: (err: any) => {
                    console.log('Componente ' + this._name + ': deleteAvatars: error ─> ', err);
                    resolve(err);
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
        return this.form.get(