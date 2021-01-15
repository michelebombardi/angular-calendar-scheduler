import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import {
    CalendarSchedulerEvent
} from './models';

@Component({
    selector: 'calendar-scheduler-event-content',
    template: `
        <div *ngIf="event.content"
            class="cal-scheduler-event-content"
            [style.max-height.px]="maxHeight"
            [style.white-space]="maxHeight && maxHeight > 30 ? 'normal' : 'nowrap'"
            [innerHTML]="event.content">
        </div>
    `,
    host: {
        'class': 'cal-scheduler-event-content-container'
    }
})
export class CalendarSchedulerEventContentComponent implements AfterViewInit {

    @Input() event: CalendarSchedulerEvent;

    @Input() eventContainer: HTMLElement;

    maxHeight: number;

    constructor(private hostElement: ElementRef) {  }

    public ngAfterViewInit(): void {
        setTimeout(() => { this.maxHeight = Math.max(30, this.eventContainer.clientHeight - 70); }, 0);
    }
}
