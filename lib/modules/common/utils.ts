import {
    startOfDay,
    startOfWeek,
    startOfMonth,
    endOfDay,
    endOfWeek,
    endOfMonth,
    addDays,
    addWeeks,
    addMonths,
    subDays,
    subWeeks,
    subMonths
} from 'date-fns';
import {
    SchedulerViewPeriod,
    SchedulerViewEvent,
    SchedulerViewDay,
    CalendarSchedulerEvent,
    SchedulerViewHour,
    SchedulerViewHourSegment
} from '../scheduler/models';
import {
    DayViewHour,
    DayViewHourSegment
} from 'calendar-utils';
import {
    CalendarView
} from 'angular-calendar';
import { MINUTES_IN_HOUR } from '../scheduler/utils/calendar-scheduler-utils';

export function addPeriod(period: CalendarView, date: Date, amount: number): Date {
    return {
        day: addDays,
        week: addWeeks,
        month: addMonths
    }[period](date, amount);
}

export function subPeriod(period: CalendarView, date: Date, amount: number): Date {
    return {
        day: subDays,
        week: subWeeks,
        month: subMonths
    }[period](date, amount);
}

export function startOfPeriod(period: CalendarView, date: Date): Date {
    return {
        day: startOfDay,
        week: startOfWeek,
        month: startOfMonth
    }[period](date);
}

export function endOfPeriod(period: CalendarView, date: Date): Date {
    return {
        day: endOfDay,
        week: endOfWeek,
        month: endOfMonth
    }[period](date);
}


export const trackByDayOrEvent = (index: number, event: SchedulerViewEvent ) =>
    (event.event.id ? event.event.id : event.event);

export const trackByHourColumn = (index: number, day: SchedulerViewDay) =>
    day.hours[0] ? day.hours[0].segments[0].date.toISOString() : day;

export const trackByHour = (index: number, hour: DayViewHour | SchedulerViewHour) =>
    hour.segments[0].date.toISOString();

export const trackByHourSegment = (index: number, segment: DayViewHourSegment | SchedulerViewHourSegment) =>
    segment.date.toISOString();


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
