import { CalendarDateFormatter, DateFormatterParams, DateAdapter } from 'angular-calendar';
import { DAYS_IN_WEEK } from '../utils/calendar-scheduler-utils';
import {inject, Injectable} from '@angular/core';

export interface SchedulerDateFormatterParams extends DateFormatterParams {
    dateAdapter: DateAdapter;
    startsWithToday: boolean;
}

@Injectable()
export class SchedulerDateFormatter extends CalendarDateFormatter {
    protected dateAdapter = inject(DateAdapter);

    constructor(dateAdapter: DateAdapter) {
        super();
    }

    /**
     * The time formatting down the left hand side of the day view
     */
    public dayViewHour({ date, locale }: SchedulerDateFormatterParams): string {
        return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: 'numeric' }).format(date);
    }

    public weekViewTitle({ date, locale, weekStartsOn, excludeDays, daysInWeek, startsWithToday }: SchedulerDateFormatterParams): string {
        // http://generatedcontent.org/post/59403168016/esintlapi
        const year: string = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(date);
        const month: string = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);

        const dateInner: Date = startsWithToday || daysInWeek < DAYS_IN_WEEK
            ? date
            : this.dateAdapter.startOfWeek(date, { weekStartsOn: weekStartsOn });

        const start = new Date(dateInner);
        while (excludeDays.includes(start.getDay())) {
            start.setDate(start.getDate() + 1);
        }

        const end = new Date(start);
        let addedDays = 0;
        while (addedDays < daysInWeek - 1) {
            end.setDate(end.getDate() + 1);
            if (!excludeDays.includes(end.getDay())) {
                addedDays++;
        }
        }

        // Se stesso giorno → mostra solo una data
        if (start.toDateString() === end.toDateString()) {
            return new Intl.DateTimeFormat(locale, {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
            }).format(start);
        }

        const sameMonth = start.getMonth() === end.getMonth();
        const sameYear = start.getFullYear() === end.getFullYear();

        // Formattatori localizzati
        const formatDay = (d: Date) =>
            new Intl.DateTimeFormat(locale, { day: 'numeric' }).format(d);
        const formatMonth = (d: Date) =>
            new Intl.DateTimeFormat(locale, { month: 'short' }).format(d);
        const formatYear = (d: Date) =>
            new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(d);

        if (sameMonth && sameYear) {
            // Es: 4–10 nov 2025
            return `${formatDay(start)}–${formatDay(end)} ${formatMonth(end)} ${formatYear(end)}`;
        }

        if (sameYear) {
            // Es: 30 dic – 5 gen 2025
            return `${formatDay(start)} ${formatMonth(start)} – ${formatDay(end)} ${formatMonth(end)} ${formatYear(end)}`;
        }

        // Anno diverso
        return `${formatDay(start)} ${formatMonth(start)} ${formatYear(start)} – ${formatDay(end)} ${formatMonth(end)} ${formatYear(end)}`;
    }

    private daysInMonth(anyDateInMonth: Date): number {
        return new Date(anyDateInMonth.getFullYear(), anyDateInMonth.getMonth() + 1, 0).getDate();
    }
}
