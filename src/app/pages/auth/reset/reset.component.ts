import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';
import { UsersService } from '@app/services/bd/users.service';
import { environment } from '@env/environment';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-reset',
    templateUrl: './reset.component.html',
    styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {
    private _name = 'ResetComponent';

    userProfile!: IUserConnected;
    form: UntypedFormGroup;
    loading = false;

    // avatar
    avatarUrlDefault = environment.urlApi + '/assets/images/user.png';

    // icons
    faEnvelope = faEnvelope;

    emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
    emailTextPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    emailMaxLength: number = 60;

    durationInSeconds = 1.5;
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private router: Router,
        private _usersService: UsersService
    ) {
        const res = this._usersService.getLocalStoredProfile();

        if (res.msg === 'User logged') {
            this.router.navigateByUrl('/dashboard');
        }

        this.form = this._formBuilder.group({
            // image: [{ src: 'assets/img/user.png', nameFile: 'user.png', filePath: 'assets/img', image: null, isSelectedFile: false }, []],
            email_user: new UntypedFormControl(
                '',
                Validators.compose([Validators.required, Validators.pattern(this.emailTextPattern), Validators.maxLength(50)])
            ),
        });
    }

    async reset(event: Event) {
        event.preventDefault();

        if (this.form.value.email != '' && this.form.valid) {
            this.loading = true;

            const data: any = {
                email_user: this.form.value.email_user,
            };
            console.log('Componente ' + this._name + ': reset: data ─> ', data);

            try {
                this._usersService.resetPassword(data).subscribe({
                    next: (resp: any) => {
                        console.log('Componente ' + this._name + ': reset: ─> resp', resp);
                        this.userProfile = this._usersService.resetStoredProfile();
                        if (resp.status === 200) {
                            this.msg('El nuevo password ha sido enviado a su correo');
                            this.router.navigateByUrl('/login');
                        } else {
                            this.msg(resp.message);
                        }
                        this.loading = false;
                    },
                    error: (err: any) => {
                        this.userProfile = this._usersService.resetStoredProfile();
                        console.log('Componente ' + this._name + ': reset: error ─> perfil', err);
                        this.msg(err);
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': reset: complete ─> perfil');
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

    ngOnInit(): void {}

    get emailField(): any {
        return this.form.get('email_user');
    }

    get emailIsValid(): boolean {
        return this.form.get('email_user')!.valid && this.form.get('email_user')!.touched;
    }

    get emailIsInvalid(): boolean {
        return this.form.get('email_user')!.invalid && this.form.get('email_user')!.touched;
    }

    msg(msg: string) {
        this._snackBar.open(msg, '', {
            duration: this.durationInSeconds * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
}
