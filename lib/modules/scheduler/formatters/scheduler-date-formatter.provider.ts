import { CalendarDateFormatter, DateFormatterParams, DateAdapter } from 'angular-calendar';
import { DAYS_IN_WEEK } from '../utils/calendar-scheduler-utils';
import { Injectable } from '@angular/core';

export interface SchedulerDateFormatterParams extends DateFormatterParams {
    dateAdapter: DateAdapter;
    startsWithToday: boolean;
}

@Injectable()
export class SchedulerDateFormatter extends CalendarDateFormatter {
    constructor(dateAdapter: DateAdapter) {
        super(dateAdapter);
    }

    /**
     * The time formatting down the left hand side of the day view
     */
    public dayViewHour({ date, locale }: SchedulerDateFormatterParams): string {
        return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: 'numeric' }).format(date);
    }

    public weekViewTitle({ dateAdapter, date, locale, weekStartsOn, excludeDays, daysInWeek, startsWithToday }: SchedulerDateFormatterParams): string {
        // http://generatedcontent.org/post/59403168016/esintlapi
        const year: string = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(date);
        const month: string = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);

        const dateInner: Date = startsWithToday || daysInWeek < DAYS_IN_WEEK
            ? date
            : dateAdapter.startOfWeek(date, { weekStartsOn: weekStartsOn });

        // var firstDay: number = date.getDate() - date.getDay() + 1; // First day is the day of the month - the day of the week
        let firstDay: number = dateInner.getDate();
        while (excludeDays.includes(firstDay)) {
            firstDay += 1;
        }

        let lastDay: number = firstDay + (daysInWeek - 1); // last day is the first day + (daysInWeek - 1)
        while (excludeDays.includes(lastDay)) {
            lastDay += 1;
        }

        let firstDayMonth: string = month;
        let lastDayMonth: string = month;

        let firstDayYear: string = year;
        let lastDayYear: string = year;

        if (firstDay < 1) {
            const prevMonthDate: Date = new Date(dateInner.getFullYear(), dateInner.getMonth() - 1);
            firstDayMonth = new Intl.DateTimeFormat(locale, { month: 'short' }).format(prevMonthDate);
            const daysInPrevMonth: number = this.daysInMonth(prevMonthDate);

            let i: number = 0;
            let prevMonthDay: number = daysInPrevMonth;
            for (i = 0; i < Math.abs(firstDay); i++) {
                prevMonthDay--;
            }
            firstDay = prevMonthDay;

            const prevMonthYear: string = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(prevMonthDate);
            if (Number(prevMonthYear) < Number(year)) {
                firstDayYear = prevMonthYear;
            }
        }

        const daysInMonth: number = this.daysInMonth(dateInner);
        if (lastDay > daysInMonth) {
            const nextMonthDate: Date = new Date(dateInner.getFullYear(), dateInner.getMonth() + 1);
            lastDayMonth = new Intl.DateTimeFormat(locale, { month: 'short' }).format(nextMonthDate);

            let i: number = 0;
            let nextMonthDay: number = 0;
            for (i = 0; i < (lastDay - daysInMonth); i++) {
                nextMonthDay++;
            }
            lastDay = nextMonthDay;

            const nextMonthYear: string = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(nextMonthDate);
            if (Number(nextMonthYear) > Number(year)) {
                lastDayYear = nextMonthYear;
            }
        }

        return `${firstDay}` + (firstDayMonth !== lastDayMonth || lastDay === firstDay ? ' ' + firstDayMonth : '') +
            (firstDayYear !== lastDayYear ? ' ' + firstDayYear : '') +
            (lastDay === firstDay ? '' : ` - ${lastDay} ${lastDayMonth} ${lastDayYear}`);
    }

    private daysInMonth(anyDateInMonth: Date): number {
        return new Date(anyDateInMonth.getFullYear(), anyDateInMonth.getMonth() + 1, 0).getDate();
    }
}
