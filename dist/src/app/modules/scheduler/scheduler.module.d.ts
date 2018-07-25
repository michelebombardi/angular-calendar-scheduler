import { ModuleWithProviders, InjectionToken } from '@angular/core';
export * from './calendar-scheduler-view.component';
export * from './formatters';
export * from './pipes';
export * from './calendar-utils';
import { SchedulerConfig } from './scheduler-config';
export declare const SCHEDULER_CONFIG: InjectionToken<{}>;
export declare function provideAuthConfig(config: SchedulerConfig): SchedulerConfig;
export declare class SchedulerModule {
    static forRoot(config?: SchedulerConfig): ModuleWithProviders;
}
