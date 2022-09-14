import { Component, Input, OnInit } from '@angular/core';
import { ICardUser } from './icard-user.metadata';

@Component({
    selector: 'app-cards-user',
    templateUrl: './cards-user.component.html',
    styleUrls: ['./cards-user.component.scss'],
})
export class CardsUserComponent implements OnInit {
    @Input() data!: ICardUser;

    constructor() {}

    ngOnInit(): void {}
}
