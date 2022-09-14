import { ComponentType } from '@angular/cdk/portal';
import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IBDAsociacion } from '@app/interfaces/api/iapi-asociation.metadata';
import { IProfileUsuario, IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';
import { IOptionsDialog, IResponseActionsUsers } from '@app/interfaces/ui/dialogs.interface';
import { AsociationsService } from '@app/services/bd/asociations.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/bd/users.service';
import { CreateUserComponent } from '../create-user/create-user.component';
import { DeleteUserComponent } from '../delete-usuer/delete-user.component';
// import { CrearUsuarioComponent } from '../crear-usuario/crear-usuario.component';
// import { DeleteUsuarioComponent } from '../delete-usuario/delete-usuario.component';
// import { EditUsuarioComponent } from '../edit-usuario/edit-usuario.component';

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
    selector: 'app-usuarios',
    templateUrl: './lista-usuarios.component.html',
    styleUrls: ['./lista-usuarios.component.scss'],
    providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
})
export class ListaUsuariosComponent implements OnInit {
    private _name = 'ListaUsuariosComponent';
    // private userProfile$: Observable<IUserProfile>;
    userProfile!: IUserConnected;
    recordsPerPage: number = 3;
    pageSizeOptions: Array<number> = [];
    numPageSizeOptions: number = 1;
    subscriptions$: Array<Subscription> = [];

    userPerfil$!: Subscription;
    listUsuarios$!: Subscription;

    titleData = {
        title: 'Lista de Usuarios',
        style: '',
    };

    listUsuarios: IProfileUsuario[] = [];
    asociations: IBDAsociacion[] = [];

    durationInSeconds = 1.5;

    loading = true;
    viewCheckeed = true;

