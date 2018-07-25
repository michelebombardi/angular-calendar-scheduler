/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
var CalendarSchedulerEventActionsComponent = /** @class */ (function () {
    function CalendarSchedulerEventActionsComponent() {
        this.actions = [];
    }
    /**
     * @return {?}
     */
    CalendarSchedulerEventActionsComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.actions = this.event.isDisabled ?
            this.event.actions.filter(function (a) { return !a.when || a.when === 'disabled'; }) :
            this.event.actions.filter(function (a) { return !a.when || a.when === 'enabled'; });
    };
    /**
     * @hidden
     */
    /**
     * @hidden
     * @param {?} mouseEvent
     * @param {?} action
     * @param {?} event
     * @return {?}
     */
    CalendarSchedulerEventActionsComponent.prototype.onActionClick = /**
     * @hidden
     * @param {?} mouseEvent
     * @param {?} action
     * @param {?} event
     * @return {?}
     */
    function (mouseEvent, action, event) {
        if (mouseEvent.stopPropagation) {
            mouseEvent.stopPropagation();
        }
        action.onClick(event);
    };
    CalendarSchedulerEventActionsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'calendar-scheduler-event-actions',
                    template: "\n        <span *ngIf=\"event.actions\" class=\"cal-scheduler-event-actions\">\n            <a\n                class=\"cal-scheduler-event-action\"\n                href=\"javascript:;\"\n                *ngFor=\"let action of actions\"\n                (mwlClick)=\"onActionClick($event, action, event)\"\n                [ngClass]=\"action.cssClass\"\n                [innerHtml]=\"action.label\"\n                [title]=\"action.title\">\n            </a>\n        </span>\n    ",
                    host: {
                        'class': 'cal-scheduler-event-actions-container'
                    }
                },] },
    ];
    CalendarSchedulerEventActionsComponent.propDecorators = {
        event: [{ type: Input }]
    };
    return CalendarSchedulerEventActionsComponent;
}());
export { CalendarSchedulerEventActionsComponent };
if (false) {
    /** @type {?} */
    CalendarSchedulerEventActionsComponent.prototype.event;
    /** @type {?} */
    CalendarSchedulerEventActionsComponent.prototype.actions;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LWFjdGlvbnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIvIiwic291cmNlcyI6WyJzcmMvYXBwL21vZHVsZXMvc2NoZWR1bGVyL2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7Ozt1QkE2QkosRUFBRTs7Ozs7SUFFNUMseURBQVE7Ozs7UUFDWCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBK0IsSUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBaEMsQ0FBZ0MsQ0FBQyxDQUFDLENBQUM7WUFDbEcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBK0IsSUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDOztJQUd4Rzs7T0FFRzs7Ozs7Ozs7SUFDSCw4REFBYTs7Ozs7OztJQUFiLFVBQWMsVUFBc0IsRUFBRSxNQUFvQyxFQUFFLEtBQTZCO1FBQ3JHLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzdCLFVBQVUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUNoQztRQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDekI7O2dCQXhDSixTQUFTLFNBQUM7b0JBQ1AsUUFBUSxFQUFFLGtDQUFrQztvQkFDNUMsUUFBUSxFQUFFLHFlQVlUO29CQUNELElBQUksRUFBRTt3QkFDRixPQUFPLEVBQUUsdUNBQXVDO3FCQUNuRDtpQkFDSjs7O3dCQUdJLEtBQUs7O2lEQTNCVjs7U0F5QmEsc0NBQXNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgICBDYWxlbmRhclNjaGVkdWxlckV2ZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudEFjdGlvblxyXG59IGZyb20gJy4vY2FsZW5kYXItc2NoZWR1bGVyLXZpZXcuY29tcG9uZW50JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdjYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtYWN0aW9ucycsXHJcbiAgICB0ZW1wbGF0ZTogYFxyXG4gICAgICAgIDxzcGFuICpuZ0lmPVwiZXZlbnQuYWN0aW9uc1wiIGNsYXNzPVwiY2FsLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zXCI+XHJcbiAgICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImNhbC1zY2hlZHVsZXItZXZlbnQtYWN0aW9uXCJcclxuICAgICAgICAgICAgICAgIGhyZWY9XCJqYXZhc2NyaXB0OjtcIlxyXG4gICAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IGFjdGlvbiBvZiBhY3Rpb25zXCJcclxuICAgICAgICAgICAgICAgIChtd2xDbGljayk9XCJvbkFjdGlvbkNsaWNrKCRldmVudCwgYWN0aW9uLCBldmVudClcIlxyXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwiYWN0aW9uLmNzc0NsYXNzXCJcclxuICAgICAgICAgICAgICAgIFtpbm5lckh0bWxdPVwiYWN0aW9uLmxhYmVsXCJcclxuICAgICAgICAgICAgICAgIFt0aXRsZV09XCJhY3Rpb24udGl0bGVcIj5cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvc3Bhbj5cclxuICAgIGAsXHJcbiAgICBob3N0OiB7XHJcbiAgICAgICAgJ2NsYXNzJzogJ2NhbC1zY2hlZHVsZXItZXZlbnQtYWN0aW9ucy1jb250YWluZXInXHJcbiAgICB9XHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDYWxlbmRhclNjaGVkdWxlckV2ZW50QWN0aW9uc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gICAgQElucHV0KCkgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQ7XHJcblxyXG4gICAgcHVibGljIGFjdGlvbnM6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRBY3Rpb25bXSA9IFtdO1xyXG5cclxuICAgIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFjdGlvbnMgPSB0aGlzLmV2ZW50LmlzRGlzYWJsZWQgP1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50LmFjdGlvbnMuZmlsdGVyKChhOiBDYWxlbmRhclNjaGVkdWxlckV2ZW50QWN0aW9uKSA9PiAhYS53aGVuIHx8IGEud2hlbiA9PT0gJ2Rpc2FibGVkJykgOlxyXG4gICAgICAgICAgICB0aGlzLmV2ZW50LmFjdGlvbnMuZmlsdGVyKChhOiBDYWxlbmRhclNjaGVkdWxlckV2ZW50QWN0aW9uKSA9PiAhYS53aGVuIHx8IGEud2hlbiA9PT0gJ2VuYWJsZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBoaWRkZW5cclxuICAgICAqL1xyXG4gICAgb25BY3Rpb25DbGljayhtb3VzZUV2ZW50OiBNb3VzZUV2ZW50LCBhY3Rpb246IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRBY3Rpb24sIGV2ZW50OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKG1vdXNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKSB7XHJcbiAgICAgICAgICAgIG1vdXNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhY3Rpb24ub25DbGljayhldmVudCk7XHJcbiAgICB9XHJcbn1cclxuIl19