import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';

import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { CalendarSchedulerViewComponent } from './calendar-scheduler-view.component';
import { CalendarSchedulerHourSegmentComponent } from './calendar-scheduler-hour-segment.component';
import { CalendarSchedulerHeaderComponent } from './calendar-scheduler-header.component';
import { CalendarSchedulerEventComponent } from './calendar-scheduler-event.component';
import { CalendarSchedulerEventTitleComponent } from './calendar-scheduler-event-title.component';
import { CalendarSchedulerEventContentComponent } from './calendar-scheduler-event-content.component';
import { CalendarSchedulerEventActionsComponent } from './calendar-scheduler-event-actions.component';

import { CalendarSchedulerUtils } from './utils/calendar-scheduler-utils.provider';

import { SchedulerEventTitlePipe } from './pipes/scheduler-event-title.pipe';
import { CalendarSchedulerDatePipe } from './pipes/calendar-scheduler-date.pipe';

import { SchedulerDateFormatter } from './formatters/scheduler-date-formatter.provider';
import { SchedulerEventTitleFormatter } from './formatters/scheduler-event-title-formatter.provider';

export * from './calendar-scheduler-view.component';
export * from './formatters/scheduler-date-formatter.provider';
export * from './formatters/scheduler-event-title-formatter.provider';
export * from './pipes/scheduler-event-title.pipe';
export * from './utils/calendar-scheduler-utils';
export * from './utils/calendar-scheduler-utils.provider';
export * from '../common/utils';
export * from './models';

import { SchedulerConfig } from './scheduler-config';

export const SCHEDULER_CONFIG = new InjectionToken('SchedulerConfig');

export function provideSchedulerConfig(config: SchedulerConfig) {
    return new SchedulerConfig(config);
}

/**
 * The main module of this library. Example usage:
 *
 * ```typescript
 * import { CalendarModule, DateAdapter } from 'angular-calendar';
 * import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
 * import { SchedulerModule } from 'angular-calendar-scheduler';
 *
 * @NgModule({
 *  imports: [
 *     CalendarModule.forRoot({
 *       provide: DateAdapter,
 *       useFactory: adapterFactory
 *     }),
 *     SchedulerModule.forRoot({ locale: 'en', headerDateFormat: 'daysRange' })
 *   ]
 * })
 * class MyModule {}
 * ```
 *
 */
@NgModule({
  imports: [
    CommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  declarations: [
    CalendarSchedulerViewComponent,
    CalendarSchedulerHourSegmentComponent,
    CalendarSchedulerHeaderComponent,
    CalendarSchedulerEventComponent,
    CalendarSchedulerEventTitleComponent,
    CalendarSchedulerEventContentComponent,
    CalendarSchedulerEventActionsComponent,
    SchedulerEventTitlePipe,
    CalendarSchedulerDatePipe
  ],
  providers: [
    CalendarSchedulerUtils,
    SchedulerEventTitlePipe,
    CalendarSchedulerDatePipe,
    SchedulerEventTitleFormatter,
    SchedulerDateFormatter
  ],
  exports: [
    CalendarSchedulerDatePipe,
    CalendarSchedulerViewComponent,
    CalendarSchedulerHourSegmentComponent,
    CalendarSchedulerHeaderComponent,
    CalendarSchedulerEventComponent,
    CalendarSchedulerEventTitleComponent,
    CalendarSchedulerEventContentComponent,
    CalendarSchedulerEventActionsComponent
  ]
})
export class SchedulerModule {
  static forRoot(config?: SchedulerConfig): ModuleWithProviders<SchedulerModule> {
    return {
        ngModule: SchedulerModule,
        providers: [
            { provide: SCHEDULER_CONFIG, useValue: config },
            { provide: SchedulerConfig, useFactory: provideSchedulerConfig, deps: [SCHEDULER_CONFIG] }
        ]
    };
}
}
