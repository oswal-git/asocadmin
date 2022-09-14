import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { IIdUser } from '@app/interfaces/api/iapi-users.metadatos';
import { IOptionsDialog, IReplay, IResponseActionsUsers } from '@app/interfaces/ui/dialogs.interface';
// import { Router } from '@angular/router';
// import { BdfirestoreService } from '@app/services/bd/bdfirestore.service';
import { UsersService } from '@app/services/bd/users.service';
import { IEglImagen } from '@app/shared/controls/egl-img/egl-img.component';
import { environment } from '@env/environment';

@Component({
    selector: 'app-delete-user',
    templateUrl: './delete-user.component.html',
    styleUrls: ['./delete-user.component.scss'],
})
export class DeleteUserComponent implements OnInit {
    private _name = 'DeleteUserComponent';

    options!: IOptionsDialog;
    userResp: IResponseActionsUsers = { action: '', data: '', replay: { status: '', message: '' } };

    avatarUrlDefault = environment.urlApi + '/assets/images/user.png';
    avatarImg: IEglImagen = {
        src: this.avatarUrlDefault,
        nameFile: '',
        filePath: '',
        fileImage: null,
        isSelectedFile: false,
    };

    durationInSeconds = 1.5;

    loading = true;

    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    constructor(
        public dialogRef: MatDialogRef<DeleteUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IOptionsDialog | string,
        private _usersService: UsersService,
        // private router: Router,
        private _snackBar: MatSnackBar
    ) {
        console.log('Componente ' + this._name + ': constructor: data ─> ', data);
        if (typeof data !== 'string') {
            this.options = data;
            if (this.options.record.avatar_user) {
                this.avatarImg.src = this.options.record.avatar_user;
            }

            console.log('Componente ' + this._name + ': constructor: this.options ─> ', this.options);
        }
    }

    ngOnInit(): void {
        this.loading = false;
    }

    async clickDelete() {
        const resDelete = await this.deleteUser();
        this.loading = false;
        if (resDelete.status === 'ok') {
            this.cancelar({ action: this.options.id, data: this.options.record.id_user, replay: { status: 'ok', message: 'User deleted' } });
        } else {
            this.msg(resDelete.message);
        }
    }

    async deleteUser() {
        return new Promise<IReplay>((resolve) => {
            const data: IIdUser = {
                id_user: this.options.record.id_user,
                date_updated_user: this.options.record.date_updated_user ? this.options.record.date_updated_user : '',
            };
            console.log('Componente ' + this._name + ': deleteUser: data ─> ', data);
            try {
                this.loading = true;
                this._usersService.deleteUser(data).subscribe({
                    next: async (resp: any) => {
                        console.log('Componente ' + this._name + ': deleteUser: resp ─> ', resp);
                        if (resp.status === 200) {
                            resolve({ status: 'ok', message: 'El usuario se eliminó con exito' });
                        } else {
                            console.log('Componente ' + this._name + ': deleteUser: error ─> resp.message', resp.message);
                            resolve({ status: 'error', message: resp.message });
                        }
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': deleteUser: error ─> delete', err);
                        resolve({ status: 'error', message: err });
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': deleteUser: complete ─> delete');
                    },
                });
            } catch (error: any) {
                console.log('Componente ' + this._name + ': deleteUser: catch error ─> ', error);
                resolve({ status: 'abort', message: error });
            }
        });
    }

    cancelar(datosSalida: IResponseActionsUsers | null) {
        if (datosSalida === null) {
            datosSalida = { action: 'exit', data: '', replay: { status: '', message: '' } };
        }
        console.log('Componente ' + this._name + ': cancelar: ─> dialogRef.close ', datosSalida);
        this.dialogRef.close(datosSalida);
    }

    msg(msg: string) {
        this._snackBar.open(msg, '', {
            duration: this.durationInSeconds * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
}
