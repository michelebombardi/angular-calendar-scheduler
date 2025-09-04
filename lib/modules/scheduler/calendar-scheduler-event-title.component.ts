﻿import { Component, Input, TemplateRef } from '@angular/core';
import {
    CalendarSchedulerEvent
} from './models';

@Component({
    standalone: false,
    selector: 'calendar-scheduler-event-title',
    template: `
        <ng-template #defaultTemplate>
          <div
            class="cal-scheduler-event-title"
            [innerHTML]="event.title | schedulerEventTitle:view:event">
          </div>
          @if (showActions && !showContent && (event.isClickable || event.isDisabled)) {
            <calendar-scheduler-event-actions
              class="no-content-actions"
              [event]="event">
            </calendar-scheduler-event-actions>
          }
          @if (event.status && showStatus) {
            <div
              class="cal-scheduler-event-status"
              [class.ok]="event.status === 'ok'"
              [class.warning]="event.status === 'warning'"
              [class.danger]="event.status === 'danger'">
            </div>
          }
        </ng-template>
        <ng-template
          [ngTemplateOutlet]="customTemplate || defaultTemplate"
            [ngTemplateOutletContext]="{
                view: view,
                event: event,
                showStatus: showStatus,
                showContent: showContent,
                showActions: showActions
            }">
        </ng-template>
        `,
    host: {
        'class': 'cal-scheduler-event-title-container'
    }
})
export class CalendarSchedulerEventTitleComponent {

    @Input() view: string;

    @Input() event: CalendarSchedulerEvent;

    @Input() showStatus: boolean = true;

    @Input() showContent: boolean = true;

    @Input() showActions: boolean = true;

    @Input() customTemplate: TemplateRef<any>;
}
