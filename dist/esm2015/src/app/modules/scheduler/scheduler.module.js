/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { CalendarSchedulerViewComponent } from './calendar-scheduler-view.component';
import { CalendarSchedulerCellComponent } from './calendar-scheduler-cell.component';
import { CalendarSchedulerHeaderComponent } from './calendar-scheduler-header.component';
import { CalendarSchedulerEventComponent } from './calendar-scheduler-event.component';
import { CalendarSchedulerEventTitleComponent } from './calendar-scheduler-event-title.component';
import { CalendarSchedulerEventContentComponent } from './calendar-scheduler-event-content.component';
import { CalendarSchedulerEventActionsComponent } from './calendar-scheduler-event-actions.component';
import { SchedulerEventTitlePipe } from './pipes';
import { SchedulerEventTitleFormatter } from './formatters';
export { CalendarSchedulerViewComponent } from './calendar-scheduler-view.component';
export { SchedulerDateFormatter, SchedulerEventTitleFormatter } from './formatters';
export { SchedulerEventTitlePipe } from './pipes';
export { addPeriod, subPeriod, startOfPeriod, endOfPeriod } from './calendar-utils';
import { SchedulerConfig } from './scheduler-config';
/** @type {?} */
export const SCHEDULER_CONFIG = new InjectionToken('SchedulerConfig');
/**
 * @param {?} config
 * @return {?}
 */
