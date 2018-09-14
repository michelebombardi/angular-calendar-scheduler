import {
    CalendarSchedulerEvent,
    SchedulerViewHour,
    SchedulerViewDay,
    SchedulerViewEvent,
    SchedulerViewHourSegment,
    SchedulerView,
    SchedulerViewPeriod
} from '../models';
import {
    DayViewHour,
    DayViewHourSegment
} from 'calendar-utils';
import {
    subMinutes
} from 'date-fns';
import { DateAdapter } from 'angular-calendar';


export enum DAYS_OF_WEEK {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6
}

const DEFAULT_WEEKEND_DAYS: number[] = [
    DAYS_OF_WEEK.SUNDAY,
    DAYS_OF_WEEK.SATURDAY
];

export const DAYS_IN_WEEK: number = 7;
export const HOURS_IN_DAY: number = 24;
export const MINUTES_IN_HOUR: number = 60;
export const SECONDS_IN_DAY: number = 60 * 60 * 24;

export const DEFAULT_HOUR_SEGMENT_HEIGHT_PX = 40;
export const DEFAULT_EVENT_WIDTH_PERCENT = 100;
export const DEFAULT_HOUR_SEGMENTS = 2;

export interface GetSchedulerViewHourGridArgs {
    viewDate: Date;
    hourSegments: number;
    dayStart: {
        hour: number;
        minute: number;
    };
    dayEnd: {
        hour: number;
        minute: number;
    };
}

export function getSchedulerViewHourGrid(dateAdapter: DateAdapter, args: GetSchedulerViewHourGridArgs): DayViewHour[] {
    const viewDate: Date = args.viewDate, hourSegments: number = args.hourSegments, dayStart: any = args.dayStart, dayEnd: any = args.dayEnd;
    const hours: DayViewHour[] = [];

    const startOfView: Date = dateAdapter.setMinutes(dateAdapter.setHours(dateAdapter.startOfDay(viewDate), dayStart.hour), dayStart.minute);
    const endOfView: Date = dateAdapter.setMinutes(dateAdapter.setHours(dateAdapter.startOfMinute(dateAdapter.endOfDay(viewDate)), dayEnd.hour), dayEnd.minute);
    const segmentDuration: number = MINUTES_IN_HOUR / hourSegments;
    const startOfViewDay: Date = dateAdapter.startOfDay(viewDate);

    const range = (start: number, end: number): number[] => Array.from({ length: ((end + 1) - start) }, (v, k) => k + start);
    const hoursInView: number[] = range(dayStart.hour, dayEnd.hour);

    hoursInView.forEach((hour: number, i: number) => {
        const segments = [];
        for (let j = 0; j < hourSegments; j++) {
            const date = dateAdapter.addMinutes(dateAdapter.addHours(startOfViewDay, hour), j * segmentDuration);
            if (date >= startOfView && date < endOfView) {
                segments.push({
                    date: date,
                    isStart: j === 0
                });
            }
        }
        if (segments.length > 0) {
            hours.push(<DayViewHour>{ segments: segments });
        }
    });
    return hours;
}

export interface GetSchedulerViewArgs {
    events?: CalendarSchedulerEvent[];
    viewDate: Date;
    hourSegments: 1 | 2 | 4 | 6;
    weekStartsOn: number;
    startsWithToday: boolean;
    dayStart: {
        hour: number;
        minute: number;
    };
    dayEnd: {
        hour: number;
        minute: number;
    };
    excluded?: number[];
    eventWidth: number;
    hourSegmentHeight: number;
}

