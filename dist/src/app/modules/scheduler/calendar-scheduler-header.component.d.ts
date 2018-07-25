import { EventEmitter, TemplateRef } from '@angular/core';
import { SchedulerViewDay } from './calendar-scheduler-view.component';
export declare class CalendarSchedulerHeaderComponent {
    days: SchedulerViewDay[];
    locale: string;
    customTemplate: TemplateRef<any>;
    dayClicked: EventEmitter<{
        date: Date;
    }>;
}
