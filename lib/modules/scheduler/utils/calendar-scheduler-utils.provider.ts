import { Injectable } from '@angular/core';
import {
    getSchedulerViewHourGrid,
    GetSchedulerViewHourGridArgs,
    getSchedulerViewDays,
    GetSchedulerViewDayArgs,
    getSchedulerView,
    GetSchedulerViewArgs
} from './calendar-scheduler-utils';
import { DayViewHour } from 'calendar-utils';
import { SchedulerView, SchedulerViewDay } from '../models';
import { DateAdapter } from 'angular-calendar';

@Injectable()
export class CalendarSchedulerUtils {
    constructor(private dateAdapter: DateAdapter) { }

    getSchedulerViewHourGrid(args: GetSchedulerViewHourGridArgs): DayViewHour[] {
        return getSchedulerViewHourGrid(this.dateAdapter, args);
    }

    getSchedulerViewDays(args: GetSchedulerViewDayArgs): SchedulerViewDay[] {
        return getSchedulerViewDays(this.dateAdapter, args);
    }

    getSchedulerView(args: GetSchedulerViewArgs): SchedulerView {
        return getSchedulerView(this.dateAdapter, args);
    }
}
