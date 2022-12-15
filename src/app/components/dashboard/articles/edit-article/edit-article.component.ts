import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ILocalProfile } from '@app/interfaces/api/iapi-users.metadatos';
import { IOptionsDialog, IResponseActionsUsers } from '@app/interfaces/ui/dialogs.interface';
import { UsersService } from '@app/services/bd/users.service';
@Component({
    selector: 'app-edit-article',
    templateUrl: './edit-article.component.html',
    styleUrls: ['./edit-article.component.scss'],
})
export class EditArticleComponent implements OnInit {
    private _name = 'EditArticleComponent';

    options!: IOptionsDialog;

    durationInSeconds = 1.5;
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    constructor(
        private _usersService: UsersService,
        private _snackBar: MatSnackBar,
        private router: Router,
        public dialogRef: MatDialogRef<EditArticleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this._usersService.getLocalStoredProfile().then((res: ILocalProfile) => {
            if (res.msg !== 'User logged') {
                this.msg('User not logged. Login for edit articles');
                this.router.navigateByUrl('/dashboard');
            }
        });

        if (typeof data !== 'string') {
            this.options = data;
            console.log('Componente ' + this._name + ': constructor: options ─> ', this.options);
        }
    }

    ngOnInit(): void {}

    close(datosSalida: IResponseActionsUsers | any) {
        console.log('Componente ' + this._name + ': cancelar: ─> dialogRef.close: datosSalida ', datosSalida);
        this.dialogRef.close(datosSalida);
    }

    msg(msg: string) {
        this._snackBar.open(msg, '', {
            duration: this.durationInSeconds * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
}
