import { BdmysqlService } from './services/bd/bdmysql.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Componentes
// Angular Material
import { PagesModule } from '@pages/pages.module';
import { ComponentsModule } from '@components/components.module';
import { RouterModule } from '@angular/router';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxSpinnerModule } from 'ngx-spinner';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
// import { AutofocusDirective } from './directives/autofocus.directive';

@NgModule({
    declarations: [
        AppComponent,
        // , AutofocusDirective
    ],
    imports: [
        RouterModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        PagesModule,
        ComponentsModule,
        HttpClientModule,
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-center-center',
            preventDuplicates: true,
            enableHtml: true,
        }), // ToastrModule added,
        FontAwesomeModule,
        NgxSpinnerModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        {
            provide: LocationStrategy,
            useClass: PathLocationStrategy,
        },
        BdmysqlService,
    ],
    bootstrap: [AppComponent],
    exports: [],
})
export class AppModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faCoffee);
    }
}
