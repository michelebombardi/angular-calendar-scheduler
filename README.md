# Angular Calendar Scheduler

This project provide a scheduler view component for [mattlewis92/angular-calendar](https://github.com/mattlewis92/angular-calendar).

<a href="https://www.npmjs.com/package/angular-calendar-scheduler">
    <img src="https://badge.fury.io/js/angular-calendar-scheduler.svg" alt="npm">
</a> 
<a href="https://travis-ci.org/bm-software/angular-calendar-scheduler">
    <img src="https://travis-ci.org/bm-software/angular-calendar-scheduler.svg?branch=master" alt="travis">
</a> 
<a href="https://codecov.io/gh/bm-software/angular-calendar-scheduler">
    <img src="https://codecov.io/gh/bm-software/angular-calendar-scheduler/branch/master/graph/badge.svg" alt="codecov">
</a>
<a href="https://github.com/bm-software/angular-calendar-scheduler/issues">
    <img src="https://img.shields.io/github/issues/bm-software/angular-calendar-scheduler.svg" alt="issues">
</a>
<a href="https://github.com/bm-software/angular-calendar-scheduler/network">
    <img src="https://img.shields.io/github/forks/bm-software/angular-calendar-scheduler.svg" alt="forks">
</a>
<a href="https://github.com/bm-software/angular-calendar-scheduler/stargazers">
    <img src="https://img.shields.io/github/stars/bm-software/angular-calendar-scheduler.svg" alt="stars">
</a>
<a href="https://github.com/bm-software/angular-calendar-scheduler/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/bm-software/angular-calendar-scheduler.svg" alt="license">
</a>

___

<!-- * [About](#about) -->
* [Getting Started](#getting-started)
    * [Install](#install)
    * [Include Component](#include-component)
    * [Usage](#usage)
<!-- * [API](#api)
  * [Properties](#properties) -->
* [License](#license)

<!-- ## About -->

## Getting Started

### Install

```sh
npm install angular-calendar-scheduler --save
```

or

```sh
yarn add angular-calendar-scheduler
```

### Include Component

##### import

```ts
import { CalendarModule } from 'angular-calendar';
import { SchedulerModule } from 'angular-calendar-scheduler';

@NgModule({
    ...
    imports: [
        ...,
        CalendarModule.forRoot(),
        SchedulerModule.forRoot({ locale: 'en', headerDateFormat: 'daysRange' }),
        ...
    ],
    ...
})
class AppModule { }
```

### Usage

##### app.component.ts

```ts
import { CalendarDateFormatter } from 'angular-calendar';
import { ... } from 'angular-calendar-scheduler';

@Component({
    selector: 'app-component',
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
```

##### app.component.html

```html
    ...
    <calendar-scheduler-view [viewDate]="viewDate"
                             [events]="events"
                             [locale]="locale"
                             [weekStartsOn]="weekStartsOn"
                             [tooltipPlacement]="'top'"
                             [refresh]="refreshSubject"
                             [excludeDays]="excludeDays"
                             [startsWithToday]="startsWithToday"
                             [hourSegments]="2"
                             [dayStartHour]="dayStartHour"
                             [dayEndHour]="dayEndHour"
                             [dayModifier]="dayModifier"
                             [hourModifier]="hourModifier"
                             [segmentModifier]="segmentModifier"
                             [showActions]="true"
                             (dayClicked)="dayClicked($event.day)"
                             (segmentClicked)="segmentClicked('Clicked', $event.segment)"
                             (eventClicked)="eventClicked('Clicked', $event.event)">
    </calendar-scheduler-view>
    ...
```

### License

This software is released under the MIT license. See [LICENSE](LICENSE) for more details.