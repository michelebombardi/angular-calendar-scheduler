import { Injectable } from '@angular/core';
import {
    CalendarSchedulerEvent,
    CalendarSchedulerEventStatus,
    CalendarSchedulerEventAction
} from 'angular-calendar-scheduler';
import {
    addDays,
    startOfHour,
    addHours
} from 'date-fns';

@Injectable()
export class AppService {
    getEvents(actions: CalendarSchedulerEventAction[]): Promise<CalendarSchedulerEvent[]> {
        const events = [
            <CalendarSchedulerEvent>{
                id: '1',
                start: addDays(startOfHour(new Date()), 1),
                end: addDays(addHours(startOfHour(new Date()), 1), 1),
                title: 'Event 1',
                content: 'IMPORTANT MEETING',
                color: { primary: '#E0E0E0', secondary: '#EEEEEE' },
                actions: actions,
                status: 'danger' as CalendarSchedulerEventStatus,
                isClickable: true,
                isDisabled: false
            },
            <CalendarSchedulerEvent>{
                id: '2',
                start: addDays(startOfHour(new Date()), 2),
                end: addDays(addHours(startOfHour(new Date()), 2), 2),
                title: 'Event 2',
                content: 'LESS IMPORTANT MEETING',
                color: { primary: '#E0E0E0', secondary: '#EEEEEE' },
                actions: actions,
                status: 'warning' as CalendarSchedulerEventStatus,
                isClickable: true,
                isDisabled: false
            },
            <CalendarSchedulerEvent>{
                id: '3',
                start: addDays(startOfHour(new Date()), 3),
                end: addDays(addHours(startOfHour(new Date()), 3), 3),
                title: 'Event 3',
                content: 'NOT IMPORTANT MEETING',
                color: { primary: '#E0E0E0', secondary: '#EEEEEE' },
                actions: actions,
                status: 'ok' as CalendarSchedulerEventStatus,
                isClickable: true,
                isDisabled: false
            }
        ];

        return new Promise(resolve => setTimeout(() => resolve(events), 3000));
    }
}
