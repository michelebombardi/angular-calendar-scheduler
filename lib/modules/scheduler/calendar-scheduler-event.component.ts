import { Component, Input, Output, EventEmitter, TemplateRef, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import {
    SchedulerViewDay,
    SchedulerViewHour,
    SchedulerViewHourSegment,
    CalendarSchedulerEvent,
    SchedulerViewEvent
} from './calendar-scheduler-view.component';
import {
    isSameDay
} from 'date-fns';

// WORKAROUND: https://github.com/dherges/ng-packagr/issues/217#issuecomment-339460255
import * as momentImported from 'moment';
const moment = momentImported;

/**
 * [mwlCalendarTooltip]="event.title | calendarEventTitle:'weekTooltip':event"
 * [tooltipPlacement]="tooltipPlacement"
 */
@Component({
    selector: 'calendar-scheduler-event',
    template: `
        <ng-template #defaultTemplate>
            <div class="cal-scheduler-event"
                [title]="title"
                [class.cal-disabled]="event.event.isDisabled"
                [class.cal-not-clickable]="!event.event.isClickable"
                [class.cal-draggable]="event.event.draggable"
                [class.cal-starts-before-day]="event.startsBeforeDay"
                [class.cal-ends-after-day]="event.endsAfterDay"
                [style.backgroundColor]="event.event.color?.secondary"
                [style.borderColor]="event.event.color?.primary"
                (mwlClick)="onEventClick($event, event.event)"
                (mouseenter)="onMouseEnter()"
                (mouseleave)="onMouseLeave()">
                <calendar-scheduler-event-title
                    view="week"
                    [event]="event.event"
                    [showStatus]="showStatus"
                    [customTemplate]="eventTitleTemplate">
                </calendar-scheduler-event-title>
                <calendar-scheduler-event-content
                    [event]="event.event">
                </calendar-scheduler-event-content>
                <calendar-scheduler-event-actions [event]="event.event" *ngIf="showActions && event.event.isClickable"></calendar-scheduler-event-actions>
                <calendar-scheduler-event-actions [event]="event.event" *ngIf="showActions && event.event.isDisabled"></calendar-scheduler-event-actions>
            </div>
        </ng-template>
        <ng-template
            [ngTemplateOutlet]="customTemplate || defaultTemplate"
            [ngTemplateOutletContext]="{
                day: day,
                event: event,
                tooltipPlacement: tooltipPlacement,
                showActions: showActions,
                showStatus: showStatus,
                eventTitleTemplate: eventTitleTemplate,
                eventClicked: eventClicked
            }">
        </ng-template>
    `,
    host: {
        '[style.height.%]': '100'
    }
})
export class CalendarSchedulerEventComponent implements OnInit {
    @Input() title: string;

    @Input() day: SchedulerViewDay;

    @Input() event: SchedulerViewEvent;

    @Input() tooltipPlacement: string;

    @Input() showActions: boolean = true;

    @Input() showStatus: boolean = true;

    @Input() customTemplate: TemplateRef<any>;

    @Input() eventTitleTemplate: TemplateRef<any>;

    @Output() eventClicked: EventEmitter<{ event: CalendarSchedulerEvent }> = new EventEmitter<{ event: CalendarSchedulerEvent }>();

    constructor(private renderer: Renderer2) {   }

    public ngOnInit(): void {
        this.title = `${this.event.event.title}, ${moment(this.event.event.start).format('dddd L, LT')}`;
    }

    onMouseEnter(): void {
        // Maybe do something
    }

    onMouseLeave(): void {
        // Maybe do something
    }

    /**
     * @hidden
     */
    onEventClick(mouseEvent: MouseEvent, event: CalendarSchedulerEvent): void {
        if (mouseEvent.stopPropagation) {
            mouseEvent.stopPropagation();
        }
        if (event.isClickable) {
            this.eventClicked.emit({ event: event });
        }
    }
}
