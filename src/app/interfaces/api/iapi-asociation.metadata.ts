export interface IListAsociationData {
    id_asociation: number;
    long_name_asociation: string;
    short_name_asociation: string;
    logo_asociation: string;
}
export interface IAsociationData extends IListAsociationData {
    email_asociation: string;
    name_contact_asociation: string;
    phone_asociation: string;
}
export interface IBDAsociation extends IAsociationData {
    date_deleted_asociation: string;
    date_created_asociation: string;
    date_updated_asociation: string;
}

export interface IIdAsociation {
    id_asociation: number;
    date_updated_asociation: string;
    force?: boolean;
}
export interface ICreateAsociation {
    long_name_asociation: string;
    short_name_asociation: string;
    email_asociation: string;
    name_contact_asociation: string;
    phone_asociation: string;
    logo_asociation?: string;
}
