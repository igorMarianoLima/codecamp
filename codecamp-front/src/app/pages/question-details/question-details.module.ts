import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionDetailsRoutingModule } from './question-details-routing.module';
import { QuestionDetailsComponent } from './question-details.component';


@NgModule({
  declarations: [
    QuestionDetailsComponent
  ],
  imports: [
    CommonModule,
    QuestionDetailsRoutingModule
  ]
})
export class QuestionDetailsModule { }
