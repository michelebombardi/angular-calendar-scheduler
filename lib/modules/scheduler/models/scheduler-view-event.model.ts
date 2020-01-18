import { CalendarSchedulerEvent } from './calendar-scheduler-event.model';

export interface SchedulerViewEvent {
    event: CalendarSchedulerEvent;
    top?: number;
    height?: number;
    left?: number;
    width?: number;
    startsBeforeDay?: boolean;
    endsAfterDay?: boolean;
}
