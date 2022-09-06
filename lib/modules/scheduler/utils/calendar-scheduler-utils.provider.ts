import { Inject, Injectable } from '@angular/core';
import {
    getSchedulerViewHourGrid,
    GetSchedulerViewHourGridArgs,
    getSchedulerViewDays,
    GetSchedulerViewDaysArgs,
    getSchedulerView,
    GetSchedulerViewArgs
} from './calendar-scheduler-utils';
import { WeekViewHour } from 'calendar-utils';
import { SchedulerView, SchedulerViewDay } from '../models';
import { DateAdapter, MOMENT } from 'angular-calendar';

@Injectable()
export class CalendarSchedulerUtils {
    constructor(private dateAdapter: DateAdapter, @Inject(MOMENT) protected moment: any) { }

    getSchedulerViewHourGrid(args: GetSchedulerViewHourGridArgs): WeekViewHour[] {
        return getSchedulerViewHourGrid(this.dateAdapter, args);
    }

    getSchedulerViewDays(args: GetSchedulerViewDaysArgs): SchedulerViewDay[] {
        return getSchedulerViewDays(this.dateAdapter, args);
    }

    getSchedulerView(args: GetSchedulerViewArgs): SchedulerView {
        return getSchedulerView(this.dateAdapter, this.moment, args);
    }
}
