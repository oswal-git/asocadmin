import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UsersService } from '@app/services/bd/users.service';
import { Subscription, tap, map, distinctUntilChanged } from 'rxjs';

@Directive({
    selector: '[eglosShowForRoles]',
})
export class ShowForRolesDirective implements OnInit, OnDestroy {
    // private _name = 'ShowForRolesDirective';

    // @Input('eglosShowForRoles') allowedRoles: string[] = [];
    allowedRoles: string[] = [];

    @Input('eglosShowForRoles') set allowedRol(value: string | string[]) {
        // console.log('Componente ' + this._name + ': Input: value ─> ', value);
        if (typeof value == 'string') {
            this.allowedRoles = value.split(',');
            // console.log('Componente ' + this._name + ': Input string: this.allowedRoles ─> ', this.allowedRoles);
        } else {
            this.allowedRoles = value;
            // console.log('Componente ' + this._name + ': Input: this.allowedRoles ─> ', this.allowedRoles);
        }
    }

    private sub?: Subscription;

    constructor(private _usersService: UsersService, private _viewContainerRef: ViewContainerRef, private _temlpateRef: TemplateRef<any>) {}

    ngOnInit(): void {
        this.sub = this._usersService.userProfile
            .pipe(
                // tap((user) => console.log('Componente ' + this._name + ': map: user.profile_user ─> ', user.profile_user)),
                // tap((user) =>
                //     console.log(
                //         'Componente ' + this._name + ': map: allowedRoles.includes(user.profile_user) ─> ',
                //         this.allowedRoles.includes(user.profile_user)
                //     )
                // ),
                // tap(() => console.log('Componente ' + this._name + ': map: allowedRoles.includes(all) ─> ', this.allowedRoles.includes('all'))),
                map((user) => Boolean(user && this.allowedRoles.includes(user.profile_user)) || Boolean(user && this.allowedRoles.includes('all'))),
                distinctUntilChanged(),
                tap((hasRole) => (hasRole ? this._viewContainerRef.createEmbeddedView(this._temlpateRef) : this._viewContainerRef.clear()))
            )
            .subscribe();
    }
    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }
}
