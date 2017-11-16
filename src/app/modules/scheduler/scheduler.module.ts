import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulerComponent } from './scheduler.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SchedulerComponent
  ],
  exports: [
    SchedulerComponent
  ]
})
export class SchedulerModule { }
