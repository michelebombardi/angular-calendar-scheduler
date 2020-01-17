import { WeekViewHourSegment } from 'calendar-utils';
import { SchedulerViewEvent } from './scheduler-view-event.model';

export interface SchedulerViewHourSegment {
    segment: WeekViewHourSegment;
    date: Date;
    events: SchedulerViewEvent[];
    isDisabled: boolean;
    isCancelled: boolean;
    backgroundColor?: string;
    cssClass?: string;
}
