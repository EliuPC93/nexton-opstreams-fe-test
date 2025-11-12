import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapperComponent } from './wrapper.component';
import { QuestionsRoutingModule } from './questions-routing.module';
import { SectionComponent } from './section/section.component';
import { RouterModule } from '@angular/router';
import { SectionService } from '../section.service';
import { ActionButtonComponent } from '../components/atoms/action-button/action-button.component';

@NgModule({
  declarations: [
    WrapperComponent,
  ],
  providers: [SectionService],
  imports: [
    RouterModule,
    CommonModule,
    QuestionsRoutingModule,
    SectionComponent,
    ActionButtonComponent
  ]
})
export class QuestionsModule { }
