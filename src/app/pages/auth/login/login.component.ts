import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ICredentials, ILocalProfile, IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';
import { UsersService } from '@app/services/bd/users.service';
import { IEglImagen } from '@app/shared/controls';
import { environment } from '@env/environment';
import { faEnvelope, faEye, faEyeSlash, faKey } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    private _name = 'LoginComponent';
    userProfile!: IUserConnected;

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

    form: UntypedFormGroup;
    durationInSeconds = 1.5;
    loading = false;

    emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
    emailTextPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    emailMaxLength: number = 60;

    passwordMinLength: number = 3;

    fieldTextType = true;

    srcImage: string | ArrayBuffer | null = 'assets/user.png';

    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    // icons
    faEnvelope = faEnvelope;
    faKey = faKey;
    faEye = faEye;
    faEyeSlash = faEyeSlash;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private router: Router,
        private _usersService: UsersService
    ) {
        this._usersService.getLocalStoredProfile().then((res: ILocalProfile) => {
            if (res.msg === 'User logged') {
                this.router.navigateByUrl('/dashboard');
            }
        });

        this.form = this._formBuilder.group({
            // image: [{ src: 'assets/img/user.png', nameFile: 'user.png', filePath: 'assets/img', image: null, isSelectedFile: false }, []],
            email_user: new UntypedFormControl(
                '',
                Validators.compose([Validators.required, Validators.pattern(this.emailTextPattern), Validators.maxLength(50)])
            ),
            password_user: new UntypedFormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
        });
    }

    ngOnInit(): void {
        // this.userProfile = this._usersService.getProfile();
    }

    async login(event: Event) {
        event.preventDefault();

        if (this.form.value.email_user != '' && this.form.value.password_user != '' && this.form.valid) {
            this.loading = true;

            const credentials: ICredentials = {
                email_user: this.form.value.email_user,
                password_user: this.form.value.password_user,
            };
            console.log('Componente ' + this._name + ': login: credentials ─> ', credentials);

            try {
                this._usersService.login(credentials).subscribe({
                    next: (resp: any) => {
                        console.log('Componente ' + this._name + ': login: ─> resp', resp);
                        if (resp.status === 200) {
                            this.userProfile = this._usersService.actualizeStoreProfile(resp.result.data_user, resp.result.data_asoc);
                            console.log('Componente ' + this._name + ': login: ─> this.userProfile', this.userProfile);

                            const msg =
                                'El usuario ingresó con exito' +
                                (this.userProfile.recover_password_user === 0 ? '' : '<br>' + 'Debería cambiar la contraseña después de ingresar');
                            this.msg(msg, 2);
                            this.router.navigateByUrl('/dashboard');
                        } else {
                            this.userProfile = this._usersService.resetStoredProfile();
                            console.log('Componente ' + this._name + ': login: ─> this.userProfile', this.userProfile);
                            this.msg(resp.message);
                        }
                        this.loading = false;
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': login: err ─> perfil', err.error.message);
                        this.userProfile = this._usersService.resetStoredProfile();
                        console.log('Componente ' + this._name + ': login: ─> this.userProfile', this.userProfile);
                        this.msg(err.error.message);
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': login: complete ─> perfil');
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

    toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType;
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

    msg(msg: string, duration = this.durationInSeconds) {
        this._snackBar.open(msg, '', {
            duration: duration * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
}
