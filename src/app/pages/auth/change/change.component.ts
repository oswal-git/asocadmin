import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ILocalProfile, INewCredentials, IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';
import { UsersService } from '@app/services/bd/users.service';
import { IEglImagen } from '@app/shared/controls';
import { environment } from '@env/environment';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-change',
    templateUrl: './change.component.html',
    styleUrls: ['./change.component.scss'],
    providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
})
export class ChangeComponent implements OnInit {
    private _name = 'LoginComponent';
    userProfile!: IUserConnected;
    userProfileOSubscription!: Subscription;
    isLogin: boolean = false;

    // avatar
    avatarUrlDefault = environment.urlApi2 + '/assets/img/user.png';
    src = environment.urlApi2 + '/assets/img/user.png';

    avatarImg: IEglImagen = {
        src: this.src,
        nameFile: '',
        filePath: '',
        fileImage: null,
        isSelectedFile: false,
        isDefault: this.avatarUrlDefault === this.src,
        isChange: false,
    };

    form!: UntypedFormGroup;
    durationInSeconds = 1.5;
    loading = false;

    emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
    emailTextPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    emailMaxLength: number = 60;

    passwordMinLength: number = 3;

    srcImage: string | ArrayBuffer | null = 'assets/user.png';

    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    // icons
    faEnvelope = faEnvelope;
    faKey = faKey;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private router: Router,
        private _usersService: UsersService,
        private _location: Location
    ) {}

    ngOnInit(): void {
        this.init();
        this.form = this._formBuilder.group({
            // image: [{ src: 'assets/img/user.png', nameFile: 'user.png', filePath: 'assets/img', image: null, isSelectedFile: false }, []],
            email_user: new UntypedFormControl(
                this.userProfile.email_user,
                Validators.compose([Validators.required, Validators.pattern(this.emailTextPattern), Validators.maxLength(50)])
            ),
            password_user: new UntypedFormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
            new_password_user: new UntypedFormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
        });
    }

    async init() {
        const res: ILocalProfile = this._usersService.getLocalStoredProfile();
        console.log('Componente ' + this._name + ': constructor: res ─> ', res);

        if (res.msg !== 'User logged') {
            this.router.navigateByUrl('/login');
        }
        this.userProfile = res.userprofile;
        console.log('Componente ' + this._name + ': constructor: res.userprofile ─> ', res.userprofile);
        const avatar = res.userprofile.avatar_user === '' ? environment.urlApi2 + '/assets/img/user.png' : res.userprofile.avatar_user;
        console.log('Componente ' + this._name + ': constructor: avatar ─> ', avatar);

        this.avatarImg = {
            src: avatar,
            nameFile: avatar.split(/[\\/]/).pop() || '',
            filePath: '',
            fileImage: null,
            isSelectedFile: false,
            isDefault: this.avatarUrlDefault === avatar,
            isChange: false,
        };
    }

    async change(event: Event) {
        event.preventDefault();

        if (this.form.value.email_user != '' && this.form.value.password_user != '' && this.form.value.new_password_user != '' && this.form.valid) {
            if (this.form.value.password_user === this.form.value.new_password_user) {
                this.msg('The new password has been diferent of old password');
                return;
            }

            this.loading = true;

            const credentials: INewCredentials = {
                email_user: this.form.value.email_user,
                password_user: this.form.value.password_user,
                new_password_user: this.form.value.new_password_user,
            };
            console.log('Componente ' + this._name + ': change: credentials ─> ', credentials);

            try {
                this._usersService.change(credentials).subscribe({
                    next: (resp: any) => {
                        console.log('Componente ' + this._name + ': change: ─> resp', resp);
                        if (resp.status === 200) {
                            this.userProfile = this._usersService.actualizeStoreProfile(resp.result.data_user, resp.result.data_asoc);
                            console.log('Componente ' + this._name + ': change: ─> this.userProfile', this.userProfile);

                            const msg = 'La contraseña se ha cambiado correctamente';
                            this.msg(msg, 2);
                            this.router.navigateByUrl('/dashboard');
                        } else {
                            // this.userProfile = this._usersService.resetStoredProfile();
                            this.msg(resp.message);
                        }
                        this.loading = false;
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': change: error ─> perfil', err.error.message);
                        // this.userProfile = this._usersService.resetStoredProfile();
                        console.log('Componente ' + this._name + ': change: ─> this.userProfile', this.userProfile);
                        this.msg(err.error.message);
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': change: complete ─> perfil');
                    },
                });

                this.loading = false;
            } catch (err: any) {
                this.loading = false;
                this.msg(err);
                console.log('Componente ' + this._name + ': ingresar: err ─> ', err);
            }
        } else {
            this.loading = false;
            this.form.markAllAsTouched();
            this.msg('Email o contraseña ingresados son inválidos');
        }
    }

    exit(): void {
        this._location.back();
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

    get newPasswordField(): any {
        return this.form.get('new_password_user');
    }

    get newPasswordIsValid(): boolean {
        return this.form.get('new_password_user')!.valid && this.form.get('new_password_user')!.touched;
    }

    get newPasswordIsInvalid(): boolean {
        return this.form.get('new_password_user')!.invalid && this.form.get('new_password_user')!.touched;
    }

    msg(msg: string, duration = this.durationInSeconds) {
        this._snackBar.open(msg, '', {
            duration: duration * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
}
