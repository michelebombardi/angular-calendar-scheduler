/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
export class CalendarSchedulerEventTitleComponent {
}
CalendarSchedulerEventTitleComponent.decorators = [
    { type: Component, args: [{
                selector: 'calendar-scheduler-event-title',
                template: `
        <div
            class="cal-scheduler-event-title"
            [innerHTML]="event.title | schedulerEventTitle:view:event">
        </div>
        <div *ngIf="event.status"
            class="cal-scheduler-event-status"
            [class.ok]="event.status === 'ok'"
            [class.warning]="event.status === 'warning'"
            [class.danger]="event.status === 'danger'">
        </div>
    `,
                host: {
                    'class': 'cal-scheduler-event-title-container'
                }
            },] },
];
CalendarSchedulerEventTitleComponent.propDecorators = {
    event: [{ type: Input }],
    view: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    CalendarSchedulerEventTitleComponent.prototype.event;
    /** @type {?} */
    CalendarSchedulerEventTitleComponent.prototype.view;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LXRpdGxlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2FsZW5kYXItc2NoZWR1bGVyLyIsInNvdXJjZXMiOlsic3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9jYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtdGl0bGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQXVCakQsTUFBTTs7O1lBbEJMLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsZ0NBQWdDO2dCQUMxQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7O0tBV1Q7Z0JBQ0QsSUFBSSxFQUFFO29CQUNGLE9BQU8sRUFBRSxxQ0FBcUM7aUJBQ2pEO2FBQ0o7OztvQkFHSSxLQUFLO21CQUVMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgICBDYWxlbmRhclNjaGVkdWxlckV2ZW50XHJcbn0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItdmlldy5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC10aXRsZScsXHJcbiAgICB0ZW1wbGF0ZTogYFxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgICAgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLWV2ZW50LXRpdGxlXCJcclxuICAgICAgICAgICAgW2lubmVySFRNTF09XCJldmVudC50aXRsZSB8IHNjaGVkdWxlckV2ZW50VGl0bGU6dmlldzpldmVudFwiPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgKm5nSWY9XCJldmVudC5zdGF0dXNcIlxyXG4gICAgICAgICAgICBjbGFzcz1cImNhbC1zY2hlZHVsZXItZXZlbnQtc3RhdHVzXCJcclxuICAgICAgICAgICAgW2NsYXNzLm9rXT1cImV2ZW50LnN0YXR1cyA9PT0gJ29rJ1wiXHJcbiAgICAgICAgICAgIFtjbGFzcy53YXJuaW5nXT1cImV2ZW50LnN0YXR1cyA9PT0gJ3dhcm5pbmcnXCJcclxuICAgICAgICAgICAgW2NsYXNzLmRhbmdlcl09XCJldmVudC5zdGF0dXMgPT09ICdkYW5nZXInXCI+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICBgLFxyXG4gICAgaG9zdDoge1xyXG4gICAgICAgICdjbGFzcyc6ICdjYWwtc2NoZWR1bGVyLWV2ZW50LXRpdGxlLWNvbnRhaW5lcidcclxuICAgIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRUaXRsZUNvbXBvbmVudCB7XHJcblxyXG4gICAgQElucHV0KCkgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQ7XHJcblxyXG4gICAgQElucHV0KCkgdmlldzogc3RyaW5nO1xyXG59XHJcbiJdfQ==