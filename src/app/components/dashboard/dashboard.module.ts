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
import { EditUserComponent } from './usuarios/edit-user/edit-user.component';
import { BrowseUserComponent } from './usuarios/browse-user/browse-user.component';
import { ListAsociationsComponent } from './asociations/list-asociations/list-asociations.component';
import { DeleteAsociationComponent } from './asociations/delete-asociation/delete-asociation.component';
import { EditAsociationComponent } from './asociations/edit-asociation/edit-asociation.component';
import { BrowseAsociationComponent } from './asociations/browse-asociation/browse-asociation.component';
import { CreateAsociationComponent } from './asociations/create-asociation/create-asociation.component';
import { ProfileAsociationComponent } from './asociations/profile-asociation/profile-asociation.component';
import { NewArticleComponent } from './articles/new-article/new-article.component';
import { PreviewArticleComponent } from './articles/preview-article/preview-article.component';
import { ListArticlesComponent } from './articles/list-articles/list-articles.component';
import { BrowseArticleComponent } from './articles/browse-article/browse-article.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditArticleComponent } from './articles/edit-article/edit-article.component';
import { DeleteArticleComponent } from './articles/delete-article/delete-article.component';

@NgModule({
    declarations: [
        DashboardComponent,
        ReportesComponent,
        NavbarComponent,
        InicioComponent,
        ListaUsuariosComponent,
        CreateUserComponent,
        DeleteUserComponent,
        EditUserComponent,
        BrowseUserComponent,
        ListAsociationsComponent,
        DeleteAsociationComponent,
        EditAsociationComponent,
        ProfileAsociationComponent,
        BrowseAsociationComponent,
        CreateAsociationComponent,
        NewArticleComponent,
        PreviewArticleComponent,
        ListArticlesComponent,
        BrowseArticleComponent,
        EditArticleComponent,
        DeleteArticleComponent,
    ],
    imports: [CommonModule, DashboardRoutingModule, ComponentsModule, FontAwesomeModule],
})
export class DashboardModule {}
