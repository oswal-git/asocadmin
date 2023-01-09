import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '@auth/register/register.component';
import { LoginComponent } from '@auth/login/login.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetComponent } from './auth/reset/reset.component';
import { ChangeComponent } from './auth/change/change.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ComponentsModule } from '@app/components/components.module';

@NgModule({
    declarations: [LoginComponent, RegisterComponent, ResetComponent, ChangeComponent, ProfileComponent],
    imports: [CommonModule, AppRoutingModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, ComponentsModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PagesModule {}
