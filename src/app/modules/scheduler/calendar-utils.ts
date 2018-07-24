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

export type CalendarPeriod = 'day' | 'week' | 'month';

export function addPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
    return {
        day: addDays,
        week: addWeeks,
        month: addMonths
    }[period](date, amount);
}

export function subPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
    return {
        day: subDays,
        week: subWeeks,
        month: subMonths
    }[period](date, amount);
}

export function startOfPeriod(period: CalendarPeriod, date: Date): Date {
    return {
        day: startOfDay,
        week: startOfWeek,
        month: startOfMonth
    }[period](date);
}

export function endOfPeriod(period: CalendarPeriod, date: Date): Date {
    return {
        day: endOfDay,
        week: endOfWeek,
        month: endOfMonth
    }[period](date);
}
