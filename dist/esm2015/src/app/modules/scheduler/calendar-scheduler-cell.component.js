/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import * as momentImported from 'moment';
/** @type {?} */
const moment = momentImported;
export class CalendarSchedulerCellComponent {
    constructor() {
        this.showActions = true;
        this.highlightSegment = new EventEmitter();
        this.unhighlightSegment = new EventEmitter();
        this.segmentClicked = new EventEmitter();
        this.eventClicked = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.title = moment(this.day.date).format('dddd L');
    }
    /**
     * @param {?} mouseEvent
     * @param {?} segment
     * @param {?} event
     * @return {?}
     */
    onMouseEnter(mouseEvent, segment, event) {
        if (!event.isDisabled && !segment.isDisabled) {
            this.highlightSegment.emit({ event: event });
        }
    }
    /**
     * @param {?} mouseEvent
     * @param {?} segment
     * @param {?} event
     * @return {?}
     */
    onMouseLeave(mouseEvent, segment, event) {
        if (!event.isDisabled && !segment.isDisabled) {
            this.unhighlightSegment.emit({ event: event });
        }
    }
    /**
     * @hidden
     * @param {?} mouseEvent
     * @param {?} segment
     * @return {?}
     */
    onSegmentClick(mouseEvent, segment) {
        if (mouseEvent.stopPropagation) {
            mouseEvent.stopPropagation();
        }
        if (segment.events.length === 0) {
            this.segmentClicked.emit({ segment: segment });
        }
    }
    /**
     * @hidden
     * @param {?} mouseEvent
     * @param {?} event
     * @return {?}
     */
    onEventClick(mouseEvent, event) {
        if (mouseEvent.stopPropagation) {
            mouseEvent.stopPropagation();
        }
        if (event.isClickable) {
            this.eventClicked.emit({ event: event });
        }
    }
}
CalendarSchedulerCellComponent.decorators = [
    { type: Component, args: [{
                // [class.no-border]': '!day.hasBorder
                selector: 'calendar-scheduler-cell',
                template: `
        <ng-template #defaultTemplate>
            <div class="cal-scheduler-segments" *ngIf="hour.segments.length > 0"
                [ngClass]="hour?.cssClass"
                [class.no-border]="!hour.hasBorder">
                <div class="cal-scheduler-segment"
                    *ngFor="let segment of hour.segments; let si = index"
                    [title]="title"
                    [ngClass]="segment?.cssClass"
                    [class.has-events]="segment.events.length > 0"
                    [class.cal-disabled]="segment.isDisabled"
                    [style.backgroundColor]="segment.backgroundColor"
                    [class.no-border]="!segment.hasBorder"
                    (mwlClick)="onSegmentClick($event, segment)">

                    <div class="cal-scheduler-events" *ngIf="segment.events.length > 0">
                        <calendar-scheduler-event
                            *ngFor="let event of segment.events"
                            [day]="day"
                            [hour]="hour"
                            [segment]="segment"
                            [event]="event"
                            (mouseenter)="onMouseEnter($event, segment, event)"
                            (mouseleave)="onMouseLeave($event, segment, event)"
                            [tooltipPlacement]="tooltipPlacement"
                            [showActions]="showActions"
                            [customTemplate]="eventTemplate"
                            (eventClicked)="onEventClick($event, event)">
                        </calendar-scheduler-event>
                    </div>
                </div>
            </div>
        </ng-template>
        <ng-template
            [ngTemplateOutlet]="customTemplate || defaultTemplate"
            [ngTemplateOutletContext]="{
                day: day,
                hour: hour,
                locale: locale,
                tooltipPlacement: tooltipPlacement,
                showActions: showActions,
                eventTemplate: eventTemplate,
                highlightSegment: highlightSegment,
                unhighlightSegment: unhighlightSegment,
                segmentClicked: segmentClicked,
                eventClicked: eventClicked
            }">
        </ng-template>
    `,
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItc2NoZWR1bGVyLWNlbGwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIvIiwic291cmNlcyI6WyJzcmMvYXBwL21vZHVsZXMvc2NoZWR1bGVyL2NhbGVuZGFyLXNjaGVkdWxlci1jZWxsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQWUsTUFBTSxlQUFlLENBQUM7QUFTekcsT0FBTyxLQUFLLGNBQWMsTUFBTSxRQUFRLENBQUM7O0FBQ3pDLE1BQU0sTUFBTSxHQUFHLGNBQWMsQ0FBQztBQWdFOUIsTUFBTTs7MkJBWThCLElBQUk7Z0NBTVksSUFBSSxZQUFZLEVBQUU7a0NBRWhCLElBQUksWUFBWSxFQUFFOzhCQUVZLElBQUksWUFBWSxFQUF5Qzs0QkFFL0QsSUFBSSxZQUFZLEVBQXFDOzs7OztJQUcvSCxRQUFRO1FBQ0osSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDdkQ7Ozs7Ozs7SUFFRCxZQUFZLENBQUMsVUFBc0IsRUFBRSxPQUFpQyxFQUFFLEtBQTZCO1FBQ2pHLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUNoRDtLQUNKOzs7Ozs7O0lBRUQsWUFBWSxDQUFDLFVBQXNCLEVBQUUsT0FBaUMsRUFBRSxLQUE2QjtRQUNqRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDbEQ7S0FDSjs7Ozs7OztJQUtELGNBQWMsQ0FBQyxVQUFzQixFQUFFLE9BQWlDO1FBQ3BFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzdCLFVBQVUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUNoQztRQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUNsRDtLQUNKOzs7Ozs7O0lBS0QsWUFBWSxDQUFDLFVBQXNCLEVBQUUsS0FBNkI7UUFDOUQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDN0IsVUFBVSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQ2hDO1FBQ0QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUM1QztLQUNKOzs7WUFoSUosU0FBUyxTQUFDOztnQkFDUCxRQUFRLEVBQUUseUJBQXlCO2dCQUNuQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQWdEVDtnQkFDRCxJQUFJLEVBQUU7b0JBQ0YsT0FBTyxFQUFFLG9CQUFvQjtvQkFDN0Isa0JBQWtCLEVBQUUsWUFBWTtvQkFDaEMsbUJBQW1CLEVBQUUsYUFBYTtvQkFDbEMsb0JBQW9CLEVBQUUsY0FBYztvQkFDcEMscUJBQXFCLEVBQUUsZUFBZTtvQkFDdEMsc0JBQXNCLEVBQUUsYUFBYTtvQkFDckMsdUJBQXVCLEVBQUUsY0FBYztvQkFDdkMseUJBQXlCLEVBQUUscUJBQXFCO2lCQUNuRDthQUNKOzs7b0JBR0ksS0FBSztrQkFFTCxLQUFLO21CQUVMLEtBQUs7cUJBRUwsS0FBSzsrQkFFTCxLQUFLOzBCQUVMLEtBQUs7NkJBRUwsS0FBSzs0QkFFTCxLQUFLOytCQUVMLE1BQU07aUNBRU4sTUFBTTs2QkFFTixNQUFNOzJCQUVOLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBUZW1wbGF0ZVJlZiwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICAgIFNjaGVkdWxlclZpZXdEYXksXHJcbiAgICBTY2hlZHVsZXJWaWV3SG91cixcclxuICAgIFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRcclxufSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci12aWV3LmNvbXBvbmVudCc7XHJcblxyXG4vLyBXT1JLQVJPVU5EOiBodHRwczovL2dpdGh1Yi5jb20vZGhlcmdlcy9uZy1wYWNrYWdyL2lzc3Vlcy8yMTcjaXNzdWVjb21tZW50LTMzOTQ2MDI1NVxyXG5pbXBvcnQgKiBhcyBtb21lbnRJbXBvcnRlZCBmcm9tICdtb21lbnQnO1xyXG5jb25zdCBtb21lbnQgPSBtb21lbnRJbXBvcnRlZDtcclxuXHJcbkBDb21wb25lbnQoeyAvLyBbY2xhc3Mubm8tYm9yZGVyXSc6ICchZGF5Lmhhc0JvcmRlclxyXG4gICAgc2VsZWN0b3I6ICdjYWxlbmRhci1zY2hlZHVsZXItY2VsbCcsXHJcbiAgICB0ZW1wbGF0ZTogYFxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdFRlbXBsYXRlPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXNjaGVkdWxlci1zZWdtZW50c1wiICpuZ0lmPVwiaG91ci5zZWdtZW50cy5sZW5ndGggPiAwXCJcclxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cImhvdXI/LmNzc0NsYXNzXCJcclxuICAgICAgICAgICAgICAgIFtjbGFzcy5uby1ib3JkZXJdPVwiIWhvdXIuaGFzQm9yZGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXNjaGVkdWxlci1zZWdtZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgc2VnbWVudCBvZiBob3VyLnNlZ21lbnRzOyBsZXQgc2kgPSBpbmRleFwiXHJcbiAgICAgICAgICAgICAgICAgICAgW3RpdGxlXT1cInRpdGxlXCJcclxuICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJzZWdtZW50Py5jc3NDbGFzc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgW2NsYXNzLmhhcy1ldmVudHNdPVwic2VnbWVudC5ldmVudHMubGVuZ3RoID4gMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgW2NsYXNzLmNhbC1kaXNhYmxlZF09XCJzZWdtZW50LmlzRGlzYWJsZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIFtzdHlsZS5iYWNrZ3JvdW5kQ29sb3JdPVwic2VnbWVudC5iYWNrZ3JvdW5kQ29sb3JcIlxyXG4gICAgICAgICAgICAgICAgICAgIFtjbGFzcy5uby1ib3JkZXJdPVwiIXNlZ21lbnQuaGFzQm9yZGVyXCJcclxuICAgICAgICAgICAgICAgICAgICAobXdsQ2xpY2spPVwib25TZWdtZW50Q2xpY2soJGV2ZW50LCBzZWdtZW50KVwiPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXNjaGVkdWxlci1ldmVudHNcIiAqbmdJZj1cInNlZ21lbnQuZXZlbnRzLmxlbmd0aCA+IDBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGNhbGVuZGFyLXNjaGVkdWxlci1ldmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IGV2ZW50IG9mIHNlZ21lbnQuZXZlbnRzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkYXldPVwiZGF5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtob3VyXT1cImhvdXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3NlZ21lbnRdPVwic2VnbWVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZXZlbnRdPVwiZXZlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG1vdXNlZW50ZXIpPVwib25Nb3VzZUVudGVyKCRldmVudCwgc2VnbWVudCwgZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtb3VzZWxlYXZlKT1cIm9uTW91c2VMZWF2ZSgkZXZlbnQsIHNlZ21lbnQsIGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdG9vbHRpcFBsYWNlbWVudF09XCJ0b29sdGlwUGxhY2VtZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzaG93QWN0aW9uc109XCJzaG93QWN0aW9uc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiZXZlbnRUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZXZlbnRDbGlja2VkKT1cIm9uRXZlbnRDbGljaygkZXZlbnQsIGV2ZW50KVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZVxyXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxyXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie1xyXG4gICAgICAgICAgICAgICAgZGF5OiBkYXksXHJcbiAgICAgICAgICAgICAgICBob3VyOiBob3VyLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxlOiBsb2NhbGUsXHJcbiAgICAgICAgICAgICAgICB0b29sdGlwUGxhY2VtZW50OiB0b29sdGlwUGxhY2VtZW50LFxyXG4gICAgICAgICAgICAgICAgc2hvd0FjdGlvbnM6IHNob3dBY3Rpb25zLFxyXG4gICAgICAgICAgICAgICAgZXZlbnRUZW1wbGF0ZTogZXZlbnRUZW1wbGF0ZSxcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodFNlZ21lbnQ6IGhpZ2hsaWdodFNlZ21lbnQsXHJcbiAgICAgICAgICAgICAgICB1bmhpZ2hsaWdodFNlZ21lbnQ6IHVuaGlnaGxpZ2h0U2VnbWVudCxcclxuICAgICAgICAgICAgICAgIHNlZ21lbnRDbGlja2VkOiBzZWdtZW50Q2xpY2tlZCxcclxuICAgICAgICAgICAgICAgIGV2ZW50Q2xpY2tlZDogZXZlbnRDbGlja2VkXHJcbiAgICAgICAgICAgIH1cIj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgYCxcclxuICAgIGhvc3Q6IHtcclxuICAgICAgICAnY2xhc3MnOiAnY2FsLXNjaGVkdWxlci1jZWxsJyxcclxuICAgICAgICAnW2NsYXNzLmNhbC1wYXN0XSc6ICdkYXkuaXNQYXN0JyxcclxuICAgICAgICAnW2NsYXNzLmNhbC10b2RheV0nOiAnZGF5LmlzVG9kYXknLFxyXG4gICAgICAgICdbY2xhc3MuY2FsLWZ1dHVyZV0nOiAnZGF5LmlzRnV0dXJlJyxcclxuICAgICAgICAnW2NsYXNzLmNhbC13ZWVrZW5kXSc6ICdkYXkuaXNXZWVrZW5kJyxcclxuICAgICAgICAnW2NsYXNzLmNhbC1pbi1tb250aF0nOiAnZGF5LmluTW9udGgnLFxyXG4gICAgICAgICdbY2xhc3MuY2FsLW91dC1tb250aF0nOiAnIWRheS5pbk1vbnRoJyxcclxuICAgICAgICAnW3N0eWxlLmJhY2tncm91bmRDb2xvcl0nOiAnZGF5LmJhY2tncm91bmRDb2xvcidcclxuICAgIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIENhbGVuZGFyU2NoZWR1bGVyQ2VsbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gICAgQElucHV0KCkgdGl0bGU6IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoKSBkYXk6IFNjaGVkdWxlclZpZXdEYXk7XHJcblxyXG4gICAgQElucHV0KCkgaG91cjogU2NoZWR1bGVyVmlld0hvdXI7XHJcblxyXG4gICAgQElucHV0KCkgbG9jYWxlOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KCkgdG9vbHRpcFBsYWNlbWVudDogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dCgpIHNob3dBY3Rpb25zOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICBASW5wdXQoKSBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgICBASW5wdXQoKSBldmVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICAgIEBPdXRwdXQoKSBoaWdobGlnaHRTZWdtZW50OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBAT3V0cHV0KCkgdW5oaWdobGlnaHRTZWdtZW50OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBAT3V0cHV0KCkgc2VnbWVudENsaWNrZWQ6IEV2ZW50RW1pdHRlcjx7IHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCB9PiA9IG5ldyBFdmVudEVtaXR0ZXI8eyBzZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQgfT4oKTtcclxuXHJcbiAgICBAT3V0cHV0KCkgZXZlbnRDbGlja2VkOiBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB9PiA9IG5ldyBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB9PigpO1xyXG5cclxuXHJcbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnRpdGxlID0gbW9tZW50KHRoaXMuZGF5LmRhdGUpLmZvcm1hdCgnZGRkZCBMJyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZUVudGVyKG1vdXNlRXZlbnQ6IE1vdXNlRXZlbnQsIHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCwgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIWV2ZW50LmlzRGlzYWJsZWQgJiYgIXNlZ21lbnQuaXNEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodFNlZ21lbnQuZW1pdCh7IGV2ZW50OiBldmVudCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZUxlYXZlKG1vdXNlRXZlbnQ6IE1vdXNlRXZlbnQsIHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCwgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIWV2ZW50LmlzRGlzYWJsZWQgJiYgIXNlZ21lbnQuaXNEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnVuaGlnaGxpZ2h0U2VnbWVudC5lbWl0KHsgZXZlbnQ6IGV2ZW50IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBoaWRkZW5cclxuICAgICAqL1xyXG4gICAgb25TZWdtZW50Q2xpY2sobW91c2VFdmVudDogTW91c2VFdmVudCwgc2VnbWVudDogU2NoZWR1bGVyVmlld0hvdXJTZWdtZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKG1vdXNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKSB7XHJcbiAgICAgICAgICAgIG1vdXNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VnbWVudC5ldmVudHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudENsaWNrZWQuZW1pdCh7IHNlZ21lbnQ6IHNlZ21lbnQgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGhpZGRlblxyXG4gICAgICovXHJcbiAgICBvbkV2ZW50Q2xpY2sobW91c2VFdmVudDogTW91c2VFdmVudCwgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAobW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24pIHtcclxuICAgICAgICAgICAgbW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGV2ZW50LmlzQ2xpY2thYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRDbGlja2VkLmVtaXQoeyBldmVudDogZXZlbnQgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==