import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangeComponent } from '@app/pages/auth/change/change.component';
import { ProfileComponent } from '@app/pages/auth/profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InicioComponent } from './inicio/inicio.component';
import { ReportesComponent } from './reportes/reportes.component';
import { CreateUserComponent } from './usuarios/create-user/create-user.component';
import { ListaUsuariosComponent } from './usuarios/lista-usuarios/lista-usuarios.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            { path: '', component: InicioComponent },
            { path: 'list-users', component: ListaUsuariosComponent },
            { path: 'reportes', component: ReportesComponent },
            { path: 'change', component: ChangeComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'create-usuer', component: CreateUserComponent },
            // { path: 'listar-asociaciones', component: ListarAsociacionesComponent },
            // { path: 'nuevo-articulo', component: NewArticleComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
