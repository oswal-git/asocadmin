import { IAsociationData } from './iapi-asociation.metadata';

export interface IBDUsuario extends IProfileUsuario {
    password_user: string;
}
export interface IProfileUsuario {
    id_user: number;
    id_asociation_user: number;
    user_name_user: string;
    email_user: string;
    recover_password_user: number;
    token_user: string;
    token_exp_user: string;
    profile_user: string;
    status_user: string;
    name_user: string;
    last_name_user: string;
    avatar_user: string;
    phone_user: string;
    date_deleted_user: string;
    date_created_user: string;
    date_updated_user: string;
}

export interface IUserAsociation extends IProfileUsuario, IAsociationData {}

// Datos básicos del usuario - users.sevice
export interface IUserConnected {
    id_user: number;
    id_asociation_user: number;
    user_name_user: string;
    email_user: string;
    recover_password_user: number;
    token_user: string;
    token_exp_user: string;
    profile_user: string;
    status_user: string;
    name_user: string;
    last_name_user: string;
    avatar_user: string;
    phone_user: string;
    date_deleted_user: string;
    date_created_user: string;
    date_updated_user: string;
    id_asoc_admin: number;
    long_name_asoc: string;
    short_name_asoc: string;
}

export interface ICredentials {
    email_user: string;
    password_user: string;
}
export interface INewCredentials extends ICredentials {
    new_password_user: string;
}
export interface IRolUser {
    perfil: string;
    literal: string;
}
export interface IStateUser {
    estado: string;
}
export interface IIdUser {
    id_user: number;
    date_updated_user: string;
    force?: boolean;
}
