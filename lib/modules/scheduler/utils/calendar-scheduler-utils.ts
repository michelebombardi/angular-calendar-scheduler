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
    WeekViewHour,
    WeekViewHourSegment
} from 'calendar-utils';
import { DateAdapter } from 'angular-calendar';

// WORKAROUND: https://github.com/dherges/ng-packagr/issues/217#issuecomment-339460255
import * as momentImported from 'moment';
const moment = momentImported;


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
export const DEFAULT_EVENT_WIDTH = 1;
export const DEFAULT_HOUR_SEGMENTS = 2;

interface Time {
    hour: number;
    minute: number;
  }

export interface GetSchedulerViewHourGridArgs {
    viewDate: Date;
    hourSegments: number;
    dayStart: Time;
    dayEnd: Time;
}

export function getSchedulerViewHourGrid(
    dateAdapter: DateAdapter,
    {
        viewDate,
        hourSegments,
        dayStart,
        dayEnd
    }: GetSchedulerViewHourGridArgs
): WeekViewHour[] {
    const {
        setMinutes,
        setHours,
        startOfDay,
        startOfMinute,
        endOfDay,
        addMinutes,
        addHours,
        addDays
      } = dateAdapter;
    const hours: WeekViewHour[] = [];

    let startOfView: Date = setMinutes(
        setHours(startOfDay(viewDate), sanitiseHours(dayStart.hour)),
        sanitiseMinutes(dayStart.minute)
    );
    let endOfView: Date = setMinutes(
        setHours(startOfMinute(endOfDay(viewDate)), sanitiseHours(dayEnd.hour)),
        sanitiseMinutes(dayEnd.minute)
    );
    const segmentDuration: number = MINUTES_IN_HOUR / hourSegments;
    let startOfViewDay: Date = startOfDay(viewDate);
    const endOfViewDay: Date = endOfDay(viewDate);
    let dateAdjustment: (d: Date) => Date = (d: Date) => d;

    // this means that we change from or to DST on this day and that's going to cause problems so we bump the date
    if (startOfViewDay.getTimezoneOffset() !== endOfViewDay.getTimezoneOffset()) {
        startOfViewDay = addDays(startOfViewDay, 1);
        startOfView = addDays(startOfView, 1);
        endOfView = addDays(endOfView, 1);
        dateAdjustment = (d: Date) => addDays(d, -1);
    }

    for (let i: number = 0; i < HOURS_IN_DAY; i++) {
    }

    for (let i: number = 0; i < HOURS_IN_DAY; i++) {
        const segments: WeekViewHourSegment[] = [];
        for (let j: number = 0; j < hourSegments; j++) {
          const date: Date = addMinutes(
            addHours(startOfViewDay, i),
            j * segmentDuration
          );
          if (date >= startOfView && date < endOfView) {
            segments.push({
              date: dateAdjustment(date),
              displayDate: date,
              isStart: j === 0
            });
          }
        }
        if (segments.length > 0) {
          hours.push({ segments });
        }
    }

    return hours;
}

export interface GetSchedulerViewArgs {
    events?: CalendarSchedulerEvent[];
    viewDate: Date;
    hourSegments: 1 | 2 | 4 | 6;
    weekStartsOn: number;
    startsWithToday: boolean;
    dayStart: Time;
    dayEnd: Time;
    weekendDays?: number[];
    excluded?: number[];
    eventWidth: number;
    hourSegmentHeight: number;
    logEnabled?: boolean;
}

