import { IEglImagen } from '@app/shared/controls';

// DB registers
export interface IBDArticle {
    id_article: number;
    id_asociation_article: number;
    id_user_article: number;
    category_article: string;
    subcategory_article: string;
    class_article: string;
    state_article: string;
    publication_date_article: string;
    effective_date_article: string;
    expiration_date_article: string;
    cover_image_article: string;
    title_article: string;
    abstract_article: string;
    ubication_article: string;
    // }

    // export interface IBDDatesArticle {
    date_deleted_article: string;
    date_created_article: string;
    date_updated_article: string;
}

export interface IBDItemArticle {
    id_item_article: number;
    id_article_item_article: number;
    date_created_item_article: string;
    // }

    // export interface IBDDataItemsArticle {
    image_item_article: string;
    text_item_article: string;
}
// DB registers ************************************************

export interface IArticle {
    id_article: number;
    id_asociation_article: number;
    id_user_article: number;
    category_article: string;
    subcategory_article: string;
    class_article: string;
    state_article: string;
    publication_date_article: string;
    effective_date_article: string;
    expiration_date_article: string;
    cover_image_article: IEglImagen;
    title_article: string;
    abstract_article: string;
    items_article: IDataItemArticle[];
    ubication_article: string;
    date_deleted_article: string;
    date_created_article: string;
    date_updated_article: string;
}

export interface IDataItemArticle {
    image_item_article: IEglImagen;
    text_item_article: string;
}

export interface IItemArticle extends IDataItemArticle {
    id_item_article: number;
    id_article_item_article: number;
}

export interface IArticlePlain {
    id_article: number;
    id_asociation_article: number;
    id_user_article: number;
    category_article: string;
    subcategory_article: string;
    class_article: string;
    state_article: string;
    publication_date_article: string;
    effective_date_article: string;
    expiration_date_article: string;
    title_article: string;
    abstract_article: string;
    items_article: IDataItemArticlePlain[];
    ubication_article: string;
    date_updated_article: string;
}

export interface IIdArticle {
    id_article: number;
    date_updated_article: string;
}

export interface IDataItemArticlePlain {
    id_item_article: number;
    text_item_article: string;
}

export interface IArticleImage {
    id_article: number;
    id_asociation_article: number;
    cover_image_article: IEglImagen;
    items_article: IDataItemArticleImage[];
    date_updated_article: string;
}

export interface IDataItemArticleImage {
    id_item_article: number;
    image_item_article: IEglImagen;
}

export interface IApiArticle {
    data: {
        id_article: number;
        id_asociation_article: number;
        id_user_article: number;
        category_article: string;
        subcategory_article: string;
        class_article: string;
        state_article: string;
        publication_date_article: string;
        effective_date_article: string;
        expiration_date_article: string;
        title_article: string;
        abstract_article: string;
        ubication_article: string;
        date_updated_article: string;
    };
    items: IDataItemArticlePlain[];
}
