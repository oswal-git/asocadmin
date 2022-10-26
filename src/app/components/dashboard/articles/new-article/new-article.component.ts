import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IOptionsDialog, IResponseActionsUsers } from '@app/interfaces/ui/dialogs.interface';
// import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-new-article',
    templateUrl: './new-article.component.html',
    styleUrls: ['./new-article.component.scss'],
    providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
})
export class NewArticleComponent implements OnInit {
    private _name = 'NewArticleComponent';

    readOnly: boolean = true;
    public htmlData: string = '';
    options: IOptionsDialog = { id: 'create', title: 'Nuevo artículo', button: 'Guardar', record: null, options: { fin: true } };
    // public htmlData2: string = '';

    constructor(private _location: Location) {
        // setInterval(() => {
        //     console.log('Componente ' + this._name + ': constructor: htmlData  ─> ', this.htmlData);
        //     // console.log('Componente ' + this._name + ': constructor: htmlData2  ─> ', this.htmlData2);
        // }, 2000);
    }

    ngOnInit(): void {
        // this.toastr.success('Hello world!', 'Toastr fun!');
        // this.toastr.error('everything is broken', 'Major Error', {
        //     timeOut: 3000,
        //   });
    }

    close(datosSalida: IResponseActionsUsers | any) {
        console.log('Componente ' + this._name + ': cancelar: ─> dialogRef.close: datosSalida ', datosSalida);
        this._location.back();
    }
}
