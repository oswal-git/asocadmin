import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ComponentsModule } from '../components.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InicioComponent } from './inicio/inicio.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ListaUsuariosComponent } from './usuarios/lista-usuarios/lista-usuarios.component';
import { CreateUserComponent } from './usuarios/create-user/create-user.component';
import { DeleteUserComponent } from './usuarios/delete-usuer/delete-user.component';

@NgModule({
    declarations: [
        DashboardComponent,
        ReportesComponent,
        NavbarComponent,
        InicioComponent,
        ListaUsuariosComponent,
        CreateUserComponent,
        DeleteUserComponent,
    ],
    imports: [CommonModule, DashboardRoutingModule, ComponentsModule],
})
export class DashboardModule {}
