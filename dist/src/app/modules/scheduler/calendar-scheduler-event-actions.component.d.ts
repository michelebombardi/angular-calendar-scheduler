import { OnInit } from '@angular/core';
import { CalendarSchedulerEvent, CalendarSchedulerEventAction } from './calendar-scheduler-view.component';
export declare class CalendarSchedulerEventActionsComponent implements OnInit {
    event: CalendarSchedulerEvent;
    actions: CalendarSchedulerEventAction[];
    ngOnInit(): void;
    /**
     * @hidden
     */
    onActionClick(mouseEvent: MouseEvent, action: CalendarSchedulerEventAction, event: CalendarSchedulerEvent): void;
}
