import { Component, Input, Output, EventEmitter, TemplateRef, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import {
    SchedulerViewDay,
    SchedulerViewHour,
    SchedulerViewHourSegment,
    CalendarSchedulerEvent
} from './calendar-scheduler-view.component';
import {
    isSameDay,
    differenceInMinutes
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
            <div #calEvent
                class="cal-scheduler-event"
                [title]="title"
                [class.hovered]="event.isHovered"
                [class.cal-disabled]="event.isDisabled"
                [class.cal-not-clickable]="!event.isClickable"
                [style.backgroundColor]="event.color.primary"
                [ngClass]="event?.cssClass"
                (mwlClick)="eventClicked.emit({event: event})"
                (mouseenter)="highlightEvent()"
                (mouseleave)="unhighlightEvent()">
                <calendar-scheduler-event-title
                    [event]="event"
                    view="week">
                </calendar-scheduler-event-title>
                <calendar-scheduler-event-content
                    [event]="event">
                </calendar-scheduler-event-content>
                <calendar-scheduler-event-actions [event]="event" *ngIf="showActions && event.isClickable"></calendar-scheduler-event-actions>
                <calendar-scheduler-event-actions [event]="event" *ngIf="showActions && event.isDisabled"></calendar-scheduler-event-actions>
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
})
export class CalendarSchedulerEventComponent implements OnInit {
    @ViewChild('calEvent') eventRef: ElementRef;

    @Input() title: string;

    @Input() day: SchedulerViewDay;

    @Input() hour: SchedulerViewHour;

    @Input() segment: SchedulerViewHourSegment;

    @Input() event: CalendarSchedulerEvent;

    @Input() tooltipPlacement: string;

    @Input() showActions: boolean = true;

    @Input() customTemplate: TemplateRef<any>;

    @Output() eventClicked: EventEmitter<{ event: CalendarSchedulerEvent }> = new EventEmitter<{ event: CalendarSchedulerEvent }>();

    constructor(private renderer: Renderer2) {   }

    public ngOnInit(): void {
        this.title = moment(this.event.start).format('dddd L');
    }

    highlightEvent(): void {
        // let events: CalendarSchedulerEvent[] = this.day.hours
        //    .filter(h => h.segments.some(s => s.events.some(e => e.id === this.event.id)))
        //    .map(h =>
        //        h.segments.map(s =>
        //            s.events.filter(e => e.id === this.event.id)
        //        ).reduce((prev, curr) => prev.concat(curr))
        //    )
        //    .reduce((prev, curr) => prev.concat(curr));

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
