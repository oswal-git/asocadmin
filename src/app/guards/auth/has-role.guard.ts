import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, UrlTree } from '@angular/router';
import { UsersService } from '@app/services/bd/users.service';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HasRoleGuard implements CanLoad, CanActivate {
    // private _name = 'HasRoleGuard';
    constructor(private _usersService: UsersService, private _router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.hasRole(route);
    }

    canLoad(route: Route): boolean | UrlTree | Observable<boolean | UrlTree> {
        return this.hasRole(route);
    }

    private hasRole(route: Route | ActivatedRouteSnapshot) {
        const childrenRoles = route.data?.['children'].path;

        // console.log('Componente ' + this._name + ': canLoad: childrenRoles ─> ', childrenRoles);
        const url = window.location.pathname;
        // console.log('Componente ' + this._name + ': canLoad: url ─> ', url);

        const path = url.substring(url.lastIndexOf('/') + 1);
        // console.log('Componente ' + this._name + ': canLoad: path ─> ', path);

        const allowedRolesFilter = childrenRoles.filter((role: any) => role.action === path).map((role: any) => role.allowedRoles);

        if (allowedRolesFilter.length === 0) {
            // console.log('Componente ' + this._name + ': allowedRoles.length === 0:  ─> ', true);
            return true;
        } else {
            const allowedRoles = allowedRolesFilter[0];
            return this._usersService.userProfile.pipe(
                // tap((user) => console.log('Componente ' + this._name + ': map: user.profile_user ─> ', user.profile_user)),
                // tap((user) =>
                //     console.log(
                //         'Componente ' + this._name + ': map: allowedRoles.includes(user.profile_user) ─> ',
                //         allowedRoles.includes(user.profile_user)
                //     )
                // ),
                map((user) => Boolean(user && allowedRoles.includes(user.profile_user)) || this._router.createUrlTree(['/dashboard']))
            );
        }
    }
}
