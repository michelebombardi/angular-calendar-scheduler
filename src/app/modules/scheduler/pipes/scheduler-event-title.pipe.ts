import { Pipe, PipeTransform } from '@angular/core';
import { CalendarSchedulerEvent } from '../calendar-scheduler-view.component';
import { SchedulerEventTitleFormatter } from '../formatters/scheduler-event-title-formatter.provider';

@Pipe({
  name: 'schedulerEventTitle'
})
export class SchedulerEventTitlePipe implements PipeTransform {
  constructor(private schedulerEventTitle: SchedulerEventTitleFormatter) {}

  transform(title: string, titleType: string, event: CalendarSchedulerEvent): string {
    return this.schedulerEventTitle[titleType](event);
  }
}
