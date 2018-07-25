import { EventEmitter, TemplateRef, OnInit, Renderer2 } from '@angular/core';
import { SchedulerViewDay, SchedulerViewHour, SchedulerViewHourSegment, CalendarSchedulerEvent } from './calendar-scheduler-view.component';
/**
 * [mwlCalendarTooltip]="event.title | calendarEventTitle:'weekTooltip':event"
 * [tooltipPlacement]="tooltipPlacement"
 */
export declare class CalendarSchedulerEventComponent implements OnInit {
    private renderer;
    title: string;
    day: SchedulerViewDay;
    hour: SchedulerViewHour;
    segment: SchedulerViewHourSegment;
    event: CalendarSchedulerEvent;
    tooltipPlacement: string;
    showActions: boolean;
    customTemplate: TemplateRef<any>;
    eventClicked: EventEmitter<{
        event: CalendarSchedulerEvent;
    }>;
    constructor(renderer: Renderer2);
    ngOnInit(): void;
    private checkEnableState();
    highlightEvent(): void;
    unhighlightEvent(): void;
}
