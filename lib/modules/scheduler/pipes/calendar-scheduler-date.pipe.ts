import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';
import { CalendarDateFormatter, DateAdapter } from 'angular-calendar';

@Pipe({
  name: 'calendarSchedulerDate'
})
export class CalendarSchedulerDatePipe implements PipeTransform {
  constructor(
    private dateAdapter: DateAdapter,
    private dateFormatter: CalendarDateFormatter,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  transform(
    date: Date,
    method: string,
    locale: string = this.locale,
    weekStartsOn: number = 0,
    excludeDays: number[] = [],
    daysInWeek?: number,
    startsWithToday?: boolean
  ): string {
    if (typeof this.dateFormatter[method] === 'undefined') {
      const allowedMethods = Object.getOwnPropertyNames(
        Object.getPrototypeOf(CalendarDateFormatter.prototype)
      ).filter(iMethod => iMethod !== 'constructor');
      throw new Error(
        `${method} is not a valid date formatter. Can only be one of ${allowedMethods.join(
          ', '
        )}`
      );
    }
    return this.dateFormatter[method]({
      dateAdapter: this.dateAdapter,
      date,
      locale,
      weekStartsOn,
      excludeDays,
      daysInWeek,
      startsWithToday
    });
  }
}
