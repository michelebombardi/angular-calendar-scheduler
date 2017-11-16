import { Component, Input, OnInit } from '@angular/core';
import {
    CalendarSchedulerEvent,
    CalendarSchedulerEventAction
} from './calendar-scheduler-view.component';

@Component({
    selector: 'calendar-scheduler-event-actions',
    template: `
        <span *ngIf="event.actions" class="cal-scheduler-event-actions">
            <a
                class="cal-scheduler-event-action"
                href="javascript:;"
                *ngFor="let action of actions"
                (mwlClick)="onActionClick($event, action, event)"
                [ngClass]="action.cssClass"
                [innerHtml]="action.label"
                [title]="action.title">
            </a>
        </span>
    `,
    host: {
        'class': 'cal-scheduler-event-actions-container'
    }
})
export class CalendarSchedulerEventActionsComponent implements OnInit {

    @Input() event: CalendarSchedulerEvent;

    public actions: CalendarSchedulerEventAction[] = [];

    public ngOnInit(): void {
        this.actions = this.event.isDisabled ?
            this.event.actions.filter((a: CalendarSchedulerEventAction) => !a.when || a.when === 'disabled') :
            this.event.actions.filter((a: CalendarSchedulerEventAction) => !a.when || a.when === 'enabled');
    }

    /**
     * @hidden
     */
    onActionClick(mouseEvent: MouseEvent, action: CalendarSchedulerEventAction, event: CalendarSchedulerEvent): void {
        if (mouseEvent.stopPropagation) {
            mouseEvent.stopPropagation();
        }

        action.onClick(event);
    }
}
