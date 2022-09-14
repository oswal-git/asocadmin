import { Injectable } from '@angular/core';
import { IBDAsociacion } from '@app/interfaces/api/iapi-asociation.metadata';
import { BdmysqlService } from './bdmysql.service';

@Injectable({
    providedIn: 'root',
})
export class AsociationsService {
    private _name = 'AsociationsService';

    private _asociation: IBDAsociacion = {
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

    get asociation(): IBDAsociacion {
        return this._asociation;
    }

    set asociationData(data: IBDAsociacion) {
        this._asociation = data;
    }

    set asociationAvatar(logo: string) {
        this._asociation.logo_asociation = logo;
    }

    constructor(private _db: BdmysqlService) {}

    getAllAsociations(header: any) {
        console.log('Componente ' + this._name + ': getAllAsociations: header ─> ', header);
        return this._db.getAllAsociations(header);
    }

    getListAsociations() {
        console.log('Componente ' + this._name + ': getListAsociations: ─> ');
        return this._db.getListAsociations();
    }

    async createAsociation() {}

    async insertProfile() {}

    async updateProfile() {}
}
