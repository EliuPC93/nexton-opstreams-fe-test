import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from './action-button/action-button.component';
import { FieldInputComponent } from './field-input/field-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IconButtonComponent } from './icon-button/icon-button.component';

@NgModule({
    declarations: [
        ActionButtonComponent,
        FieldInputComponent,
        IconButtonComponent
    ],
    providers: [],
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    exports: [
        ActionButtonComponent,
        FieldInputComponent,
        IconButtonComponent
    ]
})
export class AtomsModule { }