export function getSchedulerView(
    dateAdapter: DateAdapter,
    {
        events = [],
        viewDate,
        weekStartsOn,
        startsWithToday,
        excluded = [],
        hourSegments = DEFAULT_HOUR_SEGMENTS,
        dayStart,
        dayEnd,
        weekendDays = DEFAULT_WEEKEND_DAYS,
        hourSegmentHeight = DEFAULT_HOUR_SEGMENT_HEIGHT_PX,
        eventWidth = DEFAULT_EVENT_WIDTH,
        logEnabled,
    }: GetSchedulerViewArgs
): SchedulerView {
    if (!events) { events = []; }

    const { addDays, startOfDay, endOfDay, startOfWeek, endOfWeek } = dateAdapter;
    const startOfViewWeek: Date = startsWithToday ? startOfDay(viewDate) : startOfWeek(viewDate, { weekStartsOn: weekStartsOn });
    const endOfViewWeek: Date = startsWithToday ? addDays(endOfDay(viewDate), 6) : endOfWeek(viewDate, { weekStartsOn: weekStartsOn });

    const eventsInWeek: CalendarSchedulerEvent[] = getEventsInPeriod(dateAdapter, {
        events: events,
        periodStart: startOfViewWeek,
        periodEnd: endOfViewWeek
    });

    const days: SchedulerViewDay[] = getSchedulerViewDays(dateAdapter, {
        viewDate: viewDate,
        weekStartsOn: weekStartsOn,
        startsWithToday: startsWithToday,
        excluded: excluded,
        weekendDays: weekendDays
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

        const dayEvents = eventsInDay
            .sort((eventA: CalendarSchedulerEvent, eventB: CalendarSchedulerEvent) => eventA.start.valueOf() - eventB.start.valueOf())
            .map((ev: CalendarSchedulerEvent) => {
                const eventStart: Date = ev.start;
                const eventEnd: Date = ev.end || eventStart;
                const startsBeforeDay: boolean = eventStart < startOfView;
                const endsAfterDay: boolean = dateAdapter.addMinutes(eventEnd, -1) > endOfView;
                const hourHeightModifier: number = ((hourSegments * hourSegmentHeight) + 1) / MINUTES_IN_HOUR; // +1 for the 1px segment bottom border

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
                        endsAfterDay: endsAfterDay
                    };

                previousDayEvents.push(event);

                return event;
            });

        function getColumnCount(
            allEvents: SchedulerViewEvent[],
            prevOverlappingEvents: SchedulerViewEvent[]
        ): number {
            const columnCount = Math.max(
                ...prevOverlappingEvents.map((ev: SchedulerViewEvent) => ev.left + 1)
            );

            const nextOverlappingEvents = allEvents
                .filter((ev: SchedulerViewEvent) => ev.left >= columnCount)
                .filter((ev: SchedulerViewEvent) => {
                    return (
                        getOverLappingDayViewEvents(
                            prevOverlappingEvents,
                            ev.top,
                            ev.top + ev.height
                        ).length > 0
                    );
            });

            if (nextOverlappingEvents.length > 0) {
                return getColumnCount(allEvents, nextOverlappingEvents);
            } else {
                return columnCount;
            }
        }

        const mappedEvents = dayEvents.map(event => {
            const columnCount = getColumnCount(
                dayEvents,
                getOverLappingDayViewEvents(
                    dayEvents,
                    event.top,
                    event.top + event.height
                )
            );

            const width = 100 / columnCount;
            return { ...event, left: event.left * width, width };
        });

        day.events = mappedEvents.map(event => {
            const overLappingEvents = getOverLappingDayViewEvents(
              mappedEvents.filter(otherEvent => otherEvent.left > event.left),
              event.top,
              event.top + event.height
            );
            if (overLappingEvents.length > 0) {
              return {
                ...event,
                width:
                  Math.min(
                    ...overLappingEvents.map(otherEvent => otherEvent.left)
                  ) - event.left
              };
            }
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
        }).map((hour: WeekViewHour) => {
            const date: Date = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate(), hour.segments[0].date.getHours());

            const startOfHour: Date = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate(), hour.segments[0].date.getHours());
            const endOfHour: Date = dateAdapter.addSeconds(dateAdapter.addHours(startOfHour, 1), -1);

            const eventsInHour: SchedulerViewEvent[] = getSchedulerEventsInPeriod(dateAdapter, {
                events: day.events,
                periodStart: startOfHour,
                periodEnd: endOfHour
            });

            const segments: SchedulerViewHourSegment[] =
                hour.segments.map((segment: WeekViewHourSegment) => {
                    segment.date = dateAdapter.setDate(dateAdapter.setMonth(dateAdapter.setYear(segment.date, day.date.getFullYear()), day.date.getMonth()), day.date.getDate());

                    const startOfSegment: Date = segment.date;
                    const endOfSegment: Date = dateAdapter.addSeconds(dateAdapter.addMinutes(startOfSegment, MINUTES_IN_HOUR / hourSegments), -1);

                    const eventsInSegment: SchedulerViewEvent[] = getSchedulerEventsInPeriod(dateAdapter, {
                        events: eventsInHour,
                        periodStart: startOfSegment,
                        periodEnd: endOfSegment
                    });

                    if (logEnabled) {
                        console.log('SEGMENT [' + moment(startOfSegment).format('dddd L, LT') + ' - ' + moment(endOfSegment).format('dddd L, LT') + '] EVENTS -> ', eventsInSegment);
                    }

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

export function getSchedulerViewDays(
    dateAdapter: DateAdapter,
    {
        viewDate,
        weekStartsOn,
        startsWithToday,
        excluded = [],
        weekendDays = DEFAULT_WEEKEND_DAYS
    }: GetSchedulerViewDaysArgs
): SchedulerViewDay[] {
    const start = startsWithToday
        ? new Date(viewDate)
        : dateAdapter.startOfWeek(viewDate, { weekStartsOn: weekStartsOn });
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

function getEventsInPeriod(
    dateAdapter: DateAdapter,
    {
        events,
        periodStart,
        periodEnd
    }: GetEventsInPeriodArgs
): CalendarSchedulerEvent[] {
    return events.filter((event) => isEventInPeriod(dateAdapter, { event: event, periodStart: periodStart, periodEnd: periodEnd }));
}

export interface GetSchedulerEventsInPeriodArgs {
    events: SchedulerViewEvent[];
    periodStart: Date;
    periodEnd: Date;
}

function getSchedulerEventsInPeriod(
    dateAdapter: DateAdapter,
    {
        events,
        periodStart,
        periodEnd
    }: GetSchedulerEventsInPeriodArgs
): SchedulerViewEvent[] {
    return events.filter((event) => isEventInPeriod(dateAdapter, { event: event.event, periodStart: periodStart, periodEnd: periodEnd }));
}

interface IsEventInPeriodArgs {
    event: CalendarSchedulerEvent;
    periodStart: Date;
    periodEnd: Date;
}

function isEventInPeriod(dateAdapter: DateAdapter, { event, periodStart, periodEnd}: IsEventInPeriodArgs): boolean {
    const { isSameSecond } = dateAdapter;
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
        } else if (top < previousEventTop && previousEventTop < bottom) {
            return true;
        } else if (previousEventTop <= top && bottom <= previousEventBottom) {
            return true;
        }

        return false;
    });
}


function sanitiseHours(hours: number): number {
    return Math.max(Math.min(23, hours), 0);
}

function sanitiseMinutes(minutes: number): number {
    return Math.max(Math.min(59, minutes), 0);
}
