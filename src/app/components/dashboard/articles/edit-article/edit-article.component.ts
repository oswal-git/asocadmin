import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IOptionsDialog, IResponseActionsUsers } from '@app/interfaces/ui/dialogs.interface';

@Component({
    selector: 'app-edit-article',
    templateUrl: './edit-article.component.html',
    styleUrls: ['./edit-article.component.scss'],
})
export class EditArticleComponent implements OnInit {
    private _name = 'EditArticleComponent';

    options!: IOptionsDialog;

    constructor(public dialogRef: MatDialogRef<EditArticleComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
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
}
