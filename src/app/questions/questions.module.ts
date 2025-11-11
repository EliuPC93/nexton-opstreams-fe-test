import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapperComponent } from './wrapper.component';
import { QuestionsRoutingModule } from './questions-routing.module';
import { SectionComponent } from './section/section.component';
import { RouterModule } from '@angular/router';
import { SectionService } from '../section.service';

@NgModule({
  declarations: [],
  providers: [SectionService],
  imports: [
    RouterModule,
    CommonModule,
    QuestionsRoutingModule,
    WrapperComponent,
    SectionComponent,
  ]
})
export class QuestionsModule { }
