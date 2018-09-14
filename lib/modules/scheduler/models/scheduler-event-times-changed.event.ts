import { CalendarSchedulerEvent } from './calendar-scheduler-event.model';
import { CalendarEventTimesChangedEventType } from 'angular-calendar';

export interface SchedulerEventTimesChangedEvent {
    event: CalendarSchedulerEvent;
    newStart: Date;
    newEnd?: Date;
    type?: CalendarEventTimesChangedEventType;
}
