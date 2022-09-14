import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';
import { IOptionsDialog } from '@app/interfaces/ui/dialogs.interface';
import { UsersService } from '@app/services/bd/users.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    private _name = 'ProfileComponent';
    userProfile!: IUserConnected;

    loading = false;

    durationInSeconds = 1.5;
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    options: IOptionsDialog = {
        id: 'profile',
        title: 'Editar el Perfil de <span class="title__span">Usuario</span>',
        second_title: 'Actualiza tus datos',
        button: 'Actualizar',
        record: null,
        options: { fin: false },
    };

    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private _usersService: UsersService // private _db: BdmysqlService
    ) {
        console.log('Componente ' + this._name + ': constructor:  ─> getProfile');
        const res = this._usersService.getLocalStoredProfile();

        if (res.msg === 'Token expired') {
            this.msg('Token expired');
            this.router.navigateByUrl('/login');
        }

        if (this._usersService.userProfile.token_user === '') {
            //TODO npm install crypto-js
            this.router.navigateByUrl('/login');
        }
    }

    ngOnInit(): void {
        console.log('Componente ' + this._name + ': ngOnInit: this._usersService.userPerfil ─> ', this._usersService.userProfile);
        if ((this._usersService.userProfile.profile_user === 'superadmin' || this._usersService.userProfile.token_user) === '') {
            this.options.options.fin = true;
        }
    }

    msg(msg: string) {
        this._snackBar.open(msg, '', {
            duration: this.durationInSeconds * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    cancelar(datosSalida: any) {
        console.log('Componente ' + this._name + ': cancelar: ─> dialogRef.close: datosSalida ', datosSalida);
        if (this.options.id === 'profile') {
            if (datosSalida.action === 'profile') {
                this._usersService.updateProfileAvatar(datosSalida.data.avatar);
            }
            this.router.navigate(['/dashboard']);
        } else {
            this.router.navigate(['/login']);
        }
    }
}
