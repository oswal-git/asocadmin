import { Component } from '@angular/core';
import { UsersService } from './services/bd/users.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'Gestión de Asociaciones';
    private _name = 'AppComponent';
    usersServiceSubscriber!: Subscription;
    pollSubscriber: Subscription | null = null;

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

        if (!this.usersServiceSubscriber) {
            this.usersServiceSubscriber = this._usersService.userProfile.subscribe((user) => {
                if (user.token_user === '') {
                    //TODO npm install crypto-js
                    if (this.pollSubscriber) {
                        console.log('Componente ' + this._name + ': constructor:  ─> pollSubscriber.unsubscribe');
                        this.pollSubscriber.unsubscribe();
                        this.pollSubscriber = null;
                    }
                    // this.router.navigateByUrl('/login');
                } else {
                    if (!this.pollSubscriber) {
                        console.log('Componente ' + this._name + ': constructor:  ─> pollSubscriber.subscribe');
                        this.pollSubscriber = this._usersService.pollUsers().subscribe((res) => {
                            console.log('Componente ' + this._name + ': constructor: pollUsers res ─> ', res);
                            if (res) {
                                res.result.map((noti: any) => {
                                    console.log('Componente ' + this._name + ': constructor: pollUsers noti ─> ', noti);
                                    // this.makeNotification(noti.title_article, noti.abstract_article);
                                });
                            }
                        });
                    }
                }
            });
        }
    }

    // private makeNotification(title: any, body: string) {
    //     let notify: Notification = new Notification(title, { body });
    //     if (notification.click) {
    //         notify.onclick = notification.click;
    //     }
    //     if (notification.error) {
    //         notify.onerror = notification.error;
    //     }
    //     if (notification.timeout) {
    //         setTimeout(() => {
    //             notify.close();
    //         }, notification.timeout);
    //     }
    // }

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
    ngOnDestroy() {
        // console.log('Componente ' + this._name + ': ngOnDestroy:  ─> ');
        this.usersServiceSubscriber.unsubscribe();
    }

    msg(msg: string) {
        this._snackBar.open(msg, '', {
            duration: this.durationInSeconds * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
}