export function getSchedulerView(dateAdapter: DateAdapter, args: GetSchedulerViewArgs): SchedulerView {
    let events: CalendarSchedulerEvent[] = args.events || [];
    if (!events) { events = []; }

    const viewDate: Date = args.viewDate;
    const weekStartsOn: number = args.weekStartsOn;
    const startsWithToday: boolean = args.startsWithToday;
    const excluded: number[] = args.excluded || [];
    const hourSegments: number = args.hourSegments || DEFAULT_HOUR_SEGMENTS;
    const hourSegmentHeight: number = args.hourSegmentHeight || DEFAULT_HOUR_SEGMENT_HEIGHT_PX;
    const eventWidth: number = args.eventWidth || DEFAULT_EVENT_WIDTH_PERCENT;
    const dayStart: any = args.dayStart, dayEnd: any = args.dayEnd;

    const startOfViewWeek: Date = startsWithToday ? dateAdapter.startOfDay(viewDate) : dateAdapter.startOfWeek(viewDate, { weekStartsOn: weekStartsOn });
    const endOfViewWeek: Date = startsWithToday ? dateAdapter.addDays(dateAdapter.endOfDay(viewDate), 6) : dateAdapter.endOfWeek(viewDate, { weekStartsOn: weekStartsOn });

    const eventsInWeek: CalendarSchedulerEvent[] = getEventsInPeriod(dateAdapter, {
        events: events,
        periodStart: startOfViewWeek,
        periodEnd: endOfViewWeek
    });

    const days: SchedulerViewDay[] = getSchedulerViewDays(dateAdapter, {
        viewDate: viewDate,
        weekStartsOn: weekStartsOn,
        startsWithToday: startsWithToday,
        excluded: excluded
    });
    days.forEach((day: SchedulerViewDay) => {
        const startOfView: Date = dateAdapter.setMinutes(dateAdapter.setHours(dateAdapter.startOfDay(day.date), dayStart.hour), dayStart.minute);
        const endOfView: Date = dateAdapter.setMinutes(dateAdapter.setHours(dateAdapter.startOfMinute(dateAdapter.endOfDay(day.date)), dayEnd.hour), dayEnd.minute);
        const previousDayEvents: SchedulerViewEvent[] = [];

        const eventsInDay: CalendarSchedulerEvent[] = getEventsInPeriod(dateAdapter, {
            events: eventsInWeek,
            periodStart: startOfView,
            periodEnd: endOfView
        });

        day.events = eventsInDay
            .sort((eventA: CalendarSchedulerEvent, eventB: CalendarSchedulerEvent) => eventA.start.valueOf() - eventB.start.valueOf())
            .map((ev: CalendarSchedulerEvent) => {
                const eventStart: Date = ev.start;
                const eventEnd: Date = ev.end || eventStart;
                const startsBeforeDay: boolean = eventStart < startOfView;
                const endsAfterDay: boolean = subMinutes(eventEnd, 1) > endOfView;
                const hourHeightModifier: number = ((hourSegments * hourSegmentHeight) + 1) / MINUTES_IN_HOUR; // +1 for the 1px top border

                let top: number = 0;
                if (eventStart > startOfView) {
                    top += dateAdapter.differenceInMinutes(eventStart, startOfView);
                }
                top *= hourHeightModifier;

                const startDate: Date = startsBeforeDay ? startOfView : eventStart;
                const endDate: Date = endsAfterDay ? endOfView : eventEnd;
                let height: number = dateAdapter.differenceInMinutes(endDate, startDate);
                if (!ev.end) {
                    height = hourSegmentHeight;
                } else {
                    height *= hourHeightModifier;
                }

                const bottom: number = top + height;
                const overlappingPreviousEvents = getOverLappingDayViewEvents(
                    previousDayEvents,
                    top,
                    bottom
                );

                let left: number = 0;
                while (overlappingPreviousEvents.some(previousEvent => previousEvent.left === left)) {
                    left += eventWidth;
                }

                const event: SchedulerViewEvent =
                <SchedulerViewEvent>{
                    event: ev,
                    top: top,
                    height: height,
                    width: eventWidth,
                    left: left,
                    startsBeforeDay: startsBeforeDay,
                    endsAfterDay: endsAfterDay,
                    isProcessed: false
                };

                previousDayEvents.push(event);

                return event;
            });

        day.hours = getSchedulerViewHourGrid(dateAdapter, {
            viewDate: viewDate,
            hourSegments: hourSegments,
            dayStart: {
                hour: dayStart.hour,
                minute: dayStart.minute
            },
            dayEnd: {
                hour: dayEnd.hour,
                minute: dayEnd.minute
            }
        }).map((hour: DayViewHour) => {
            const date: Date = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate(), hour.segments[0].date.getHours());

            const startOfHour: Date = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate(), hour.segments[0].date.getHours());
            const endOfHour: Date = subMinutes(dateAdapter.addHours(startOfHour, 1), 1);

            const eventsInHour: CalendarSchedulerEvent[] = getEventsInPeriod(dateAdapter, {
                events: eventsInDay,
                periodStart: startOfHour,
                periodEnd: endOfHour
            });

            const segments: SchedulerViewHourSegment[] =
                hour.segments.map((segment: DayViewHourSegment) => {
                    segment.date = dateAdapter.setDate(dateAdapter.setMonth(dateAdapter.setYear(segment.date, day.date.getFullYear()), day.date.getMonth()), day.date.getDate());

                    const startOfSegment: Date = segment.date;
                    const endOfSegment: Date = dateAdapter.addMinutes(segment.date, MINUTES_IN_HOUR / hourSegments);

                    const eventsInSegment: CalendarSchedulerEvent[] = getEventsInPeriod(dateAdapter, {
                        events: eventsInHour,
                        periodStart: startOfSegment,
                        periodEnd: endOfSegment
                    });

                    return <SchedulerViewHourSegment>{
                        segment: segment,
                        date: new Date(segment.date),
                        events: eventsInSegment
                    };
                });

            return <SchedulerViewHour>{
                hour: hour,
                date: date,
                events: eventsInHour,
                segments: segments
            };
        });
    });

    return <SchedulerView>{
        days: days,
        period: <SchedulerViewPeriod>{
            events: eventsInWeek,
            start: startOfViewWeek,
            end: endOfViewWeek
        }
    };
}

