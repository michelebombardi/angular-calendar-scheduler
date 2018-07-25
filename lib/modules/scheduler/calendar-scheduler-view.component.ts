import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    OnChanges,
    OnInit,
    OnDestroy,
    LOCALE_ID,
    Inject,
    TemplateRef,
    ViewEncapsulation
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import {
    EventColor,
    DayViewHour,
    DayViewHourSegment
} from 'calendar-utils';
import {
    startOfMinute,
    startOfDay,
    startOfWeek,
    endOfDay,
    endOfWeek,
    addMinutes,
    addHours,
    addDays,
    subSeconds,
    setMinutes,
    setHours,
    setDate,
    setMonth,
    setYear,
    isSameSecond,
    isSameDay,
    getDay
} from 'date-fns';
import { SchedulerConfig } from './scheduler-config';


const WEEKEND_DAY_NUMBERS = [0, 6];
const DAYS_IN_WEEK = 7;
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_DAY = 60 * 60 * 24;

export interface SchedulerView {
    days: SchedulerViewDay[];
}

export interface SchedulerViewDay {
    date: Date;
    isPast: boolean;
    isToday: boolean;
    isFuture: boolean;
    isWeekend: boolean;
    inMonth: boolean;
    dragOver: boolean;
    backgroundColor?: string;
    cssClass?: string;
    hours: SchedulerViewHour[];
}

export interface SchedulerViewHour {
    hour: DayViewHour;
    date: Date;
    segments: SchedulerViewHourSegment[];
    isPast: boolean;
    isFuture: boolean;
    hasBorder: boolean;
    backgroundColor?: string;
    cssClass?: string;
}

export interface SchedulerViewHourSegment {
    segment: DayViewHourSegment;
    date: Date;
    events: CalendarSchedulerEvent[];
    isPast: boolean;
    isFuture: boolean;
    isDisabled: boolean;
    hasBorder: boolean;
    backgroundColor?: string;
    cssClass?: string;
}

export interface CalendarSchedulerEvent {
    id: string;
    start: Date;
    end?: Date;
    title: string;
    content?: string;
    color: EventColor;
    actions?: CalendarSchedulerEventAction[];
    status?: CalendarSchedulerEventStatus;
    cssClass?: string;
    startsBeforeSegment?: boolean;
    endsAfterSegment?: boolean;
    isHovered?: boolean;
    isDisabled?: boolean;
    isClickable?: boolean;
}

export type CalendarSchedulerEventStatus = 'ok' | 'warning' | 'danger';

export interface CalendarSchedulerEventAction {
    when?: 'enabled' | 'disabled';
    label: string;
    title: string;
    cssClass?: string;
    onClick(event: CalendarSchedulerEvent): void;
}

 // https://css-tricks.com/snippets/css/a-guide-to-flexbox/
