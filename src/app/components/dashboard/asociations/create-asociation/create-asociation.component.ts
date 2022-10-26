import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IOptionsDialog, IResponseActionsUsers } from '@app/interfaces/ui/dialogs.interface';

@Component({
    selector: 'app-create-asociation',
    templateUrl: './create-asociation.component.html',
    styleUrls: ['./create-asociation.component.scss'],
})
export class CreateAsociationComponent implements OnInit {
    private _name = 'CreateAsociationComponent';

    options!: IOptionsDialog;

    constructor(public dialogRef: MatDialogRef<CreateAsociationComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
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
