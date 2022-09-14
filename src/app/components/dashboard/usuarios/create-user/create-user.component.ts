import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IOptionsDialog, IResponseActionsUsers } from '@app/interfaces/ui/dialogs.interface';

@Component({
    selector: 'app-create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
    private _name = 'CreateUserComponent';

    options!: IOptionsDialog;

    constructor(public dialogRef: MatDialogRef<CreateUserComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        if (typeof data !== 'string') {
            this.options = data;
        }
    }

    ngOnInit(): void {}

    cancelar(datosSalida: IResponseActionsUsers) {
        console.log('Componente ' + this._name + ': cancelar: ─> dialogRef.close: datosSalida ', datosSalida);
        this.dialogRef.close(datosSalida);
    }
}
