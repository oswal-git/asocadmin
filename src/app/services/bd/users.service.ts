import { Injectable } from '@angular/core';
import { IBDAsociacion } from '@app/interfaces/api/iapi-asociation.metadata';
import { IBDUsuario, ICredentials, IIdUser, INewCredentials, IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';
import { ICreateUser } from '@app/interfaces/ui/dialogs.interface';
import { BdmysqlService } from './bdmysql.service';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    // private _name = 'UsersService';

    private _userprofile: IUserConnected = {
        id_user: 0,
        id_asociation_user: 0,
        user_name_user: '',
        email_user: '',
        recover_password_user: 0,
        token_user: '',
        token_exp_user: '',
        profile_user: '',
        status_user: '',
        name_user: '',
        last_name_user: '',
        avatar_user: '',
        phone_user: '',
        date_deleted_user: '',
        date_created_user: '',
        date_updated_user: '',
        id_asoc_admin: 0,
        long_name_asoc: '',
        short_name_asoc: '',
    };

    get userProfile(): IUserConnected {
        return this._userprofile;
    }

    set userProfileData(data: IUserConnected) {
        this._userprofile = data;
    }

    set userProfileAvatar(avatar: string) {
        this._userprofile.avatar_user = avatar;
    }

    constructor(private _db: BdmysqlService) {}

    getUserConnected() {
        // console.log('Componente ' + this._name + ': getUser: data ─> ');
        return this._db.getUserConnected(this.getAuthHeaders());
    }

    getAllUsers() {
        // console.log('Componente ' + this._name + ': getUser: data ─> ');
        return this._db.getAllUsers(this.getAuthHeaders());
    }

    login(credentials: ICredentials) {
        // console.log('Componente ' + this._name + ': login: credentials ─> ', credentials);
        return this._db.signIn(credentials, this.getAuthHeaders());
    }

    logout() {
        // console.log('Componente ' + this._name + ': logout:  ─> ');
        return this._db.signOut(this.getAuthHeaders());
    }

    createUser(data: ICreateUser) {
        return this._db.createUser(data, this.getAuthHeaders());
    }

    deleteUser(data: IIdUser) {
        return this._db.deleteUser(data, this.getAuthHeaders());
    }

    registerUser(data: any) {
        return this._db.registerUser(data);
    }

    resetPassword(data: any) {
        // console.log('Componente ' + this._name + ': resetPassword: data ─> ', data);
        return this._db.resetPassword(data, this.getAuthHeaders());
    }

    change(credentials: INewCredentials) {
        // console.log('Componente ' + this._name + ': change: credentials ─> ', credentials);
        return this._db.changePassword(credentials, this.getAuthHeaders());
    }

    dataUser(_uid: string) {
        // console.log('Componente ' + this._name + ': uid:  ─> ', uid);
    }

    register(_credentials: ICredentials) {
        // return this._db.createUserWithEmailAndPassword(credentials.email, credentials.password);
    }

    getAuthHeaders(_auth: boolean = false) {
        let header: any = {};

        if (this._userprofile.token_user === '') {
            header = {
                error: '',
                headers: {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            };
        } else {
            header = {
                error: '',
                headers: {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this._userprofile.token_user}`,
                    },
                },
            };
        }

        return header;
    }

    async insertProfile() {}

    updateProfile(data: any) {
        return this._db.updateUserProfile(data, this.getAuthHeaders());
    }

    stateUser() {
        // return this._db.authState;
    }

    getLocalStoredProfile() {
        const item = localStorage.getItem('userprofile') || null;
        let resp!: any;

        if (item == null) {
            this.resetStoredProfile();
            resp = {
                msg: 'Not user logged',
                userprofile: this._userprofile,
            };
            // console.log('Componente ' + this._name + ': getProfile: resp  ─> ', resp);
            return resp;
        } else {
            this._userprofile = JSON.parse(item);
            if (this._userprofile.token_exp_user !== '') {
                const now = Math.round(new Date().getTime() / 1000);
                // console.log('Componente ' + this._name + ': getProfile: now  ─> ', now);
                // console.log('Componente ' + this._name + ': getProfile: unixtime  ─> ', this._userprofile.token_exp_user);
                if (now >= parseInt(this._userprofile.token_exp_user)) {
                    this.resetStoredProfile();
                    resp = {
                        msg: 'Token expired',
                        userprofile: this._userprofile,
                    };
                    // console.log('Componente ' + this._name + ': getProfile: resp  ─> ', resp);
                    return resp;
                } else {
                    resp = {
                        msg: 'User logged',
                        userprofile: this._userprofile,
                    };
                    // console.log('Componente ' + this._name + ': getProfile: resp  ─> ', resp);
                    return resp;
                }
            } else {
                this.resetStoredProfile();
                resp = {
                    msg: 'Not user logged',
                    userprofile: this._userprofile,
                };
                // console.log('Componente ' + this._name + ': getProfile: resp  ─> ', resp);
                return resp;
            }
        }
    }

    actualizeStoreProfile(user: IBDUsuario, asoc: IBDAsociacion) {
        // console.log('Componente ' + this._name + ': actualizeProfile: user  ─> ', user);
        // console.log('Componente ' + this._name + ': actualizeProfile: asoc  ─> ', asoc);

        this._userprofile.id_user = user.id_user;
        this._userprofile.id_asociation_user = user.id_asociation_user;
        this._userprofile.user_name_user = user.user_name_user;
        this._userprofile.email_user = user.email_user;
        this._userprofile.recover_password_user = user.recover_password_user;
        this._userprofile.token_user = user.token_user;
        this._userprofile.token_exp_user = user.token_exp_user;
        this._userprofile.profile_user = user.profile_user;
        this._userprofile.status_user = user.status_user;
        this._userprofile.name_user = user.name_user;
        this._userprofile.last_name_user = user.last_name_user;
        this._userprofile.avatar_user = user.avatar_user;
        this._userprofile.phone_user = user.phone_user;
        this._userprofile.date_deleted_user = user.date_deleted_user === '' ? '3022-12-31 00:00:00' : user.date_deleted_user;
        this._userprofile.date_created_user = user.date_created_user;
        this._userprofile.date_updated_user = user.date_updated_user;

        this._userprofile.id_asoc_admin = user.profile_user === 'admin' ? user.id_asociation_user : 0;

        if (asoc) {
            this._userprofile.long_name_asoc = asoc.long_name_asociation;
            this._userprofile.short_name_asoc = asoc.short_name_asociation;
        } else {
            this._userprofile.long_name_asoc = '';
            this._userprofile.short_name_asoc = '';
        }

        localStorage.setItem('userprofile', JSON.stringify(this._userprofile));

        return this._userprofile;
    }

    resetStoredProfile() {
        // console.log('Componente ' + this._name + ': resetProfile:   ─> ');

        this._userprofile.id_user = 0;
        this._userprofile.id_asociation_user = 0;
        this._userprofile.user_name_user = '';
        this._userprofile.email_user = '';
        this._userprofile.recover_password_user = 0;
        this._userprofile.token_user = '';
        this._userprofile.token_exp_user = '';
        this._userprofile.profile_user = '';
        this._userprofile.status_user = '';
        this._userprofile.name_user = '';
        this._userprofile.last_name_user = '';
        this._userprofile.avatar_user = '';
        this._userprofile.phone_user = '';
        this._userprofile.date_deleted_user = '';
        this._userprofile.date_created_user = '';
        this._userprofile.date_updated_user = '';

        this._userprofile.id_asoc_admin = 0;
        this._userprofile.long_name_asoc = ' ';
        this._userprofile.short_name_asoc = '';

        localStorage.removeItem('userprofile');

        return this._userprofile;
    }

    updateProfileAvatar(avatar: string) {
        this._userprofile.avatar_user = avatar;
        localStorage.setItem('userprofile', JSON.stringify(this._userprofile));
        return this._userprofile;
    }

    uploadAvatar(fd: FormData) {
        return this._db.uploadAvatarUser(fd, this.getAuthHeaders());
    }

    deleteAvatar(fd: FormData) {
        return this._db.deleteAvatarUser(fd, this.getAuthHeaders());
    }
}
