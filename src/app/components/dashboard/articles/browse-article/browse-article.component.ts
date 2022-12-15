import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ILocalProfile, IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';
import { IResponseActionsUsers } from '@app/interfaces/ui/dialogs.interface';
import { UsersService } from '@app/services/bd/users.service';
import { environment } from '@env/environment';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-browse-article',
    templateUrl: './browse-article.component.html',
    styleUrls: ['./browse-article.component.scss'],
})
export class BrowseArticleComponent implements OnInit {
    private _name = 'BrowseArticleComponent';

    userProfile!: IUserConnected;

    public article!: any;

    isSuper = false;
    asociationId: number = 0;
    isAdmin = false;

    articleUrlDefault = environment.urlApi2 + '/assets/img/images.jpg';
    articleSrcDefault = environment.urlApi2 + '/assets/img/images.jpg';

    loading = true;

    faArrowRightFromBracket = faArrowRightFromBracket;

    constructor(
        private _usersService: UsersService,
        private _toastr: ToastrService,
        public dialogRef: MatDialogRef<BrowseArticleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this._usersService.getLocalStoredProfile().then((res: ILocalProfile) => {
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
                    this.close(null);
                });
            }

            console.log('Componente ' + this._name + ': constructor: data ─> ', data);
            this.article = data.record;
            this.loading = false;
        });
    }

    ngOnInit(): void {}

    close(datosSalida: IResponseActionsUsers | any) {
        if (datosSalida === null) {
            datosSalida = { action: 'exit', data: '', replay: { status: '', message: '' } };
        }
        console.log('Componente ' + this._name + ': exitForm:  ─> this.salir.emit: ', datosSalida);
        this.dialogRef.close(datosSalida);
    }
}
