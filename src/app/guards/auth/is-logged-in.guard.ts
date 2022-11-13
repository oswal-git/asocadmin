import { Injectable } from '@angular/core';
import { CanLoad, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UsersService } from '../../services/bd/users.service';

@Injectable({
    providedIn: 'root',
})
export class IsLoggedInGuard implements CanLoad {
    // private _name = 'IsLoggedInGuard';

    constructor(private _usersService: UsersService, private _router: Router) {}

    canLoad(): Observable<boolean | UrlTree> | boolean {
        const url = window.location.pathname;
        // console.log('Componente ' + this._name + ': canLoad: url ─> ', url);

        if (url === '/' || url === '/dashboard') {
            // alert('Acceso concedido');
            return true;
        }

        // console.log('Componente ' + this._name + ': canLoad: a ─> ', this._usersService.userProfile);

        // if (this._usersService.userProfile.token_user !== '') {
        //     // alert('Acceso denegado ' + this._router.createUrlTree(['/dashboard']));
        //     return true;
        // } else {
        //     return this._router.createUrlTree(['/dashboard']);
        // }

        return this._usersService.userProfile.pipe(
            map((user) => (user.token_user !== '' ? true : false) || this._router.createUrlTree(['/dashboard']))
        );
    }
}
