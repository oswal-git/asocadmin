import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';
import { IOptionsDialog } from '@app/interfaces/ui/dialogs.interface';
import { UsersService } from '@app/services/bd/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-profile-asociation',
    templateUrl: './profile-asociation.component.html',
    styleUrls: ['./profile-asociation.component.scss'],
    providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
})
export class ProfileAsociationComponent implements OnInit {
    private _name = 'ProfileAsociationComponent';

    userProfile!: IUserConnected;

    loading = false;

    options: IOptionsDialog = {
        id: 'profile',
        title: 'Editar el Perfil de <span class="title__span">Asociación</span>',
        second_title: 'Actualiza los datos',
        button: 'Actualizar',
        record: null,
        options: { fin: false },
    };

    constructor(
        private _usersService: UsersService,
        private _toastr: ToastrService // private _location: Location
    ) {
        const res: any = this._usersService.getLocalStoredProfile();

        if (res.msg === 'Token expired') {
            this._toastr.error('Login for try the user list', 'User not logged').onHidden.subscribe(() => {
                // this._location.back();
            });
        }

        if (res.msg !== 'User logged') {
            //TODO npm install crypto-js
            // this._location.back();
        }
    }

    ngOnInit(): void {
        this.options.options.fin = true;
    }

    close(datosSalida: any) {
        console.log('Componente ' + this._name + ': cancelar: ─> dialogRef.close: datosSalida ', datosSalida);
        // if (this.options.id === 'profile') {
        //     // if (datosSalida.action === 'profile') {
        //     //     this._usersService.updateProfileAvatar(datosSalida.data.avatar);
        //     // }
        //     this._location.back();
        // } else {
        //     this._location.back();
        // }
    }
}
