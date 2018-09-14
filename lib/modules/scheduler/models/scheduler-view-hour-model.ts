import { DayViewHour } from 'calendar-utils';
import { CalendarSchedulerEvent } from './calendar-scheduler-event.model';
import { SchedulerViewHourSegment } from './scheduler-view-hour-segment.model';

export interface SchedulerViewHour {
    hour: DayViewHour;
    date: Date;
    events: CalendarSchedulerEvent[];
    segments: SchedulerViewHourSegment[];
    backgroundColor?: string;
    cssClass?: string;
}
