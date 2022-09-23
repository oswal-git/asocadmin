import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ICredentials, IIdUser, INewCredentials } from '@app/interfaces/api/iapi-users.metadatos';
import { ICreateUser } from '@app/interfaces/ui/dialogs.interface';
import { IIdAsociation } from '@app/interfaces/api/iapi-asociation.metadata';

@Injectable({
    providedIn: 'root',
})
export class BdmysqlService {
    private _name = 'BdmysqlService';
    Url: string = 'http://apiasoc.es';

    constructor(private http: HttpClient) {}

    signIn(credentials: ICredentials, header: any) {
        // console.log('Componente ' + this._name + ': signIn: credentials ─> ', credentials);

        return this.http.post(`${this.Url}/users/login.php`, credentials, header.headers);
    }

    getUserConnected(header: any) {
        // console.log('Componente ' + this._name + ': signIn: credentials ─> ');

        return this.http.get(`${this.Url}/users/connected-user.php`, header.headers);
    }

    signOut(header: any) {
        // console.log('Componente ' + this._name + ': signOut:  ─> ');

        return this.http.get(`${this.Url}/users/logout.php`, header.headers);
    }

    deleteUser(data: IIdUser, header: any) {
        // console.log('Componente ' + this._name + ': signOut:  ─> ');
        console.log('Componente ' + this._name + ': signOut: data.date_updated_user ─> ', data.date_updated_user);
        console.log('Componente ' + this._name + ': signOut: typeof data.date_updated_user ─> ', typeof data.date_updated_user);

        return this.http.get(`${this.Url}/users/delete.php?id_user=${data.id_user}&date_updated_user=${data.date_updated_user}`, header.headers);
    }

    deleteAsociation(data: IIdAsociation, header: any) {
        // console.log('Componente ' + this._name + ': signOut:  ─> ');
        console.log('Componente ' + this._name + ': signOut: data.date_updated_asociation ─> ', data.date_updated_asociation);
        console.log('Componente ' + this._name + ': signOut: typeof data.date_updated_asociation ─> ', typeof data.date_updated_asociation);

        return this.http.get(
            `${this.Url}/asociations/delete.php?id_asociation=${data.id_asociation}&date_updated_asociation=${data.date_updated_asociation}`,
            header.headers
        );
    }

    createUser(data: ICreateUser, header: any) {
        return this.http.post(`${this.Url}/users/create.php`, data, header.headers);
    }

    registerUser(data: any) {
        return this.http.post(`${this.Url}/users/register.php`, data);
    }

    resetPassword(data: any, header: any) {
        // console.log('Componente ' + this._name + ': resetPassword: data ─> ', data);
        // console.log('Componente ' + this._name + ': resetPassword: header ─> ', header);
        return this.http.post(`${this.Url}/users/reset.php`, data, header.headers);
    }

    changePassword(credentials: INewCredentials, header: any) {
        // console.log('Componente ' + this._name + ': changePassword: credentials ─> ', credentials);

        return this.http.post(`${this.Url}/users/change.php`, credentials, header.headers);
    }

    uploadImage(fd: FormData, _header: any) {
        // console.log('Componente ' + this._name + ': changePassword: credentials ─> ', credentials);

        return this.http.post(`${this.Url}/images/upload.php`, fd, {
            reportProgress: true,
            observe: 'events',
        });
    }

    deleteImage(fd: FormData, _header: any) {
        // console.log('Componente ' + this._name + ': changePassword: credentials ─> ', credentials);

        return this.http.post(`${this.Url}/images/upload.php`, fd);
    }

    getListAsociations() {
        // console.log('Componente ' + this._name + ': getListAsociations:  ─> ');

        return this.http.get(`${this.Url}/asociations/list-all.php`);
    }

    getAllAsociations(header: any) {
        // console.log('Componente ' + this._name + ': getAllAsociations:  ─> ');

        return this.http.get(`${this.Url}/asociations/list-all.php`, header.headers);
    }

    getAllUsers(header: any) {
        // console.log('Componente ' + this._name + ': getAllAsociations:  ─> ');

        return this.http.get(`${this.Url}/users/list-all.php`, header.headers);
    }

    updateUserProfile(data: any, header: any) {
        return this.http.post(`${this.Url}/users/profile.php`, data, header.headers);
    }

    updateUser(data: any, header: any) {
        return this.http.post(`${this.Url}/users/update.php`, data, header.headers);
    }

    updateAsociation(data: any, header: any) {
        return this.http.post(`${this.Url}/asociations/update.php`, data, header.headers);
    }
}
