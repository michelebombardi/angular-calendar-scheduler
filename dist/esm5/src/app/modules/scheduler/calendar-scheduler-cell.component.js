/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import * as momentImported from 'moment';
/** @type {?} */
var moment = momentImported;
var CalendarSchedulerCellComponent = /** @class */ (function () {
    function CalendarSchedulerCellComponent() {
        this.showActions = true;
        this.highlightSegment = new EventEmitter();
        this.unhighlightSegment = new EventEmitter();
        this.segmentClicked = new EventEmitter();
        this.eventClicked = new EventEmitter();
    }
    /**
     * @return {?}
     */
    CalendarSchedulerCellComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.title = moment(this.day.date).format('dddd L');
    };
    /**
     * @param {?} mouseEvent
     * @param {?} segment
     * @param {?} event
     * @return {?}
     */
    CalendarSchedulerCellComponent.prototype.onMouseEnter = /**
     * @param {?} mouseEvent
     * @param {?} segment
     * @param {?} event
     * @return {?}
     */
    function (mouseEvent, segment, event) {
        if (!event.isDisabled && !segment.isDisabled) {
            this.highlightSegment.emit({ event: event });
        }
    };
    /**
     * @param {?} mouseEvent
     * @param {?} segment
     * @param {?} event
     * @return {?}
     */
    CalendarSchedulerCellComponent.prototype.onMouseLeave = /**
     * @param {?} mouseEvent
     * @param {?} segment
     * @param {?} event
     * @return {?}
     */
    function (mouseEvent, segment, event) {
        if (!event.isDisabled && !segment.isDisabled) {
            this.unhighlightSegment.emit({ event: event });
        }
    };
    /**
     * @hidden
     */
    /**
     * @hidden
     * @param {?} mouseEvent
     * @param {?} segment
     * @return {?}
     */
    CalendarSchedulerCellComponent.prototype.onSegmentClick = /**
     * @hidden
     * @param {?} mouseEvent
     * @param {?} segment
     * @return {?}
     */
    function (mouseEvent, segment) {
        if (mouseEvent.stopPropagation) {
            mouseEvent.stopPropagation();
        }
        if (segment.events.length === 0) {
            this.segmentClicked.emit({ segment: segment });
        }
    };
    /**
     * @hidden
     */
    /**
     * @hidden
     * @param {?} mouseEvent
     * @param {?} event
     * @return {?}
     */
    CalendarSchedulerCellComponent.prototype.onEventClick = /**
     * @hidden
     * @param {?} mouseEvent
     * @param {?} event
     * @return {?}
     */
    function (mouseEvent, event) {
        if (mouseEvent.stopPropagation) {
            mouseEvent.stopPropagation();
        }
        if (event.isClickable) {
            this.eventClicked.emit({ event: event });
        }
    };
    CalendarSchedulerCellComponent.decorators = [
        { type: Component, args: [{
                    // [class.no-border]': '!day.hasBorder
                    selector: 'calendar-scheduler-cell',
                    template: "\n        <ng-template #defaultTemplate>\n            <div class=\"cal-scheduler-segments\" *ngIf=\"hour.segments.length > 0\"\n                [ngClass]=\"hour?.cssClass\"\n                [class.no-border]=\"!hour.hasBorder\">\n                <div class=\"cal-scheduler-segment\"\n                    *ngFor=\"let segment of hour.segments; let si = index\"\n                    [title]=\"title\"\n                    [ngClass]=\"segment?.cssClass\"\n                    [class.has-events]=\"segment.events.length > 0\"\n                    [class.cal-disabled]=\"segment.isDisabled\"\n                    [style.backgroundColor]=\"segment.backgroundColor\"\n                    [class.no-border]=\"!segment.hasBorder\"\n                    (mwlClick)=\"onSegmentClick($event, segment)\">\n\n                    <div class=\"cal-scheduler-events\" *ngIf=\"segment.events.length > 0\">\n                        <calendar-scheduler-event\n                            *ngFor=\"let event of segment.events\"\n                            [day]=\"day\"\n                            [hour]=\"hour\"\n                            [segment]=\"segment\"\n                            [event]=\"event\"\n                            (mouseenter)=\"onMouseEnter($event, segment, event)\"\n                            (mouseleave)=\"onMouseLeave($event, segment, event)\"\n                            [tooltipPlacement]=\"tooltipPlacement\"\n                            [showActions]=\"showActions\"\n                            [customTemplate]=\"eventTemplate\"\n                            (eventClicked)=\"onEventClick($event, event)\">\n                        </calendar-scheduler-event>\n                    </div>\n                </div>\n            </div>\n        </ng-template>\n        <ng-template\n            [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n            [ngTemplateOutletContext]=\"{\n                day: day,\n                hour: hour,\n                locale: locale,\n                tooltipPlacement: tooltipPlacement,\n                showActions: showActions,\n                eventTemplate: eventTemplate,\n                highlightSegment: highlightSegment,\n                unhighlightSegment: unhighlightSegment,\n                segmentClicked: segmentClicked,\n                eventClicked: eventClicked\n            }\">\n        </ng-template>\n    ",
                    host: {
                        'class': 'cal-scheduler-cell',
                        '[class.cal-past]': 'day.isPast',
                        '[class.cal-today]': 'day.isToday',
                        '[class.cal-future]': 'day.isFuture',
                        '[class.cal-weekend]': 'day.isWeekend',
                        '[class.cal-in-month]': 'day.inMonth',
                        '[class.cal-out-month]': '!day.inMonth',
                        '[style.backgroundColor]': 'day.backgroundColor'
                    }
                },] },
    ];
    CalendarSchedulerCellComponent.propDecorators = {
        title: [{ type: Input }],
        day: [{ type: Input }],
        hour: [{ type: Input }],
        locale: [{ type: Input }],
        tooltipPlacement: [{ type: Input }],
        showActions: [{ type: Input }],
        customTemplate: [{ type: Input }],
        eventTemplate: [{ type: Input }],
        highlightSegment: [{ type: Output }],
        unhighlightSegment: [{ type: Output }],
        segmentClicked: [{ type: Output }],
        eventClicked: [{ type: Output }]
    };
    return CalendarSchedulerCellComponent;
}());
export { CalendarSchedulerCellComponent };
if (false) {
    /** @type {?} */
    CalendarSchedulerCellComponent.prototype.title;
    /** @type {?} */
    CalendarSchedulerCellComponent.prototype.day;
    /** @type {?} */
    CalendarSchedulerCellComponent.prototype.hour;
    /** @type {?} */
    CalendarSchedulerCellComponent.prototype.locale;
    /** @type {?} */
    CalendarSchedulerCellComponent.prototype.tooltipPlacement;
    /** @type {?} */
    CalendarSchedulerCellComponent.prototype.showActions;
    /** @type {?} */
    CalendarSchedulerCellComponent.prototype.customTemplate;
    /** @type {?} */
    CalendarSchedulerCellComponent.prototype.eventTemplate;
    /** @type {?} */
    CalendarSchedulerCellComponent.prototype.highlightSegment;
    /** @type {?} */
    CalendarSchedulerCellComponent.prototype.unhighlightSegment;
    /** @type {?} */
    CalendarSchedulerCellComponent.prototype.segmentClicked;
    /** @type {?} */
    CalendarSchedulerCellComponent.prototype.eventClicked;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItc2NoZWR1bGVyLWNlbGwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIvIiwic291cmNlcyI6WyJzcmMvYXBwL21vZHVsZXMvc2NoZWR1bGVyL2NhbGVuZGFyLXNjaGVkdWxlci1jZWxsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQWUsTUFBTSxlQUFlLENBQUM7QUFTekcsT0FBTyxLQUFLLGNBQWMsTUFBTSxRQUFRLENBQUM7O0FBQ3pDLElBQU0sTUFBTSxHQUFHLGNBQWMsQ0FBQzs7OzJCQTRFTSxJQUFJO2dDQU1ZLElBQUksWUFBWSxFQUFFO2tDQUVoQixJQUFJLFlBQVksRUFBRTs4QkFFWSxJQUFJLFlBQVksRUFBeUM7NEJBRS9ELElBQUksWUFBWSxFQUFxQzs7Ozs7SUFHL0gsaURBQVE7OztJQUFSO1FBQ0ksSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDdkQ7Ozs7Ozs7SUFFRCxxREFBWTs7Ozs7O0lBQVosVUFBYSxVQUFzQixFQUFFLE9BQWlDLEVBQUUsS0FBNkI7UUFDakcsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQ2hEO0tBQ0o7Ozs7Ozs7SUFFRCxxREFBWTs7Ozs7O0lBQVosVUFBYSxVQUFzQixFQUFFLE9BQWlDLEVBQUUsS0FBNkI7UUFDakcsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQ2xEO0tBQ0o7SUFFRDs7T0FFRzs7Ozs7OztJQUNILHVEQUFjOzs7Ozs7SUFBZCxVQUFlLFVBQXNCLEVBQUUsT0FBaUM7UUFDcEUsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDN0IsVUFBVSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQ2hDO1FBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ2xEO0tBQ0o7SUFFRDs7T0FFRzs7Ozs7OztJQUNILHFEQUFZOzs7Ozs7SUFBWixVQUFhLFVBQXNCLEVBQUUsS0FBNkI7UUFDOUQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDN0IsVUFBVSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQ2hDO1FBQ0QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUM1QztLQUNKOztnQkFoSUosU0FBUyxTQUFDOztvQkFDUCxRQUFRLEVBQUUseUJBQXlCO29CQUNuQyxRQUFRLEVBQUUsMjFFQWdEVDtvQkFDRCxJQUFJLEVBQUU7d0JBQ0YsT0FBTyxFQUFFLG9CQUFvQjt3QkFDN0Isa0JBQWtCLEVBQUUsWUFBWTt3QkFDaEMsbUJBQW1CLEVBQUUsYUFBYTt3QkFDbEMsb0JBQW9CLEVBQUUsY0FBYzt3QkFDcEMscUJBQXFCLEVBQUUsZUFBZTt3QkFDdEMsc0JBQXNCLEVBQUUsYUFBYTt3QkFDckMsdUJBQXVCLEVBQUUsY0FBYzt3QkFDdkMseUJBQXlCLEVBQUUscUJBQXFCO3FCQUNuRDtpQkFDSjs7O3dCQUdJLEtBQUs7c0JBRUwsS0FBSzt1QkFFTCxLQUFLO3lCQUVMLEtBQUs7bUNBRUwsS0FBSzs4QkFFTCxLQUFLO2lDQUVMLEtBQUs7Z0NBRUwsS0FBSzttQ0FFTCxNQUFNO3FDQUVOLE1BQU07aUNBRU4sTUFBTTsrQkFFTixNQUFNOzt5Q0FsR1g7O1NBMEVhLDhCQUE4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIFRlbXBsYXRlUmVmLCBIb3N0QmluZGluZyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1xyXG4gICAgU2NoZWR1bGVyVmlld0RheSxcclxuICAgIFNjaGVkdWxlclZpZXdIb3VyLFxyXG4gICAgU2NoZWR1bGVyVmlld0hvdXJTZWdtZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudFxyXG59IGZyb20gJy4vY2FsZW5kYXItc2NoZWR1bGVyLXZpZXcuY29tcG9uZW50JztcclxuXHJcbi8vIFdPUktBUk9VTkQ6IGh0dHBzOi8vZ2l0aHViLmNvbS9kaGVyZ2VzL25nLXBhY2thZ3IvaXNzdWVzLzIxNyNpc3N1ZWNvbW1lbnQtMzM5NDYwMjU1XHJcbmltcG9ydCAqIGFzIG1vbWVudEltcG9ydGVkIGZyb20gJ21vbWVudCc7XHJcbmNvbnN0IG1vbWVudCA9IG1vbWVudEltcG9ydGVkO1xyXG5cclxuQENvbXBvbmVudCh7IC8vIFtjbGFzcy5uby1ib3JkZXJdJzogJyFkYXkuaGFzQm9yZGVyXHJcbiAgICBzZWxlY3RvcjogJ2NhbGVuZGFyLXNjaGVkdWxlci1jZWxsJyxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICAgICAgPG5nLXRlbXBsYXRlICNkZWZhdWx0VGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLXNlZ21lbnRzXCIgKm5nSWY9XCJob3VyLnNlZ21lbnRzLmxlbmd0aCA+IDBcIlxyXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwiaG91cj8uY3NzQ2xhc3NcIlxyXG4gICAgICAgICAgICAgICAgW2NsYXNzLm5vLWJvcmRlcl09XCIhaG91ci5oYXNCb3JkZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLXNlZ21lbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICpuZ0Zvcj1cImxldCBzZWdtZW50IG9mIGhvdXIuc2VnbWVudHM7IGxldCBzaSA9IGluZGV4XCJcclxuICAgICAgICAgICAgICAgICAgICBbdGl0bGVdPVwidGl0bGVcIlxyXG4gICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInNlZ21lbnQ/LmNzc0NsYXNzXCJcclxuICAgICAgICAgICAgICAgICAgICBbY2xhc3MuaGFzLWV2ZW50c109XCJzZWdtZW50LmV2ZW50cy5sZW5ndGggPiAwXCJcclxuICAgICAgICAgICAgICAgICAgICBbY2xhc3MuY2FsLWRpc2FibGVkXT1cInNlZ21lbnQuaXNEaXNhYmxlZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgW3N0eWxlLmJhY2tncm91bmRDb2xvcl09XCJzZWdtZW50LmJhY2tncm91bmRDb2xvclwiXHJcbiAgICAgICAgICAgICAgICAgICAgW2NsYXNzLm5vLWJvcmRlcl09XCIhc2VnbWVudC5oYXNCb3JkZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIChtd2xDbGljayk9XCJvblNlZ21lbnRDbGljaygkZXZlbnQsIHNlZ21lbnQpXCI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLWV2ZW50c1wiICpuZ0lmPVwic2VnbWVudC5ldmVudHMubGVuZ3RoID4gMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgZXZlbnQgb2Ygc2VnbWVudC5ldmVudHNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2RheV09XCJkYXlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2hvdXJdPVwiaG91clwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc2VnbWVudF09XCJzZWdtZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtldmVudF09XCJldmVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobW91c2VlbnRlcik9XCJvbk1vdXNlRW50ZXIoJGV2ZW50LCBzZWdtZW50LCBldmVudClcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG1vdXNlbGVhdmUpPVwib25Nb3VzZUxlYXZlKCRldmVudCwgc2VnbWVudCwgZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt0b29sdGlwUGxhY2VtZW50XT1cInRvb2x0aXBQbGFjZW1lbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3Nob3dBY3Rpb25zXT1cInNob3dBY3Rpb25zXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtjdXN0b21UZW1wbGF0ZV09XCJldmVudFRlbXBsYXRlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChldmVudENsaWNrZWQpPVwib25FdmVudENsaWNrKCRldmVudCwgZXZlbnQpXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlXHJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImN1c3RvbVRlbXBsYXRlIHx8IGRlZmF1bHRUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7XHJcbiAgICAgICAgICAgICAgICBkYXk6IGRheSxcclxuICAgICAgICAgICAgICAgIGhvdXI6IGhvdXIsXHJcbiAgICAgICAgICAgICAgICBsb2NhbGU6IGxvY2FsZSxcclxuICAgICAgICAgICAgICAgIHRvb2x0aXBQbGFjZW1lbnQ6IHRvb2x0aXBQbGFjZW1lbnQsXHJcbiAgICAgICAgICAgICAgICBzaG93QWN0aW9uczogc2hvd0FjdGlvbnMsXHJcbiAgICAgICAgICAgICAgICBldmVudFRlbXBsYXRlOiBldmVudFRlbXBsYXRlLFxyXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0U2VnbWVudDogaGlnaGxpZ2h0U2VnbWVudCxcclxuICAgICAgICAgICAgICAgIHVuaGlnaGxpZ2h0U2VnbWVudDogdW5oaWdobGlnaHRTZWdtZW50LFxyXG4gICAgICAgICAgICAgICAgc2VnbWVudENsaWNrZWQ6IHNlZ21lbnRDbGlja2VkLFxyXG4gICAgICAgICAgICAgICAgZXZlbnRDbGlja2VkOiBldmVudENsaWNrZWRcclxuICAgICAgICAgICAgfVwiPlxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICBgLFxyXG4gICAgaG9zdDoge1xyXG4gICAgICAgICdjbGFzcyc6ICdjYWwtc2NoZWR1bGVyLWNlbGwnLFxyXG4gICAgICAgICdbY2xhc3MuY2FsLXBhc3RdJzogJ2RheS5pc1Bhc3QnLFxyXG4gICAgICAgICdbY2xhc3MuY2FsLXRvZGF5XSc6ICdkYXkuaXNUb2RheScsXHJcbiAgICAgICAgJ1tjbGFzcy5jYWwtZnV0dXJlXSc6ICdkYXkuaXNGdXR1cmUnLFxyXG4gICAgICAgICdbY2xhc3MuY2FsLXdlZWtlbmRdJzogJ2RheS5pc1dlZWtlbmQnLFxyXG4gICAgICAgICdbY2xhc3MuY2FsLWluLW1vbnRoXSc6ICdkYXkuaW5Nb250aCcsXHJcbiAgICAgICAgJ1tjbGFzcy5jYWwtb3V0LW1vbnRoXSc6ICchZGF5LmluTW9udGgnLFxyXG4gICAgICAgICdbc3R5bGUuYmFja2dyb3VuZENvbG9yXSc6ICdkYXkuYmFja2dyb3VuZENvbG9yJ1xyXG4gICAgfVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJTY2hlZHVsZXJDZWxsQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgICBASW5wdXQoKSB0aXRsZTogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dCgpIGRheTogU2NoZWR1bGVyVmlld0RheTtcclxuXHJcbiAgICBASW5wdXQoKSBob3VyOiBTY2hlZHVsZXJWaWV3SG91cjtcclxuXHJcbiAgICBASW5wdXQoKSBsb2NhbGU6IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoKSB0b29sdGlwUGxhY2VtZW50OiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KCkgc2hvd0FjdGlvbnM6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgIEBJbnB1dCgpIGN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICAgIEBJbnB1dCgpIGV2ZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gICAgQE91dHB1dCgpIGhpZ2hsaWdodFNlZ21lbnQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAgIEBPdXRwdXQoKSB1bmhpZ2hsaWdodFNlZ21lbnQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAgIEBPdXRwdXQoKSBzZWdtZW50Q2xpY2tlZDogRXZlbnRFbWl0dGVyPHsgc2VnbWVudDogU2NoZWR1bGVyVmlld0hvdXJTZWdtZW50IH0+ID0gbmV3IEV2ZW50RW1pdHRlcjx7IHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCB9PigpO1xyXG5cclxuICAgIEBPdXRwdXQoKSBldmVudENsaWNrZWQ6IEV2ZW50RW1pdHRlcjx7IGV2ZW50OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50IH0+ID0gbmV3IEV2ZW50RW1pdHRlcjx7IGV2ZW50OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50IH0+KCk7XHJcblxyXG5cclxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMudGl0bGUgPSBtb21lbnQodGhpcy5kYXkuZGF0ZSkuZm9ybWF0KCdkZGRkIEwnKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRW50ZXIobW91c2VFdmVudDogTW91c2VFdmVudCwgc2VnbWVudDogU2NoZWR1bGVyVmlld0hvdXJTZWdtZW50LCBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghZXZlbnQuaXNEaXNhYmxlZCAmJiAhc2VnbWVudC5pc0Rpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0U2VnbWVudC5lbWl0KHsgZXZlbnQ6IGV2ZW50IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlTGVhdmUobW91c2VFdmVudDogTW91c2VFdmVudCwgc2VnbWVudDogU2NoZWR1bGVyVmlld0hvdXJTZWdtZW50LCBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghZXZlbnQuaXNEaXNhYmxlZCAmJiAhc2VnbWVudC5pc0Rpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMudW5oaWdobGlnaHRTZWdtZW50LmVtaXQoeyBldmVudDogZXZlbnQgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGhpZGRlblxyXG4gICAgICovXHJcbiAgICBvblNlZ21lbnRDbGljayhtb3VzZUV2ZW50OiBNb3VzZUV2ZW50LCBzZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAobW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24pIHtcclxuICAgICAgICAgICAgbW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzZWdtZW50LmV2ZW50cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50Q2xpY2tlZC5lbWl0KHsgc2VnbWVudDogc2VnbWVudCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaGlkZGVuXHJcbiAgICAgKi9cclxuICAgIG9uRXZlbnRDbGljayhtb3VzZUV2ZW50OiBNb3VzZUV2ZW50LCBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChtb3VzZUV2ZW50LnN0b3BQcm9wYWdhdGlvbikge1xyXG4gICAgICAgICAgICBtb3VzZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZXZlbnQuaXNDbGlja2FibGUpIHtcclxuICAgICAgICAgICAgdGhpcy5ldmVudENsaWNrZWQuZW1pdCh7IGV2ZW50OiBldmVudCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19