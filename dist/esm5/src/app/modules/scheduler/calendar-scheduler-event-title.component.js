/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
var CalendarSchedulerEventTitleComponent = /** @class */ (function () {
    function CalendarSchedulerEventTitleComponent() {
    }
    CalendarSchedulerEventTitleComponent.decorators = [
        { type: Component, args: [{
                    selector: 'calendar-scheduler-event-title',
                    template: "\n        <div\n            class=\"cal-scheduler-event-title\"\n            [innerHTML]=\"event.title | schedulerEventTitle:view:event\">\n        </div>\n        <div *ngIf=\"event.status\"\n            class=\"cal-scheduler-event-status\"\n            [class.ok]=\"event.status === 'ok'\"\n            [class.warning]=\"event.status === 'warning'\"\n            [class.danger]=\"event.status === 'danger'\">\n        </div>\n    ",
                    host: {
                        'class': 'cal-scheduler-event-title-container'
                    }
                },] },
    ];
    CalendarSchedulerEventTitleComponent.propDecorators = {
        event: [{ type: Input }],
        view: [{ type: Input }]
    };
    return CalendarSchedulerEventTitleComponent;
}());
export { CalendarSchedulerEventTitleComponent };
if (false) {
    /** @type {?} */
    CalendarSchedulerEventTitleComponent.prototype.event;
    /** @type {?} */
    CalendarSchedulerEventTitleComponent.prototype.view;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LXRpdGxlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2FsZW5kYXItc2NoZWR1bGVyLyIsInNvdXJjZXMiOlsic3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9jYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtdGl0bGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7Z0JBS2hELFNBQVMsU0FBQztvQkFDUCxRQUFRLEVBQUUsZ0NBQWdDO29CQUMxQyxRQUFRLEVBQUUsa2JBV1Q7b0JBQ0QsSUFBSSxFQUFFO3dCQUNGLE9BQU8sRUFBRSxxQ0FBcUM7cUJBQ2pEO2lCQUNKOzs7d0JBR0ksS0FBSzt1QkFFTCxLQUFLOzsrQ0EzQlY7O1NBdUJhLG9DQUFvQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRcclxufSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci12aWV3LmNvbXBvbmVudCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LXRpdGxlJyxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICBjbGFzcz1cImNhbC1zY2hlZHVsZXItZXZlbnQtdGl0bGVcIlxyXG4gICAgICAgICAgICBbaW5uZXJIVE1MXT1cImV2ZW50LnRpdGxlIHwgc2NoZWR1bGVyRXZlbnRUaXRsZTp2aWV3OmV2ZW50XCI+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiAqbmdJZj1cImV2ZW50LnN0YXR1c1wiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiY2FsLXNjaGVkdWxlci1ldmVudC1zdGF0dXNcIlxyXG4gICAgICAgICAgICBbY2xhc3Mub2tdPVwiZXZlbnQuc3RhdHVzID09PSAnb2snXCJcclxuICAgICAgICAgICAgW2NsYXNzLndhcm5pbmddPVwiZXZlbnQuc3RhdHVzID09PSAnd2FybmluZydcIlxyXG4gICAgICAgICAgICBbY2xhc3MuZGFuZ2VyXT1cImV2ZW50LnN0YXR1cyA9PT0gJ2RhbmdlcidcIj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIGAsXHJcbiAgICBob3N0OiB7XHJcbiAgICAgICAgJ2NsYXNzJzogJ2NhbC1zY2hlZHVsZXItZXZlbnQtdGl0bGUtY29udGFpbmVyJ1xyXG4gICAgfVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudFRpdGxlQ29tcG9uZW50IHtcclxuXHJcbiAgICBASW5wdXQoKSBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudDtcclxuXHJcbiAgICBASW5wdXQoKSB2aWV3OiBzdHJpbmc7XHJcbn1cclxuIl19