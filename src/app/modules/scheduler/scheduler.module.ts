import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarModule } from 'angular-calendar';
import { CalendarSchedulerViewComponent } from './calendar-scheduler-view.component';
import { CalendarSchedulerCellComponent } from './calendar-scheduler-cell.component';
import { CalendarSchedulerHeaderComponent } from './calendar-scheduler-header.component';
import { CalendarSchedulerEventComponent } from './calendar-scheduler-event.component';
import { CalendarSchedulerEventTitleComponent } from './calendar-scheduler-event-title.component';
import { CalendarSchedulerEventContentComponent } from './calendar-scheduler-event-content.component';
import { CalendarSchedulerEventActionsComponent } from './calendar-scheduler-event-actions.component';

export * from './calendar-scheduler-view.component';
export * from './calendar-utils';

@NgModule({
  imports: [
    CommonModule,
    CalendarModule.forRoot()
  ],
  declarations: [
    CalendarSchedulerViewComponent,
    CalendarSchedulerCellComponent,
    CalendarSchedulerHeaderComponent,
    CalendarSchedulerEventComponent,
    CalendarSchedulerEventTitleComponent,
    CalendarSchedulerEventContentComponent,
    CalendarSchedulerEventActionsComponent
  ],
  exports: [
    CalendarSchedulerViewComponent,
    CalendarSchedulerCellComponent,
    CalendarSchedulerHeaderComponent,
    CalendarSchedulerEventComponent,
    CalendarSchedulerEventTitleComponent,
    CalendarSchedulerEventContentComponent,
    CalendarSchedulerEventActionsComponent
  ]
})
export class SchedulerModule { }
