import { SchedulerViewEvent } from './scheduler-view-event.model';
import { SchedulerViewHour } from './scheduler-view-hour-model';

export interface SchedulerViewDay {
    date: Date;
    events: SchedulerViewEvent[];
    isPast: boolean;
    isToday: boolean;
    isFuture: boolean;
    isWeekend: boolean;
    inMonth: boolean;
    backgroundColor?: string;
    cssClass?: string;
    hours: SchedulerViewHour[];
}
