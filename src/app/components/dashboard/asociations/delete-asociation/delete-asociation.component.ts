import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { IIdAsociation } from '@app/interfaces/api/iapi-asociation.metadata';
import { IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';
import { IOptionsDialog, IReplay, IResponseActionsUsers } from '@app/interfaces/ui/dialogs.interface';
import { AsociationsService } from '@app/services/bd/asociations.service';
import { UsersService } from '@app/services/bd/users.service';
import { IEglImagen } from '@app/shared/controls/egl-img/egl-img.component';
import { environment } from '@env/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-delete-asociation',
    templateUrl: './delete-asociation.component.html',
    styleUrls: ['./delete-asociation.component.scss'],
    providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
})
export class DeleteAsociationComponent implements OnInit {
    private _name = 'DeleteAsociationComponent';

    options!: IOptionsDialog;
    asocResp: IResponseActionsUsers = { action: '', data: '', replay: { status: '', message: '' } };
    userProfile!: IUserConnected;

    avatarUrlDefault = environment.urlApi + '/assets/images/user.png';
    avatarImg: IEglImagen = {
        src: this.avatarUrlDefault,
        nameFile: '',
        filePath: '',
        fileImage: null,
        isSelectedFile: false,
    };

    isSuper = false;
    isAdmin = false;

    loading = true;

    durationInSeconds = 1.5;
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    constructor(
        public dialogRef: MatDialogRef<DeleteAsociationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IOptionsDialog | string,
        private _usersService: UsersService,
        private _asociationsService: AsociationsService,
        private _snackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _location: Location
    ) {
        console.log('Componente ' + this._name + ': constructor: data ─> ', data);
        if (typeof data !== 'string') {
            this.options = data;
            if (this.options.record.avatar_user) {
                this.avatarImg.src = this.options.record.avatar_user;
            }

            console.log('Componente ' + this._name + ': constructor: this.options ─> ', this.options);
        }

        const res = this._usersService.getLocalStoredProfile();
        console.log('Componente ' + this._name + ': constructor: res ─> ', res);

        if (res.msg !== 'User logged') {
            this._toastr.error(res.msge, 'User not logged. Login for try the user list').onHidden.subscribe(() => {
                this._location.back();
            });
        } else if (!['admin', 'superadmin'].includes(res.userprofile.profile_user)) {
            this._toastr.error(res.msge, 'User not authorized for try the asociations list').onHidden.subscribe(() => {
                this._location.back();
            });
        }

        this.userProfile = res.userprofile;

        this.isSuper = this.userProfile.profile_user === 'superadmin' ? true : false;
        this.isAdmin = this.userProfile.id_asoc_admin === 0 ? false : true;
        if (!this.isSuper) {
            this._toastr.error(res.msge, 'User not authorized for try the asociations list').onHidden.subscribe(() => {
                this._location.back();
            });
        }
    }

    ngOnInit(): void {
        this.loading = false;
    }

    async clickDelete() {
        const resDelete = await this.deleteAsociation();
        this.loading = false;
        if (resDelete.status === 'ok') {
            this.cancelar({
                action: this.options.id,
                data: this.options.record.id_asociation,
                replay: { status: 'ok', message: 'Asociation deleted' },
            });
        } else {
            this.msg(resDelete.message);
        }
    }

    async deleteAsociation() {
        return new Promise<IReplay>((resolve) => {
            const data: IIdAsociation = {
                id_asociation: this.options.record.id_asociation,
                date_updated_asociation: this.options.record.date_updated_asociation ? this.options.record.date_updated_asociation : '',
            };
            console.log('Componente ' + this._name + ': deleteAsociation: data ─> ', data);
            try {
                this.loading = true;
                this._asociationsService.deleteAsociation(data).subscribe({
                    next: async (resp: any) => {
                        console.log('Componente ' + this._name + ': deleteAsociation: resp ─> ', resp);
                        if (resp.status === 200) {
                            resolve({ status: 'ok', message: 'El usuario se eliminó con exito' });
                        } else {
                            console.log('Componente ' + this._name + ': deleteAsociation: error ─> resp.message', resp.message);
                            resolve({ status: 'error', message: resp.message });
                        }
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': deleteAsociation: error ─> delete', err);
                        resolve({ status: 'error', message: err });
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': deleteAsociation: complete ─> delete');
                    },
                });
            } catch (error: any) {
                console.log('Componente ' + this._name + ': deleteAsociation: catch error ─> ', error);
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
