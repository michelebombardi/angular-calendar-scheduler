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

@Injectable()
export class CalendarSchedulerUtils {
    constructor() { }

    getSchedulerViewHourGrid(args: GetSchedulerViewHourGridArgs): DayViewHour[] {
        return getSchedulerViewHourGrid(args);
    }

    getSchedulerViewDays(args: GetSchedulerViewDayArgs): SchedulerViewDay[] {
        return getSchedulerViewDays(args);
    }

    getSchedulerView(args: GetSchedulerViewArgs): SchedulerView {
        return getSchedulerView(args);
    }
}
