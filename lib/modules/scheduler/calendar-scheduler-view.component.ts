import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    OnChanges,
    OnInit,
    AfterViewInit,
    OnDestroy,
    LOCALE_ID,
    Inject,
    TemplateRef,
    ViewEncapsulation,
    ViewChild,
    ElementRef
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
    subDays,
    setMinutes,
    setHours,
    setDate,
    setMonth,
    setYear,
    isSameDay,
    getDay,
    differenceInMinutes,
    isBefore
} from 'date-fns';
import { SchedulerConfig } from './scheduler-config';

const DEFAULT_SEGMENT_HEIGHT_PX = 58;
const DEFAULT_EVENT_WIDTH_PX = 150;
const DEFAULT_SEGMENT_HOURS = 2;

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
    events: CalendarSchedulerEvent[];
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
    events: CalendarSchedulerEvent[];
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
    isHovered?: boolean;
    isDisabled?: boolean;
    isClickable?: boolean;
    top?: number;
    height?: number;
    left?: number;
    width?: number;
    isProcessed?: boolean;
}

export type CalendarSchedulerEventStatus = 'ok' | 'warning' | 'danger';

export interface CalendarSchedulerEventAction {
    when?: 'enabled' | 'disabled';
    label: string;
    title: string;
    cssClass?: string;
    onClick(event: CalendarSchedulerEvent): void;
}

/**
 *  [ngClass]="getPositioningClasses(event)"
 * 
 *  [style.top.%]="event.top"
 *  [style.height.%]="event.height"
 *  [style.left.px]="event.left"
 *  [style.width.px]="event.width - 1"
 */
