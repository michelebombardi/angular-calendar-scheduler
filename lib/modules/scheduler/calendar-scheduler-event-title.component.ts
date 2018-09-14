import { Component, Input, TemplateRef } from '@angular/core';
import {
    CalendarSchedulerEvent
} from './models';

@Component({
    selector: 'calendar-scheduler-event-title',
    template: `
        <ng-template #defaultTemplate>
            <div
                class="cal-scheduler-event-title"
                [innerHTML]="event.title | schedulerEventTitle:view:event">
            </div>
            <div *ngIf="event.status && showStatus"
                class="cal-scheduler-event-status"
                [class.ok]="event.status === 'ok'"
                [class.warning]="event.status === 'warning'"
                [class.danger]="event.status === 'danger'">
            </div>
        </ng-template>
        <ng-template
            [ngTemplateOutlet]="customTemplate || defaultTemplate"
            [ngTemplateOutletContext]="{
                view: view,
                event: event,
                showStatus: showStatus
            }">
        </ng-template>
    `,
    host: {
        'class': 'cal-scheduler-event-title-container'
    }
})
export class CalendarSchedulerEventTitleComponent {

    @Input() event: CalendarSchedulerEvent;

    @Input() view: string;

    @Input() showStatus: boolean = true;

    @Input() customTemplate: TemplateRef<any>;
}
