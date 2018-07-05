import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarModule } from 'angular-calendar';
import { CalendarSchedulerViewComponent } from './calendar-scheduler-view.component';
import { CalendarSchedulerCellComponent } from './calendar-scheduler-cell.component';
import { CalendarSchedulerHeaderComponent } from './calendar-scheduler-header.component';
import { CalendarSchedulerEventComponent } from './calendar-scheduler-event.component';
import { CalendarSchedulerEventTitleComponent } from './calendar-scheduler-event-title.component';
import { CalendarSchedulerEventContentComponent } from './calendar-scheduler-event-content.component';
import { CalendarSchedulerEventActionsComponent } from './calendar-scheduler-event-actions.component';

import { SchedulerEventTitlePipe } from './pipes'
import { SchedulerEventTitleFormatter } from './formatters'

export * from './calendar-scheduler-view.component';
export * from './formatters';
export * from './pipes';
export * from './calendar-utils';

import { SchedulerConfig } from './scheduler-config';

export const SCHEDULER_CONFIG = new InjectionToken('SchedulerConfig');

export function provideAuthConfig(config: SchedulerConfig) {
    return new SchedulerConfig(config);
}

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
    CalendarSchedulerEventActionsComponent,
    SchedulerEventTitlePipe
  ],
  providers: [
    SchedulerEventTitlePipe,
    SchedulerEventTitleFormatter
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
export class SchedulerModule {
  static forRoot(config?: SchedulerConfig): ModuleWithProviders {
    return {
        ngModule: SchedulerModule,
        providers: [
            { provide: SCHEDULER_CONFIG, useValue: config },
            { provide: SchedulerConfig, useFactory: provideAuthConfig, deps: [SCHEDULER_CONFIG] }
        ]
    };
}
}
