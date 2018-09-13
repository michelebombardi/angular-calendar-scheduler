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
import { CalendarView } from 'angular-calendar';

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
