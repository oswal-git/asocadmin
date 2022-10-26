import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IOptionsDialog, IResponseActionsUsers } from '@app/interfaces/ui/dialogs.interface';

@Component({
    selector: 'app-browse-asociation',
    templateUrl: './browse-asociation.component.html',
    styleUrls: ['./browse-asociation.component.scss'],
})
export class BrowseAsociationComponent implements OnInit {
    private _name = 'BrowseAsociationComponent';

    options!: IOptionsDialog;

    constructor(public dialogRef: MatDialogRef<BrowseAsociationComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        if (typeof data !== 'string') {
            this.options = data;
            console.log('Componente ' + this._name + ': constructor: options ─> ', this.options);
        }
    }

    ngOnInit(): void {}

    onActivate() {
        console.log('Componente ' + this._name + ': onActivate: ─> ');
        window.scroll(0, 0);
    }

    close(datosSalida: IResponseActionsUsers) {
        console.log('Componente ' + this._name + ': cancelar: ─> dialogRef.close: datosSalida ', datosSalida);
        this.dialogRef.close(datosSalida);
    }
}