    hasUser = false;
    hasAsociations = false;

    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    displayedColumns: string[] = [
        'id_asociation_user',
        'user_name_user',
        'name_user',
        'last_name_user',
        'email_user',
        'phone_user',
        'status_user',
        'profile_user',
        'actions',
    ];
    // dataSource!: MatTableDataSource<IProfileUsuario>;
    dataSource: any = new MatTableDataSource<IProfileUsuario>([]);

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
        private _snackBar: MatSnackBar,
        private _toastr: ToastrService,
        public dialog: MatDialog,
        private router: Router
    ) {
        console.log('Componente ' + this._name + ': constructor: subscriptions ─> ');
        const res = this._usersService.getLocalStoredProfile();

        if (res.msg !== 'User logged') {
            this.router.navigateByUrl('/dashboard');
        }

        this.userProfile = res.userprofile;

        this.titleData.title =
            this.userProfile.long_name_asoc === '' ? this.titleData.title : this.titleData.title + ' de ' + this.userProfile.long_name_asoc;
    }

    async ngOnInit() {
        console.log('\n NgOnInit...\n');
        console.log('Componente ' + this._name + ': ngOnInit: userPerfil ─> ', this.userProfile);
        console.log('Componente ' + this._name + ': ngOnInit: getAsociaciones ─> ');
        await this.getAsociaciones();
        console.log('Componente ' + this._name + ': ngOnInit: userLoad ─> ');
        await this.userLoad();

        for (let i = 0; i < this.listUsuarios.length; i = i + this.recordsPerPage) {
            this.pageSizeOptions.push(i + this.recordsPerPage);
        }
        this.numPageSizeOptions = this.pageSizeOptions.length;

        // this.dataSource = new MatTableDataSource<IProfileUsuario>(this.listUsuarios);
        // this.dataSource.paginator = this.paginator;
        console.log('Componente ' + this._name + ': ngOnInit: this.listUsuarios ─> ', this.listUsuarios);
        this.dataSource.data = this.listUsuarios;
        console.log('Componente ' + this._name + ': ngOnInit: this.dataSource.data ─> ', this.dataSource.data);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
    }

    async getAsociaciones() {
        console.log(
            'Componente ' + this._name + ': getAsociations: this.userProfile.asociation_id: ',
            this._usersService.userProfile.id_asociation_user
        );
        try {
            this._asociationsService.getListAsociations().subscribe({
                next: (resp: any) => {
                    console.log('Componente ' + this._name + ': getAsociations: ─> resp', resp);
                    if (resp.status === 200) {
                        this.asociations = resp.result.records.map((record: any) => {
                            return {
                                url: record.logo_asociation,
                                long_name_asociation: record.long_name_asociation,
                                short_name_asociation: record.short_name_asociation,
                                id_asociation: record.id_asociation,
                            };
                        });
                        console.log('Componente ' + this._name + ': getAsociations: ─> this.asociations', this.asociations);
                    } else {
                        console.log('Componente ' + this._name + ': getAsociations: ─> resp.message', resp.message);
                    }
                    this.hasAsociations = true;
                    if (this.hasAsociations && this.hasUser) {
                        this.loading = false;
                    }
                },
                error: (err: any) => {
                    console.log('Componente ' + this._name + ': getAsociations: error ─> ', err);
                },
                complete: () => {
                    console.log('Componente ' + this._name + ': getAsociations: complete ─> ');
                },
            });
        } catch (err: any) {
            console.log('Componente ' + this._name + ': getAsociations: err ─> ', err);
        }
    }

    async userLoad(): Promise<boolean> {
        console.log('Componente ' + this._name + ': userLoad: this.userProfile.asociation_id ─> ', this.userProfile.id_asociation_user);
        return new Promise((resolve, reject) => {
            try {
                this.loading = true;
                this._usersService.getAllUsers().subscribe({
                    next: (resp: any) => {
                        console.log('Componente ' + this._name + ': userLoad: ─> resp', resp);
                        if (resp.status === 200) {
                            this.listUsuarios = resp.result.records;
                            // .map((record: any) => {
                            //     return { url: record.logo_asociation, caption: record.long_name_asociation, id: record.id_asociation };
                            // });
                            // this.dataSource = new MatTableDataSource<IProfileUsuario>(this.listUsuarios);
                            // this.dataSource.paginator = this.paginator;
                            // this.dataSource.sort = this.sort;
                            console.log('Componente ' + this._name + ': userLoad: ─> this.asociations', this.asociations);
                        } else {
                            this._toastr.success(resp.message, 'Error retrieving user list').onHidden.subscribe(() => {
                                // this.router.navigateByUrl('/login');
                            });
                        }
                        this.hasUser = true;
                        if (this.hasAsociations && this.hasUser) {
                            this.loading = false;
                        }
                        resolve(true);
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': userLoad: error ─> ', err);
                        reject(true);
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': userLoad: complete ─> ');
                    },
                });
            } catch (error) {
                this.loading = false;
                console.log('Componente ' + this._name + ': userLoad: catch error ─> ', error);
                reject(true);
            }
        });
    }

    getNameAsociation(asoc_id: number): string {
        // console.log('Componente ' + this._name + ': getNameAsociation: asoc_id ─> ', asoc_id);
        // console.log('Componente ' + this._name + ': getNameAsociation: ─> this.asociations', this.asociations);
        const asoc: IBDAsociacion[] = this.asociations.filter((asoc: any) => asoc.id_asociation === asoc_id);
        if (asoc.length === 1) {
            // console.log('Componente ' + this._name + ': getNameAsociation: asoc[0].short_name_asociation ─> ', asoc[0].short_name_asociation);
            return asoc[0].short_name_asociation;
        } else {
            // console.log('Componente ' + this._name + ': getNameAsociation: asoc[0].short_name_asociation ─> ', '--');
            return ' -- ';
        }
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    trackByUid(item: any) {
        return item.user_id;
    }

    agregarUsuario(user: IProfileUsuario) {
        console.log('Componente ' + this._name + ': agregarUsuario: user.user_id ─> ', user.id_user);
        this.listUsuarios.push(user);
        this.dataSource = new MatTableDataSource<IProfileUsuario>(this.listUsuarios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this._snackBar.open('El usuario fue añadido con exito', '', {
            duration: this.durationInSeconds * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    editarUsuario(userEdit: IProfileUsuario) {
        console.log('Componente ' + this._name + ': editarUsuario: userEdit.user_id ─> ', userEdit.id_user);
        console.log('Componente ' + this._name + ': editarUsuario: this.listUsuarios ─> ', this.listUsuarios);
        this.listUsuarios = this.listUsuarios.map((user) => {
            console.log('Componente ' + this._name + ': editarUsuario: user ─> map', user);
            if (user.id_user === userEdit.id_user) {
                user.user_name_user = userEdit.user_name_user;
                user.profile_user = userEdit.profile_user;
                user.status_user = userEdit.status_user;
                user.name_user = userEdit.name_user;
                user.last_name_user = userEdit.last_name_user;
                user.avatar_user = userEdit.avatar_user;
                user.phone_user = userEdit.phone_user;
                user.date_updated_user = userEdit.date_updated_user;

                console.log('Componente ' + this._name + ': editarUsuario: user ─> modify', user);
                return user;
            }

            console.log('Componente ' + this._name + ': editarUsuario: user ─> equal', user);
            return user;
        });

        this.dataSource = new MatTableDataSource<IProfileUsuario>(this.listUsuarios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this._snackBar.open('El usuario fue modificado con exito', '', {
            duration: this.durationInSeconds * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    eliminarUsuario(uid: number) {
        console.log('Componente ' + this._name + ': eliminarUsuario: uid ─> ', uid);
        this.listUsuarios = this.listUsuarios.filter((user) => user.id_user !== uid);
        this.dataSource.data = this.listUsuarios;
        // this.dataSource = new MatTableDataSource<IProfileUsuario>(this.listUsuarios);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;

        this._snackBar.open('El usuario fue eliminado con exito', '', {
            duration: this.durationInSeconds * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    abrirDialogo(action: string, registro: IProfileUsuario | null = null, index: number = -1) {
        // let dialogo1!: MatDialogRef<any, any>;
        let component!: ComponentType<any>;
        let dataDialog!: IOptionsDialog | '';
        let height = '80%';
        let width = '80%';
        let id = '';
        let panelClass = '';

        switch (action) {
            case 'create':
                component = CreateUserComponent;
                dataDialog = {
                    id: 'create',
                    title: 'Crear Usuario',
                    button: 'Crear',
                    record: null,
                    options: { num: this.listUsuarios.length },
                };
                width = '90%';
                height = '100%';
                id = 'create-user';
                panelClass = 'create-user-modalbox';

                break;

            case 'browse':
                // component = EditUsuarioComponent;
                dataDialog = {
                    id: 'browse',
                    title: 'Visualizar Usuario',
                    button: 'Visualizar Usuario',
                    options: { index },
                    record: registro,
                };
                width = '90%';
                height = '100%';
                id = 'browse-user';
                panelClass = 'browse-user-modalbox';

                break;

            case 'edit':
                component = CreateUserComponent;
                dataDialog = {
                    id: 'edit',
                    title: 'Editar Usuario',
                    button: 'Actualizar',
                    options: { index },
                    record: registro,
                };
                width = '90%';
                height = '100%';
                id = 'edit-user';
                panelClass = 'edit-user-modalbox';

                break;

            case 'delete':
                component = DeleteUserComponent;
                dataDialog = {
                    id: 'delete',
                    title: 'Eliminar Usuario',
                    button: 'Eliminar',
                    options: { index },
                    record: registro,
                };
                height = '72%';
                width = '90%';
                id = 'delete-user';
                panelClass = 'delete-user-modalbox';

                break;

            default:
                break;
        }

        const dialogo1 = this.dialog.open(component, {
            id,
            height,
            width,
            data: dataDialog,
            panelClass,
        });

        dialogo1.afterClosed().subscribe({
            next: (retorno: IResponseActionsUsers) => {
                console.log('Componente ' + this._name + ': afterClosed: retorno ─> ', retorno);
                if (retorno && retorno.action)
                    if (retorno.action === 'create') {
                        this.agregarUsuario(retorno.data);
                    } else if (retorno.action === 'edit') {
                        this.editarUsuario(retorno.data);
                    } else if (retorno.action === 'delete') {
                        this.eliminarUsuario(retorno.data);
                    }
            },
            error: (err: IResponseActionsUsers) => {
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