export function provideAuthConfig(config) {
    return new SchedulerConfig(config);
}
export class SchedulerModule {
    /**
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: SchedulerModule,
            providers: [
                { provide: SCHEDULER_CONFIG, useValue: config },
                { provide: SchedulerConfig, useFactory: provideAuthConfig, deps: [SCHEDULER_CONFIG] }
            ]
        };
    }
}
SchedulerModule.decorators = [
    { type: NgModule, args: [{
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
            },] },
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2FsZW5kYXItc2NoZWR1bGVyLyIsInNvdXJjZXMiOlsic3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9zY2hlZHVsZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixjQUFjLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRixPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRixPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUN6RixPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN2RixPQUFPLEVBQUUsb0NBQW9DLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNsRyxPQUFPLEVBQUUsc0NBQXNDLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUN0RyxPQUFPLEVBQUUsc0NBQXNDLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUV0RyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDbEQsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRTVELCtDQUFjLHFDQUFxQyxDQUFDO0FBQ3BELHFFQUFjLGNBQWMsQ0FBQztBQUM3Qix3Q0FBYyxTQUFTLENBQUM7QUFDeEIsaUVBQWMsa0JBQWtCLENBQUM7QUFFakMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDOztBQUVyRCxhQUFhLGdCQUFnQixHQUFHLElBQUksY0FBYyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Ozs7O0FBRXRFLE1BQU0sNEJBQTRCLE1BQXVCO0lBQ3JELE1BQU0sQ0FBQyxJQUFJLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztDQUN0QztBQStCRCxNQUFNOzs7OztJQUNKLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBd0I7UUFDckMsTUFBTSxDQUFDO1lBQ0gsUUFBUSxFQUFFLGVBQWU7WUFDekIsU0FBUyxFQUFFO2dCQUNQLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUU7Z0JBQy9DLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsRUFBRTthQUN4RjtTQUNKLENBQUM7S0FDTDs7O1lBdENBLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUU7b0JBQ1AsWUFBWTtvQkFDWixjQUFjLENBQUMsT0FBTyxFQUFFO2lCQUN6QjtnQkFDRCxZQUFZLEVBQUU7b0JBQ1osOEJBQThCO29CQUM5Qiw4QkFBOEI7b0JBQzlCLGdDQUFnQztvQkFDaEMsK0JBQStCO29CQUMvQixvQ0FBb0M7b0JBQ3BDLHNDQUFzQztvQkFDdEMsc0NBQXNDO29CQUN0Qyx1QkFBdUI7aUJBQ3hCO2dCQUNELFNBQVMsRUFBRTtvQkFDVCx1QkFBdUI7b0JBQ3ZCLDRCQUE0QjtpQkFDN0I7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLDhCQUE4QjtvQkFDOUIsOEJBQThCO29CQUM5QixnQ0FBZ0M7b0JBQ2hDLCtCQUErQjtvQkFDL0Isb0NBQW9DO29CQUNwQyxzQ0FBc0M7b0JBQ3RDLHNDQUFzQztpQkFDdkM7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBJbmplY3Rpb25Ub2tlbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5cclxuaW1wb3J0IHsgQ2FsZW5kYXJNb2R1bGUgfSBmcm9tICdhbmd1bGFyLWNhbGVuZGFyJztcclxuaW1wb3J0IHsgQ2FsZW5kYXJTY2hlZHVsZXJWaWV3Q29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItdmlldy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDYWxlbmRhclNjaGVkdWxlckNlbGxDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci1jZWxsLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENhbGVuZGFyU2NoZWR1bGVySGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItaGVhZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDYWxlbmRhclNjaGVkdWxlckV2ZW50VGl0bGVDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC10aXRsZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDYWxlbmRhclNjaGVkdWxlckV2ZW50Q29udGVudENvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LWNvbnRlbnQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudEFjdGlvbnNDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zLmNvbXBvbmVudCc7XHJcblxyXG5pbXBvcnQgeyBTY2hlZHVsZXJFdmVudFRpdGxlUGlwZSB9IGZyb20gJy4vcGlwZXMnO1xyXG5pbXBvcnQgeyBTY2hlZHVsZXJFdmVudFRpdGxlRm9ybWF0dGVyIH0gZnJvbSAnLi9mb3JtYXR0ZXJzJztcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vY2FsZW5kYXItc2NoZWR1bGVyLXZpZXcuY29tcG9uZW50JztcclxuZXhwb3J0ICogZnJvbSAnLi9mb3JtYXR0ZXJzJztcclxuZXhwb3J0ICogZnJvbSAnLi9waXBlcyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vY2FsZW5kYXItdXRpbHMnO1xyXG5cclxuaW1wb3J0IHsgU2NoZWR1bGVyQ29uZmlnIH0gZnJvbSAnLi9zY2hlZHVsZXItY29uZmlnJztcclxuXHJcbmV4cG9ydCBjb25zdCBTQ0hFRFVMRVJfQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuKCdTY2hlZHVsZXJDb25maWcnKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlQXV0aENvbmZpZyhjb25maWc6IFNjaGVkdWxlckNvbmZpZykge1xyXG4gICAgcmV0dXJuIG5ldyBTY2hlZHVsZXJDb25maWcoY29uZmlnKTtcclxufVxyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBDYWxlbmRhck1vZHVsZS5mb3JSb290KClcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJWaWV3Q29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJDZWxsQ29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJIZWFkZXJDb21wb25lbnQsXHJcbiAgICBDYWxlbmRhclNjaGVkdWxlckV2ZW50Q29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudFRpdGxlQ29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudENvbnRlbnRDb21wb25lbnQsXHJcbiAgICBDYWxlbmRhclNjaGVkdWxlckV2ZW50QWN0aW9uc0NvbXBvbmVudCxcclxuICAgIFNjaGVkdWxlckV2ZW50VGl0bGVQaXBlXHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIFNjaGVkdWxlckV2ZW50VGl0bGVQaXBlLFxyXG4gICAgU2NoZWR1bGVyRXZlbnRUaXRsZUZvcm1hdHRlclxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJWaWV3Q29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJDZWxsQ29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJIZWFkZXJDb21wb25lbnQsXHJcbiAgICBDYWxlbmRhclNjaGVkdWxlckV2ZW50Q29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudFRpdGxlQ29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudENvbnRlbnRDb21wb25lbnQsXHJcbiAgICBDYWxlbmRhclNjaGVkdWxlckV2ZW50QWN0aW9uc0NvbXBvbmVudFxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFNjaGVkdWxlck1vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QoY29uZmlnPzogU2NoZWR1bGVyQ29uZmlnKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5nTW9kdWxlOiBTY2hlZHVsZXJNb2R1bGUsXHJcbiAgICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgICAgIHsgcHJvdmlkZTogU0NIRURVTEVSX0NPTkZJRywgdXNlVmFsdWU6IGNvbmZpZyB9LFxyXG4gICAgICAgICAgICB7IHByb3ZpZGU6IFNjaGVkdWxlckNvbmZpZywgdXNlRmFjdG9yeTogcHJvdmlkZUF1dGhDb25maWcsIGRlcHM6IFtTQ0hFRFVMRVJfQ09ORklHXSB9XHJcbiAgICAgICAgXVxyXG4gICAgfTtcclxufVxyXG59XHJcbiJdfQ==