export interface IOptionsDialog {
    id: 'create' | 'register' | 'browse' | 'profile' | 'login' | 'edit' | 'delete';
    title: string;
    second_title?: string;
    button: string;
    // class: string;
    record: any;
    options: any;
}

export interface IReplay {
    status: string;
    message: string;
}

export interface IResponseActionsUsers {
    action: string;
    data: any;
    replay: IReplay;
}

export interface IResponseActionsAsociations {
    action: string;
    data: any;
    replay: {
        status: string;
        message: string;
    };
}

export interface ICreateUser {
    id_asociation_user: number;
    user_name_user: string;
    name_user: string;
    last_name_user: string;
    email_user: string;
    password_user: string;
    phone_user: string;
    profile_user: string;
    status_user: string;
}

export enum ACTION_AVATAR {
    user = 'user',
    delete = 'delete',
    profile = 'profile',
}
