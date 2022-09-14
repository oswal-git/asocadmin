import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';
import { IOptionsDialog } from '@app/interfaces/ui/dialogs.interface';
// import { BdmysqlService } from '@app/services/bd/bdmysql.service';
import { UsersService } from '@app/services/bd/users.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    private _name = 'RegisterComponent';
    userProfile!: IUserConnected;

    durationInSeconds = 1.5;
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    options: IOptionsDialog = {
        id: 'register',
        title: 'Registrar Usuario',
        button: 'Registrar',
        record: null,
        options: { fin: false },
    };

    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private _usersService: UsersService // private _db: BdmysqlService
    ) {}

    ngOnChanges() {
        console.log('Componente ' + this._name + ': ngOnChanges:  ─> ');
    }

    ngOnInit() {
        console.log('Componente ' + this._name + ': ngOnInit: this._usersService.userPerfil ─> ', this._usersService.userProfile);
        if ((this._usersService.userProfile.profile_user === 'superadmin' || this._usersService.userProfile.token_user) === '') {
            this.options.options.fin = true;
        }
    }

    getProfile(_user_uid: string) {
        // const userDoc: any = this._db.getDoc('Usuarios', user_uid).subscribe({
        //     next: (doc: any) => {
        //         console.log('Componente ' + this._name + ': getProfile: doc.data() ─> ', doc.data());
        //         this.options.id = 'profile';
        //         this.options.title = 'Perfil de usuario';
        //         this.options.button = 'Actualizar';
        //         this.options.options.fin = true;
        //         this.options.record = doc.data();
        //     },
        //     error: (err: any) => {
        //         console.log('Componente ' + this._name + ': getProfile: error ─> perfil', err);
        //     },
        //     complete: () => {
        //         console.log('Componente ' + this._name + ': getProfile: complete ─> perfil');
        //         userDoc.unsubscribe();
        //     },
        // });
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
