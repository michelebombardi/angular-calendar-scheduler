import { OnInit, EventEmitter, TemplateRef } from '@angular/core';
import { SchedulerViewDay, SchedulerViewHour, SchedulerViewHourSegment, CalendarSchedulerEvent } from './calendar-scheduler-view.component';
export declare class CalendarSchedulerCellComponent implements OnInit {
    title: string;
    day: SchedulerViewDay;
    hour: SchedulerViewHour;
    locale: string;
    tooltipPlacement: string;
    showActions: boolean;
    customTemplate: TemplateRef<any>;
    eventTemplate: TemplateRef<any>;
    highlightSegment: EventEmitter<any>;
    unhighlightSegment: EventEmitter<any>;
    segmentClicked: EventEmitter<{
        segment: SchedulerViewHourSegment;
    }>;
    eventClicked: EventEmitter<{
        event: CalendarSchedulerEvent;
    }>;
    ngOnInit(): void;
    onMouseEnter(mouseEvent: MouseEvent, segment: SchedulerViewHourSegment, event: CalendarSchedulerEvent): void;
    onMouseLeave(mouseEvent: MouseEvent, segment: SchedulerViewHourSegment, event: CalendarSchedulerEvent): void;
    /**
     * @hidden
     */
    onSegmentClick(mouseEvent: MouseEvent, segment: SchedulerViewHourSegment): void;
    /**
     * @hidden
     */
    onEventClick(mouseEvent: MouseEvent, event: CalendarSchedulerEvent): void;
}
