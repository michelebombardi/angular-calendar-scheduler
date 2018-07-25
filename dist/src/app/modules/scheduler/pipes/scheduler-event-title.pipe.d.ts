import { PipeTransform } from '@angular/core';
import { CalendarSchedulerEvent } from '../calendar-scheduler-view.component';
import { SchedulerEventTitleFormatter } from '../formatters/scheduler-event-title-formatter.provider';
export declare class SchedulerEventTitlePipe implements PipeTransform {
    private schedulerEventTitle;
    constructor(schedulerEventTitle: SchedulerEventTitleFormatter);
    transform(title: string, titleType: string, event: CalendarSchedulerEvent): string;
}
