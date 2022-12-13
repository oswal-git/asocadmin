import { Injectable } from '@angular/core';
import { IBDAsociation, ICreateAsociation, IIdAsociation } from '@app/interfaces/api/iapi-asociation.metadata';
import { BdmysqlService } from './bdmysql.service';
import { UsersService } from './users.service';

@Injectable({
    providedIn: 'root',
})
export class AsociationsService {
    private _name = 'AsociationsService';

    private _asociation: IBDAsociation = {
        id_asociation: 0,
        long_name_asociation: '',
        short_name_asociation: '',
        logo_asociation: '',
        email_asociation: '',
        name_contact_asociation: '',
        phone_asociation: '',
        date_deleted_asociation: '',
        date_created_asociation: '',
        date_updated_asociation: '',
    };

    get asociation(): IBDAsociation {
        return this._asociation;
    }

    set asociationData(data: IBDAsociation) {
        this._asociation = data;
    }

    set asociationAvatar(logo: string) {
        this._asociation.logo_asociation = logo;
    }

    constructor(private _db: BdmysqlService, private _usersService: UsersService) {}

    getAllAsociations() {
        console.log('Componente ' + this._name + ': getAllAsociations: header ─> ', this._usersService.getAuthHeaders());
        return this._db.getAllAsociations(this._usersService.getAuthHeaders());
    }

    getListAsociations() {
        console.log('Componente ' + this._name + ': getListAsociations: ─> ');
        return this._db.getListAsociations();
    }

    createAsociation(data: ICreateAsociation) {
        return this._db.createAsociation(data, this._usersService.getAuthHeaders());
    }

    async insertProfile() {}

    modifyAsociation(data: any) {
        return this._db.updateAsociation(data, this._usersService.getAuthHeaders());
    }

    deleteAsociation(data: IIdAsociation) {
        return this._db.deleteAsociation(data, this._usersService.getAuthHeaders());
    }

    uploadLogo(fd: FormData) {
        return this._db.uploadImage(fd, this._usersService.getAuthHeaders());
    }

    deleteLogo(fd: FormData) {
        return this._db.deleteImage(fd, this._usersService.getAuthHeaders());
    }
}
