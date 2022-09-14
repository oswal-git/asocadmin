import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as fromComponents from './components';
import * as fromPipes from './pipes';
import * as fromControls from './controls';
import * as fromDirectives from '@app/directives';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [...fromComponents.components, ...fromPipes.pipes, ...fromControls.controls, ...fromDirectives.directives],
    imports: [CommonModule, FormsModule, CKEditorModule, FontAwesomeModule, NgxSpinnerModule],
    exports: [...fromComponents.components, ...fromPipes.pipes, ...fromControls.controls, ...fromDirectives.directives],
})
export class SharedModule {}
