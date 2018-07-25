/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, TemplateRef, Renderer2 } from '@angular/core';
import { isSameDay } from 'date-fns';
import * as momentImported from 'moment';
/** @type {?} */
const moment = momentImported;
/**
 * [mwlCalendarTooltip]="event.title | calendarEventTitle:'weekTooltip':event"
 * [tooltipPlacement]="tooltipPlacement"
 */
export class CalendarSchedulerEventComponent {
    /**
     * @param {?} renderer
     */
    constructor(renderer) {
        this.renderer = renderer;
        this.showActions = true;
        this.eventClicked = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.segment.hasBorder = this.hour.hasBorder = !this.event.endsAfterSegment;
        this.title = moment(this.event.start).format('dddd L');
        this.checkEnableState();
    }
    /**
     * @return {?}
     */
    checkEnableState() {
        if (this.segment.isDisabled) {
            this.day.hours.forEach((hour) => {
                hour.segments.forEach((segment) => {
                    segment.events.filter((event) => event.id === this.event.id && isSameDay(event.start, this.event.start))
                        .forEach((event) => {
                        event.isDisabled = true;
                    });
                });
            });
        }
    }
    /**
     * @return {?}
     */
    highlightEvent() {
        // let events: CalendarSchedulerEvent[] = this.day.hours
        //    .filter(h => h.segments.some(s => s.events.some(e => e.id === this.event.id)))
        //    .map(h =>
        //        h.segments.map(s =>
        //            s.events.filter(e => e.id === this.event.id)
        //        ).reduce((prev, curr) => prev.concat(curr))
        //    )
        //    .reduce((prev, curr) => prev.concat(curr));
        this.day.hours.forEach((hour) => {
            hour.segments.forEach((segment) => {
                segment.events.filter((event) => event.id === this.event.id && isSameDay(event.start, this.event.start))
                    .forEach((event) => {
                    event.isHovered = true;
                });
            });
        });
    }
    /**
     * @return {?}
     */
    unhighlightEvent() {
        this.day.hours.forEach((hour) => {
            hour.segments.forEach((segment) => {
                segment.events.filter((event) => event.id === this.event.id && isSameDay(event.start, this.event.start))
                    .forEach((event) => {
                    event.isHovered = false;
                });
            });
        });
    }
}
CalendarSchedulerEventComponent.decorators = [
    { type: Component, args: [{
                selector: 'calendar-scheduler-event',
                template: `
        <ng-template #defaultTemplate>
            <div
                class="cal-scheduler-event"
                [title]="title"
                [class.cal-starts-within-segment]="!event.startsBeforeSegment"
                [class.cal-ends-within-segment]="!event.endsAfterSegment"
                [class.hovered]="event.isHovered"
                [class.cal-disabled]="event.isDisabled || segment.isDisabled"
                [class.cal-not-clickable]="!event.isClickable"
                [style.backgroundColor]="event.color.primary"
                [ngClass]="event?.cssClass"
                (mwlClick)="eventClicked.emit({event: event})"
                (mouseenter)="highlightEvent()"
                (mouseleave)="unhighlightEvent()">
                <calendar-scheduler-event-title *ngIf="!event.startsBeforeSegment"
                    [event]="event"
                    view="week">
                </calendar-scheduler-event-title>
                <calendar-scheduler-event-content *ngIf="!event.startsBeforeSegment"
                    [event]="event">
                </calendar-scheduler-event-content>
                <calendar-scheduler-event-actions [event]="event" *ngIf="showActions && event.isClickable && !event.endsAfterSegment"></calendar-scheduler-event-actions>
                <calendar-scheduler-event-actions [event]="event" *ngIf="showActions && event.isDisabled && !event.endsAfterSegment"></calendar-scheduler-event-actions>
            </div>
        </ng-template>
        <ng-template
            [ngTemplateOutlet]="customTemplate || defaultTemplate"
            [ngTemplateOutletContext]="{
                day: day,
                hour: hour,
                segment: segment,
                event: event,
                tooltipPlacement: tooltipPlacement,
                showActions: showActions,
                customTemplate: customTemplate,
                eventClicked: eventClicked
            }">
        </ng-template>
    `,
                host: {
                    'class': 'cal-scheduler-event-container'
                }
            },] },
];
/** @nocollapse */
CalendarSchedulerEventComponent.ctorParameters = () => [
    { type: Renderer2 }
];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2FsZW5kYXItc2NoZWR1bGVyLyIsInNvdXJjZXMiOlsic3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9jYWxlbmRhci1zY2hlZHVsZXItZXZlbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBVSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPdkcsT0FBTyxFQUNILFNBQVMsRUFDWixNQUFNLFVBQVUsQ0FBQztBQUdsQixPQUFPLEtBQUssY0FBYyxNQUFNLFFBQVEsQ0FBQzs7QUFDekMsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDOzs7OztBQW9EOUIsTUFBTTs7OztJQW9CRixZQUFvQixRQUFtQjtRQUFuQixhQUFRLEdBQVIsUUFBUSxDQUFXOzJCQU5QLElBQUk7NEJBSXNDLElBQUksWUFBWSxFQUFxQztLQUVqRjs7OztJQUV2QyxRQUFRO1FBQ1gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDO1FBRTVFLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXZELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOzs7OztJQUdwQixnQkFBZ0I7UUFDcEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQXVCLEVBQUUsRUFBRTtnQkFDL0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFpQyxFQUFFLEVBQUU7b0JBQ3hELE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBNkIsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO3lCQUMzSCxPQUFPLENBQUMsQ0FBQyxLQUE2QixFQUFFLEVBQUU7d0JBQ3ZDLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO3FCQUMzQixDQUFDLENBQUM7aUJBQ1YsQ0FBQyxDQUFDO2FBQ04sQ0FBQyxDQUFDO1NBQ047Ozs7O0lBR0wsY0FBYzs7Ozs7Ozs7O1FBVVYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBdUIsRUFBRSxFQUFFO1lBQy9DLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBaUMsRUFBRSxFQUFFO2dCQUN4RCxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQTZCLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDM0gsT0FBTyxDQUFDLENBQUMsS0FBNkIsRUFBRSxFQUFFO29CQUN2QyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztpQkFDMUIsQ0FBQyxDQUFDO2FBQ1YsQ0FBQyxDQUFDO1NBQ04sQ0FBQyxDQUFDO0tBQ047Ozs7SUFFRCxnQkFBZ0I7UUFDWixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUF1QixFQUFFLEVBQUU7WUFDL0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFpQyxFQUFFLEVBQUU7Z0JBQ3hELE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBNkIsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUMzSCxPQUFPLENBQUMsQ0FBQyxLQUE2QixFQUFFLEVBQUU7b0JBQ3ZDLEtBQUssQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO2lCQUMzQixDQUFDLENBQUM7YUFDVixDQUFDLENBQUM7U0FDTixDQUFDLENBQUM7S0FDTjs7O1lBdEhKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsMEJBQTBCO2dCQUNwQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQXVDVDtnQkFDRCxJQUFJLEVBQUU7b0JBQ0YsT0FBTyxFQUFFLCtCQUErQjtpQkFDM0M7YUFDSjs7OztZQWhFcUUsU0FBUzs7O29CQW1FMUUsS0FBSztrQkFFTCxLQUFLO21CQUVMLEtBQUs7c0JBRUwsS0FBSztvQkFFTCxLQUFLOytCQUVMLEtBQUs7MEJBRUwsS0FBSzs2QkFFTCxLQUFLOzJCQUVMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgVGVtcGxhdGVSZWYsIE9uSW5pdCwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgICBTY2hlZHVsZXJWaWV3RGF5LFxyXG4gICAgU2NoZWR1bGVyVmlld0hvdXIsXHJcbiAgICBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQsXHJcbiAgICBDYWxlbmRhclNjaGVkdWxlckV2ZW50XHJcbn0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItdmlldy5jb21wb25lbnQnO1xyXG5pbXBvcnQge1xyXG4gICAgaXNTYW1lRGF5XHJcbn0gZnJvbSAnZGF0ZS1mbnMnO1xyXG5cclxuLy8gV09SS0FST1VORDogaHR0cHM6Ly9naXRodWIuY29tL2RoZXJnZXMvbmctcGFja2Fnci9pc3N1ZXMvMjE3I2lzc3VlY29tbWVudC0zMzk0NjAyNTVcclxuaW1wb3J0ICogYXMgbW9tZW50SW1wb3J0ZWQgZnJvbSAnbW9tZW50JztcclxuY29uc3QgbW9tZW50ID0gbW9tZW50SW1wb3J0ZWQ7XHJcblxyXG4vKipcclxuICogW213bENhbGVuZGFyVG9vbHRpcF09XCJldmVudC50aXRsZSB8IGNhbGVuZGFyRXZlbnRUaXRsZTond2Vla1Rvb2x0aXAnOmV2ZW50XCJcclxuICogW3Rvb2x0aXBQbGFjZW1lbnRdPVwidG9vbHRpcFBsYWNlbWVudFwiXHJcbiAqL1xyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50JyxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICAgICAgPG5nLXRlbXBsYXRlICNkZWZhdWx0VGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiY2FsLXNjaGVkdWxlci1ldmVudFwiXHJcbiAgICAgICAgICAgICAgICBbdGl0bGVdPVwidGl0bGVcIlxyXG4gICAgICAgICAgICAgICAgW2NsYXNzLmNhbC1zdGFydHMtd2l0aGluLXNlZ21lbnRdPVwiIWV2ZW50LnN0YXJ0c0JlZm9yZVNlZ21lbnRcIlxyXG4gICAgICAgICAgICAgICAgW2NsYXNzLmNhbC1lbmRzLXdpdGhpbi1zZWdtZW50XT1cIiFldmVudC5lbmRzQWZ0ZXJTZWdtZW50XCJcclxuICAgICAgICAgICAgICAgIFtjbGFzcy5ob3ZlcmVkXT1cImV2ZW50LmlzSG92ZXJlZFwiXHJcbiAgICAgICAgICAgICAgICBbY2xhc3MuY2FsLWRpc2FibGVkXT1cImV2ZW50LmlzRGlzYWJsZWQgfHwgc2VnbWVudC5pc0Rpc2FibGVkXCJcclxuICAgICAgICAgICAgICAgIFtjbGFzcy5jYWwtbm90LWNsaWNrYWJsZV09XCIhZXZlbnQuaXNDbGlja2FibGVcIlxyXG4gICAgICAgICAgICAgICAgW3N0eWxlLmJhY2tncm91bmRDb2xvcl09XCJldmVudC5jb2xvci5wcmltYXJ5XCJcclxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cImV2ZW50Py5jc3NDbGFzc1wiXHJcbiAgICAgICAgICAgICAgICAobXdsQ2xpY2spPVwiZXZlbnRDbGlja2VkLmVtaXQoe2V2ZW50OiBldmVudH0pXCJcclxuICAgICAgICAgICAgICAgIChtb3VzZWVudGVyKT1cImhpZ2hsaWdodEV2ZW50KClcIlxyXG4gICAgICAgICAgICAgICAgKG1vdXNlbGVhdmUpPVwidW5oaWdobGlnaHRFdmVudCgpXCI+XHJcbiAgICAgICAgICAgICAgICA8Y2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LXRpdGxlICpuZ0lmPVwiIWV2ZW50LnN0YXJ0c0JlZm9yZVNlZ21lbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgIFtldmVudF09XCJldmVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmlldz1cIndlZWtcIj5cclxuICAgICAgICAgICAgICAgIDwvY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LXRpdGxlPlxyXG4gICAgICAgICAgICAgICAgPGNhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1jb250ZW50ICpuZ0lmPVwiIWV2ZW50LnN0YXJ0c0JlZm9yZVNlZ21lbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgIFtldmVudF09XCJldmVudFwiPlxyXG4gICAgICAgICAgICAgICAgPC9jYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtY29udGVudD5cclxuICAgICAgICAgICAgICAgIDxjYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtYWN0aW9ucyBbZXZlbnRdPVwiZXZlbnRcIiAqbmdJZj1cInNob3dBY3Rpb25zICYmIGV2ZW50LmlzQ2xpY2thYmxlICYmICFldmVudC5lbmRzQWZ0ZXJTZWdtZW50XCI+PC9jYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtYWN0aW9ucz5cclxuICAgICAgICAgICAgICAgIDxjYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtYWN0aW9ucyBbZXZlbnRdPVwiZXZlbnRcIiAqbmdJZj1cInNob3dBY3Rpb25zICYmIGV2ZW50LmlzRGlzYWJsZWQgJiYgIWV2ZW50LmVuZHNBZnRlclNlZ21lbnRcIj48L2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZVxyXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxyXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie1xyXG4gICAgICAgICAgICAgICAgZGF5OiBkYXksXHJcbiAgICAgICAgICAgICAgICBob3VyOiBob3VyLFxyXG4gICAgICAgICAgICAgICAgc2VnbWVudDogc2VnbWVudCxcclxuICAgICAgICAgICAgICAgIGV2ZW50OiBldmVudCxcclxuICAgICAgICAgICAgICAgIHRvb2x0aXBQbGFjZW1lbnQ6IHRvb2x0aXBQbGFjZW1lbnQsXHJcbiAgICAgICAgICAgICAgICBzaG93QWN0aW9uczogc2hvd0FjdGlvbnMsXHJcbiAgICAgICAgICAgICAgICBjdXN0b21UZW1wbGF0ZTogY3VzdG9tVGVtcGxhdGUsXHJcbiAgICAgICAgICAgICAgICBldmVudENsaWNrZWQ6IGV2ZW50Q2xpY2tlZFxyXG4gICAgICAgICAgICB9XCI+XHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgIGAsXHJcbiAgICBob3N0OiB7XHJcbiAgICAgICAgJ2NsYXNzJzogJ2NhbC1zY2hlZHVsZXItZXZlbnQtY29udGFpbmVyJ1xyXG4gICAgfVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gICAgQElucHV0KCkgdGl0bGU6IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoKSBkYXk6IFNjaGVkdWxlclZpZXdEYXk7XHJcblxyXG4gICAgQElucHV0KCkgaG91cjogU2NoZWR1bGVyVmlld0hvdXI7XHJcblxyXG4gICAgQElucHV0KCkgc2VnbWVudDogU2NoZWR1bGVyVmlld0hvdXJTZWdtZW50O1xyXG5cclxuICAgIEBJbnB1dCgpIGV2ZW50OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50O1xyXG5cclxuICAgIEBJbnB1dCgpIHRvb2x0aXBQbGFjZW1lbnQ6IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoKSBzaG93QWN0aW9uczogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgQElucHV0KCkgY3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gICAgQE91dHB1dCgpIGV2ZW50Q2xpY2tlZDogRXZlbnRFbWl0dGVyPHsgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQgfT4gPSBuZXcgRXZlbnRFbWl0dGVyPHsgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQgfT4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHsgICB9XHJcblxyXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc2VnbWVudC5oYXNCb3JkZXIgPSB0aGlzLmhvdXIuaGFzQm9yZGVyID0gIXRoaXMuZXZlbnQuZW5kc0FmdGVyU2VnbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy50aXRsZSA9IG1vbWVudCh0aGlzLmV2ZW50LnN0YXJ0KS5mb3JtYXQoJ2RkZGQgTCcpO1xyXG5cclxuICAgICAgICB0aGlzLmNoZWNrRW5hYmxlU3RhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNoZWNrRW5hYmxlU3RhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VnbWVudC5pc0Rpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF5LmhvdXJzLmZvckVhY2goKGhvdXI6IFNjaGVkdWxlclZpZXdIb3VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBob3VyLnNlZ21lbnRzLmZvckVhY2goKHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnQuZXZlbnRzLmZpbHRlcigoZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpID0+IGV2ZW50LmlkID09PSB0aGlzLmV2ZW50LmlkICYmIGlzU2FtZURheShldmVudC5zdGFydCwgdGhpcy5ldmVudC5zdGFydCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKChldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuaXNEaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoaWdobGlnaHRFdmVudCgpOiB2b2lkIHtcclxuICAgICAgICAvLyBsZXQgZXZlbnRzOiBDYWxlbmRhclNjaGVkdWxlckV2ZW50W10gPSB0aGlzLmRheS5ob3Vyc1xyXG4gICAgICAgIC8vICAgIC5maWx0ZXIoaCA9PiBoLnNlZ21lbnRzLnNvbWUocyA9PiBzLmV2ZW50cy5zb21lKGUgPT4gZS5pZCA9PT0gdGhpcy5ldmVudC5pZCkpKVxyXG4gICAgICAgIC8vICAgIC5tYXAoaCA9PlxyXG4gICAgICAgIC8vICAgICAgICBoLnNlZ21lbnRzLm1hcChzID0+XHJcbiAgICAgICAgLy8gICAgICAgICAgICBzLmV2ZW50cy5maWx0ZXIoZSA9PiBlLmlkID09PSB0aGlzLmV2ZW50LmlkKVxyXG4gICAgICAgIC8vICAgICAgICApLnJlZHVjZSgocHJldiwgY3VycikgPT4gcHJldi5jb25jYXQoY3VycikpXHJcbiAgICAgICAgLy8gICAgKVxyXG4gICAgICAgIC8vICAgIC5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHByZXYuY29uY2F0KGN1cnIpKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXkuaG91cnMuZm9yRWFjaCgoaG91cjogU2NoZWR1bGVyVmlld0hvdXIpID0+IHtcclxuICAgICAgICAgICAgaG91ci5zZWdtZW50cy5mb3JFYWNoKChzZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlZ21lbnQuZXZlbnRzLmZpbHRlcigoZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpID0+IGV2ZW50LmlkID09PSB0aGlzLmV2ZW50LmlkICYmIGlzU2FtZURheShldmVudC5zdGFydCwgdGhpcy5ldmVudC5zdGFydCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKGV2ZW50OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmlzSG92ZXJlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVuaGlnaGxpZ2h0RXZlbnQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kYXkuaG91cnMuZm9yRWFjaCgoaG91cjogU2NoZWR1bGVyVmlld0hvdXIpID0+IHtcclxuICAgICAgICAgICAgaG91ci5zZWdtZW50cy5mb3JFYWNoKChzZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlZ21lbnQuZXZlbnRzLmZpbHRlcigoZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpID0+IGV2ZW50LmlkID09PSB0aGlzLmV2ZW50LmlkICYmIGlzU2FtZURheShldmVudC5zdGFydCwgdGhpcy5ldmVudC5zdGFydCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKGV2ZW50OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmlzSG92ZXJlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIHNhbWVFdmVudEluUHJldmlvdXNIb3VyKGRheTogU2NoZWR1bGVyVmlld0RheSwgaG91cjogU2NoZWR1bGVyVmlld0hvdXIpOiBDYWxlbmRhclNjaGVkdWxlckV2ZW50IHtcclxuICAgIC8vICAgIGxldCBob3VySW5kZXg6IG51bWJlciA9IGRheS5ob3Vycy5pbmRleE9mKGhvdXIpO1xyXG4gICAgLy8gICAgbGV0IHByZXZpb3VzSG91ciA9IGRheS5ob3Vyc1tob3VySW5kZXggLSAxXTtcclxuICAgIC8vICAgIGlmIChwcmV2aW91c0hvdXIpIHtcclxuICAgIC8vICAgICAgICBsZXQgcHJldmlvdXNTZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQgPSBwcmV2aW91c0hvdXIuc2VnbWVudHNbcHJldmlvdXNIb3VyLnNlZ21lbnRzLmxlbmd0aCAtIDFdO1xyXG4gICAgLy8gICAgICAgIHJldHVybiBwcmV2aW91c1NlZ21lbnQuZXZlbnRzW3ByZXZpb3VzU2VnbWVudC5ldmVudHMubGVuZ3RoIC0gMV07XHJcbiAgICAvLyAgICB9XHJcbiAgICAvLyAgICByZXR1cm4gbnVsbDtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIHNhbWVFdmVudEluUHJldmlvdXNTZWdtZW50KHNlZ21lbnRJbmRleDogbnVtYmVyKTogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB7XHJcbiAgICAvLyAgICBsZXQgcHJldmlvdXNTZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQgPSB0aGlzLmhvdXIuc2VnbWVudHNbc2VnbWVudEluZGV4IC0gMV07XHJcbiAgICAvLyAgICBpZiAocHJldmlvdXNTZWdtZW50KSB7XHJcbiAgICAvLyAgICAgICAgcmV0dXJuIHByZXZpb3VzU2VnbWVudC5ldmVudHNbcHJldmlvdXNTZWdtZW50LmV2ZW50cy5sZW5ndGggLSAxXTtcclxuICAgIC8vICAgIH1cclxuICAgIC8vICAgIHJldHVybiBudWxsO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHByaXZhdGUgc2FtZUV2ZW50SW5OZXh0SG91cigpOiBDYWxlbmRhclNjaGVkdWxlckV2ZW50IHtcclxuICAgIC8vICAgIGxldCBob3VySW5kZXg6IG51bWJlciA9IHRoaXMuZGF5LmhvdXJzLmluZGV4T2YodGhpcy5ob3VyKTtcclxuICAgIC8vICAgIGxldCBuZXh0SG91cjogU2NoZWR1bGVyVmlld0hvdXIgPSB0aGlzLmRheS5ob3Vyc1tob3VySW5kZXggKyAxXTtcclxuICAgIC8vICAgIGlmIChuZXh0SG91cikge1xyXG4gICAgLy8gICAgICAgIGxldCBuZXh0U2VnbWVudDogU2NoZWR1bGVyVmlld0hvdXJTZWdtZW50ID0gbmV4dEhvdXIuc2VnbWVudHNbMF07XHJcbiAgICAvLyAgICAgICAgcmV0dXJuIG5leHRTZWdtZW50LmV2ZW50c1swXTtcclxuICAgIC8vICAgIH1cclxuICAgIC8vICAgIHJldHVybiBudWxsO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHByaXZhdGUgc2FtZUV2ZW50SW5OZXh0U2VnbWVudChzZWdtZW50SW5kZXg6IG51bWJlcik6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQge1xyXG4gICAgLy8gICAgbGV0IG5leHRTZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQgPSB0aGlzLmhvdXIuc2VnbWVudHNbc2VnbWVudEluZGV4ICsgMV07XHJcbiAgICAvLyAgICBpZiAobmV4dFNlZ21lbnQpIHtcclxuICAgIC8vICAgICAgICByZXR1cm4gbmV4dFNlZ21lbnQuZXZlbnRzWzBdO1xyXG4gICAgLy8gICAgfVxyXG4gICAgLy8gICAgcmV0dXJuIG51bGw7XHJcbiAgICAvLyB9XHJcbn1cclxuIl19