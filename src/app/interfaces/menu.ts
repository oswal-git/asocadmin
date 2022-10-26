export interface IMenu {
    nombre: string;
    redirect: string;
    ngif: string;
    menu: IMenu[] | any[];
}
