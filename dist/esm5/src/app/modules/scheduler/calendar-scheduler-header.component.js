/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
var CalendarSchedulerHeaderComponent = /** @class */ (function () {
    function CalendarSchedulerHeaderComponent() {
        this.dayClicked = new EventEmitter();
    }
    CalendarSchedulerHeaderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'calendar-scheduler-header',
                    template: "\n        <ng-template #defaultTemplate>\n            <div class=\"cal-scheduler-headers\">\n                <div class=\"cal-header aside cal-header-clock align-center\">\n                    <i class=\"material-icons md-32\" style=\"margin:auto;\">schedule</i>\n                </div>\n\n                <div class=\"cal-header-cols aside\">\n                    <div\n                        class=\"cal-header\"\n                        *ngFor=\"let day of days\"\n                        [class.cal-past]=\"day.isPast\"\n                        [class.cal-today]=\"day.isToday\"\n                        [class.cal-future]=\"day.isFuture\"\n                        [class.cal-weekend]=\"day.isWeekend\"\n                        [class.cal-drag-over]=\"day.dragOver\"\n                        (mwlClick)=\"dayClicked.emit({date: day.date})\">\n                        <b>{{ day.date | calendarDate:'weekViewColumnHeader':locale }}</b><br>\n                        <span>{{ day.date | calendarDate:'weekViewColumnSubHeader':locale }}</span>\n                    </div>\n                </div>\n            </div>\n        </ng-template>\n        <ng-template\n            [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n            [ngTemplateOutletContext]=\"{days: days, locale: locale, dayClicked: dayClicked}\">\n        </ng-template>\n    "
                },] },
    ];
    CalendarSchedulerHeaderComponent.propDecorators = {
        days: [{ type: Input }],
        locale: [{ type: Input }],
        customTemplate: [{ type: Input }],
        dayClicked: [{ type: Output }]
    };
    return CalendarSchedulerHeaderComponent;
}());
export { CalendarSchedulerHeaderComponent };
if (false) {
    /** @type {?} */
    CalendarSchedulerHeaderComponent.prototype.days;
    /** @type {?} */
    CalendarSchedulerHeaderComponent.prototype.locale;
    /** @type {?} */
    CalendarSchedulerHeaderComponent.prototype.customTemplate;
    /** @type {?} */
    CalendarSchedulerHeaderComponent.prototype.dayClicked;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItc2NoZWR1bGVyLWhlYWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLXNjaGVkdWxlci8iLCJzb3VyY2VzIjpbInNyYy9hcHAvbW9kdWxlcy9zY2hlZHVsZXIvY2FsZW5kYXItc2NoZWR1bGVyLWhlYWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7MEJBMEMzQixJQUFJLFlBQVksRUFBa0I7OztnQkF2QzFGLFNBQVMsU0FBQztvQkFDUCxRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxRQUFRLEVBQUUsZzFDQTJCVDtpQkFDSjs7O3VCQUdJLEtBQUs7eUJBRUwsS0FBSztpQ0FFTCxLQUFLOzZCQUVMLE1BQU07OzJDQTFDWDs7U0FrQ2EsZ0NBQWdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFNjaGVkdWxlclZpZXdEYXkgfSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci12aWV3LmNvbXBvbmVudCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnY2FsZW5kYXItc2NoZWR1bGVyLWhlYWRlcicsXHJcbiAgICB0ZW1wbGF0ZTogYFxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdFRlbXBsYXRlPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXNjaGVkdWxlci1oZWFkZXJzXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLWhlYWRlciBhc2lkZSBjYWwtaGVhZGVyLWNsb2NrIGFsaWduLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgbWQtMzJcIiBzdHlsZT1cIm1hcmdpbjphdXRvO1wiPnNjaGVkdWxlPC9pPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhbC1oZWFkZXItY29scyBhc2lkZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJjYWwtaGVhZGVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IGRheSBvZiBkYXlzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgW2NsYXNzLmNhbC1wYXN0XT1cImRheS5pc1Bhc3RcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbY2xhc3MuY2FsLXRvZGF5XT1cImRheS5pc1RvZGF5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgW2NsYXNzLmNhbC1mdXR1cmVdPVwiZGF5LmlzRnV0dXJlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgW2NsYXNzLmNhbC13ZWVrZW5kXT1cImRheS5pc1dlZWtlbmRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbY2xhc3MuY2FsLWRyYWctb3Zlcl09XCJkYXkuZHJhZ092ZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAobXdsQ2xpY2spPVwiZGF5Q2xpY2tlZC5lbWl0KHtkYXRlOiBkYXkuZGF0ZX0pXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxiPnt7IGRheS5kYXRlIHwgY2FsZW5kYXJEYXRlOid3ZWVrVmlld0NvbHVtbkhlYWRlcic6bG9jYWxlIH19PC9iPjxicj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e3sgZGF5LmRhdGUgfCBjYWxlbmRhckRhdGU6J3dlZWtWaWV3Q29sdW1uU3ViSGVhZGVyJzpsb2NhbGUgfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICA8bmctdGVtcGxhdGVcclxuICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY3VzdG9tVGVtcGxhdGUgfHwgZGVmYXVsdFRlbXBsYXRlXCJcclxuICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntkYXlzOiBkYXlzLCBsb2NhbGU6IGxvY2FsZSwgZGF5Q2xpY2tlZDogZGF5Q2xpY2tlZH1cIj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgYFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJTY2hlZHVsZXJIZWFkZXJDb21wb25lbnQge1xyXG5cclxuICAgIEBJbnB1dCgpIGRheXM6IFNjaGVkdWxlclZpZXdEYXlbXTtcclxuXHJcbiAgICBASW5wdXQoKSBsb2NhbGU6IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoKSBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgICBAT3V0cHV0KCkgZGF5Q2xpY2tlZDogRXZlbnRFbWl0dGVyPHsgZGF0ZTogRGF0ZSB9PiA9IG5ldyBFdmVudEVtaXR0ZXI8eyBkYXRlOiBEYXRlIH0+KCk7XHJcbn1cclxuIl19