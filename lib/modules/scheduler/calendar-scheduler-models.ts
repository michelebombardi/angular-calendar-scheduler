import { CalendarEventTimesChangedEventType } from 'angular-calendar';
import { EventColor, DayViewHourSegment, DayViewHour } from 'calendar-utils';

export interface SchedulerView {
    days: SchedulerViewDay[];
    period: SchedulerViewPeriod;
}

export interface SchedulerViewPeriod {
    start: Date;
    end: Date;
    events: CalendarSchedulerEvent[];
}

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

export interface SchedulerViewHour {
    hour: DayViewHour;
    date: Date;
    events: CalendarSchedulerEvent[];
    segments: SchedulerViewHourSegment[];
    backgroundColor?: string;
    cssClass?: string;
}

export interface SchedulerViewHourSegment {
    segment: DayViewHourSegment;
    date: Date;
    events: CalendarSchedulerEvent[];
    isDisabled: boolean;
    backgroundColor?: string;
    cssClass?: string;
}

export interface SchedulerViewEvent {
    event: CalendarSchedulerEvent;
    top?: number;
    height?: number;
    left?: number;
    width?: number;
    startsBeforeDay?: boolean;
    endsAfterDay?: boolean;
    isProcessed?: boolean;
}

export interface CalendarSchedulerEvent {
    id: string;
    start: Date;
    end?: Date;
    title: string;
    content?: string;
    color: EventColor;
    actions?: CalendarSchedulerEventAction[];
    status?: CalendarSchedulerEventStatus;
    cssClass?: string;
    isDisabled?: boolean;
    isClickable?: boolean;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;
}

export type CalendarSchedulerEventStatus = 'ok' | 'warning' | 'danger';

export interface CalendarSchedulerEventAction {
    when?: 'enabled' | 'disabled';
    label: string;
    title: string;
    cssClass?: string;
    onClick(event: CalendarSchedulerEvent): void;
}

export interface SchedulerEventTimesChangedEvent {
    event: CalendarSchedulerEvent;
    newStart: Date;
    newEnd?: Date;
    type?: CalendarEventTimesChangedEventType;
}