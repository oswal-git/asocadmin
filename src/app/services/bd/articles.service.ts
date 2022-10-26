import { Injectable } from '@angular/core';
import { BdmysqlService } from './bdmysql.service';
import { UsersService } from './users.service';
import { IApiArticle, IArticleImage, IArticle, IIdArticle } from '@app/interfaces/api/iapi-articles.metadata';

@Injectable({
    providedIn: 'root',
})
export class ArticlesService {
    // private _name = 'ArticlesService';

    articlePlainData!: IApiArticle;
    articlePmageData!: IArticleImage;

    private _articlePreview!: IArticle;
    //  = {
    // id_article: 0,
    // id_asociation_article: 0,
    // id_user_article: 0,
    // category_article: '',
    // subcategory_article: '',
    // class_article: '',
    // state_article: '',
    // publication_date_article: '',
    // effective_date_article: '',
    // expiration_date_article: '',
    // cover_image_article: '',
    // title_article: '',
    // abstract_article: '',
    // items_article: '',
    // ubication_article: '',
    // delete_date_article: '',
    // creation_date_article: '',
    // update_date_article: '',
    // };

    get articlePreview(): IArticle {
        return this._articlePreview;
    }

    set articlePreview(data: IArticle) {
        this._articlePreview = data;
        this.setSessionArticlePreview(data);
    }

    getSessionArticlePreview() {
        const articlePreview = JSON.parse(sessionStorage.getItem('articlePreview') || '');
        if (articlePreview) {
            this._articlePreview = articlePreview;
            return this._articlePreview;
        }
        return null;
    }

    setSessionArticlePreview(data: IArticle) {
        sessionStorage.setItem('articlePreview', JSON.stringify(data));
    }

    deleteSessionArticlePreview() {
        sessionStorage.removeItem('articlePreview');
    }

    // set articleAvatar(logo: string) {
    //     this._article.logo_article = logo;
    // }

    constructor(private _db: BdmysqlService, private _usersService: UsersService) {}

    // getAllArticles() {
    //     console.log('Componente ' + this._name + ': getAllArticles: header ─> ', this._usersService.getAuthHeaders());
    //     return this._db.getAllArticles(this._usersService.getAuthHeaders());
    // }

    // getListArticles() {
    //     // console.log('Componente ' + this._name + ': getListArticles: ─> ');
    //     return this._db.getListArticles();
    // }

    getAllArticlesOfAsociation(asoc: number) {
        return this._db.getAllArticlesOfAsociation(asoc, this._usersService.getAuthHeaders());
    }

    getAllArticlesOfAsociationByCategory(asoc: number, category: string) {
        return this._db.getAllArticlesOfAsociationByCategory(asoc, category, this._usersService.getAuthHeaders());
    }

    getAllArticlesOfAsociationBySubcategory(asoc: number, category: string, subcategory: string) {
        return this._db.getAllArticlesOfAsociationBySubcategory(asoc, category, subcategory, this._usersService.getAuthHeaders());
    }

    createArticle(data: IApiArticle) {
        return this._db.createArticle(data, this._usersService.getAuthHeaders());
    }

    // async insertProfile() {}

    modifyArticle(data: IApiArticle) {
        return this._db.updateArticle(data, this._usersService.getAuthHeaders());
    }

    deleteArticle(data: IIdArticle) {
        return this._db.deleteArticle(data, this._usersService.getAuthHeaders());
    }

    uploadImage(fd: FormData) {
        return this._db.uploadImage(fd, this._usersService.getAuthHeaders());
    }

    uploadImageItem(fd: FormData) {
        return this._db.uploadImageItem(fd, this._usersService.getAuthHeaders());
    }

    deleteLogo(fd: FormData) {
        return this._db.deleteImage(fd, this._usersService.getAuthHeaders());
    }

    uploadLogo(fd: FormData) {
        return this._db.uploadImage(fd, this._usersService.getAuthHeaders());
    }
}
