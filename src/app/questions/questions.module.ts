import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapperComponent } from './wrapper.component';
import { QuestionsRoutingModule } from './questions-routing.module';
import { SectionComponent } from './section/section.component';
import { RouterModule } from '@angular/router';
import { ProcurementService, SchemaService } from '../services';
import { ActionButtonComponent } from '../components/atoms/action-button/action-button.component';
import { FieldInputComponent } from '../components/atoms/field-input/field-input.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    WrapperComponent,
    SectionComponent,
  ],
  providers: [SchemaService, ProcurementService],
  imports: [
    RouterModule,
    CommonModule,
    QuestionsRoutingModule,
    ActionButtonComponent,
    ReactiveFormsModule,
    FieldInputComponent
  ]
})
export class QuestionsModule { }
