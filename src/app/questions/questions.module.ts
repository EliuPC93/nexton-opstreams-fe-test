import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapperComponent } from './wrapper.component';
import { QuestionsRoutingModule } from './questions-routing.module';
import { SectionComponent } from './section/section.component';
import { RouterModule } from '@angular/router';
import { ProcurementService, SchemaService } from '../services';
import { ReactiveFormsModule } from '@angular/forms';
import { AtomsModule } from '../components/atoms/atoms.module';

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
    ReactiveFormsModule,
    AtomsModule,
  ]
})
export class QuestionsModule { }
