import { ArticlesService } from '@app/services/bd/articles.service';
import { BrowseArticleComponent } from '../browse-article/browse-article.component';
import { Component, OnInit } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { EditArticleComponent } from '../edit-article/edit-article.component';
import { faCircleXmark, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { IArticle } from '@app/interfaces/api/iapi-articles.metadata';
import { IOptionsDialog, IResponseActionsAsociations } from '@app/interfaces/ui/dialogs.interface';
import { IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '@app/services/bd/users.service';
import { DeleteArticleComponent } from '../delete-article/delete-article.component';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-list-articles',
    templateUrl: './list-articles.component.html',
    styleUrls: ['./list-articles.component.scss'],
})
export class ListArticlesComponent implements OnInit {
    private _name = 'ListArticlesComponent';

    userProfile!: IUserConnected;

    public listArticles!: IArticle[];

    subscriberParamams: any;
    idCategory: any = '';
    idSubcategory: any = '';

    recordsPerPage: number = 3;
    isSuper = false;
    asociationId: number = 0;
    isAdmin = false;

    loading = true;
    editArticleCkeck: boolean = false;

    faCircleXmark = faCircleXmark;
    faPenToSquare = faPenToSquare;
    faPlus = faPlus;

    constructor(
        private _usersService: UsersService,
        private _articlesService: ArticlesService,
        public dialog: MatDialog,
        private _toastr: ToastrService,
        private _route: ActivatedRoute,
        private router: Router
    ) {
        const res = this._usersService.getLocalStoredProfile();
        console.log('Componente ' + this._name + ': constructor: res ─> ', res);

        this.userProfile = res.userprofile;

        this.isSuper = this.userProfile.profile_user === 'superadmin' ? true : false;
        this.isAdmin = this.userProfile.id_asoc_admin === 0 ? false : true;

        if (res.msg !== 'User logged') {
            this.asociationId = parseInt('9'.repeat(9));
        } else if (this.isSuper) {
            this.asociationId = parseInt('9'.repeat(9));
        } else if (res.msg === 'User logged') {
            this.asociationId = this.userProfile.id_asociation_user;
        } else {
            this._toastr.error('User not authorized for try the listArticles list', 'User unauthorized').onHidden.subscribe(() => {
                this.router.navigateByUrl('/dashboard');
            });
        }
    }

    ngOnInit(): void {
        this.subscriberParamams = this._route.paramMap.subscribe((params: ParamMap) => {
            if (params.get('id-category')) {
                this.idCategory = params.get('id-category'); // (+) converts string 'id' to a number
                console.log('Componente ' + this._name + ': ngOnInit: this.idCategory ─> ', this.idCategory);
            }
            if (params.get('id-subcategory')) {
                this.idSubcategory = params.get('id-subcategory'); // (+) converts string 'id' to a number
                console.log('Componente ' + this._name + ': ngOnInit: this.idSubcategory ─> ', this.idSubcategory);
            }
            // In a real app: dispatch action to load the details here.

            this.loadArticles().then((resp) => {
                console.log('Componente ' + this._name + ': ngOnInit: resp ─> ', resp);
                if (resp.status === 'ok') {
                    this.listArticles = resp.data;
                }
                this.loading = false;
            });
        });
    }

    ngOnDestroy() {
        this.subscriberParamams.unsubscribe();
    }