export interface GetSchedulerViewDaysArgs {
    viewDate: Date;
    weekStartsOn: number;
    startsWithToday: boolean;
    excluded?: number[];
    weekendDays?: number[];
}

export function getSchedulerViewDays(dateAdapter: DateAdapter, args: GetSchedulerViewDaysArgs): SchedulerViewDay[] {
    const viewDate: Date = args.viewDate;
    const weekStartsOn: number = args.weekStartsOn;
    const startsWithToday: boolean = args.startsWithToday;
    const excluded: number[] = args.excluded || [];
    const weekendDays: number[] = args.weekendDays || DEFAULT_WEEKEND_DAYS;

    const start = startsWithToday ? new Date(viewDate) : dateAdapter.startOfWeek(viewDate, { weekStartsOn: weekStartsOn });
    const days: SchedulerViewDay[] = [];
    const loop = (i: number) => {
        const date = dateAdapter.addDays(start, i);
        if (!excluded.some((e: number) => date.getDay() === e)) {
            days.push(getSchedulerDay(dateAdapter, { date, weekendDays }));
        }
    };
    for (let i = 0; i < DAYS_IN_WEEK; i++) {
        loop(i);
    }
    return days;
}

function getSchedulerDay(dateAdapter: DateAdapter, args: { date: Date, weekendDays: number[] }): SchedulerViewDay {
    const date: Date = args.date;
    const today: Date = dateAdapter.startOfDay(new Date());

    return <SchedulerViewDay>{
        date: date,
        isPast: date < today,
        isToday: dateAdapter.isSameDay(date, today),
        isFuture: date >= dateAdapter.addDays(today, 1),
        isWeekend: args.weekendDays.indexOf(dateAdapter.getDay(date)) > -1,
        inMonth: dateAdapter.isSameMonth(date, today),
        hours: []
    };
}

export interface GetEventsInPeriodArgs {
    events: CalendarSchedulerEvent[];
    periodStart: Date;
    periodEnd: Date;
}

function getEventsInPeriod(dateAdapter: DateAdapter, args: GetEventsInPeriodArgs): CalendarSchedulerEvent[] {
    const events: CalendarSchedulerEvent[] = args.events, periodStart: string | number | Date = args.periodStart, periodEnd: string | number | Date = args.periodEnd;
    return events.filter((event) => isEventInPeriod(dateAdapter, { event: event, periodStart: periodStart, periodEnd: periodEnd }));
}

interface IsEventInPeriodArgs {
    event: CalendarSchedulerEvent;
    periodStart: Date;
    periodEnd: Date;
}


function isEventInPeriod(dateAdapter: DateAdapter, args: IsEventInPeriodArgs): boolean {
    const { isSameSecond } = dateAdapter;
    const event: CalendarSchedulerEvent = args.event, periodStart: string | number | Date = args.periodStart, periodEnd: string | number | Date = args.periodEnd;
    const eventStart: Date = event.start;
    const eventEnd: Date = event.end || event.start;

    if (eventStart > periodStart && eventStart < periodEnd) {
        return true;
    }

    if (eventEnd > periodStart && eventEnd < periodEnd) {
        return true;
    }

    if (eventStart < periodStart && eventEnd > periodEnd) {
        return true;
    }

    if (isSameSecond(eventStart, periodStart) || isSameSecond(eventStart, periodEnd)) {
        return true;
    }

    if (isSameSecond(eventEnd, periodStart) || isSameSecond(eventEnd, periodEnd)) {
        return true;
    }

    return false;
}


function getOverLappingDayViewEvents(events: SchedulerViewEvent[], top: number, bottom: number): SchedulerViewEvent[] {
    return events.filter((previousEvent: SchedulerViewEvent) => {
        const previousEventTop: number = previousEvent.top;
        const previousEventBottom: number = previousEvent.top + previousEvent.height;

        if (top < previousEventBottom && previousEventBottom < bottom) {
            return true;
        } else if (previousEventTop <= top && bottom <= previousEventBottom) {
            return true;
        }

        return false;
    });
}
