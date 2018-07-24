import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, HostBinding } from '@angular/core';
import {
    SchedulerViewDay,
    SchedulerViewHour,
    SchedulerViewHourSegment,
    CalendarSchedulerEvent
} from './calendar-scheduler-view.component';

// WORKAROUND: https://github.com/dherges/ng-packagr/issues/217#issuecomment-339460255
import * as momentImported from 'moment';
const moment = momentImported;

@Component({ // [class.no-border]': '!day.hasBorder
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
})
export class CalendarSchedulerCellComponent implements OnInit {

    @Input() title: string;

    @Input() day: SchedulerViewDay;

    @Input() hour: SchedulerViewHour;

    @Input() locale: string;

    @Input() tooltipPlacement: string;

    @Input() showActions: boolean = true;

    @Input() customTemplate: TemplateRef<any>;

    @Input() eventTemplate: TemplateRef<any>;

    @Output() highlightSegment: EventEmitter<any> = new EventEmitter();

    @Output() unhighlightSegment: EventEmitter<any> = new EventEmitter();

    @Output() segmentClicked: EventEmitter<{ segment: SchedulerViewHourSegment }> = new EventEmitter<{ segment: SchedulerViewHourSegment }>();

    @Output() eventClicked: EventEmitter<{ event: CalendarSchedulerEvent }> = new EventEmitter<{ event: CalendarSchedulerEvent }>();


    ngOnInit(): void {
        this.title = moment(this.day.date).format('dddd L');
    }

    onMouseEnter(mouseEvent: MouseEvent, segment: SchedulerViewHourSegment, event: CalendarSchedulerEvent): void {
        if (!event.isDisabled && !segment.isDisabled) {
            this.highlightSegment.emit({ event: event });
        }
    }

    onMouseLeave(mouseEvent: MouseEvent, segment: SchedulerViewHourSegment, event: CalendarSchedulerEvent): void {
        if (!event.isDisabled && !segment.isDisabled) {
            this.unhighlightSegment.emit({ event: event });
        }
    }

    /**
     * @hidden
     */
    onSegmentClick(mouseEvent: MouseEvent, segment: SchedulerViewHourSegment): void {
        if (mouseEvent.stopPropagation) {
            mouseEvent.stopPropagation();
        }

        if (segment.events.length === 0) {
            this.segmentClicked.emit({ segment: segment });
        }
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
