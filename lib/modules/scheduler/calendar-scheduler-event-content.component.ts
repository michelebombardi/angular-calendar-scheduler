import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
    CalendarSchedulerEvent
} from './models';

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
