import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
export declare class SchedulerDateFormatter extends CalendarDateFormatter {
    /**
     * The time formatting down the left hand side of the day view
     */
    dayViewHour({date, locale}: DateFormatterParams): string;
    weekViewTitle({date, locale}: DateFormatterParams): string;
    private daysInMonth(anyDateInMonth);
}
