import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangeComponent } from '@app/pages/auth/change/change.component';
import { ProfileComponent } from '@app/pages/auth/profile/profile.component';
import { ListArticlesComponent } from './articles/list-articles/list-articles.component';
import { NewArticleComponent } from './articles/new-article/new-article.component';
import { PreviewArticleComponent } from './articles/preview-article/preview-article.component';
import { ListAsociationsComponent } from './asociations/list-asociations/list-asociations.component';
import { ProfileAsociationComponent } from './asociations/profile-asociation/profile-asociation.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ReportesComponent } from './reportes/reportes.component';
import { CreateUserComponent } from './usuarios/create-user/create-user.component';
import { ListaUsuariosComponent } from './usuarios/lista-usuarios/lista-usuarios.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            { path: '', component: ListArticlesComponent },
            { path: 'list-users', component: ListaUsuariosComponent },
            { path: 'reportes', component: ReportesComponent },
            { path: 'change', component: ChangeComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'create-usuer', component: CreateUserComponent },
            { path: 'list-asociations', component: ListAsociationsComponent },
            { path: 'single-asociations', component: ProfileAsociationComponent },
            { path: 'nuevo-articulo', component: NewArticleComponent },
            { path: 'preview-articulo', component: PreviewArticleComponent },
            { path: 'list-categorys/:id-category', component: ListArticlesComponent },
            { path: 'list-subcategorys/:id-category/:id-subcategory', component: ListArticlesComponent },
            { path: 'policy', component: PrivacyComponent },
            { path: 'contact', component: ContactComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
