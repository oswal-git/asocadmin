import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IOptionsDialog, IResponseActionsUsers } from '@app/interfaces/ui/dialogs.interface';

@Component({
    selector: 'app-edit-asociation',
    templateUrl: './edit-asociation.component.html',
    styleUrls: ['./edit-asociation.component.scss'],
})
export class EditAsociationComponent implements OnInit {
    private _name = 'EditAsociationComponent';

    options!: IOptionsDialog;

    constructor(public dialogRef: MatDialogRef<EditAsociationComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        if (typeof data !== 'string') {
            this.options = data;
            console.log('Componente ' + this._name + ': constructor: options ─> ', this.options);
        }
    }

    ngOnInit(): void {}

    close(datosSalida: IResponseActionsUsers) {
        console.log('Componente ' + this._name + ': cancelar: ─> dialogRef.close: datosSalida ', datosSalida);
        this.dialogRef.close(datosSalida);
    }
}
