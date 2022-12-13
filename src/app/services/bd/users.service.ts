import { Injectable } from '@angular/core';
import { IBDAsociation } from '@app/interfaces/api/iapi-asociation.metadata';
import {
    IBDUsuario,
    ICredentials,
    IIdUser,
    ILocalProfile,
    INewCredentials,
    IUserAsociation,
    IUserConnected,
} from '@app/interfaces/api/iapi-users.metadatos';
import { ICreateUser } from '@app/interfaces/ui/dialogs.interface';
import { BehaviorSubject, Observable, timer, switchMap } from 'rxjs';
import { BdmysqlService } from './bdmysql.service';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private _name = 'UsersService';

    hours: number = 0;
    minuts: number = 0;
    seconds: number = 10;
    miliSeconds: number = ((this.hours * 60 + this.minuts) * 60 + this.seconds) * 1000;
    private _userprofile: IUserConnected = {
        avatar_user: '',
        date_created_user: '',
        date_deleted_user: '',
        date_updated_user: '',
        email_user: '',
        id_asoc_admin: 0,
        id_asociation_user: 0,
        id_user: 0,
        last_name_user: '',
        long_name_asoc: '',
        name_user: '',
        phone_user: '',
        profile_user: '',
        recover_password_user: 0,
        short_name_asoc: '',
        status_user: '',
        token_exp_user: 0,
        token_user: '',
        user_name_user: '',
    };

    // private _userProfileO: IUserConnected = this._userprofile;

    get userProfile(): Observable<IUserConnected> {
        return this.userProfileSubject$.asObservable();
    }
    private userProfileSubject$: BehaviorSubject<IUserConnected>;

    set userProfileData(data: IUserConnected) {
        // console.log('Componente ' + this._name + ': userProfileData: data ─> ', data);
        this._userprofile = data;
        // this._userProfileO = this._userprofile;
        // this.sharedUserPerfilObservable.next(data);
        this.userProfileSubject$.next(this._userprofile);
    }

    set userProfileAvatar(avatar: string) {
        // console.log('Componente ' + this._name + ': userProfileAvatar: avatar ─> ', avatar);
        this._userprofile.avatar_user = avatar;
        // this._userProfileO.avatar_user = avatar;
        // this.sharedUserPerfilObservable.next(this._userProfileO);
        this.userProfileSubject$.next(this._userprofile);
    }

    constructor(private _db: BdmysqlService) {
        this.userProfileSubject$ = new BehaviorSubject(this._userprofile);
        // this.pollUsers().subscribe((res) => console.log('Componente ' + this._name + ': constructor: pollUsers ─> ', res));
    }

    pollUsers(): Observable<any> {
        return timer(this.seconds, this.miliSeconds).pipe(switchMap(() => this.getUserNotifications()));
    }

    getUserNotifications(): Observable<any> {
        return this._db.getUserNotifications(this.getAuthHeaders());
    }

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

    updateProfile(data: any) {
        return this._db.updateUserProfile(data, this.getAuthHeaders());
    }

    editUser(data: any) {
        return this._db.updateUser(data, this.getAuthHeaders());
    }

    getLocalStoredProfile(): ILocalProfile {
        const item = localStorage.getItem('userprofile') || null;
        let resp!: any;

        if (item == null) {
            this.resetStoredProfile();
            resp = {
                msg: 'Not user logged',
                userprofile: this._userprofile,
            };
            console.log('Componente ' + this._name + ': getProfile: item == null resp  ─> ', resp);
            return resp;
        } else {
            this._userprofile = JSON.parse(item);
            if (this._userprofile.token_exp_user !== 0) {
                const now = Math.round(new Date().getTime() / 1000);
                if (now >= this._userprofile.token_exp_user) {
                    this.resetStoredProfile();
                    resp = {
                        msg: 'Token expired',
                        userprofile: this._userprofile,
                    };
                    console.log('Componente ' + this._name + ': getProfile: token_exp_user resp  ─> ', resp);
                    return resp;
                } else {
                    console.log('Componente ' + this._name + ': getProfile: this._userprofile  ─> ', this._userprofile);
                    resp = {
                        msg: 'User logged',
                        userprofile: this._userprofile,
                    };
                    this.userProfileSubject$.next(this._userprofile);
                    console.log('Componente ' + this._name + ': getProfile: logged resp  ─> ', resp);
                    return resp;
                }
            } else {
                this.resetStoredProfile();
                resp = {
                    msg: 'Not user logged',
                    userprofile: this._userprofile,
                };
                console.log('Componente ' + this._name + ': getProfile: else resp  ─> ', resp);
                return resp;
            }
        }
    }

    actualizeStoreProfile(user: IBDUsuario, asoc: IBDAsociation) {
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

        // this._userProfileO = this._userprofile;
        // this.sharedUserPerfilObservable.next(this._userProfileO);
        this.userProfileSubject$.next(this._userprofile);

        return this._userprofile;
    }

    modifyStoreProfile(user: IUserAsociation) {
        // console.log('Componente ' + this._name + ': actualizeProfile: user  ─> ', user);
        // console.log('Componente ' + this._name + ': actualizeProfile: asoc  ─> ', asoc);

        this._userprofile.avatar_user = user.avatar_user;
        this._userprofile.date_created_user = user.date_created_user;
        this._userprofile.date_deleted_user = user.date_deleted_user;
        this._userprofile.date_updated_user = user.date_updated_user;
        this._userprofile.email_user = user.email_user;
        this._userprofile.id_asociation_user = user.id_asociation_user;
        this._userprofile.id_user = user.id_user;
        this._userprofile.last_name_user = user.last_name_user;
        this._userprofile.name_user = user.name_user;
        this._userprofile.phone_user = user.phone_user;
        this._userprofile.profile_user = user.profile_user;
        this._userprofile.recover_password_user = user.recover_password_user;
        this._userprofile.status_user = user.status_user;
        this._userprofile.token_exp_user = user.token_exp_user;
        this._userprofile.token_user = user.token_user;
        this._userprofile.user_name_user = user.user_name_user;

        this._userprofile.id_asoc_admin = user.profile_user === 'admin' ? user.id_asociation_user : 0;

        this._userprofile.long_name_asoc = user.long_name_asociation;
        this._userprofile.short_name_asoc = user.short_name_asociation;

        localStorage.setItem('userprofile', JSON.stringify(this._userprofile));

        // this._userProfileO = this._userprofile;
        // this.sharedUserPerfilObservable.next(this._userProfileO);
        this.userProfileSubject$.next(this._userprofile);

        return this._userprofile;
    }

    modifyDataAsociationStoreProfile(asoc: IBDAsociation) {
        // console.log('Componente ' + this._name + ': actualizeProfile: asoc  ─> ', asoc);

        this._userprofile.long_name_asoc = asoc.long_name_asociation;
        this._userprofile.short_name_asoc = asoc.short_name_asociation;

        localStorage.setItem('userprofile', JSON.stringify(this._userprofile));

        // this._userProfileO = this._userprofile;
        // this.sharedUserPerfilObservable.next(this._userProfileO);
        this.userProfileSubject$.next(this._userprofile);

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
        this._userprofile.token_exp_user = 0;
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

        // this._userProfileO = this._userprofile;
        // this.sharedUserPerfilObservable.next(this._userProfileO);
        this.userProfileSubject$.next(this._userprofile);

        return this._userprofile;
    }

    updateProfileAvatar(avatar: string) {
        this._userprofile.avatar_user = avatar;
        localStorage.setItem('userprofile', JSON.stringify(this._userprofile));
        // this._userProfileO = this._userprofile;
        // this.sharedUserPerfilObservable.next(this._userProfileO);
        this.userProfileSubject$.next(this._userprofile);
        return this._userprofile;
    }

    uploadAvatar(fd: FormData) {
        return this._db.uploadImage(fd, this.getAuthHeaders());
    }

    deleteAvatar(fd: FormData) {
        return this._db.deleteImage(fd, this.getAuthHeaders());
    }
}
