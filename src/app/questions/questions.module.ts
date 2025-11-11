import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapperComponent } from './wrapper.component';
import { QuestionsRoutingModule } from './questions-routing.module';
import { SectionComponent } from './section/section.component';
import { Router, RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    RouterModule,
    CommonModule,
    QuestionsRoutingModule,
    WrapperComponent,
    SectionComponent,
  ]
})
export class QuestionsModule { }