    loadArticles(): Promise<any> {
        console.log(
            'Componente ' + this._name + ': loadArticles: this.userProfile.id_asociation_user: ',
            this._usersService.userProfile.id_asociation_user
        );
        return new Promise((resolve, reject) => {
            let observableLoadArticles: Observable<any>;
            let subscription!: Subscription;
            try {
                if (this.idSubcategory) {
                    observableLoadArticles = this._articlesService.getAllArticlesOfAsociationBySubcategory(
                        this.asociationId,
                        this.idCategory,
                        this.idSubcategory
                    );
                } else if (this.idCategory) {
                    observableLoadArticles = this._articlesService.getAllArticlesOfAsociationByCategory(this.asociationId, this.idCategory);
                } else {
                    observableLoadArticles = this._articlesService.getAllArticlesOfAsociation(this.asociationId);
                }
                subscription = observableLoadArticles.subscribe({
                    next: (resp: any) => {
                        console.log('Componente ' + this._name + ': loadArticles: ─> resp', resp);
                        if (resp.status === 200) {
                            this.listArticles = resp.result;
                            console.log('Componente ' + this._name + ': loadArticles: ─> this.listArticles', this.listArticles);
                        } else {
                            console.log('Componente ' + this._name + ': loadArticles: ─> resp.message', resp.message);
                        }
                        subscription.unsubscribe();
                        resolve({ status: 'ok', message: 'lista completada', data: resp.result });
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': loadArticles: error ─> ', err);
                        subscription.unsubscribe();
                        reject({ status: 'ko', message: err, data: null });
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': loadArticles: complete ─> ');
                    },
                });
            } catch (err: any) {
                console.log('Componente ' + this._name + ': loadArticles: err ─> ', err);
                subscription.unsubscribe();
                reject({ status: 'ko', message: err, data: null });
            }
        });
    }

    browseArticle(register: any, index: number) {
        const component = BrowseArticleComponent;
        const dataDialog: IOptionsDialog = {
            id: 'browse',
            title: '',
            button: '',
            options: { index },
            record: register,
        };

        const dialogo1 = this.dialog.open(component, {
            id: 'browse-article',
            height: '100%',
            width: '100%',
            data: dataDialog,
            panelClass: 'browse-article-modalbox',
        });

        dialogo1.afterClosed().subscribe({
            next: (retorno: IResponseActionsAsociations) => {
                console.log('Componente ' + this._name + ': afterClosed: retorno ─> ', retorno);
                if (retorno && retorno.action) {
                    console.log('Componente ' + this._name + ': afterClosed: retorno.action ─> ', retorno.action);
                }
            },
            error: (err: IResponseActionsAsociations) => {
                console.log('Componente ' + this._name + ': afterClosed: error ─> ', err.replay.message);
            },
            complete: () => {
                console.log('Componente ' + this._name + ': afterClosed: complete ─> dialogo1');
            },
        });
    }

    editArticle(register: any, index: number) {
        const component = EditArticleComponent;
        const dataDialog: IOptionsDialog = {
            id: 'edit',
            title: 'Edición del artículo',
            button: '',
            options: { index },
            record: register,
        };

        const dialogo: MatDialogRef<EditArticleComponent, any> = this.dialog.open(component, {
            id: 'edit-article',
            height: '100%',
            width: '100vw',
            maxWidth: '100%',
            data: dataDialog,
            panelClass: 'edit-article-modalbox',
        });

        dialogo.afterClosed().subscribe({
            next: (retorno: IResponseActionsAsociations) => {
                console.log('Componente ' + this._name + ': editArticle afterClosed: retorno ─> ', retorno);
                if (retorno && retorno.action && retorno.action === 'edit') {
                    console.log('Componente ' + this._name + ': editArticle afterClosed: retorno.action ─> ', retorno.action);
                    this.listArticles = this.listArticles.map((article) => {
                        console.log('Componente ' + this._name + ': editArticle afterClosed: article ─> map', article);
                        if (article.id_article.toString() === retorno.data.id_article.toString()) {
                            article = retorno.data;

                            console.log('Componente ' + this._name + ': editArticle afterClosed: article ─> modify', article);
                            return article;
                        }

                        console.log('Componente ' + this._name + ': editArticle afterClosed: article ─> equal', article);
                        return article;
                    });
                }
            },
            error: (err: IResponseActionsAsociations) => {
                console.log('Componente ' + this._name + ': afterClosed: error ─> ', err.replay.message);
            },
            complete: () => {
                console.log('Componente ' + this._name + ': afterClosed: complete ─> dialogo1');
            },
        });
    }

    deleteArticle(register: any, index: number) {
        let component!: ComponentType<any>;
        let dataDialog!: IOptionsDialog | '';
        // let height = '90%';
        let width = '80%';
        let id = '';
        let panelClass = '';

        component = DeleteArticleComponent;
        dataDialog = {
            id: 'delete',
            title: 'Eliminar Artículo ',
            button: 'Eliminar',
            record: register,
            options: { index },
        };

        id = 'delete-article';
        panelClass = 'delete-article-modalbox';

        console.log('Componente ' + this._name + ': dialogo1: dataDialog ─> ', dataDialog);

        const dialog = this.dialog.open(component, {
            id,
            // height,
            width,
            data: dataDialog,
            panelClass,
        });

        dialog.afterClosed().subscribe({
            next: (retorno: IResponseActionsAsociations) => {
                console.log('Componente ' + this._name + ': afterClosed: retorno ─> ', retorno);
                if (retorno && retorno.action) {
                    console.log('Componente ' + this._name + ': afterClosed: retorno.action ─> ', retorno.action);
                    if (retorno.action === 'delete') {
                        this.listArticles = this.listArticles.filter((article) => article.id_article.toString() !== retorno.data.toString());
                    }
                }
            },
            error: (err: IResponseActionsAsociations) => {
                console.log('Componente ' + this._name + ': afterClosed: error ─> ', err.replay.message);
            },
            complete: () => {
                console.log('Componente ' + this._name + ': afterClosed: complete ─> dialogo1');
            },
        });
    }
}
