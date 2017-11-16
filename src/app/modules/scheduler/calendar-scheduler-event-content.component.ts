import { Component, Input } from '@angular/core';
import {
    CalendarSchedulerEvent
} from './calendar-scheduler-view.component';

@Component({
    selector: 'calendar-scheduler-event-content',
    template: `
        <div *ngIf="event.content"
            class="cal-scheduler-event-content"
            [innerHTML]="event.content">
        </div>
    `,
    host: {
        'class': 'cal-scheduler-event-content-container'
    }
})
export class CalendarSchedulerEventContentComponent {

    @Input() event: CalendarSchedulerEvent;

}
