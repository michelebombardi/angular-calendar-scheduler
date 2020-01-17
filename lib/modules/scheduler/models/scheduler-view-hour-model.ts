import { WeekViewHour } from 'calendar-utils';
import { SchedulerViewHourSegment } from './scheduler-view-hour-segment.model';
import { SchedulerViewEvent } from './scheduler-view-event.model';

export interface SchedulerViewHour {
    hour: WeekViewHour;
    date: Date;
    events: SchedulerViewEvent[];
    segments: SchedulerViewHourSegment[];
    backgroundColor?: string;
    cssClass?: string;
}
