import { SchedulerViewDay } from './scheduler-view-day.model';
import { CalendarSchedulerEvent } from './calendar-scheduler-event.model';

export interface SchedulerView {
    days: SchedulerViewDay[];
    period: SchedulerViewPeriod;
}

export interface SchedulerViewPeriod {
    start: Date;
    end: Date;
    events: CalendarSchedulerEvent[];
}
