/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, TemplateRef, Renderer2 } from '@angular/core';
import { isSameDay } from 'date-fns';
import * as momentImported from 'moment';
/** @type {?} */
var moment = momentImported;
/**
 * [mwlCalendarTooltip]="event.title | calendarEventTitle:'weekTooltip':event"
 * [tooltipPlacement]="tooltipPlacement"
 */
var CalendarSchedulerEventComponent = /** @class */ (function () {
    function CalendarSchedulerEventComponent(renderer) {
        this.renderer = renderer;
        this.showActions = true;
        this.eventClicked = new EventEmitter();
    }
    /**
     * @return {?}
     */
    CalendarSchedulerEventComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.segment.hasBorder = this.hour.hasBorder = !this.event.endsAfterSegment;
        this.title = moment(this.event.start).format('dddd L');
        this.checkEnableState();
    };
    /**
     * @return {?}
     */
    CalendarSchedulerEventComponent.prototype.checkEnableState = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.segment.isDisabled) {
            this.day.hours.forEach(function (hour) {
                hour.segments.forEach(function (segment) {
                    segment.events.filter(function (event) { return event.id === _this.event.id && isSameDay(event.start, _this.event.start); })
                        .forEach(function (event) {
                        event.isDisabled = true;
                    });
                });
            });
        }
    };
    /**
     * @return {?}
     */
    CalendarSchedulerEventComponent.prototype.highlightEvent = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // let events: CalendarSchedulerEvent[] = this.day.hours
        //    .filter(h => h.segments.some(s => s.events.some(e => e.id === this.event.id)))
        //    .map(h =>
        //        h.segments.map(s =>
        //            s.events.filter(e => e.id === this.event.id)
        //        ).reduce((prev, curr) => prev.concat(curr))
        //    )
        //    .reduce((prev, curr) => prev.concat(curr));
        this.day.hours.forEach(function (hour) {
            hour.segments.forEach(function (segment) {
                segment.events.filter(function (event) { return event.id === _this.event.id && isSameDay(event.start, _this.event.start); })
                    .forEach(function (event) {
                    event.isHovered = true;
                });
            });
        });
    };
    /**
     * @return {?}
     */
    CalendarSchedulerEventComponent.prototype.unhighlightEvent = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.day.hours.forEach(function (hour) {
            hour.segments.forEach(function (segment) {
                segment.events.filter(function (event) { return event.id === _this.event.id && isSameDay(event.start, _this.event.start); })
                    .forEach(function (event) {
                    event.isHovered = false;
                });
            });
        });
    };
    CalendarSchedulerEventComponent.decorators = [
        { type: Component, args: [{
                    selector: 'calendar-scheduler-event',
                    template: "\n        <ng-template #defaultTemplate>\n            <div\n                class=\"cal-scheduler-event\"\n                [title]=\"title\"\n                [class.cal-starts-within-segment]=\"!event.startsBeforeSegment\"\n                [class.cal-ends-within-segment]=\"!event.endsAfterSegment\"\n                [class.hovered]=\"event.isHovered\"\n                [class.cal-disabled]=\"event.isDisabled || segment.isDisabled\"\n                [class.cal-not-clickable]=\"!event.isClickable\"\n                [style.backgroundColor]=\"event.color.primary\"\n                [ngClass]=\"event?.cssClass\"\n                (mwlClick)=\"eventClicked.emit({event: event})\"\n                (mouseenter)=\"highlightEvent()\"\n                (mouseleave)=\"unhighlightEvent()\">\n                <calendar-scheduler-event-title *ngIf=\"!event.startsBeforeSegment\"\n                    [event]=\"event\"\n                    view=\"week\">\n                </calendar-scheduler-event-title>\n                <calendar-scheduler-event-content *ngIf=\"!event.startsBeforeSegment\"\n                    [event]=\"event\">\n                </calendar-scheduler-event-content>\n                <calendar-scheduler-event-actions [event]=\"event\" *ngIf=\"showActions && event.isClickable && !event.endsAfterSegment\"></calendar-scheduler-event-actions>\n                <calendar-scheduler-event-actions [event]=\"event\" *ngIf=\"showActions && event.isDisabled && !event.endsAfterSegment\"></calendar-scheduler-event-actions>\n            </div>\n        </ng-template>\n        <ng-template\n            [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n            [ngTemplateOutletContext]=\"{\n                day: day,\n                hour: hour,\n                segment: segment,\n                event: event,\n                tooltipPlacement: tooltipPlacement,\n                showActions: showActions,\n                customTemplate: customTemplate,\n                eventClicked: eventClicked\n            }\">\n        </ng-template>\n    ",
                    host: {
                        'class': 'cal-scheduler-event-container'
                    }
                },] },
    ];
    /** @nocollapse */
    CalendarSchedulerEventComponent.ctorParameters = function () { return [
        { type: Renderer2 }
    ]; };
    CalendarSchedulerEventComponent.propDecorators = {
        title: [{ type: Input }],
        day: [{ type: Input }],
        hour: [{ type: Input }],
        segment: [{ type: Input }],
        event: [{ type: Input }],
        tooltipPlacement: [{ type: Input }],
        showActions: [{ type: Input }],
        customTemplate: [{ type: Input }],
        eventClicked: [{ type: Output }]
    };
    return CalendarSchedulerEventComponent;
}());
export { CalendarSchedulerEventComponent };
if (false) {
    /** @type {?} */
    CalendarSchedulerEventComponent.prototype.title;
    /** @type {?} */
    CalendarSchedulerEventComponent.prototype.day;
    /** @type {?} */
    CalendarSchedulerEventComponent.prototype.hour;
    /** @type {?} */
    CalendarSchedulerEventComponent.prototype.segment;
    /** @type {?} */
    CalendarSchedulerEventComponent.prototype.event;
    /** @type {?} */
    CalendarSchedulerEventComponent.prototype.tooltipPlacement;
    /** @type {?} */
    CalendarSchedulerEventComponent.prototype.showActions;
    /** @type {?} */
    CalendarSchedulerEventComponent.prototype.customTemplate;
    /** @type {?} */
    CalendarSchedulerEventComponent.prototype.eventClicked;
    /** @type {?} */
    CalendarSchedulerEventComponent.prototype.renderer;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2FsZW5kYXItc2NoZWR1bGVyLyIsInNvdXJjZXMiOlsic3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9jYWxlbmRhci1zY2hlZHVsZXItZXZlbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBVSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPdkcsT0FBTyxFQUNILFNBQVMsRUFDWixNQUFNLFVBQVUsQ0FBQztBQUdsQixPQUFPLEtBQUssY0FBYyxNQUFNLFFBQVEsQ0FBQzs7QUFDekMsSUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDOzs7Ozs7SUF3RTFCLHlDQUFvQixRQUFtQjtRQUFuQixhQUFRLEdBQVIsUUFBUSxDQUFXOzJCQU5QLElBQUk7NEJBSXNDLElBQUksWUFBWSxFQUFxQztLQUVqRjs7OztJQUV2QyxrREFBUTs7OztRQUNYLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztRQUU1RSxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV2RCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzs7Ozs7SUFHcEIsMERBQWdCOzs7OztRQUNwQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBdUI7Z0JBQzNDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBaUM7b0JBQ3BELE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQUMsS0FBNkIsSUFBSyxPQUFBLEtBQUssQ0FBQyxFQUFFLEtBQUssS0FBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBdEUsQ0FBc0UsQ0FBQzt5QkFDM0gsT0FBTyxDQUFDLFVBQUMsS0FBNkI7d0JBQ25DLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO3FCQUMzQixDQUFDLENBQUM7aUJBQ1YsQ0FBQyxDQUFDO2FBQ04sQ0FBQyxDQUFDO1NBQ047Ozs7O0lBR0wsd0RBQWM7OztJQUFkO1FBQUEsaUJBa0JDOzs7Ozs7Ozs7UUFSRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUF1QjtZQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQWlDO2dCQUNwRCxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQTZCLElBQUssT0FBQSxLQUFLLENBQUMsRUFBRSxLQUFLLEtBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQXRFLENBQXNFLENBQUM7cUJBQzNILE9BQU8sQ0FBQyxVQUFDLEtBQTZCO29CQUNuQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztpQkFDMUIsQ0FBQyxDQUFDO2FBQ1YsQ0FBQyxDQUFDO1NBQ04sQ0FBQyxDQUFDO0tBQ047Ozs7SUFFRCwwREFBZ0I7OztJQUFoQjtRQUFBLGlCQVNDO1FBUkcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBdUI7WUFDM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFpQztnQkFDcEQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQyxLQUE2QixJQUFLLE9BQUEsS0FBSyxDQUFDLEVBQUUsS0FBSyxLQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUF0RSxDQUFzRSxDQUFDO3FCQUMzSCxPQUFPLENBQUMsVUFBQyxLQUE2QjtvQkFDbkMsS0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7aUJBQzNCLENBQUMsQ0FBQzthQUNWLENBQUMsQ0FBQztTQUNOLENBQUMsQ0FBQztLQUNOOztnQkF0SEosU0FBUyxTQUFDO29CQUNQLFFBQVEsRUFBRSwwQkFBMEI7b0JBQ3BDLFFBQVEsRUFBRSxnaEVBdUNUO29CQUNELElBQUksRUFBRTt3QkFDRixPQUFPLEVBQUUsK0JBQStCO3FCQUMzQztpQkFDSjs7OztnQkFoRXFFLFNBQVM7Ozt3QkFtRTFFLEtBQUs7c0JBRUwsS0FBSzt1QkFFTCxLQUFLOzBCQUVMLEtBQUs7d0JBRUwsS0FBSzttQ0FFTCxLQUFLOzhCQUVMLEtBQUs7aUNBRUwsS0FBSzsrQkFFTCxNQUFNOzswQ0FuRlg7O1NBaUVhLCtCQUErQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBUZW1wbGF0ZVJlZiwgT25Jbml0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICAgIFNjaGVkdWxlclZpZXdEYXksXHJcbiAgICBTY2hlZHVsZXJWaWV3SG91cixcclxuICAgIFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRcclxufSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci12aWV3LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7XHJcbiAgICBpc1NhbWVEYXlcclxufSBmcm9tICdkYXRlLWZucyc7XHJcblxyXG4vLyBXT1JLQVJPVU5EOiBodHRwczovL2dpdGh1Yi5jb20vZGhlcmdlcy9uZy1wYWNrYWdyL2lzc3Vlcy8yMTcjaXNzdWVjb21tZW50LTMzOTQ2MDI1NVxyXG5pbXBvcnQgKiBhcyBtb21lbnRJbXBvcnRlZCBmcm9tICdtb21lbnQnO1xyXG5jb25zdCBtb21lbnQgPSBtb21lbnRJbXBvcnRlZDtcclxuXHJcbi8qKlxyXG4gKiBbbXdsQ2FsZW5kYXJUb29sdGlwXT1cImV2ZW50LnRpdGxlIHwgY2FsZW5kYXJFdmVudFRpdGxlOid3ZWVrVG9vbHRpcCc6ZXZlbnRcIlxyXG4gKiBbdG9vbHRpcFBsYWNlbWVudF09XCJ0b29sdGlwUGxhY2VtZW50XCJcclxuICovXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdjYWxlbmRhci1zY2hlZHVsZXItZXZlbnQnLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgICAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHRUZW1wbGF0ZT5cclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLWV2ZW50XCJcclxuICAgICAgICAgICAgICAgIFt0aXRsZV09XCJ0aXRsZVwiXHJcbiAgICAgICAgICAgICAgICBbY2xhc3MuY2FsLXN0YXJ0cy13aXRoaW4tc2VnbWVudF09XCIhZXZlbnQuc3RhcnRzQmVmb3JlU2VnbWVudFwiXHJcbiAgICAgICAgICAgICAgICBbY2xhc3MuY2FsLWVuZHMtd2l0aGluLXNlZ21lbnRdPVwiIWV2ZW50LmVuZHNBZnRlclNlZ21lbnRcIlxyXG4gICAgICAgICAgICAgICAgW2NsYXNzLmhvdmVyZWRdPVwiZXZlbnQuaXNIb3ZlcmVkXCJcclxuICAgICAgICAgICAgICAgIFtjbGFzcy5jYWwtZGlzYWJsZWRdPVwiZXZlbnQuaXNEaXNhYmxlZCB8fCBzZWdtZW50LmlzRGlzYWJsZWRcIlxyXG4gICAgICAgICAgICAgICAgW2NsYXNzLmNhbC1ub3QtY2xpY2thYmxlXT1cIiFldmVudC5pc0NsaWNrYWJsZVwiXHJcbiAgICAgICAgICAgICAgICBbc3R5bGUuYmFja2dyb3VuZENvbG9yXT1cImV2ZW50LmNvbG9yLnByaW1hcnlcIlxyXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwiZXZlbnQ/LmNzc0NsYXNzXCJcclxuICAgICAgICAgICAgICAgIChtd2xDbGljayk9XCJldmVudENsaWNrZWQuZW1pdCh7ZXZlbnQ6IGV2ZW50fSlcIlxyXG4gICAgICAgICAgICAgICAgKG1vdXNlZW50ZXIpPVwiaGlnaGxpZ2h0RXZlbnQoKVwiXHJcbiAgICAgICAgICAgICAgICAobW91c2VsZWF2ZSk9XCJ1bmhpZ2hsaWdodEV2ZW50KClcIj5cclxuICAgICAgICAgICAgICAgIDxjYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtdGl0bGUgKm5nSWY9XCIhZXZlbnQuc3RhcnRzQmVmb3JlU2VnbWVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgW2V2ZW50XT1cImV2ZW50XCJcclxuICAgICAgICAgICAgICAgICAgICB2aWV3PVwid2Vla1wiPlxyXG4gICAgICAgICAgICAgICAgPC9jYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtdGl0bGU+XHJcbiAgICAgICAgICAgICAgICA8Y2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LWNvbnRlbnQgKm5nSWY9XCIhZXZlbnQuc3RhcnRzQmVmb3JlU2VnbWVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgW2V2ZW50XT1cImV2ZW50XCI+XHJcbiAgICAgICAgICAgICAgICA8L2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1jb250ZW50PlxyXG4gICAgICAgICAgICAgICAgPGNhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zIFtldmVudF09XCJldmVudFwiICpuZ0lmPVwic2hvd0FjdGlvbnMgJiYgZXZlbnQuaXNDbGlja2FibGUgJiYgIWV2ZW50LmVuZHNBZnRlclNlZ21lbnRcIj48L2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zPlxyXG4gICAgICAgICAgICAgICAgPGNhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zIFtldmVudF09XCJldmVudFwiICpuZ0lmPVwic2hvd0FjdGlvbnMgJiYgZXZlbnQuaXNEaXNhYmxlZCAmJiAhZXZlbnQuZW5kc0FmdGVyU2VnbWVudFwiPjwvY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LWFjdGlvbnM+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlXHJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImN1c3RvbVRlbXBsYXRlIHx8IGRlZmF1bHRUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7XHJcbiAgICAgICAgICAgICAgICBkYXk6IGRheSxcclxuICAgICAgICAgICAgICAgIGhvdXI6IGhvdXIsXHJcbiAgICAgICAgICAgICAgICBzZWdtZW50OiBzZWdtZW50LFxyXG4gICAgICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LFxyXG4gICAgICAgICAgICAgICAgdG9vbHRpcFBsYWNlbWVudDogdG9vbHRpcFBsYWNlbWVudCxcclxuICAgICAgICAgICAgICAgIHNob3dBY3Rpb25zOiBzaG93QWN0aW9ucyxcclxuICAgICAgICAgICAgICAgIGN1c3RvbVRlbXBsYXRlOiBjdXN0b21UZW1wbGF0ZSxcclxuICAgICAgICAgICAgICAgIGV2ZW50Q2xpY2tlZDogZXZlbnRDbGlja2VkXHJcbiAgICAgICAgICAgIH1cIj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgYCxcclxuICAgIGhvc3Q6IHtcclxuICAgICAgICAnY2xhc3MnOiAnY2FsLXNjaGVkdWxlci1ldmVudC1jb250YWluZXInXHJcbiAgICB9XHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDYWxlbmRhclNjaGVkdWxlckV2ZW50Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgICBASW5wdXQoKSB0aXRsZTogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dCgpIGRheTogU2NoZWR1bGVyVmlld0RheTtcclxuXHJcbiAgICBASW5wdXQoKSBob3VyOiBTY2hlZHVsZXJWaWV3SG91cjtcclxuXHJcbiAgICBASW5wdXQoKSBzZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQ7XHJcblxyXG4gICAgQElucHV0KCkgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQ7XHJcblxyXG4gICAgQElucHV0KCkgdG9vbHRpcFBsYWNlbWVudDogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dCgpIHNob3dBY3Rpb25zOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICBASW5wdXQoKSBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgICBAT3V0cHV0KCkgZXZlbnRDbGlja2VkOiBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB9PiA9IG5ldyBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB9PigpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikgeyAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zZWdtZW50Lmhhc0JvcmRlciA9IHRoaXMuaG91ci5oYXNCb3JkZXIgPSAhdGhpcy5ldmVudC5lbmRzQWZ0ZXJTZWdtZW50O1xyXG5cclxuICAgICAgICB0aGlzLnRpdGxlID0gbW9tZW50KHRoaXMuZXZlbnQuc3RhcnQpLmZvcm1hdCgnZGRkZCBMJyk7XHJcblxyXG4gICAgICAgIHRoaXMuY2hlY2tFbmFibGVTdGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hlY2tFbmFibGVTdGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5zZWdtZW50LmlzRGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXkuaG91cnMuZm9yRWFjaCgoaG91cjogU2NoZWR1bGVyVmlld0hvdXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGhvdXIuc2VnbWVudHMuZm9yRWFjaCgoc2VnbWVudDogU2NoZWR1bGVyVmlld0hvdXJTZWdtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudC5ldmVudHMuZmlsdGVyKChldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCkgPT4gZXZlbnQuaWQgPT09IHRoaXMuZXZlbnQuaWQgJiYgaXNTYW1lRGF5KGV2ZW50LnN0YXJ0LCB0aGlzLmV2ZW50LnN0YXJ0KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKGV2ZW50OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5pc0Rpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhpZ2hsaWdodEV2ZW50KCk6IHZvaWQge1xyXG4gICAgICAgIC8vIGxldCBldmVudHM6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRbXSA9IHRoaXMuZGF5LmhvdXJzXHJcbiAgICAgICAgLy8gICAgLmZpbHRlcihoID0+IGguc2VnbWVudHMuc29tZShzID0+IHMuZXZlbnRzLnNvbWUoZSA9PiBlLmlkID09PSB0aGlzLmV2ZW50LmlkKSkpXHJcbiAgICAgICAgLy8gICAgLm1hcChoID0+XHJcbiAgICAgICAgLy8gICAgICAgIGguc2VnbWVudHMubWFwKHMgPT5cclxuICAgICAgICAvLyAgICAgICAgICAgIHMuZXZlbnRzLmZpbHRlcihlID0+IGUuaWQgPT09IHRoaXMuZXZlbnQuaWQpXHJcbiAgICAgICAgLy8gICAgICAgICkucmVkdWNlKChwcmV2LCBjdXJyKSA9PiBwcmV2LmNvbmNhdChjdXJyKSlcclxuICAgICAgICAvLyAgICApXHJcbiAgICAgICAgLy8gICAgLnJlZHVjZSgocHJldiwgY3VycikgPT4gcHJldi5jb25jYXQoY3VycikpO1xyXG5cclxuICAgICAgICB0aGlzLmRheS5ob3Vycy5mb3JFYWNoKChob3VyOiBTY2hlZHVsZXJWaWV3SG91cikgPT4ge1xyXG4gICAgICAgICAgICBob3VyLnNlZ21lbnRzLmZvckVhY2goKHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudC5ldmVudHMuZmlsdGVyKChldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCkgPT4gZXZlbnQuaWQgPT09IHRoaXMuZXZlbnQuaWQgJiYgaXNTYW1lRGF5KGV2ZW50LnN0YXJ0LCB0aGlzLmV2ZW50LnN0YXJ0KSlcclxuICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaCgoZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuaXNIb3ZlcmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdW5oaWdobGlnaHRFdmVudCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRheS5ob3Vycy5mb3JFYWNoKChob3VyOiBTY2hlZHVsZXJWaWV3SG91cikgPT4ge1xyXG4gICAgICAgICAgICBob3VyLnNlZ21lbnRzLmZvckVhY2goKHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudC5ldmVudHMuZmlsdGVyKChldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCkgPT4gZXZlbnQuaWQgPT09IHRoaXMuZXZlbnQuaWQgJiYgaXNTYW1lRGF5KGV2ZW50LnN0YXJ0LCB0aGlzLmV2ZW50LnN0YXJ0KSlcclxuICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaCgoZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuaXNIb3ZlcmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgc2FtZUV2ZW50SW5QcmV2aW91c0hvdXIoZGF5OiBTY2hlZHVsZXJWaWV3RGF5LCBob3VyOiBTY2hlZHVsZXJWaWV3SG91cik6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQge1xyXG4gICAgLy8gICAgbGV0IGhvdXJJbmRleDogbnVtYmVyID0gZGF5LmhvdXJzLmluZGV4T2YoaG91cik7XHJcbiAgICAvLyAgICBsZXQgcHJldmlvdXNIb3VyID0gZGF5LmhvdXJzW2hvdXJJbmRleCAtIDFdO1xyXG4gICAgLy8gICAgaWYgKHByZXZpb3VzSG91cikge1xyXG4gICAgLy8gICAgICAgIGxldCBwcmV2aW91c1NlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCA9IHByZXZpb3VzSG91ci5zZWdtZW50c1twcmV2aW91c0hvdXIuc2VnbWVudHMubGVuZ3RoIC0gMV07XHJcbiAgICAvLyAgICAgICAgcmV0dXJuIHByZXZpb3VzU2VnbWVudC5ldmVudHNbcHJldmlvdXNTZWdtZW50LmV2ZW50cy5sZW5ndGggLSAxXTtcclxuICAgIC8vICAgIH1cclxuICAgIC8vICAgIHJldHVybiBudWxsO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHByaXZhdGUgc2FtZUV2ZW50SW5QcmV2aW91c1NlZ21lbnQoc2VnbWVudEluZGV4OiBudW1iZXIpOiBDYWxlbmRhclNjaGVkdWxlckV2ZW50IHtcclxuICAgIC8vICAgIGxldCBwcmV2aW91c1NlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCA9IHRoaXMuaG91ci5zZWdtZW50c1tzZWdtZW50SW5kZXggLSAxXTtcclxuICAgIC8vICAgIGlmIChwcmV2aW91c1NlZ21lbnQpIHtcclxuICAgIC8vICAgICAgICByZXR1cm4gcHJldmlvdXNTZWdtZW50LmV2ZW50c1twcmV2aW91c1NlZ21lbnQuZXZlbnRzLmxlbmd0aCAtIDFdO1xyXG4gICAgLy8gICAgfVxyXG4gICAgLy8gICAgcmV0dXJuIG51bGw7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBzYW1lRXZlbnRJbk5leHRIb3VyKCk6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQge1xyXG4gICAgLy8gICAgbGV0IGhvdXJJbmRleDogbnVtYmVyID0gdGhpcy5kYXkuaG91cnMuaW5kZXhPZih0aGlzLmhvdXIpO1xyXG4gICAgLy8gICAgbGV0IG5leHRIb3VyOiBTY2hlZHVsZXJWaWV3SG91ciA9IHRoaXMuZGF5LmhvdXJzW2hvdXJJbmRleCArIDFdO1xyXG4gICAgLy8gICAgaWYgKG5leHRIb3VyKSB7XHJcbiAgICAvLyAgICAgICAgbGV0IG5leHRTZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQgPSBuZXh0SG91ci5zZWdtZW50c1swXTtcclxuICAgIC8vICAgICAgICByZXR1cm4gbmV4dFNlZ21lbnQuZXZlbnRzWzBdO1xyXG4gICAgLy8gICAgfVxyXG4gICAgLy8gICAgcmV0dXJuIG51bGw7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBzYW1lRXZlbnRJbk5leHRTZWdtZW50KHNlZ21lbnRJbmRleDogbnVtYmVyKTogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB7XHJcbiAgICAvLyAgICBsZXQgbmV4dFNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCA9IHRoaXMuaG91ci5zZWdtZW50c1tzZWdtZW50SW5kZXggKyAxXTtcclxuICAgIC8vICAgIGlmIChuZXh0U2VnbWVudCkge1xyXG4gICAgLy8gICAgICAgIHJldHVybiBuZXh0U2VnbWVudC5ldmVudHNbMF07XHJcbiAgICAvLyAgICB9XHJcbiAgICAvLyAgICByZXR1cm4gbnVsbDtcclxuICAgIC8vIH1cclxufVxyXG4iXX0=