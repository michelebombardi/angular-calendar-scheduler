import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import {
    CalendarSchedulerEvent,
    CalendarSchedulerEventAction
} from './models';

@Component({
    selector: 'calendar-scheduler-event-actions',
    template: `
        <span *ngIf="event.actions"
            class="cal-scheduler-event-actions">
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
export class CalendarSchedulerEventActionsComponent implements OnInit, OnChanges {

    @Input() event: CalendarSchedulerEvent;

    public actions: CalendarSchedulerEventAction[] = [];

    public ngOnInit(): void {
        this.setupActions();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.event) {
            this.setupActions();
        }
    }

    private setupActions(): void {
        if (this.event.actions) {
            this.actions = this.event.isCancelled
                ? this.event.actions.filter((a: CalendarSchedulerEventAction) => !a.when || a.when === 'cancelled')
                : this.event.isDisabled
                    ? this.event.actions.filter((a: CalendarSchedulerEventAction) => !a.when || a.when === 'disabled')
                    : this.event.actions.filter((a: CalendarSchedulerEventAction) => !a.when || a.when === 'enabled');
        }
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
