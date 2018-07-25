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
export var SCHEDULER_CONFIG = new InjectionToken('SchedulerConfig');
/**
 * @param {?} config
 * @return {?}
 */
export function provideAuthConfig(config) {
    return new SchedulerConfig(config);
}
var SchedulerModule = /** @class */ (function () {
    function SchedulerModule() {
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    SchedulerModule.forRoot = /**
     * @param {?=} config
     * @return {?}
     */
    function (config) {
        return {
            ngModule: SchedulerModule,
            providers: [
                { provide: SCHEDULER_CONFIG, useValue: config },
                { provide: SchedulerConfig, useFactory: provideAuthConfig, deps: [SCHEDULER_CONFIG] }
            ]
        };
    };
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
    return SchedulerModule;
}());
export { SchedulerModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2FsZW5kYXItc2NoZWR1bGVyLyIsInNvdXJjZXMiOlsic3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9zY2hlZHVsZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixjQUFjLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRixPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRixPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUN6RixPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN2RixPQUFPLEVBQUUsb0NBQW9DLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNsRyxPQUFPLEVBQUUsc0NBQXNDLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUN0RyxPQUFPLEVBQUUsc0NBQXNDLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUV0RyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDbEQsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRTVELCtDQUFjLHFDQUFxQyxDQUFDO0FBQ3BELHFFQUFjLGNBQWMsQ0FBQztBQUM3Qix3Q0FBYyxTQUFTLENBQUM7QUFDeEIsaUVBQWMsa0JBQWtCLENBQUM7QUFFakMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDOztBQUVyRCxXQUFhLGdCQUFnQixHQUFHLElBQUksY0FBYyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Ozs7O0FBRXRFLE1BQU0sNEJBQTRCLE1BQXVCO0lBQ3JELE1BQU0sQ0FBQyxJQUFJLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztDQUN0Qzs7Ozs7Ozs7SUFnQ1EsdUJBQU87Ozs7SUFBZCxVQUFlLE1BQXdCO1FBQ3JDLE1BQU0sQ0FBQztZQUNILFFBQVEsRUFBRSxlQUFlO1lBQ3pCLFNBQVMsRUFBRTtnQkFDUCxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFO2dCQUMvQyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7YUFDeEY7U0FDSixDQUFDO0tBQ0w7O2dCQXRDQSxRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osY0FBYyxDQUFDLE9BQU8sRUFBRTtxQkFDekI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLDhCQUE4Qjt3QkFDOUIsOEJBQThCO3dCQUM5QixnQ0FBZ0M7d0JBQ2hDLCtCQUErQjt3QkFDL0Isb0NBQW9DO3dCQUNwQyxzQ0FBc0M7d0JBQ3RDLHNDQUFzQzt3QkFDdEMsdUJBQXVCO3FCQUN4QjtvQkFDRCxTQUFTLEVBQUU7d0JBQ1QsdUJBQXVCO3dCQUN2Qiw0QkFBNEI7cUJBQzdCO29CQUNELE9BQU8sRUFBRTt3QkFDUCw4QkFBOEI7d0JBQzlCLDhCQUE4Qjt3QkFDOUIsZ0NBQWdDO3dCQUNoQywrQkFBK0I7d0JBQy9CLG9DQUFvQzt3QkFDcEMsc0NBQXNDO3dCQUN0QyxzQ0FBc0M7cUJBQ3ZDO2lCQUNGOzswQkF4REQ7O1NBeURhLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycywgSW5qZWN0aW9uVG9rZW4gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbmltcG9ydCB7IENhbGVuZGFyTW9kdWxlIH0gZnJvbSAnYW5ndWxhci1jYWxlbmRhcic7XHJcbmltcG9ydCB7IENhbGVuZGFyU2NoZWR1bGVyVmlld0NvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItc2NoZWR1bGVyLXZpZXcuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ2FsZW5kYXJTY2hlZHVsZXJDZWxsQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItY2VsbC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDYWxlbmRhclNjaGVkdWxlckhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItc2NoZWR1bGVyLWhlYWRlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDYWxlbmRhclNjaGVkdWxlckV2ZW50Q29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItZXZlbnQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudFRpdGxlQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtdGl0bGUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudENvbnRlbnRDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1jb250ZW50LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRBY3Rpb25zQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtYWN0aW9ucy5jb21wb25lbnQnO1xyXG5cclxuaW1wb3J0IHsgU2NoZWR1bGVyRXZlbnRUaXRsZVBpcGUgfSBmcm9tICcuL3BpcGVzJztcclxuaW1wb3J0IHsgU2NoZWR1bGVyRXZlbnRUaXRsZUZvcm1hdHRlciB9IGZyb20gJy4vZm9ybWF0dGVycyc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci12aWV3LmNvbXBvbmVudCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vZm9ybWF0dGVycyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vcGlwZXMnO1xyXG5leHBvcnQgKiBmcm9tICcuL2NhbGVuZGFyLXV0aWxzJztcclxuXHJcbmltcG9ydCB7IFNjaGVkdWxlckNvbmZpZyB9IGZyb20gJy4vc2NoZWR1bGVyLWNvbmZpZyc7XHJcblxyXG5leHBvcnQgY29uc3QgU0NIRURVTEVSX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbignU2NoZWR1bGVyQ29uZmlnJyk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZUF1dGhDb25maWcoY29uZmlnOiBTY2hlZHVsZXJDb25maWcpIHtcclxuICAgIHJldHVybiBuZXcgU2NoZWR1bGVyQ29uZmlnKGNvbmZpZyk7XHJcbn1cclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgQ2FsZW5kYXJNb2R1bGUuZm9yUm9vdCgpXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyVmlld0NvbXBvbmVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyQ2VsbENvbXBvbmVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVySGVhZGVyQ29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudENvbXBvbmVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRUaXRsZUNvbXBvbmVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRDb250ZW50Q29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudEFjdGlvbnNDb21wb25lbnQsXHJcbiAgICBTY2hlZHVsZXJFdmVudFRpdGxlUGlwZVxyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICBTY2hlZHVsZXJFdmVudFRpdGxlUGlwZSxcclxuICAgIFNjaGVkdWxlckV2ZW50VGl0bGVGb3JtYXR0ZXJcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyVmlld0NvbXBvbmVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyQ2VsbENvbXBvbmVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVySGVhZGVyQ29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudENvbXBvbmVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRUaXRsZUNvbXBvbmVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRDb250ZW50Q29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudEFjdGlvbnNDb21wb25lbnRcclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTY2hlZHVsZXJNb2R1bGUge1xyXG4gIHN0YXRpYyBmb3JSb290KGNvbmZpZz86IFNjaGVkdWxlckNvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZ01vZHVsZTogU2NoZWR1bGVyTW9kdWxlLFxyXG4gICAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgICAgICB7IHByb3ZpZGU6IFNDSEVEVUxFUl9DT05GSUcsIHVzZVZhbHVlOiBjb25maWcgfSxcclxuICAgICAgICAgICAgeyBwcm92aWRlOiBTY2hlZHVsZXJDb25maWcsIHVzZUZhY3Rvcnk6IHByb3ZpZGVBdXRoQ29uZmlnLCBkZXBzOiBbU0NIRURVTEVSX0NPTkZJR10gfVxyXG4gICAgICAgIF1cclxuICAgIH07XHJcbn1cclxufVxyXG4iXX0=