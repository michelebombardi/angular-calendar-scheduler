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

import { SchedulerEventTitlePipe } from './pipes/scheduler-event-title.pipe';
import { SchedulerDateFormatter } from './formatters/scheduler-date-formatter.provider';
import { SchedulerEventTitleFormatter } from './formatters/scheduler-event-title-formatter.provider';

export * from './calendar-scheduler-view.component';
export * from './formatters/scheduler-date-formatter.provider';
export * from './formatters/scheduler-event-title-formatter.provider';
export * from './pipes/scheduler-event-title.pipe';
export * from './calendar-utils';

import { SchedulerConfig } from './scheduler-config';

export const SCHEDULER_CONFIG = new InjectionToken('SchedulerConfig');

export function provideAuthConfig(config: SchedulerConfig) {
    return new SchedulerConfig(config);
}

/**
 * The main module of this library. Example usage:
 *
 * ```typescript
 * import { CalenderModule } from 'angular-calendar';
 * import { SchedulerModule } from 'angular-calendar-scheduler';
 *
 * @NgModule({
 *   imports: [
 *     CalenderModule.forRoot(),
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
    SchedulerEventTitleFormatter,
    SchedulerDateFormatter
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
