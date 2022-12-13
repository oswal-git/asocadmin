import { AfterViewChecked, Component, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { IOptionsDialog, IResponseActionsAsociations } from '@app/interfaces/ui/dialogs.interface';
import { IBDAsociation } from '@app/interfaces/api/iapi-asociation.metadata';
import { Subject, Subscription } from 'rxjs';
import { IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';
import { UsersService } from '@app/services/bd/users.service';
import { ComponentType } from '@angular/cdk/portal';
import { AsociationsService } from '@app/services/bd/asociations.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DeleteAsociationComponent } from '../delete-asociation/delete-asociation.component';
import { environment } from '@env/environment';
import { EditAsociationComponent } from '../edit-asociation/edit-asociation.component';
import { BrowseAsociationComponent } from '../browse-asociation/browse-asociation.component';
import { CreateAsociationComponent } from '../create-asociation/create-asociation.component';

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
    changes = new Subject<void>();

    // For internationalization, the `$localize` function from
    // the `@angular/localize` package can be used.
    firstPageLabel = `Primera página`;
    itemsPerPageLabel = `Usuarios por página:`;
    lastPageLabel = `Última página`;

    // You can set labels to an arbitrary string too, or dynamically compute
    // it through other third-party internationalization libraries.
    nextPageLabel = 'Página siguiente';
    previousPageLabel = 'Página anterior';

    getRangeLabel(page: number, pageSize: number, length: number): string {
        if (length === 0) {
            return `Página 1 de 1`;
        }
        const amountPages = Math.ceil(length / pageSize);
        return `Página ${page + 1} de ${amountPages}`;
    }
}

@Component({
    selector: 'app-list-asociations',
    templateUrl: './list-asociations.component.html',
    styleUrls: ['./list-asociations.component.scss'],
    providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
})
export class ListAsociationsComponent implements OnInit, AfterViewChecked, OnDestroy {
    private _name = 'ListAsociationsComponent';

    userProfile!: IUserConnected;
    recordsPerPage: number = 3;
    pageSizeOptions: Array<number> = [];
    numPageSizeOptions: number = 1;
    userPerfil$!: Subscription;
    subscriptions$: Array<Subscription> = [];

    titleData = {
        title: 'Lista de Asociaciones',
        style: '',
    };
    listAsociations: IBDAsociation[] = [];
    logoUrlDefault = environment.urlApi2 + '/assets/img/asociation_default.png';

    isSuper = false;
    isAdmin = false;

    loading = true;
    viewCheckeed = true;

    hasAsociations = false;

    durationInSeconds = 1.5;
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    displayedColumns: string[] = [
        'logo_asociation',
        'long_name_asociation',
        'short_name_asociation',
        'name_contact_asociation',
        'email_asociation',
        'phone_asociation',
        'actions',
    ];
    // dataSource!: MatTableDataSource<any>;
    dataSource: any = new MatTableDataSource<IBDAsociation>([]);

    // @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatPaginator, { static: false })
    set paginator(value: MatPaginator) {
        if (this.dataSource) {
            this.dataSource.paginator = value;
        }
    }
    // @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatSort, { static: false })
    set sort(value: MatSort) {
        if (this.dataSource) {
            this.dataSource.sort = value;
        }
    }

    constructor(
        private _usersService: UsersService,
        private _asociationsService: AsociationsService,
        private _toastr: ToastrService,
        public dialog: MatDialog,
        private router: Router
    ) {
        const res: any = this._usersService.getLocalStoredProfile();
        console.log('Componente ' + this._name + ': constructor: res ─> ', res);

        this.userProfile = res.userprofile;

        this.isSuper = this.userProfile.profile_user === 'superadmin' ? true : false;
        this.isAdmin = this.userProfile.id_asoc_admin === 0 ? false : true;

        if (res.msg !== 'User logged') {
            this._toastr.error('Login for try the asociations list', 'User not logged').onHidden.subscribe(() => {
                this.router.navigateByUrl('/dashboard');
            });
        } else if (!this.isSuper) {
            this._toastr.error('User not authorized for try the asociations list', 'User unauthorized').onHidden.subscribe(() => {
                this.router.navigateByUrl('/dashboard');
            });
        }
    }

    async ngOnInit() {
        console.log('Componente ' + this._name + ': ngOnInit: userPerfil ─> ', this.userProfile);
        await this.loadAsociations();

        for (let i = 0; i < this.listAsociations.length; i = i + this.recordsPerPage) {
            this.pageSizeOptions.push(i + this.recordsPerPage);
        }
        this.numPageSizeOptions = this.pageSizeOptions.length;

        // this.dataSource = new MatTableDataSource<IProfileUsuario>(this.listUsuarios);
        // this.dataSource.paginator = this.paginator;
        console.log('Componente ' + this._name + ': ngOnInit: this.listAsociations ─> ', this.listAsociations);
        this.dataSource.data = this.listAsociations;
        console.log('Componente ' + this._name + ': ngOnInit: this.dataSource.data ─> ', this.dataSource.data);
    }

    ngAfterViewChecked() {}

    loadAsociations(): Promise<boolean> {
        // console.log(
        //     'Componente ' + this._name + ': loadAsociations: this.userProfile.id_asociation_user: ',
        //     this._usersService.userProfile.id_asociation_user
        // );
        return new Promise((resolve, reject) => {
            try {
                this._asociationsService.getAllAsociations().subscribe({
                    next: (resp: any) => {
                        console.log('Componente ' + this._name + ': loadAsociations: ─> resp', resp);
                        if (resp.status === 200) {
                            this.listAsociations = resp.result.records;
                            console.log('Componente ' + this._name + ': loadAsociations: ─> this.asociations', this.listAsociations);
                        } else {
                            console.log('Componente ' + this._name + ': loadAsociations: ─> resp.message', resp.message);
                        }
                        this.hasAsociations = true;
                        if (this.hasAsociations) {
                            this.loading = false;
                        }
                        resolve(true);
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': loadAsociations: error ─> ', err);
                        reject(true);
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': loadAsociations: complete ─> ');
                    },
                });
            } catch (err: any) {
                console.log('Componente ' + this._name + ': loadAsociations: err ─> ', err);
                reject(true);
            }
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    trackByUid(item: any) {
        return item.uid;
    }

    agregarAsociation(asoc: IBDAsociation) {
        console.log('Componente ' + this._name + ': agregarAsociation: asoc.asoc_id ─> ', asoc.id_asociation);
        this.listAsociations.push(asoc);

        this.dataSource.data = this.listAsociations;

        // this.dataSource = new MatTableDataSource<IBDAsociation>(this.listAsociations);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
    }

    editarAsociation(asocEdit: IBDAsociation) {
        console.log('Componente ' + this._name + ': editarAsociation: asocEdit.id_asociation ─> ', asocEdit.id_asociation);
        console.log('Componente ' + this._name + ': editarAsociation: this.listAsociations ─> ', this.listAsociations);
        this.listAsociations = this.listAsociations.map((asoc) => {
            console.log('Componente ' + this._name + ': editarAsociation: asoc ─> map', asoc);
            if (asoc.id_asociation.toString() === asocEdit.id_asociation.toString()) {
                asoc.long_name_asociation = asocEdit.long_name_asociation;
                asoc.short_name_asociation = asocEdit.short_name_asociation;
                asoc.logo_asociation = asocEdit.logo_asociation;
                asoc.name_contact_asociation = asocEdit.name_contact_asociation;
                asoc.email_asociation = asocEdit.email_asociation;
                asoc.phone_asociation = asocEdit.phone_asociation;
                asoc.date_updated_asociation = asocEdit.date_updated_asociation;

                console.log('Componente ' + this._name + ': editarAsociation: asoc ─> modify', asoc);
                return asoc;
            }

            console.log('Componente ' + this._name + ': editarAsociation: asoc ─> equal', asoc);
            return asoc;
        });

        this.dataSource.data = this.listAsociations;
        // this.dataSource = new MatTableDataSource<IBDAsociation>(this.listAsociations);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
    }

    eliminarAsociation(uid: string) {
        console.log('Componente ' + this._name + ': eliminarAsociation: uid ─> ', uid);
        this.listAsociations = this.listAsociations.filter((asoc) => asoc.id_asociation.toString() !== uid.toString());
        this.dataSource.data = this.listAsociations;
        // this.dataSource = new MatTableDataSource<IBDAsociation>(this.listAsociations);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;

        // this._snackBar.open('La asociation fue eliminada con exito', '', {
        //     duration: this.durationInSeconds * 1000,
        //     horizontalPosition: this.horizontalPosition,
        //     verticalPosition: this.verticalPosition,
        // });
    }

    openDialogo(action: string, register: IBDAsociation | null = null, index: number = -1) {
        // let dialogo1!: MatDialogRef<any, any>;
        let component!: ComponentType<any>;
        let dataDialog!: IOptionsDialog | '';
        let height = '80%';
        let width = '80%';
        let id = '';
        let panelClass = '';

        switch (action) {
            case 'create':
                component = CreateAsociationComponent;
                dataDialog = {
                    id: 'create',
                    title: 'Crear Asociación',
                    button: 'Crear Asociation',
                    record: null,
                    options: { num: this.listAsociations.length },
                };
                width = '70%';
                height = '100%';
                id = 'create-asociation';
                panelClass = 'create-asociation-modalbox';

                break;

            case 'browse':
                component = BrowseAsociationComponent;
                dataDialog = {
                    id: 'browse',
                    title: register!.long_name_asociation,
                    button: 'Visualizar Asociación',
                    options: { index },
                    record: register,
                };
                width = '90%';
                height = '100%';
                id = 'browse-user';
                panelClass = 'browse-asociation-modalbox';

                break;

            case 'edit':
                component = EditAsociationComponent;
                dataDialog = {
                    id: 'edit',
                    title: register!.long_name_asociation,
                    button: 'Actualizar',
                    options: { index },
                    record: register,
                };
                width = '90%';
                height = '100%';
                id = 'edit-user';
                panelClass = 'edit-asociation-modalbox';

                break;

            case 'delete':
                component = DeleteAsociationComponent;
                dataDialog = {
                    id: 'delete',
                    title: 'Eliminar Asociación ',
                    button: 'Eliminar',
                    record: register,
                    options: { index },
                };
                height = '70%';
                width = '90%';
                id = 'delete-asociation';
                panelClass = 'delete-asociation-modalbox';

                break;

            default:
                break;
        }
        console.log('Componente ' + this._name + ': dialogo1: dataDialog ─> ', dataDialog);

        const dialogo1 = this.dialog.open(component, {
            id,
            height,
            width,
            data: dataDialog,
            panelClass,
        });

        dialogo1.afterClosed().subscribe({
            next: (retorno: IResponseActionsAsociations) => {
                console.log('Componente ' + this._name + ': afterClosed: retorno ─> ', retorno);
                if (retorno && retorno.action) {
                    console.log('Componente ' + this._name + ': afterClosed: retorno.action ─> ', retorno.action);
                    if (retorno.action === 'create') {
                        this.agregarAsociation(retorno.data);
                    } else if (retorno.action === 'edit') {
                        this.editarAsociation(retorno.data);
                    } else if (retorno.action === 'delete') {
                        this.eliminarAsociation(retorno.data);
                    }
                }
            },
            error: (err: IResponseActionsAsociations) => {
                console.log('Componente ' + this._name + ': afterClosed: error ─> ', err.replay.message);
            },
            complete: () => {
                console.log('Componente ' + this._name + ': afterClosed: complete ─> dialogo1');
            },
        });
    }

    ngOnDestroy(): void {
        this.subscriptions$.forEach((subscription) => {
            console.log('Componente ' + this._name + ': ngOnDestroy: subscription ─> ', subscription);
            subscription.unsubscribe();
        });
    }
}
