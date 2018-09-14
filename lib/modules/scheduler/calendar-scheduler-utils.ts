import {
    CalendarSchedulerEvent,
    SchedulerViewHour,
    SchedulerViewDay,
    SchedulerViewEvent,
    SchedulerViewHourSegment,
    SchedulerView
} from './calendar-scheduler-models';
import {
    DayViewHour,
    DayViewHourSegment
} from 'calendar-utils';
import {
    startOfDay,
    startOfWeek,
    addDays,
    endOfDay,
    endOfWeek,
    setMinutes,
    setHours,
    startOfMinute,
    differenceInMinutes,
    subMinutes,
    addHours,
    setDate,
    setMonth,
    setYear,
    addMinutes,
    isSameDay,
    isSameMonth,
    getDay
} from 'date-fns';


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


export interface GetSchedulerViewDayArgs {
    viewDate: Date;
    weekStartsOn: number;
    startsWithToday: boolean;
    excluded?: number[];
    weekendDays?: number[];
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


export function getSchedulerViewHourGrid( args: GetSchedulerViewHourGridArgs): DayViewHour[] {
    const viewDate: Date = args.viewDate, hourSegments: number = args.hourSegments, dayStart: any = args.dayStart, dayEnd: any = args.dayEnd;
    const hours: DayViewHour[] = [];

    const startOfView: Date = setMinutes(setHours(startOfDay(viewDate), dayStart.hour), dayStart.minute);
    const endOfView: Date = setMinutes(setHours(startOfMinute(endOfDay(viewDate)), dayEnd.hour), dayEnd.minute);
    const segmentDuration: number = MINUTES_IN_HOUR / hourSegments;
    const startOfViewDay: Date = startOfDay(viewDate);

    const range = (start: number, end: number): number[] => Array.from({ length: ((end + 1) - start) }, (v, k) => k + start);
    const hoursInView: number[] = range(dayStart.hour, dayEnd.hour);

    hoursInView.forEach((hour: number, i: number) => {
        const segments = [];
        for (let j = 0; j < hourSegments; j++) {
            const date = addMinutes(addHours(startOfViewDay, hour), j * segmentDuration);
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

export function getSchedulerView(args: GetSchedulerViewArgs): SchedulerView {
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

    const startOfViewWeek: Date = startsWithToday ? startOfDay(viewDate) : startOfWeek(viewDate, { weekStartsOn: weekStartsOn });
    const endOfViewWeek: Date = startsWithToday ? addDays(endOfDay(viewDate), 6) : endOfWeek(viewDate, { weekStartsOn: weekStartsOn });

    const eventsInWeek: CalendarSchedulerEvent[] = getEventsInPeriod({
        events: events,
        periodStart: startOfViewWeek,
        periodEnd: endOfViewWeek
    });

    const days: SchedulerViewDay[] = getSchedulerViewDays({
        viewDate: viewDate,
        weekStartsOn: weekStartsOn,
        startsWithToday: startsWithToday,
        excluded: excluded
    });
    days.forEach((day: SchedulerViewDay) => {
        const startOfView: Date = setMinutes(setHours(startOfDay(day.date), dayStart.hour), dayStart.minute);
        const endOfView: Date = setMinutes(setHours(startOfMinute(endOfDay(day.date)), dayEnd.hour), dayEnd.minute);
        const previousDayEvents: SchedulerViewEvent[] = [];

        const eventsInDay: CalendarSchedulerEvent[] = getEventsInPeriod({
            events: eventsInWeek,
            periodStart: startOfDay(day.date),
            periodEnd: endOfDay(day.date)
        });

        day.events = eventsInDay
            .sort((eventA: CalendarSchedulerEvent, eventB: CalendarSchedulerEvent) => eventA.start.valueOf() - eventB.start.valueOf())
            .map((ev: CalendarSchedulerEvent) => {
                const eventStart: Date = ev.start;
                const eventEnd: Date = ev.end || eventStart;
                const startsBeforeDay: boolean = eventStart < startOfView;
                const endsAfterDay: boolean = eventEnd > endOfView;
                const hourHeightModifier: number = ((hourSegments * hourSegmentHeight) + 1) / MINUTES_IN_HOUR; // +1 for the 1px top border

                let top: number = 0;
                if (eventStart > startOfView) {
                    top += differenceInMinutes(eventStart, startOfView);
                }
                top *= hourHeightModifier;

                const startDate: Date = startsBeforeDay ? startOfView : eventStart;
                const endDate: Date = endsAfterDay ? endOfView : eventEnd;
                let height: number = differenceInMinutes(endDate, startDate);
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

        day.hours = getSchedulerViewHourGrid({
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
            const endOfHour: Date = subMinutes(addHours(startOfHour, 1), 1);

            const eventsInHour: CalendarSchedulerEvent[] = getEventsInPeriod({
                events: eventsInDay,
                periodStart: startOfHour,
                periodEnd: endOfHour
            });

            const segments: SchedulerViewHourSegment[] =
                hour.segments.map((segment: DayViewHourSegment) => {
                    segment.date = setDate(setMonth(setYear(segment.date, day.date.getFullYear()), day.date.getMonth()), day.date.getDate());

                    const startOfSegment: Date = segment.date;
                    const endOfSegment: Date = addMinutes(segment.date, MINUTES_IN_HOUR / hourSegments);

                    const eventsInSegment: CalendarSchedulerEvent[] = getEventsInPeriod({
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
        period: {
            events: eventsInWeek,
            start: startOfViewWeek,
            end: endOfViewWeek
        }
    };
}

export function getSchedulerViewDays(args: GetSchedulerViewDayArgs): SchedulerViewDay[] {
    const viewDate: Date = args.viewDate;
    const weekStartsOn: number = args.weekStartsOn;
    const startsWithToday: boolean = args.startsWithToday;
    const excluded: number[] = args.excluded || [];
    const weekendDays: number[] = args.weekendDays || DEFAULT_WEEKEND_DAYS;

    const start = startsWithToday ? new Date(viewDate) : startOfWeek(viewDate, { weekStartsOn: weekStartsOn });
    const days: SchedulerViewDay[] = [];
    const loop = (i: number) => {
        const date = addDays(start, i);
        if (!excluded.some((e: number) => date.getDay() === e)) {
            days.push(getSchedulerDay({ date, weekendDays }));
        }
    };
    for (let i = 0; i < DAYS_IN_WEEK; i++) {
        loop(i);
    }
    return days;
}

function getSchedulerDay(args: { date: Date, weekendDays: number[] }): SchedulerViewDay {
    const date: Date = args.date;
    const today: Date = startOfDay(new Date());

    return <SchedulerViewDay>{
        date: date,
        isPast: date < today,
        isToday: isSameDay(date, today),
        isFuture: date >= addDays(today, 1),
        isWeekend: args.weekendDays.indexOf(getDay(date)) > -1,
        inMonth: isSameMonth(date, today),
        hours: []
    };
}


function getEventsInPeriod(args: { events: CalendarSchedulerEvent[], periodStart: string | number | Date, periodEnd: string | number | Date }): CalendarSchedulerEvent[] {
    const events: CalendarSchedulerEvent[] = args.events, periodStart: string | number | Date = args.periodStart, periodEnd: string | number | Date = args.periodEnd;
    return events.filter((event) => isEventInPeriod({ event: event, periodStart: periodStart, periodEnd: periodEnd }));
}

function isEventInPeriod(args: { event: CalendarSchedulerEvent, periodStart: string | number | Date, periodEnd: string | number | Date }): boolean {
    const event: CalendarSchedulerEvent = args.event, periodStart: string | number | Date = args.periodStart, periodEnd: string | number | Date = args.periodEnd;
    const eventStart: Date = event.start;
    const eventEnd: Date = event.end || event.start;

    if (eventStart >= periodStart && eventStart < periodEnd) {
        return true;
    }
    if (eventEnd <= periodEnd && eventEnd > periodStart) {
        return true;
    }
    if (eventStart < periodStart && eventEnd > periodEnd) {
        return true;
    }

    return false;
}


function getOverLappingDayViewEvents(events: SchedulerViewEvent[], top: number, bottom: number): SchedulerViewEvent[] {
    return events.filter((previousEvent: SchedulerViewEvent) => {
        const previousEventTop: number = previousEvent.top;
        const previousEventBottom: number =
            previousEvent.top + previousEvent.height;

        if (top < previousEventBottom && previousEventBottom < bottom) {
            return true;
        } else if (previousEventTop <= top && bottom <= previousEventBottom) {
            return true;
        }

        return false;
    });
}
