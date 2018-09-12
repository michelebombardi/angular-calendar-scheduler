import { Component, Input, Output, EventEmitter, TemplateRef, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import {
    SchedulerViewDay,
    SchedulerViewHour,
    SchedulerViewHourSegment,
    CalendarSchedulerEvent
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
            <calendar-scheduler-event-title
                [event]="event"
                view="week"
                [showStatus]="showStatus"
                [customTemplate]="eventTitleTemplate">
            </calendar-scheduler-event-title>
            <calendar-scheduler-event-content
                [event]="event">
            </calendar-scheduler-event-content>
            <calendar-scheduler-event-actions [event]="event" *ngIf="showActions && event.isClickable"></calendar-scheduler-event-actions>
            <calendar-scheduler-event-actions [event]="event" *ngIf="showActions && event.isDisabled"></calendar-scheduler-event-actions>
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
        'class': 'cal-scheduler-event',
        '[title]': 'title',
        '[class.hovered]': 'event.isHovered',
        '[class.cal-disabled]': 'event.isDisabled',
        '[class.cal-not-clickable]': '!event.isClickable',
        '[class.cal-draggable]': 'event.draggable',
        '[class.cal-starts-before-day]': 'event.startsBeforeDay',
        '[class.cal-ends-after-day]': 'event.endsAfterDay',
        '[style.backgroundColor]': 'event.color.primary',
        '(mwlClick)': 'eventClicked.emit({event: event})',
        '(mouseenter)': 'highlightEvent()',
        '(mouseleave)': 'unhighlightEvent()'
    }
})
export class CalendarSchedulerEventComponent implements OnInit {
    @Input() title: string;

    @Input() day: SchedulerViewDay;

    @Input() event: CalendarSchedulerEvent;

    @Input() tooltipPlacement: string;

    @Input() showActions: boolean = true;

    @Input() showStatus: boolean = true;

    @Input() customTemplate: TemplateRef<any>;

    @Input() eventTitleTemplate: TemplateRef<any>;

    @Output() eventClicked: EventEmitter<{ event: CalendarSchedulerEvent }> = new EventEmitter<{ event: CalendarSchedulerEvent }>();

    constructor(private renderer: Renderer2) {   }

    public ngOnInit(): void {
        this.title = moment(this.event.start).format('dddd L, LT');
    }

    highlightEvent(): void {
        this.day.hours.forEach((hour: SchedulerViewHour) => {
            hour.segments.forEach((segment: SchedulerViewHourSegment) => {
                segment.events.filter((event: CalendarSchedulerEvent) => event.id === this.event.id && isSameDay(event.start, this.event.start))
                    .forEach((event: CalendarSchedulerEvent) => {
                        event.isHovered = true;
                    });
            });
        });
    }

    unhighlightEvent(): void {
        this.day.hours.forEach((hour: SchedulerViewHour) => {
            hour.segments.forEach((segment: SchedulerViewHourSegment) => {
                segment.events.filter((event: CalendarSchedulerEvent) => event.id === this.event.id && isSameDay(event.start, this.event.start))
                    .forEach((event: CalendarSchedulerEvent) => {
                        event.isHovered = false;
                    });
            });
        });
    }
}
