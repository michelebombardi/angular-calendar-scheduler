import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { Subject } from 'rxjs';

import {
    startOfHour,
    endOfDay,
    addHours,
    addDays,
    addMonths,
} from 'date-fns';
import {
    SchedulerViewDay,
    SchedulerViewHour,
    SchedulerViewHourSegment,
    CalendarSchedulerEvent,
    CalendarSchedulerEventStatus,
    CalendarSchedulerEventAction,
    CalendarPeriod,
    startOfPeriod,
    endOfPeriod,
    addPeriod,
    subPeriod,
    SchedulerDateFormatter
} from 'angular-calendar-scheduler';
import {
    CalendarDateFormatter
} from 'angular-calendar';

import { AppService } from './services/app.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [{
        provide: CalendarDateFormatter,
        useClass: SchedulerDateFormatter
    }]
})
export class AppComponent implements OnInit {
    title = 'Angular Calendar Scheduler Demo';

    view: CalendarPeriod = 'week';
    viewDate: Date = new Date();
    refreshSubject: Subject<any> = new Subject();
    locale: string = 'en';
    weekStartsOn: number = 1;
    startsWithToday: boolean = true;
    activeDayIsOpen: boolean = true;
    excludeDays: number[] = []; // [0];
    dayStartHour: number = 6;
    dayEndHour: number = 22;

    minDate: Date = new Date();
    maxDate: Date = endOfDay(addMonths(new Date(), 1));
    dayModifier: Function;
    hourModifier: Function;
    segmentModifier: Function;
    prevBtnDisabled: boolean = false;
    nextBtnDisabled: boolean = false;

    actions: CalendarSchedulerEventAction[] = [{
        when: 'enabled',
        label: '<span class="valign-center"><i class="material-icons md-18 md-red-500">cancel</i></span>',
        title: 'Delete',
        onClick: (event: CalendarSchedulerEvent): void => {
            console.log('Pressed action cancel on event ' + event.id);
        }
    }];

    events: CalendarSchedulerEvent[];

    constructor(@Inject(LOCALE_ID) locale: string, private appService: AppService) {
        this.locale = locale;

        this.dayModifier = ((day: SchedulerViewDay): void => {
            if (!this.isDateValid(day.date)) {
                day.cssClass = 'cal-disabled';
            }
        }).bind(this);
        this.hourModifier = ((hour: SchedulerViewHour): void => {
            if (!this.isDateValid(hour.date)) {
                hour.cssClass = 'cal-disabled';
            }
        }).bind(this);
        this.segmentModifier = ((segment: SchedulerViewHourSegment): void => {
            if (!this.isDateValid(segment.date)) {
                segment.isDisabled = true;
            }
        }).bind(this);

        this.dateOrViewChanged();
    }

    ngOnInit(): void {
        this.appService.getEvents(this.actions)
            .then((events: CalendarSchedulerEvent[]) => this.events = events);
    }

    changeDate(date: Date): void {
        console.log('changeDate', date);
        this.viewDate = date;
        this.dateOrViewChanged();
    }

    changeView(view: CalendarPeriod): void {
        console.log('changeView', view);
        this.view = view;
        this.dateOrViewChanged();
    }

    dateOrViewChanged(): void {
        if (this.startsWithToday) {
            this.prevBtnDisabled = !this.isDateValid(subPeriod(this.view, this.viewDate, 1));
            this.nextBtnDisabled = !this.isDateValid(addPeriod(this.view, this.viewDate, 1));
        } else {
            this.prevBtnDisabled = !this.isDateValid(endOfPeriod(this.view, subPeriod(this.view, this.viewDate, 1)));
            this.nextBtnDisabled = !this.isDateValid(startOfPeriod(this.view, addPeriod(this.view, this.viewDate, 1)));
        }

        if (this.viewDate < this.minDate) {
            this.changeDate(this.minDate);
        } else if (this.viewDate > this.maxDate) {
            this.changeDate(this.maxDate);
        }
    }

    private isDateValid(date: Date): boolean {
        return /*isToday(date) ||*/ date >= this.minDate && date <= this.maxDate;
    }

    dayClicked({ date, events }: { date: Date, events: CalendarSchedulerEvent[] }): void {
        console.log('dayClicked Date', date);
        console.log('dayClicked Events', events);
    }

    eventClicked(action: string, event: CalendarSchedulerEvent): void {
        console.log('eventClicked Action', action);
        console.log('eventClicked Event', event);
    }

    segmentClicked(action: string, segment: SchedulerViewHourSegment): void {
        console.log('segmentClicked Action', action);
        console.log('segmentClicked Segment', segment);
    }
}
