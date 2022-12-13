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
    Url2: string = 'http://apiasoc.es:7251';

    constructor(private http: HttpClient) {}

    // ************************************************************************************ //
    //                                                                                      //
    //                                 User Management                                      //
    //                                                                                      //
    // ************************************************************************************ //

    signIn(credentials: ICredentials, header: any) {
        // console.log('Componente ' + this._name + ': signIn: credentials ─> ', credentials);

        return this.http.post(`${this.Url2}/auth/login`, credentials, header.headers);
    }

    getUserConnected(header: any) {
        // console.log('Componente ' + this._name + ': signIn: credentials ─> ');

        return this.http.get(`${this.Url2}/auth/connected-user`, header.headers);
    }

    signOut(header: any) {
        // console.log('Componente ' + this._name + ': signOut:  ─> ');

        return this.http.get(`${this.Url2}/auth/logout`, header.headers);
    }

    deleteUser(data: IIdUser, header: any) {
        // console.log('Componente ' + this._name + ': deleteUser:  ─> ');
        console.log('Componente ' + this._name + ': deleteUser: data.date_updated_user ─> ', data.date_updated_user);
        console.log('Componente ' + this._name + ': deleteUser: typeof data.date_updated_user ─> ', typeof data.date_updated_user);

        // return this.http.get(`${this.Url2}/users/delete?id_user=${data.id_user}&date_updated_user=${data.date_updated_user}`, header.headers);
        return this.http.get(`${this.Url2}/users/delete/${data.id_user}/${data.date_updated_user}`, header.headers);
    }

    createUser(data: ICreateUser, header: any) {
        return this.http.post(`${this.Url2}/users/create`, data, header.headers);
    }

    registerUser(data: any) {
        return this.http.post(`${this.Url2}/auth/register`, data);
    }

    resetPassword(data: any, header: any) {
        // console.log('Componente ' + this._name + ': resetPassword: data ─> ', data);
        // console.log('Componente ' + this._name + ': resetPassword: header ─> ', header);
        return this.http.post(`${this.Url2}/auth/reset`, data, header.headers);
    }

    changePassword(credentials: INewCredentials, header: any) {
        // console.log('Componente ' + this._name + ': changePassword: credentials ─> ', credentials);

        return this.http.post(`${this.Url2}/auth/change`, credentials, header.headers);
    }

    getAllUsers(header: any) {
        // console.log('Componente ' + this._name + ': getAllAsociations:  ─> ');

        return this.http.get(`${this.Url2}/users/list-all`, header.headers);
    }

    updateUserProfile(data: any, header: any) {
        return this.http.post(`${this.Url2}/auth/profile`, data, header.headers);
    }

    updateUser(data: any, header: any) {
        return this.http.post(`${this.Url2}/users/update`, data, header.headers);
    }

    // ************************************************************************************ //
    //                                                                                      //
    //                               Asociation Management                                  //
    //                                                                                      //
    // ************************************************************************************ //

    getListAsociations() {
        // console.log('Componente ' + this._name + ': getListAsociations:  ─> ');

        return this.http.get(`${this.Url2}/asoc/list-all`);
    }

    getAllAsociations(header: any) {
        // console.log('Componente ' + this._name + ': getAllAsociations:  ─> ');

        return this.http.get(`${this.Url2}/asoc/list-all`, header.headers);
    }

    createAsociation(data: ICreateAsociation, header: any) {
        return this.http.post(`${this.Url2}/asoc/create`, data, header.headers);
    }

    deleteAsociation(data: IIdAsociation, header: any) {
        // console.log('Componente ' + this._name + ': deleteAsociation:  ─> ');
        console.log('Componente ' + this._name + ': deleteAsociation: data.date_updated_asociation ─> ', data.date_updated_asociation);
        console.log('Componente ' + this._name + ': deleteAsociation: typeof data.date_updated_asociation ─> ', typeof data.date_updated_asociation);

        return this.http.get(`${this.Url2}/asoc/delete/${data.id_asociation}/${data.date_updated_asociation}`, header.headers);
    }

    updateAsociation(data: any, header: any) {
        return this.http.post(`${this.Url2}/asoc/update`, data, header.headers);
    }

    // ************************************************************************************ //
    //                                                                                      //
    //                                 Image Management                                     //
    //                                                                                      //
    // ************************************************************************************ //

    uploadImage(fd: FormData, _header: any) {
        return this.http.post(`${this.Url2}/image/upload`, fd, {
            reportProgress: true,
            observe: 'events',
        });
    }

    uploadImageItem(fd: FormData, _header: any) {
        // console.log('Componente ' + this._name + ': changePassword: credentials ─> ', credentials);

        return this.http.post(`${this.Url2}/image/upload-item`, fd, {
            reportProgress: true,
            observe: 'events',
        });
    }

    moveImageItem(data: any, header: any) {
        return this.http.post(`${this.Url2}/image/move-item`, data, header.headers);
    }

    deleteImage(fd: FormData, header: any) {
        // console.log('Componente ' + this._name + ': deleteImage: credentials ─> ', credentials);

        // const prefix = fd.get('prefix')?.toString().replace(/\//g, ':');
        const id_user = fd.get('user_id');
        const date_updated_user = fd.get('date_updated');

        console.log(
            'Componente ' + this._name + ': deleteImage: `${this.Url2}/users/delete-image/${id_user}/${date_updated_user}` ─> ',
            `${this.Url2}/users/delete-image/${id_user}/${date_updated_user}`
        );
        // return this.http.post(`${this.Url}/images/upload.php`, fd);
        return this.http.get(`${this.Url2}/image/delete-image/${id_user}/${date_updated_user}`, header.headers);
    }

    deleteCover(data: any, header: any) {
        // console.log('Componente ' + this._name + ': deleteImage: credentials ─> ', credentials);

        const id_article = data.id_article;
        const id_asociation_article = data.id_asociation_article;
        const date_updated_article = data.date_updated_article;

        console.log(
            'Componente ' +
                this._name +
                ': deleteImage: `${this.Url2}/image/delete-cover/${id_asociation_article}/${id_article}/${date_updated_article}` ─> ',
            `${this.Url2}/image/delete-cover/${id_asociation_article}/${id_article}/${date_updated_article}`
        );

        return this.http.get(`${this.Url2}/image/delete-cover/${id_asociation_article}/${id_article}/${date_updated_article}`, header.headers);
    }

    // ************************************************************************************ //
    //                                                                                      //
    //                               Article Management                                     //
    //                                                                                      //
    // ************************************************************************************ //

    createArticle(data: IApiArticle, header: any) {
        return this.http.post(`${this.Url2}/articles/create`, data, header.headers);
    }

    updateArticle(data: any, header: any) {
        return this.http.post(`${this.Url2}/articles/update`, data, header.headers);
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

    getAllArticlesOfAsociation(_data: number, header: any) {
        return this.http.get(`${this.Url2}/articles/list-all`, header.headers);
    }

    getAllArticlesOfAsociationByCategory(_data: number, category: string, header: any) {
        return this.http.get(`${this.Url2}/articles/list-all?category_article=${category}`, header.headers);
    }

    getAllArticlesOfAsociationBySubcategory(_data: number, category: string, subcategory: string, header: any) {
        return this.http.get(`${this.Url2}/articles/list-all?category_article=${category}&subcategory_article=${subcategory}`, header.headers);
    }

    // ************************************************************************************ //
    //                                                                                      //
    //                           Notifications Management                                   //
    //                                                                                      //
    // ************************************************************************************ //

    getUserNotifications(header: any) {
        // console.log('Componente ' + this._name + ': getAllAsociations:  ─> ');

        return this.http.get(`${this.Url}/notifications/pending.php`, header.headers);
    }
}
