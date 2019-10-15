import { DayViewHourSegment } from 'calendar-utils';
import { CalendarSchedulerEvent } from './calendar-scheduler-event.model';

export interface SchedulerViewHourSegment {
    segment: DayViewHourSegment;
    date: Date;
    events: CalendarSchedulerEvent[];
    isDisabled: boolean;
    isCancelled: boolean;
    backgroundColor?: string;
    cssClass?: string;
}
