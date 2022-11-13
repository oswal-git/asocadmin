// import { ChangeComponent } from './pages/auth/change/change.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ResetComponent } from './pages/auth/reset/reset.component';
import { RouterModule, Routes } from '@angular/router';
import { IsLoggedInGuard } from './guards/auth/is-logged-in.guard';
import { HasRoleGuard } from './guards/auth/has-role.guard';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        pathMatch: 'full',
        loadChildren: () => import('@components/dashboard/dashboard.module').then((x) => x.DashboardModule),
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset', component: ResetComponent },
    // { path: 'change', component: ChangeComponent },
    {
        path: 'dashboard',
        canActivate: [HasRoleGuard],
        canLoad: [IsLoggedInGuard, HasRoleGuard],
        data: {
            children: {
                path: [
                    { action: 'list-users', allowedRoles: ['admin', 'superadmin'] },
                    { action: 'reportes', allowedRoles: ['admin', 'superadmin', 'editor'] },
                    { action: 'change', allowedRoles: ['admin', 'superadmin'] },
                    { action: 'profile', allowedRoles: ['admin', 'superadmin', 'editor', 'asociado'] },
                    { action: 'create-usuer', allowedRoles: ['admin', 'superadmin'] },
                    { action: 'list-asociations', allowedRoles: ['admin', 'superadmin'] },
                    { action: 'single-asociations', allowedRoles: ['admin', 'superadmin'] },
                    { action: 'nuevo-articulo', allowedRoles: ['admin', 'superadmin', 'editor'] },
                    { action: 'preview-articulo', allowedRoles: ['admin', 'superadmin', 'editor'] },
                    { action: 'list-categorys/:id-category', allowedRoles: ['admin', 'superadmin', 'editor', 'asociado'] },
                    { action: 'list-subcategorys/:id-category/:id-subcategory', allowedRoles: ['admin', 'superadmin', 'editor', 'asociado'] },
                ],
            },
        },
        loadChildren: () => import('@components/dashboard/dashboard.module').then((x) => x.DashboardModule),
    },
    { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
