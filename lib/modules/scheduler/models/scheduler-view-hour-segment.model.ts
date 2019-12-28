import { WeekViewHourSegment } from 'calendar-utils';
import { CalendarSchedulerEvent } from './calendar-scheduler-event.model';

export interface SchedulerViewHourSegment {
    segment: WeekViewHourSegment;
    date: Date;
    events: CalendarSchedulerEvent[];
    isDisabled: boolean;
    isCancelled: boolean;
    backgroundColor?: string;
    cssClass?: string;
}
