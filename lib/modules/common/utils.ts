import {
    SchedulerViewPeriod,
    SchedulerViewEvent,
    SchedulerViewDay,
    CalendarSchedulerEvent,
    SchedulerViewHour,
    SchedulerViewHourSegment
} from '../scheduler/models';
import {
    WeekViewHour
} from 'calendar-utils';
import {
    CalendarView,
    DateAdapter
} from 'angular-calendar';
import { MINUTES_IN_HOUR } from '../scheduler/utils/calendar-scheduler-utils';

export function addPeriod(dateAdapter: DateAdapter, period: CalendarView, date: Date, amount: number): Date {
    return {
        day: dateAdapter.addDays,
        week: dateAdapter.addWeeks,
        month: dateAdapter.addMonths
    }[period](date, amount);
}

export function subPeriod(dateAdapter: DateAdapter, period: CalendarView, date: Date, amount: number): Date {
    return {
        day: dateAdapter.subDays,
        week: dateAdapter.subWeeks,
        month: dateAdapter.subMonths
    }[period](date, amount);
}

export function startOfPeriod(dateAdapter: DateAdapter, period: CalendarView, date: Date): Date {
    return {
        day: dateAdapter.startOfDay,
        week: dateAdapter.startOfWeek,
        month: dateAdapter.startOfMonth
    }[period](date);
}

export function endOfPeriod(dateAdapter: DateAdapter, period: CalendarView, date: Date): Date {
    return {
        day: dateAdapter.endOfDay,
        week: dateAdapter.endOfWeek,
        month: dateAdapter.endOfMonth
    }[period](date);
}


export const trackByDayOrEvent = (index: number, event: SchedulerViewEvent ) =>
    (event.event.id ? event.event.id : event.event);

export const trackByHourColumn = (index: number, day: SchedulerViewDay) =>
    day.hours[0] ? day.hours[0].segments[0].date.toISOString() : day;

export const trackByHour = (index: number, hour: WeekViewHour | SchedulerViewHour) =>
    hour.segments[0].date.toISOString();

export const trackByHourSegment = (index: number, segment: SchedulerViewHourSegment) =>
    segment.date.toISOString();


export function getMinimumEventHeightInMinutes(hourSegments: number, hourSegmentHeight: number) {
    return (MINUTES_IN_HOUR / (hourSegments * hourSegmentHeight)) * hourSegmentHeight;
}

export function getDefaultEventEnd(dateAdapter: DateAdapter, event: CalendarSchedulerEvent, minimumMinutes: number): Date {
    return event.end ? event.end : dateAdapter.addMinutes(event.start, minimumMinutes);
}

export function roundToNearest(amount: number, precision: number): number {
    return Math.round(amount / precision) * precision;
}

export function getMinutesMoved(movedY: number, hourSegments: number, hourSegmentHeight: number, eventSnapSize: number): number {
    const draggedInPixelsSnapSize = roundToNearest(movedY, eventSnapSize || hourSegmentHeight);
    const pixelAmountInMinutes = MINUTES_IN_HOUR / (hourSegments * hourSegmentHeight);
    return draggedInPixelsSnapSize * pixelAmountInMinutes;
}

export function isDraggedWithinPeriod(newStart: Date, newEnd: Date, period: SchedulerViewPeriod): boolean {
    const end = newEnd || newStart;
    return (
        (period.start <= newStart && newStart <= period.end) ||
        (period.start <= end && end <= period.end)
    );
}

export function shouldFireDroppedEvent(dropEvent: { dropData?: { event?: CalendarSchedulerEvent; calendarId?: symbol } }, date: Date, calendarId: symbol): boolean {
    return (
        dropEvent.dropData &&
        dropEvent.dropData.event &&
        dropEvent.dropData.calendarId !== calendarId
    );
}
