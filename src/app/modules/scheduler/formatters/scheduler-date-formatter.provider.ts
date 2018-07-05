import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';

export class SchedulerDateFormatter extends CalendarDateFormatter {

    /**
     * The time formatting down the left hand side of the day view
     */
    public dayViewHour({ date, locale }: DateFormatterParams): string {
        return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: 'numeric' }).format(date);
    }

    public weekViewTitle({ date, locale }: DateFormatterParams): string {
        // http://generatedcontent.org/post/59403168016/esintlapi
        const year: string = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(date);
        const month: string = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);

        // var firstDay: number = date.getDate() - date.getDay() + 1; // First day is the day of the month - the day of the week
        let firstDay: number = date.getDate();
        if (date.getDay() === 0) {
            firstDay += 1;
        }

        let lastDay: number = firstDay + 6; // last day is the first day + 6

        let firstDayMonth: string = month;
        let lastDayMonth: string = month;

        let firstDayYear: string = year;
        let lastDayYear: string = year;

        if (firstDay < 1) {
            const prevMonthDate: Date = new Date(date.getFullYear(), date.getMonth() - 1);
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

        const daysInMonth: number = this.daysInMonth(date);
        if (lastDay > daysInMonth) {
            const nextMonthDate: Date = new Date(date.getFullYear(), date.getMonth() + 1);
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

        return `${firstDay}` + (firstDayMonth !== lastDayMonth ? ' ' + firstDayMonth : '') +
            (firstDayYear !== lastDayYear ? ' ' + firstDayYear : '') +
            ` - ${lastDay} ${lastDayMonth} ${lastDayYear}`;
    }

    private daysInMonth(anyDateInMonth: Date): number {
        return new Date(anyDateInMonth.getFullYear(), anyDateInMonth.getMonth() + 1, 0).getDate();
    }
}
