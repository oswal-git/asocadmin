import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IOptionsDialog, IResponseActionsUsers } from '@app/interfaces/ui/dialogs.interface';
@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
    private _name = 'EditUserComponent';

    options!: IOptionsDialog;

    constructor(public dialogRef: MatDialogRef<EditUserComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        if (typeof data !== 'string') {
            this.options = data;
            console.log('Componente ' + this._name + ': constructor: options ─> ', this.options);
        }
    }

    ngOnInit(): void {}

    cancelar(datosSalida: IResponseActionsUsers) {
        console.log('Componente ' + this._name + ': cancelar: ─> dialogRef.close: datosSalida ', datosSalida);
        this.dialogRef.close(datosSalida);
    }
}
