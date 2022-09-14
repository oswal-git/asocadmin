import { Component } from '@angular/core';
import { UsersService } from './services/bd/users.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'Gestión de Asociaciones';
    // private _name = 'AppComponent';

    durationInSeconds = 1.5;
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    constructor(
        private _usersService: UsersService,
        // private router: Router,
        private _snackBar: MatSnackBar
    ) {
        // console.log('Componente ' + this._name + ': constructor:  ─> getProfile');
        const res = this._usersService.getLocalStoredProfile();

        if (res.msg === 'Token expired') {
            this.msg('Token expired');
            // this.router.navigateByUrl('/login');
        }

        if (this._usersService.userProfile.token_user === '') {
            //TODO npm install crypto-js
            // this.router.navigateByUrl('/login');
        }
    }

    // ngOnChanges() {
    //     console.log('Componente ' + this._name + ': ngOnChanges:  ─> ');
    // }
    // ngOnInit() {
    // console.log('Componente ' + this._name + ': ngOnInit:  ─> ');
    // }
    // ngDoCheck() {
    //     console.log('Componente ' + this._name + ': ngDoCheck:  ─> ');
    // }
    // ngAfterContentInit() {
    //     console.log('Componente ' + this._name + ': ngAfterContentInit:  ─> ');
    // }
    // ngAfterContentChecked() {
    //     console.log('Componente ' + this._name + ': ngAfterContentChecked:  ─> ');
    // }
    // ngAfterViewInit() {
    //     console.log('Componente ' + this._name + ': ngAfterViewInit:  ─> ');
    // }
    // ngAfterViewChecked() {
    //     console.log('Componente ' + this._name + ': ngAfterViewChecked:  ─> ');
    // }
    // ngOnDestroy() {
    //     console.log('Componente ' + this._name + ': ngOnDestroy:  ─> ');
    // }

    msg(msg: string) {
        this._snackBar.open(msg, '', {
            duration: this.durationInSeconds * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
}
