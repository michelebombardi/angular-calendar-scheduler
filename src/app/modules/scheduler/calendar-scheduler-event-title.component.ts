import { Component, Input } from '@angular/core';
import {
    CalendarSchedulerEvent
} from './calendar-scheduler-view.component';

@Component({
    selector: 'calendar-scheduler-event-title',
    template: `
        <div
            class="cal-scheduler-event-title"
            [innerHTML]="event.title | schedulerEventTitle:view:event">
        </div>
        <div *ngIf="event.status"
            class="cal-scheduler-event-status"
            [class.ok]="event.status === 'ok'"
            [class.warning]="event.status === 'warning'"
            [class.danger]="event.status === 'danger'">
        </div>
    `,
    host: {
        'class': 'cal-scheduler-event-title-container'
    }
})
export class CalendarSchedulerEventTitleComponent {

    @Input() event: CalendarSchedulerEvent;

    @Input() view: string;
}
