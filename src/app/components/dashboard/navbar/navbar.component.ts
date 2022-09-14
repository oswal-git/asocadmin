import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsersService } from '@app/services/bd/users.service';
import { environment } from '@env/environment';
import { Subscription } from 'rxjs';
import { IMenu } from 'src/app/interfaces/menu';
import { IScreenSize, screenSizes } from 'src/app/interfaces/screen-size';
import { MediaScreenService } from 'src/app/services/mediascreen.service';
import menuData from '../../../../assets/data/menu.json';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
    private _name = 'NavbarComponent';

    menu: IMenu[] = [];
    isLogin: boolean = false;
    avatar = '';
    sadmin = false;

    sizes: IScreenSize[] = screenSizes;
    size: IScreenSize = this.sizes[this.sizes.length - 1];
    last_size!: IScreenSize;

    onResizeSubscription: Subscription;

    durationInSeconds = 1.5;
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    constructor(
        private mediaScreenService: MediaScreenService,
        private router: Router,
        private _usersService: UsersService,
        private _snackBar: MatSnackBar
    ) {
        this.menu = menuData;

        // this.sadmin = false;
        // this.isLogin = this._usersService.userProfile.token_user !== '' ? true : false;
        // this.avatar =
        //     this._usersService.userProfile.avatar_user === ''
        //         ? environment.urlApi + '/assets/images/user.png'
        //         : this._usersService.userProfile.avatar_user;
        // if (this._usersService.userProfile.profile_user === 'superadmin') {
        //     this.sadmin = true;
        // }

        this.size = this.mediaScreenService._size;
        // console.log('Componente ' + this._name + ': constructor: this.size ─> ', this.size);
        this.onResizeSubscription = this.mediaScreenService.onResize$.subscribe((x) => {
            this.size = x;
        });
    }

    ngOnInit() {
        this.isLogin = this._usersService.userProfile.token_user !== '' ? true : false;
        this.avatar =
            this._usersService.userProfile.avatar_user === ''
                ? environment.urlApi + '/assets/images/user.png'
                : this._usersService.userProfile.avatar_user;
        if (this._usersService.userProfile.profile_user === 'superadmin') {
            this.sadmin = true;
        }
        // console.log('Componente ' + this._name + ': constructor: this.sadmin ─> ', this.sadmin);
        // console.log('Componente ' + this._name + ': constructor: this.isLogin ─> ', this.isLogin);
        console.log('Componente ' + this._name + ': constructor: this.avatar ─> ', this.avatar);

        // console.log('Componente ' + this._name + ': ngOnInit: this.size ─> ', this.size);
    }

    ngOnDestroy(): void {
        // console.log('Componente ' + this._name + ': ngOnDestroy: this.size ─> ', this.size);
        this.onResizeSubscription.unsubscribe();
    }

    getMediaScren(): IScreenSize {
        // if (this.size !== this.last_size) {
        //     console.log('Componente ' + this._name + ': getMediaScren: this.size ─> ', this.size);
        //     this.last_size = this.size;
        // }
        return this.size;
    }

    login() {
        this.router.navigateByUrl('/login');
    }

    change() {
        this.router.navigateByUrl('/dashboard/change');
    }

    profile() {
        this.router.navigateByUrl('/dashboard/profile');
    }

    logout() {
        this._usersService.logout().subscribe({
            next: (resp: any) => {
                console.log('Componente ' + this._name + ': logout: ─> resp', resp);
                const userProfileOk = this._usersService.resetStoredProfile();
                console.log('Componente ' + this._name + ': logout: ─> userProfileOk', userProfileOk);
                this.msg('Desconection successfull. Come back soon!!');

                // this.isLogin = this._usersService.userProfile.profile_user ? true : false;
                // this.avatar = this._usersService.userProfile.avatar_user;
                // if (this._usersService.userProfile.profile_user === 'superadmin') {
                //     this.sadmin = true;
                // }
                this.avatar = environment.urlApi + '/assets/images/user.png';
                this.isLogin = false;
                this.sadmin = false;
                console.log('Componente ' + this._name + ': logout: this.sadmin ─> ', this.sadmin);
                console.log('Componente ' + this._name + ': logout: this.isLogin ─> ', this.isLogin);
                console.log('Componente ' + this._name + ': logout: this.avatar ─> ', this.avatar);

                this.router.navigateByUrl('/dashboard');
            },
            error: (err: any) => {
                const userProfileErr = this._usersService.resetStoredProfile();
                console.log('Componente ' + this._name + ': logout: ─> userProfileErr', userProfileErr);
                console.log('Componente ' + this._name + ': logout: error ─> perfil', err);
                this.avatar = environment.urlApi + '/assets/images/user.png';
                this.isLogin = false;
                this.sadmin = false;
            },
            complete: () => {
                console.log('Componente ' + this._name + ': logout: complete ─> perfil');
            },
        });
    }

    msg(msg: string) {
        this._snackBar.open(msg, '', {
            duration: this.durationInSeconds * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
}