// https://css-tricks.com/snippets/css/a-guide-to-flexbox/
@Component({
    selector: 'calendar-scheduler-view',
    template: `
        <div class="cal-scheduler-view">
            <calendar-scheduler-header
                [days]="headerDays"
                [locale]="locale"
                [customTemplate]="headerTemplate"
                (dayClicked)="dayClicked.emit($event)">
            </calendar-scheduler-header>

            <div class="cal-scheduler" #calendarContainer>
                <div class="cal-scheduler-hour-rows aside">
                    <div class="cal-scheduler-hour align-center horizontal" *ngFor="let hour of hours">
                      <div class="cal-scheduler-time">
                        <div class="cal-scheduler-hour-segment" *ngFor="let segment of hour.segments"
                            [style.height.px]="segmentHeight">
                            {{ segment.date | calendarDate:'dayViewHour':locale }}
                        </div>
                      </div>
                    </div>
                </div>

                <div class="cal-scheduler-cols aside" #calendarColumnsContainer>
                    <div class="cal-scheduler-col" *ngFor="let day of view.days">
                        <calendar-scheduler-event
                            *ngFor="let event of day.events"
                            [style.top.px]="event.top"
                            [style.height.px]="event.height"
                            [style.left.px]="event.left"
                            [style.width.px]="event.width - 1"
                            [day]="day"
                            [hour]="hour"
                            [segment]="segment"
                            [event]="event"
                            [tooltipPlacement]="tooltipPlacement"
                            [showActions]="showActions"
                            [customTemplate]="eventTemplate"
                            (eventClicked)="onEventClick($event, event)">
                        </calendar-scheduler-event>
                        <calendar-scheduler-cell
                            *ngFor="let hour of day.hours; let i = index"
                            [class.cal-even]="i % 2 === 0"
                            [class.cal-odd]="i % 2 === 1"
                            [ngClass]="day?.cssClass"
                            [segmentHeight]="segmentHeight"
                            [day]="day"
                            [hour]="hour"
                            [locale]="locale"
                            [tooltipPlacement]="tooltipPlacement"
                            [showActions]="showActions"
                            [customTemplate]="cellTemplate"
                            [eventTemplate]="eventTemplate"
                            (click)="dayClicked.emit({date: day})"
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
export class CalendarSchedulerViewComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
    @ViewChild('calendarColumnsContainer') calendarColumnsContainer: ElementRef;
    private calendarColumnsHeight: number;
    
    /**
     * The current view date
     */
    @Input() viewDate: Date;

    /**
     * An array of events to display on view
     */
    @Input() events: CalendarSchedulerEvent[] = [];

    /**
     * The number of segments in an hour. Must be one of 1, 2, 4, 6
     */
    @Input() hourSegments: 1 | 2 | 4 | 6 = DEFAULT_SEGMENT_HOURS;

    /**
    * The height in pixels of each hour segment
    */
    @Input() segmentHeight: number = DEFAULT_SEGMENT_HEIGHT_PX;

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
    @Input() eventModifier: Function;

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
     * The width in pixels of each event on the view
     */
    @Input() eventWidth: number = DEFAULT_EVENT_WIDTH_PX;

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
    ngAfterViewInit(): void {
        const calendarColumnsContainerDOM = this.calendarColumnsContainer.nativeElement as HTMLDivElement;
        this.eventWidth = calendarColumnsContainerDOM.children[0].clientWidth;
        this.cdr.markForCheck();
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

        if (changes.events || 
            changes.viewDate || 
            changes.excludeDays || 
            changes.dayStartHour || 
            changes.dayEndHour || 
            changes.dayStartMinute || 
            changes.dayEndMinute || 
            changes.eventWidth
        ) {
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
    onEventClick(mouseEvent: MouseEvent, event: CalendarSchedulerEvent): void {
        if (mouseEvent.stopPropagation) {
            mouseEvent.stopPropagation();
        }
        if (event.isClickable) {
            this.eventClicked.emit({ event: event });
        }
    }

    getPositioningClasses(day: SchedulerViewDay, event: CalendarSchedulerEvent): string {
        const classes: string[] = [
            this.getDayClass(event.start),
            this.getTimeClass(day.date, event),
            this.getLengthClass(day.date, event)
        ];
        return classes.join(' ');
    }

    private getDayClass(date: Date): string {
        return '';
    }

    private getTimeClass(date: Date, event: CalendarSchedulerEvent): string {
        if (isSameDay(date, event.start)) {
            let hours: number = event.start.getHours();
            if (this.dayStartHour > 0) { hours = event.start.getHours() - this.dayStartHour; }
            const hoursString: string = hours < 10 ? `0${hours}` : `${hours}`;
            const minutesString: string = event.start.getMinutes() < 10 ? `0${event.start.getMinutes()}` : `${event.start.getMinutes()}`;
            return `time${hoursString}${minutesString}`;
        } else if (isBefore(event.start, startOfDay(date))) {
            return `time0000`;
        }
    }

    private getLengthClass(date: Date, event: CalendarSchedulerEvent): string {
        if (isSameDay(date, event.start)) {
            const durationInMinutes: number = differenceInMinutes(event.end, event.start);
            const leftToEndOfDay: number = differenceInMinutes(setMinutes(setHours(event.start, this.dayEndHour + 1), 0), event.start);
            return leftToEndOfDay > durationInMinutes ? `length${durationInMinutes}` : `length${leftToEndOfDay}`;
        } else if (isBefore(event.start, startOfDay(date))) {
            let leftDurationInMinutes: number = 0;
            if(isSameDay(date, event.end)) {
                leftDurationInMinutes = differenceInMinutes(event.end, startOfDay(date));
                if (this.dayStartHour > 0) { leftDurationInMinutes = (event.end.getHours() - this.dayStartHour) * MINUTES_IN_HOUR; }
            } else {
                leftDurationInMinutes = ((this.dayEndHour + 1) - this.dayStartHour) * MINUTES_IN_HOUR;
            }
            return `length${leftDurationInMinutes}`;
        }
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
            hourSegments: this.hourSegments,
            weekStartsOn: this.weekStartsOn,
            startsWithToday: this.startsWithToday,
            dayStart: {
                hour: this.dayStartHour,
                minute: this.dayStartMinute
            },
            dayEnd: {
                hour: this.dayEndHour,
                minute: this.dayEndMinute
            },
            excluded: this.excludeDays,
            eventWidth: this.eventWidth,
            segmentHeight: this.segmentHeight
        });

        this.view.days.forEach((day: SchedulerViewDay) => {
            day.events.forEach((event: CalendarSchedulerEvent) => {
                this.scaleOverlappingEvents(event.start, event.end, day.events);
            });
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

        if (this.eventModifier) {
            this.events.forEach(event => this.eventModifier(event));
        }
    }

    private refreshAll(): void {
        this.refreshHeader();
        this.refreshBody();
    }


    private getSchedulerView(args: GetSchedulerViewArgs): SchedulerView {
        let events: CalendarSchedulerEvent[] = args.events || [];
        if (!events) { events = []; }

        const viewDate: Date = args.viewDate;
        const weekStartsOn: number = args.weekStartsOn;
        const startsWithToday: boolean = args.startsWithToday;
        const excluded: number[] = args.excluded || [];
        const hourSegments: number = args.hourSegments || DEFAULT_SEGMENT_HOURS;
        const segmentHeight: number = args.segmentHeight || DEFAULT_SEGMENT_HEIGHT_PX;
        const eventWidth: number = args.eventWidth || DEFAULT_EVENT_WIDTH_PX;
        const dayStart: any = args.dayStart, dayEnd: any = args.dayEnd;

        const startOfViewWeek: Date = startsWithToday ? startOfDay(viewDate) : startOfWeek(viewDate, { weekStartsOn: weekStartsOn });
        const endOfViewWeek: Date = startsWithToday ? addDays(endOfDay(viewDate), 6) : endOfWeek(viewDate, { weekStartsOn: weekStartsOn });

        const eventsInWeek: CalendarSchedulerEvent[] = this.getEventsInPeriod({ events: events, periodStart: startOfViewWeek, periodEnd: endOfViewWeek });

        this.days = this.getSchedulerViewDays({
            viewDate: viewDate,
            weekStartsOn: weekStartsOn,
            startsWithToday: startsWithToday,
            excluded: excluded
        });
        this.days.forEach((day: SchedulerViewDay) => {
            const startOfView: Date = setMinutes(setHours(startOfDay(day.date), dayStart.hour), dayStart.minute);
            const endOfView: Date = setMinutes(setHours(startOfMinute(endOfDay(day.date)), dayEnd.hour), dayEnd.minute);
            const previousDayEvents: CalendarSchedulerEvent[] = [];
            day.events = this.getEventsInPeriod({
                events: eventsInWeek,
                periodStart: startOfDay(day.date),
                periodEnd: endOfDay(day.date)
            }).sort((eventA: CalendarSchedulerEvent, eventB: CalendarSchedulerEvent) => {
                return eventA.start.valueOf() - eventB.start.valueOf();
            }).map((ev: CalendarSchedulerEvent) => {
                const eventStart: Date = ev.start;
                const eventEnd: Date = ev.end || eventStart;
                const startsBeforeDay: boolean = eventStart < startOfView;
                const endsAfterDay: boolean = eventEnd > endOfView;
                const hourHeightModifier: number = ((hourSegments * segmentHeight) + 1) / MINUTES_IN_HOUR; // +1 for the 1px top border

                let top: number = 0;
                if (eventStart > startOfView) {
                    top += differenceInMinutes(eventStart, startOfView);
                }
                top *= hourHeightModifier;

                const startDate: Date = startsBeforeDay ? startOfView : eventStart;
                const endDate: Date = endsAfterDay ? endOfView : eventEnd;
                let height: number = differenceInMinutes(endDate, startDate);
                if (!ev.end) {
                    height = segmentHeight;
                } else {
                    height *= hourHeightModifier;
                }

                const bottom: number = top + height;
                const overlappingPreviousEvents = this.getOverLappingDayViewEvents(
                    previousDayEvents,
                    top,
                    bottom
                );

                let left: number = 0;
                while (overlappingPreviousEvents.some(previousEvent => previousEvent.left === left)) {
                    left += eventWidth;
                }

                const event: CalendarSchedulerEvent =  
                <CalendarSchedulerEvent>{
                    id: ev.id,
                    start: ev.start,
                    end: ev.end,
                    title: ev.title,
                    content: ev.content,
                    color: ev.color,
                    actions: ev.actions,
                    status: ev.status,
                    cssClass: ev.cssClass,
                    isHovered: false,
                    isDisabled: ev.isDisabled || false,
                    isClickable: ev.isClickable !== undefined && ev.isClickable !== null ? ev.isClickable : true,
                    top: top,
                    height: height,
                    width: eventWidth,
                    left: left
                };

                previousDayEvents.push(event);

                return event;
            });

            const hours: SchedulerViewHour[] = [];
            this.hours.forEach((hour: DayViewHour) => {
                const segments: SchedulerViewHourSegment[] = [];
                hour.segments.forEach((segment: DayViewHourSegment) => {
                    segment.date = setDate(setMonth(setYear(segment.date, day.date.getFullYear()), day.date.getMonth()), day.date.getDate());

                    const startOfSegment: Date = segment.date;
                    const endOfSegment: Date = addMinutes(segment.date, MINUTES_IN_HOUR / this.hourSegments);

                    const eventsInSegment: CalendarSchedulerEvent[] = this.getEventsInPeriod({
                        events: day.events,
                        periodStart: startOfSegment,
                        periodEnd: endOfSegment
                    });

                    segments.push(<SchedulerViewHourSegment>{
                        segment: segment,
                        date: new Date(segment.date),
                        events: eventsInSegment,
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

        if (eventStart >= periodStart && eventStart < periodEnd) {
            return true;
        }
        if (eventEnd <= periodEnd && eventEnd > periodStart) {
            return true;
        }
        if (eventStart < periodStart && eventEnd > periodEnd) {
            return true;
        }

        return false;
    }

    private getEventsInPeriod(args: { events: CalendarSchedulerEvent[], periodStart: string | number | Date, periodEnd: string | number | Date }): CalendarSchedulerEvent[] {
        const events: CalendarSchedulerEvent[] = args.events, periodStart: string | number | Date = args.periodStart, periodEnd: string | number | Date = args.periodEnd;
        return events.filter((event) => this.isEventInPeriod({ event: event, periodStart: periodStart, periodEnd: periodEnd }));
    }

    private scaleOverlappingEvents(startTime: Date, endTime: Date, events: CalendarSchedulerEvent[]): void {
        let newStartTime: Date = startTime;
        let newEndTime: Date = endTime;
        const overlappingEvents: CalendarSchedulerEvent[] = [];
        let maxLeft = 0;
        events.forEach((event: CalendarSchedulerEvent) => {
            if (event.isProcessed) {
                return;
            }
            if (event.start < startTime && event.end > startTime) {
                newStartTime = event.start;
            } else if (event.end > endTime && event.start < endTime) {
                newEndTime = event.end;
            } else if (event.end <= endTime && event.start >= startTime) {
                // Nothing, but remove condition and add equals to above two for overlapping effect
            } else {
                return;
            }
            if (event.left > maxLeft) {
                maxLeft = event.left;
            }
            overlappingEvents.push(event);
        });
        if (startTime === newStartTime && endTime === newEndTime) {
            const divisorFactor = Math.floor(maxLeft / this.eventWidth) + 1;
            overlappingEvents.forEach((event: CalendarSchedulerEvent) => {
                event.isProcessed = true;
                event.left /= divisorFactor;
                event.width /= divisorFactor;
            });
        } else {
            this.scaleOverlappingEvents(newStartTime, newEndTime, events);
        }
    }

    private getOverLappingDayViewEvents(events: CalendarSchedulerEvent[], top: number, bottom: number): CalendarSchedulerEvent[] {
        return events.filter((previousEvent: CalendarSchedulerEvent) => {
            const previousEventTop: number = previousEvent.top;
            const previousEventBottom: number =
                previousEvent.top + previousEvent.height;
        
            if (top < previousEventBottom && previousEventBottom < bottom) {
                return true;
            } else if (previousEventTop <= top && bottom <= previousEventBottom) {
                return true;
            }
        
            return false;
        });
    }


    private getSchedulerViewDays(args: GetSchedulerViewDayArgs): SchedulerViewDay[] {
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
            isFuture: date >= addDays(today, 1),
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

export interface GetSchedulerViewDayArgs {
    viewDate: Date;
    weekStartsOn: number;
    startsWithToday: boolean;
    excluded?: number[];
}

export interface GetSchedulerViewArgs {
    events?: CalendarSchedulerEvent[];
    viewDate: Date;
    hourSegments: 1 | 2 | 4 | 6;
    weekStartsOn: number;
    startsWithToday: boolean;
    dayStart: {
        hour: number;
        minute: number;
    };
    dayEnd: {
        hour: number;
        minute: number;
    };
    excluded?: number[];
    eventWidth: number;
    segmentHeight: number;
}

export interface GetSchedulerViewHourGridArgs {
    viewDate: Date;
    hourSegments: number;
    dayStart: {
        hour: number;
        minute: number;
    };
    dayEnd: {
        hour: number;
        minute: number;
    };
}
