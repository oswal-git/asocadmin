import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IIdArticle } from '@app/interfaces/api/iapi-articles.metadata';
import { IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';
import { IOptionsDialog, IReplay, IResponseActionsUsers } from '@app/interfaces/ui/dialogs.interface';
import { ArticlesService } from '@app/services/bd/articles.service';
import { UsersService } from '@app/services/bd/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-delete-article',
    templateUrl: './delete-article.component.html',
    styleUrls: ['./delete-article.component.scss'],
})
export class DeleteArticleComponent implements OnInit {
    private _name = 'DeleteArticleComponent';
    options!: IOptionsDialog;
    articleResp: IResponseActionsUsers = { action: '', data: '', replay: { status: '', message: '' } };
    userProfile!: IUserConnected;

    isSuper = false;
    isAdmin = false;

    loading = true;

    constructor(
        public dialogRef: MatDialogRef<DeleteArticleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IOptionsDialog | string,
        private _usersService: UsersService,
        private _articlesService: ArticlesService,
        private _toastr: ToastrService
    ) {
        console.log('Componente ' + this._name + ': constructor: data ─> ', data);
        if (typeof data !== 'string') {
            this.options = data;
            console.log('Componente ' + this._name + ': constructor: this.options ─> ', this.options);
        } else {
            this._toastr.error('No data to delete', 'Can not delete nothing').onHidden.subscribe(() => {
                this.cancelar(null);
            });
        }

        const res: any = this._usersService.getLocalStoredProfile();
        console.log('Componente ' + this._name + ': constructor: res ─> ', res);

        if (res.msg !== 'User logged') {
            this._toastr.error(res.msge, 'User not logged. Login for try the user list').onHidden.subscribe(() => {
                this.cancelar(null);
            });
        } else if (!['admin', 'superadmin'].includes(res.userprofile.profile_user)) {
            this._toastr.error(res.msge, 'User not authorized for try the asociations list').onHidden.subscribe(() => {
                this.cancelar(null);
            });
        }

        this.userProfile = res.userprofile;
        console.log('Componente ' + this._name + ': constructor: this.userProfile ─> ', this.userProfile);

        this.isSuper = this.userProfile.profile_user === 'superadmin' ? true : false;
        this.isAdmin = this.userProfile.id_asoc_admin === 0 ? false : true;
        if (!this.isSuper) {
            this._toastr.error(res.msge, 'User not authorized for try the asociations list').onHidden.subscribe(() => {
                this.cancelar(null);
            });
        }
    }

    ngOnInit(): void {
        this.loading = false;
    }

    async clickDelete() {
        const resDelete = await this.deleteArticle();
        this.loading = false;
        if (resDelete.status === 'ok' || 'success') {
            this._toastr.success('Artículo borrado correctamente', 'Artículo borrado').onHidden.subscribe(() => {
                // window.location.reload();
                this.cancelar({
                    action: this.options.id,
                    data: this.options.record.id_article,
                    replay: { status: 'ok', message: 'Article deleted' },
                });
            });
        } else {
            this._toastr.error(resDelete.message, 'Error deleting article');
        }
    }

    async deleteArticle() {
        return new Promise<IReplay>((resolve) => {
            const data: IIdArticle = {
                id_article: this.options.record.id_article,
                date_updated_article: this.options.record.date_updated_article ? this.options.record.date_updated_article : '',
            };
            console.log('Componente ' + this._name + ': deleteArticle: data ─> ', data);
            try {
                this.loading = true;
                this._articlesService.deleteArticle(data).subscribe({
                    next: async (resp: any) => {
                        console.log('Componente ' + this._name + ': deleteArticle: resp ─> ', resp);
                        if (resp.status === 200) {
                            resolve({ status: 'ok', message: 'El artículo se eliminó con exito' });
                        } else {
                            console.log('Componente ' + this._name + ': deleteArticle: error ─> resp.message', resp.message);
                            resolve({ status: 'error', message: resp.message });
                        }
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': deleteArticle: error ─> delete', err);
                        resolve({ status: 'error', message: err });
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': deleteArticle: complete ─> delete');
                    },
                });
            } catch (error: any) {
                console.log('Componente ' + this._name + ': deleteArticle: catch error ─> ', error);
                resolve({ status: 'abort', message: error });
            }
        });
    }

    cancelar(datosSalida: IResponseActionsUsers | null) {
        if (datosSalida === null) {
            datosSalida = { action: 'exit', data: '', replay: { status: '', message: '' } };
        }
        console.log('Componente ' + this._name + ': cancelar: ─> dialogRef.close ', datosSalida);
        this.dialogRef.close(datosSalida);
    }
}