@Component({
    selector: 'calendar-scheduler-view',
    template: `
        <div class="cal-scheduler-view" #weekViewContainer>
            <calendar-scheduler-header
                [days]="headerDays"
                [locale]="locale"
                [customTemplate]="headerTemplate"
                (dayClicked)="dayClicked.emit($event)">
            </calendar-scheduler-header>

            <div class="cal-scheduler">
                <div class="cal-scheduler-hour-rows aside">
                    <div class="cal-scheduler-hour align-center horizontal" *ngFor="let hour of hours">
                      <div class="cal-scheduler-time">
                        <div class="cal-scheduler-hour-segment" *ngFor="let segment of hour.segments">
                            {{ segment.date | calendarDate:'dayViewHour':locale }}
                        </div>
                      </div>
                    </div>
                </div>

                <div class="cal-scheduler-cols aside">
                    <div class="cal-scheduler-col" *ngFor="let day of view.days">
                        <calendar-scheduler-cell
                            *ngFor="let hour of day.hours"
                            [ngClass]="day?.cssClass"
                            [day]="day"
                            [hour]="hour"
                            [locale]="locale"
                            [tooltipPlacement]="tooltipPlacement"
                            [showActions]="showActions"
                            [customTemplate]="cellTemplate"
                            [eventTemplate]="eventTemplate"
                            (click)="dayClicked.emit({date: day})"
                            (highlightSegment)="toggleSegmentHighlight($event.event, true)"
                            (unhighlightSegment)="toggleSegmentHighlight($event.event, false)"
                            (segmentClicked)="segmentClicked.emit({segment: $event.segment})"
                            (eventClicked)="eventClicked.emit({event: $event.event})">
                        </calendar-scheduler-cell>
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./calendar-scheduler-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CalendarSchedulerViewComponent implements OnChanges, OnInit, OnDestroy {
    /**
     * The current view date
     */
    @Input() viewDate: Date;

    /**
     * An array of events to display on view
     */
    @Input() events: CalendarSchedulerEvent[] = [];

    /**
     * The number of segments in an hour. Must be <= 6
     */
    @Input() hourSegments: number = 2;

    /**
     * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
     */
    @Input() excludeDays: number[] = [];

    /**
     * Specify if the first day of current scheduler view has to be today or the first day of the week
     */
    @Input() startsWithToday: boolean = false;

    /**
     * Specify if actions must be shown or not
     */
    @Input() showActions: boolean = true;

    /**
     * A function that will be called before each cell is rendered. The first argument will contain the calendar (day, hour or segment) cell.
     * If you add the `cssClass` property to the cell it will add that class to the cell in the template
     */
    @Input() dayModifier: Function;
    @Input() hourModifier: Function;
    @Input() segmentModifier: Function;

    /**
     * An observable that when emitted on will re-render the current view
     */
    @Input() refresh: Subject<any>;

    /**
     * The locale used to format dates
     */
    @Input() locale: string;

    /**
     * The placement of the event tooltip
     */
    @Input() tooltipPlacement: string = 'bottom';

    /**
     * The start number of the week
     */
    @Input() weekStartsOn: number;

    /**
     * A custom template to use to replace the header
     */
    @Input() headerTemplate: TemplateRef<any>;

    /**
     * A custom template to use to replace the day cell
     */
    @Input() cellTemplate: TemplateRef<any>;

    /**
     * A custom template to use for week view events
     */
    @Input() eventTemplate: TemplateRef<any>;

    /**
     * The precision to display events.
     * `days` will round event start and end dates to the nearest day and `minutes` will not do this rounding
     */
    @Input() precision: 'days' | 'minutes' = 'days';

    /**
     * The day start hours in 24 hour time. Must be 0-23
     */
    @Input() dayStartHour: number = 0;

    /**
     * The day start minutes. Must be 0-59
     */
    @Input() dayStartMinute: number = 0;

    /**
     * The day end hours in 24 hour time. Must be 0-23
     */
    @Input() dayEndHour: number = 23;

    /**
     * The day end minutes. Must be 0-59
     */
    @Input() dayEndMinute: number = 59;

    /**
     * Called when a header week day is clicked
     */
    @Output() dayClicked: EventEmitter<{ date: Date }> = new EventEmitter<{ date: Date }>();

    /**
     * Called when the segment is clicked
     */
    @Output() segmentClicked: EventEmitter<{ segment: SchedulerViewHourSegment }> = new EventEmitter<{ segment: SchedulerViewHourSegment }>();

    /**
     * Called when the event is clicked
     */
    @Output() eventClicked: EventEmitter<{ event: CalendarSchedulerEvent }> = new EventEmitter<{ event: CalendarSchedulerEvent }>();

    /**
     * @hidden
     */
    days: SchedulerViewDay[];

    /**
     * @hidden
     */
    headerDays: SchedulerViewDay[];

    /**
     * @hidden
     */
    view: SchedulerView;

    /**
     * @hidden
     */
    refreshSubscription: Subscription;

    /**
     * @hidden
     */
    hours: DayViewHour[] = [];

    /**
     * @hidden
     */
    constructor(private cdr: ChangeDetectorRef, @Inject(LOCALE_ID) locale: string, private config: SchedulerConfig) {
        this.locale = config.locale || locale;
    }

    /**
     * @hidden
     */
    ngOnInit(): void {
        if (this.refresh) {
            this.refreshSubscription = this.refresh.subscribe(() => {
                this.refreshAll();
                this.cdr.markForCheck();
            });
        }
    }

    /**
     * @hidden
     */
    ngOnChanges(changes: any): void {
        this.hours = this.getSchedulerViewHourGrid({
            viewDate: this.viewDate,
            hourSegments: this.hourSegments,
            dayStart: {
                hour: this.dayStartHour,
                minute: this.dayStartMinute
            },
            dayEnd: {
                hour: this.dayEndHour,
                minute: this.dayEndMinute
            }
        });

        if (changes.viewDate || changes.excludeDays) {
            this.refreshHeader();
        }

        if (changes.events || changes.viewDate || changes.excludeDays || changes.dayStartHour || changes.dayEndHour || changes.dayStartMinute || changes.dayEndMinute) {
            this.refreshBody();
        }
    }

    /**
     * @hidden
     */
    ngOnDestroy(): void {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    /**
     * @hidden
     */
    toggleSegmentHighlight(event: CalendarSchedulerEvent, isHighlighted: boolean): void {
        this.days.forEach((day: SchedulerViewDay) => {
            day.hours.forEach((hour: SchedulerViewHour) => {
                // hour.segments.forEach((segment: SchedulerViewHourSegment) => {
                //    if (isHighlighted && segment.events.indexOf(event) > -1) {
                //        segment.backgroundColor = event.color.secondary;
                //    } else {
                //        delete segment.backgroundColor;
                //    }
                // });
                hour.segments.filter((segment: SchedulerViewHourSegment) => segment.events.some((ev: CalendarSchedulerEvent) => ev.id === event.id && ev.start.getDay() === event.start.getDay()))
                    .forEach((segment: SchedulerViewHourSegment) => {
                        segment.events.filter((ev: CalendarSchedulerEvent) => ev.id === event.id && ev.start.getDay() === event.start.getDay())
                            .forEach((e: CalendarSchedulerEvent) => {
                                if (isHighlighted) {
                                    segment.backgroundColor = e.color.secondary;
                                } else {
                                    delete segment.backgroundColor;
                                }
                        });
                });
            });
        });
    }

    private refreshHeader(): void {
        this.headerDays = this.getSchedulerViewDays({
            viewDate: this.viewDate,
            weekStartsOn: this.weekStartsOn,
            startsWithToday: this.startsWithToday,
            excluded: this.excludeDays
        });
    }

    private refreshBody(): void {
        this.view = this.getSchedulerView({
            events: this.events,
            viewDate: this.viewDate,
            weekStartsOn: this.weekStartsOn,
            startsWithToday: this.startsWithToday,
            excluded: this.excludeDays
        });

        if (this.dayModifier) {
            this.days.forEach(day => this.dayModifier(day));
        }

        if (this.dayModifier || this.hourModifier || this.segmentModifier) {
            this.view.days.forEach(day => {
                if (this.dayModifier) {
                    this.dayModifier(day);
                }
                day.hours.forEach((hour: SchedulerViewHour) => {
                    if (this.hourModifier) {
                        this.hourModifier(hour);
                    }
                    hour.segments.forEach((segment: SchedulerViewHourSegment) => {
                        if (this.segmentModifier) {
                            this.segmentModifier(segment);
                        }
                    });
                });
            });
        }
    }

    private refreshAll(): void {
        this.refreshHeader();
        this.refreshBody();
    }


    private getSchedulerView(args: GetSchedulerViewArgs): SchedulerView {
        let events: CalendarSchedulerEvent[] = args.events || [];
        const viewDate: Date = args.viewDate;
        const weekStartsOn: number = args.weekStartsOn;
        const startsWithToday: boolean = args.startsWithToday;
        const excluded: number[] = args.excluded || [];
        const precision: string = args.precision || 'days';

        if (!events) {
            events = [];
        }

        const startOfViewWeek: Date = startsWithToday ? startOfDay(viewDate) : startOfWeek(viewDate, { weekStartsOn: weekStartsOn });
        const endOfViewWeek: Date = startsWithToday ? addDays(endOfDay(viewDate), 6) : endOfWeek(viewDate, { weekStartsOn: weekStartsOn });
        // let maxRange: number = DAYS_IN_WEEK - excluded.length;
        const eventsInWeek: CalendarSchedulerEvent[] = this.getEventsInPeriod({ events: events, periodStart: startOfViewWeek, periodEnd: endOfViewWeek });

        this.days = this.getSchedulerViewDays({
            viewDate: viewDate,
            weekStartsOn: weekStartsOn,
            startsWithToday: startsWithToday,
            excluded: excluded
        });
        this.days.forEach((day: SchedulerViewDay, dayIndex: number) => {
            const hours: SchedulerViewHour[] = [];
            this.hours.forEach((hour: DayViewHour, hourIndex: number) => {
                const segments: SchedulerViewHourSegment[] = [];
                hour.segments.forEach((segment: DayViewHourSegment, segmentIndex: number) => {
                    segment.date = setDate(setMonth(setYear(segment.date, day.date.getFullYear()), day.date.getMonth()), day.date.getDate());

                    const startOfSegment: Date = segment.date;
                    const endOfSegment: Date = addMinutes(segment.date, MINUTES_IN_HOUR / this.hourSegments);

                    const evts: CalendarSchedulerEvent[] = this.getEventsInPeriod({
                        events: eventsInWeek,
                        periodStart: startOfSegment,
                        periodEnd: endOfSegment
                    }).map((event: CalendarSchedulerEvent) =>
                        <CalendarSchedulerEvent>{
                            id: event.id,
                            start: event.start,
                            end: event.end,
                            title: event.title,
                            content: event.content,
                            color: event.color,
                            actions: event.actions,
                            status: event.status,
                            cssClass: event.cssClass,
                            startsBeforeSegment: event.start < startOfSegment,
                            endsAfterSegment: event.end > endOfSegment,
                            isHovered: false,
                            isDisabled: event.isDisabled || false,
                            isClickable: event.isClickable !== undefined && event.isClickable !== null ? event.isClickable : true
                        });
                    segments.push(<SchedulerViewHourSegment>{
                        segment: segment,
                        date: new Date(segment.date),
                        events: evts,
                        hasBorder: true
                    });
                });

                const hourDate: Date = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate(), hour.segments[0].date.getHours());
                hours.push(<SchedulerViewHour>{ hour: hour, date: hourDate, segments: segments, hasBorder: true });
            });
            day.hours = hours;
        });

        return <SchedulerView>{
            days: this.days
        };
    }


    private isEventInPeriod(args: { event: CalendarSchedulerEvent, periodStart: string | number | Date, periodEnd: string | number | Date }): boolean {
        const event: CalendarSchedulerEvent = args.event, periodStart: string | number | Date = args.periodStart, periodEnd: string | number | Date = args.periodEnd;
        const eventStart: Date = event.start;
        const eventEnd: Date = event.end || event.start;

        if (eventStart > periodStart && eventStart < periodEnd) {
            return true;
        }
        if (eventEnd > periodStart && eventEnd < periodEnd) {
            return true;
        }
        if (eventStart < periodStart && eventEnd > periodEnd) {
            return true;
        }
        if (isSameSecond(eventStart, periodStart) || isSameSecond(eventStart, subSeconds(periodEnd, 1))) {
            return true;
        }
        if (isSameSecond(subSeconds(eventEnd, 1), periodStart) || isSameSecond(eventEnd, periodEnd)) {
            return true;
        }
        return false;
    }

    private getEventsInPeriod(args: { events: CalendarSchedulerEvent[], periodStart: string | number | Date, periodEnd: string | number | Date }): CalendarSchedulerEvent[] {
        const events: CalendarSchedulerEvent[] = args.events, periodStart: string | number | Date = args.periodStart, periodEnd: string | number | Date = args.periodEnd;
        return events.filter((event) => this.isEventInPeriod({ event: event, periodStart: periodStart, periodEnd: periodEnd }));
    }

    private getSchedulerViewDays(args: GetSchedulerViewArgs): SchedulerViewDay[] {
        const viewDate: Date = args.viewDate;
        const weekStartsOn: number = args.weekStartsOn;
        const startsWithToday: boolean = args.startsWithToday;
        const excluded: number[] = args.excluded || [];

        const start = startsWithToday ? new Date(viewDate) : startOfWeek(viewDate, { weekStartsOn: weekStartsOn });
        const days: SchedulerViewDay[] = [];
        const loop = (i: number) => {
            const date = addDays(start, i);
            if (!excluded.some((e: number) => date.getDay() === e)) {
                days.push(this.getSchedulerDay({ date: date }));
            }
        };
        for (let i = 0; i < DAYS_IN_WEEK; i++) {
            loop(i);
        }
        return days;
    }

    private getSchedulerDay(args: { date: Date }): SchedulerViewDay {
        const date: Date = args.date;
        const today: Date = startOfDay(new Date());

        return <SchedulerViewDay>{
            date: date,
            isPast: date < today,
            isToday: isSameDay(date, today),
            isFuture: date > today,
            isWeekend: WEEKEND_DAY_NUMBERS.indexOf(getDay(date)) > -1,
            hours: []
        };
    }

    private getSchedulerViewHourGrid(args: GetSchedulerViewHourGridArgs): DayViewHour[] {
        const viewDate: Date = args.viewDate, hourSegments: number = args.hourSegments, dayStart: any = args.dayStart, dayEnd: any = args.dayEnd;
        const hours: DayViewHour[] = [];

        const startOfView: Date = setMinutes(setHours(startOfDay(viewDate), dayStart.hour), dayStart.minute);
        const endOfView: Date = setMinutes(setHours(startOfMinute(endOfDay(viewDate)), dayEnd.hour), dayEnd.minute);
        const segmentDuration: number = MINUTES_IN_HOUR / hourSegments;
        const startOfViewDay: Date = startOfDay(viewDate);

        const range = (start: number, end: number): number[] => Array.from({ length: ((end + 1) - start) }, (v, k) => k + start);
        const hoursInView: number[] = range(dayStart.hour, dayEnd.hour);

        // for (var i = 0; i < HOURS_IN_DAY; i++) {
        hoursInView.forEach((hour: number, i: number) => {
            const segments = [];
            for (let j = 0; j < hourSegments; j++) {
                const date = addMinutes(addHours(startOfViewDay, hour), j * segmentDuration);
                if (date >= startOfView && date < endOfView) {
                    segments.push({
                        date: date,
                        isStart: j === 0
                    });
                }
            }
            if (segments.length > 0) {
                hours.push(<DayViewHour>{ segments: segments });
            }
        });
        return hours;
    }
}

export interface GetSchedulerViewArgs {
    events?: CalendarSchedulerEvent[];
    viewDate: Date;
    weekStartsOn: number;
    startsWithToday: boolean;
    excluded?: number[];
    precision?: 'minutes' | 'days';
}

export interface GetSchedulerViewHourGridArgs {
    viewDate: Date;
    hourSegments: number;
    dayStart: any;
    dayEnd: any;
}
