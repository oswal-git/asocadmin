import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ICredentials, IIdUser, INewCredentials } from '@app/interfaces/api/iapi-users.metadatos';
import { ICreateUser } from '@app/interfaces/ui/dialogs.interface';
import { ICreateAsociation, IIdAsociation } from '@app/interfaces/api/iapi-asociation.metadata';
import { IApiArticle, IIdArticle } from '@app/interfaces/api/iapi-articles.metadata';

@Injectable({
    providedIn: 'root',
})
export class BdmysqlService {
    private _name = 'BdmysqlService';
    Url: string = 'http://apiasoc.es';

    constructor(private http: HttpClient) {}

    // ************************************************************************************ //
    //                                                                                      //
    //                                 User Management                                      //
    //                                                                                      //
    // ************************************************************************************ //
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
        // console.log('Componente ' + this._name + ': deleteUser:  ─> ');
        console.log('Componente ' + this._name + ': deleteUser: data.date_updated_user ─> ', data.date_updated_user);
        console.log('Componente ' + this._name + ': deleteUser: typeof data.date_updated_user ─> ', typeof data.date_updated_user);

        return this.http.get(`${this.Url}/users/delete.php?id_user=${data.id_user}&date_updated_user=${data.date_updated_user}`, header.headers);
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

    // ************************************************************************************ //
    //                                                                                      //
    //                               Asociation Management                                  //
    //                                                                                      //
    // ************************************************************************************ //

    getListAsociations() {
        // console.log('Componente ' + this._name + ': getListAsociations:  ─> ');

        return this.http.get(`${this.Url}/asociations/list-all.php`);
    }

    getAllAsociations(header: any) {
        // console.log('Componente ' + this._name + ': getAllAsociations:  ─> ');

        return this.http.get(`${this.Url}/asociations/list-all.php`, header.headers);
    }

    createAsociation(data: ICreateAsociation, header: any) {
        return this.http.post(`${this.Url}/asociations/create.php`, data, header.headers);
    }

    deleteAsociation(data: IIdAsociation, header: any) {
        // console.log('Componente ' + this._name + ': deleteAsociation:  ─> ');
        console.log('Componente ' + this._name + ': deleteAsociation: data.date_updated_asociation ─> ', data.date_updated_asociation);
        console.log('Componente ' + this._name + ': deleteAsociation: typeof data.date_updated_asociation ─> ', typeof data.date_updated_asociation);

        return this.http.get(
            `${this.Url}/asociations/delete.php?id_asociation=${data.id_asociation}&date_updated_asociation=${data.date_updated_asociation}`,
            header.headers
        );
    }

    updateAsociation(data: any, header: any) {
        return this.http.post(`${this.Url}/asociations/update.php`, data, header.headers);
    }

    // ************************************************************************************ //
    //                                                                                      //
    //                                 Image Management                                     //
    //                                                                                      //
    // ************************************************************************************ //

    uploadImage(fd: FormData, _header: any) {
        // console.log('Componente ' + this._name + ': changePassword: credentials ─> ', credentials);

        return this.http.post(`${this.Url}/images/upload.php`, fd, {
            reportProgress: true,
            observe: 'events',
        });
    }

    uploadImageItem(fd: FormData, _header: any) {
        // console.log('Componente ' + this._name + ': changePassword: credentials ─> ', credentials);

        return this.http.post(`${this.Url}/images/upload-item.php`, fd, {
            reportProgress: true,
            observe: 'events',
        });
    }

    deleteImage(fd: FormData, _header: any) {
        // console.log('Componente ' + this._name + ': changePassword: credentials ─> ', credentials);

        return this.http.post(`${this.Url}/images/upload.php`, fd);
    }

    // ************************************************************************************ //
    //                                                                                      //
    //                               Article Management                                     //
    //                                                                                      //
    // ************************************************************************************ //

    createArticle(data: IApiArticle, header: any) {
        return this.http.post(`${this.Url}/articles/create.php`, data, header.headers);
    }

    updateArticle(data: any, header: any) {
        return this.http.post(`${this.Url}/articles/update.php`, data, header.headers);
    }

    deleteArticle(data: IIdArticle, header: any) {
        // console.log('Componente ' + this._name + ': deleteAsociation:  ─> ');
        console.log('Componente ' + this._name + ': deleteArticle: data.date_updated_article ─> ', data.date_updated_article);
        console.log('Componente ' + this._name + ': deleteArticle: typeof data.date_updated_article ─> ', typeof data.date_updated_article);

        return this.http.get(
            `${this.Url}/articles/delete.php?id_article=${data.id_article}&date_updated_article=${data.date_updated_article}`,
            header.headers
        );
    }

    getAllArticlesOfAsociation(data: number, header: any) {
        return this.http.get(`${this.Url}/articles/list-all.php?id_asociation_article=${data}`, header.headers);
    }

    getAllArticlesOfAsociationByCategory(data: number, category: string, header: any) {
        return this.http.get(`${this.Url}/articles/list-all.php?id_asociation_article=${data}&category_article=${category}`, header.headers);
    }

    getAllArticlesOfAsociationBySubcategory(data: number, category: string, subcategory: string, header: any) {
        return this.http.get(
            `${this.Url}/articles/list-all.php?id_asociation_article=${data}&category_article=${category}&subcategory_article=${subcategory}`,
            header.headers
        );
    }
}
