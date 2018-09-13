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
    setMinutes,
    setHours,
    setDate,
    setMonth,
    setYear,
    isSameDay,
    getDay,
    differenceInMinutes,
    isBefore,
    subMinutes
} from 'date-fns';
import { ResizeEvent } from 'angular-resizable-element';
import { CalendarResizeHelper } from './helpers/calendar-resize-helper.provider';
import { CalendarDragHelper } from './helpers/calendar-drag-helper.provider';
import { SchedulerConfig } from './scheduler-config';
import { CalendarEventTimesChangedEventType } from 'angular-calendar';
import { DragMoveEvent, DragEndEvent, DropEvent } from 'angular-draggable-droppable';

const DEFAULT_HOUR_SEGMENT_HEIGHT_PX = 40;
const DEFAULT_EVENT_WIDTH_PERCENT = 100;
const DEFAULT_HOUR_SEGMENTS = 2;

export enum DAYS_OF_WEEK {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6
}

const DEFAULT_WEEKEND_DAYS: number[] = [
    DAYS_OF_WEEK.SUNDAY,
    DAYS_OF_WEEK.SATURDAY
];

const DAYS_IN_WEEK = 7;
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_DAY = 60 * 60 * 24;

export interface SchedulerView {
    days: SchedulerViewDay[];
    period: SchedulerViewPeriod;
}

export interface SchedulerViewPeriod {
    start: Date;
    end: Date;
    events: CalendarSchedulerEvent[];
}

export interface SchedulerViewDay {
    date: Date;
    events: SchedulerViewEvent[];
    isPast: boolean;
    isToday: boolean;
    isFuture: boolean;
    isWeekend: boolean;
    inMonth: boolean;
    backgroundColor?: string;
    cssClass?: string;
    hours: SchedulerViewHour[];
}

export interface SchedulerViewHour {
    hour: DayViewHour;
    date: Date;
    events: CalendarSchedulerEvent[];
    segments: SchedulerViewHourSegment[];
    backgroundColor?: string;
    cssClass?: string;
}

export interface SchedulerViewHourSegment {
    segment: DayViewHourSegment;
    date: Date;
    events: CalendarSchedulerEvent[];
    isDisabled: boolean;
    dragOver: boolean;
    backgroundColor?: string;
    cssClass?: string;
}

export interface SchedulerViewEvent {
    event: CalendarSchedulerEvent;
    top?: number;
    height?: number;
    left?: number;
    width?: number;
    startsBeforeDay?: boolean;
    endsAfterDay?: boolean;
    isProcessed?: boolean;
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
    isDisabled?: boolean;
    isClickable?: boolean;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;
}

export type CalendarSchedulerEventStatus = 'ok' | 'warning' | 'danger';

export interface CalendarSchedulerEventAction {
    when?: 'enabled' | 'disabled';
    label: string;
    title: string;
    cssClass?: string;
    onClick(event: CalendarSchedulerEvent): void;
}

export interface SchedulerEventTimesChangedEvent {
    event: CalendarSchedulerEvent;
    newStart: Date;
    newEnd?: Date;
    type?: CalendarEventTimesChangedEventType;
}

export interface SchedulerResizeEvent extends ResizeEvent {
    originalTop: number;
    originalHeight: number;
    edge: string;
}

/**
 *  [ngClass]="getPositioningClasses(event)"
 *
 *  [style.top.px]="event.top"
 *  [style.height.px]="event.height"
 *  [style.left.%]="event.left"
 *  [style.width.%]="event.width"
 *
 *  DRAG & DROP & RESIZE -> https://github.com/mattlewis92/angular-calendar/blob/master/projects/angular-calendar/src/modules/week/calendar-week-view.component.ts
 *  FLEXBOX -> https://css-tricks.com/snippets/css/a-guide-to-flexbox/
 */
@Component({
    selector: 'calendar-scheduler-view',
    template: `
        <div class="cal-scheduler-view">
            <calendar-scheduler-header
                [days]="headerDays"
                [locale]="locale"
                [customTemplate]="headerTemplate"
                (dayHeaderClicked)="dayHeaderClicked.emit($event)"
                (eventDropped)="eventDropped({dropData: $event}, $event.newStart)">
            </calendar-scheduler-header>

            <div class="cal-scheduler" #calendarContainer>
                <div class="cal-scheduler-hour-rows aside">
                    <div class="cal-scheduler-hour align-center horizontal" *ngFor="let hour of hours">
                      <div class="cal-scheduler-time">
                        <div class="cal-scheduler-hour-segment" *ngFor="let segment of hour.segments"
                            [style.height.px]="hourSegmentHeight">
                            {{ segment.date | calendarDate:'dayViewHour':locale }}
                        </div>
                      </div>
                    </div>
                </div>

                <div class="cal-scheduler-cols aside" #dayColumns
                    mwlDroppable
                    (dragEnter)="eventDragEnter = eventDragEnter + 1"
                    (dragLeave)="eventDragEnter = eventDragEnter - 1">
                    <div class="cal-scheduler-col"
                        *ngFor="let day of view.days; trackBy:trackByHourColumn"
                        [ngClass]="day?.cssClass"
                        [style.backgroundColor]="day.backgroundColor">
                        <div #eventContainer
                            class="cal-scheduler-event-container"
                            *ngFor="let event of day.events; trackBy:trackByDayOrEvent"
                            [ngClass]="event.event?.cssClass"
                            [style.top.px]="event.top"
                            [style.height.px]="event.height"
                            [style.left.%]="event.left"
                            [style.width.%]="event.width"
                            mwlResizable
                            [resizeSnapGrid]="{left: dayColumnWidth, right: dayColumnWidth, top: eventSnapSize || hourSegmentHeight, bottom: eventSnapSize || hourSegmentHeight}"
                            [validateResize]="validateResize"
                            (resizeStart)="resizeStarted(dayColumns, event, $event)"
                            (resizing)="resizing(event, $event)"
                            (resizeEnd)="resizeEnded(event)"

                            mwlDraggable
                            dragActiveClass="cal-drag-active"
                            [dropData]="{event: event.event, calendarId: calendarId}"
                            [dragAxis]="{
                                x: event.event.draggable && resizes.size === 0,
                                y: event.event.draggable && resizes.size === 0
                            }"
                            [dragSnapGrid]="snapDraggedEvents ? {x: dayColumnWidth, y: eventSnapSize || hourSegmentHeight} : {}"
                            [ghostDragEnabled]="!snapDraggedEvents"
                            [validateDrag]="validateDrag"
                            (dragPointerDown)="dragStarted(dayColumns, eventContainer, event)"
                            (dragging)="dragMove(event, $event)"
                            (dragEnd)="dragEnded(event, $event, dayColumnWidth, true)">
                            <div *ngIf="event.event?.resizable?.beforeStart && !event.startsBeforeDay"
                                class="cal-resize-handle cal-resize-handle-before-start"
                                mwlResizeHandle
                                [resizeEdges]="{
                                    left: true,
                                    top: true
                                }">
                            </div>
                            <calendar-scheduler-event
                                [day]="day"
                                [event]="event"
                                [tooltipPlacement]="tooltipPlacement"
                                [showActions]="showActions"
                                [showStatus]="showEventStatus"
                                [customTemplate]="eventTemplate"
                                [eventTitleTemplate]="eventTitleTemplate"
                                (eventClicked)="eventClicked.emit($event)">
                            </calendar-scheduler-event>
                            <div *ngIf="event.event?.resizable?.afterEnd && !event.endsAfterDay"
                                class="cal-resize-handle cal-resize-handle-after-end"
                                mwlResizeHandle
                                [resizeEdges]="{
                                    right: true,
                                    bottom: true
                                }">
                            </div>
                        </div>
                        <calendar-scheduler-cell
                            *ngFor="let hour of day.hours; let i = index; trackBy:trackByHour"
                            [class.cal-even]="i % 2 === 0"
                            [class.cal-odd]="i % 2 === 1"
                            [ngClass]="hour?.cssClass"
                            [style.backgroundColor]="hour.backgroundColor"
                            [hourSegmentHeight]="hourSegmentHeight"
                            [day]="day"
                            [hour]="hour"
                            [locale]="locale"
                            [tooltipPlacement]="tooltipPlacement"
                            [showHour]="showSegmentHour"
                            [customTemplate]="cellTemplate"
                            (click)="hourClicked.emit({hour: hour})"
                            (segmentClicked)="segmentClicked.emit($event)"
                            (eventClicked)="eventClicked.emit($event)">
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
     * The number of segments in an hour. Must be one of 1, 2, 4, 6
     */
    @Input() hourSegments: 1 | 2 | 4 | 6 = DEFAULT_HOUR_SEGMENTS;

    /**
    * The height in pixels of each hour segment
    */
    @Input() hourSegmentHeight: number = DEFAULT_HOUR_SEGMENT_HEIGHT_PX;

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
     * Specify if status must be shown or not
     */
    @Input() showEventStatus: boolean = true;

    /**
     * Specify if hour must be shown on segment or not
     */
    @Input() showSegmentHour: boolean = false;

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
     * The grid size to snap resizing and dragging of events to
     */
    @Input() eventSnapSize: number = this.hourSegmentHeight;

    /**
    * Whether to snap events to a grid when dragging
    */
    @Input() snapDraggedEvents: boolean = true;

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
     * A custom template to use for event titles
     */
    @Input() eventTitleTemplate: TemplateRef<any>;

    /**
     * A custom template to use for all day events
     */
    @Input() allDayEventTemplate: TemplateRef<any>;

    /**
     * An array of day indexes (0 = sunday, 1 = monday etc) that indicate which days are weekends
     */
    @Input() weekendDays: number[];

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
    @Input() eventWidthPercent: number = DEFAULT_EVENT_WIDTH_PERCENT;

    /**
     * Called when a header week day is clicked
     */
    @Output() dayHeaderClicked: EventEmitter<{ day: SchedulerViewDay }> = new EventEmitter<{ day: SchedulerViewDay }>();

    /**
     * Called when the hour is clicked
     */
    @Output() hourClicked: EventEmitter<{ hour: SchedulerViewHour }> = new EventEmitter<{ hour: SchedulerViewHour }>();

    /**
     * Called when the segment is clicked
     */
    @Output() segmentClicked: EventEmitter<{ segment: SchedulerViewHourSegment }> = new EventEmitter<{ segment: SchedulerViewHourSegment }>();

    /**
     * Called when the event is clicked
     */
    @Output() eventClicked: EventEmitter<{ event: CalendarSchedulerEvent }> = new EventEmitter<{ event: CalendarSchedulerEvent }>();

    /**
     * Called when an event is resized or dragged and dropped
     */
    @Output() eventTimesChanged: EventEmitter<SchedulerEventTimesChangedEvent> = new EventEmitter<SchedulerEventTimesChangedEvent>();

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
    // resizes: Map<CalendarSchedulerEvent, SchedulerResizeEvent> = new Map();
    resizes: Map<CalendarSchedulerEvent, ResizeEvent> = new Map();

    /**
     * @hidden
     */
    eventDragEnter: number = 0;

    /**
     * @hidden
     */
    dragActive: boolean = false;

    /**
     * @hidden
     */
    validateResize: (args: any) => boolean;

    /**
     * @hidden
     */
    validateDrag: (args: any) => boolean;

    /**
     * @hidden
     */
    dayColumnWidth: number;

    /**
     * @hidden
     */
    calendarId: Symbol = Symbol('angular calendar scheduler view id');

    /**
     * @hidden
     */
    trackByDayOrEvent = (index: number, event: SchedulerViewEvent ) => (event.event.id ? event.event.id : event.event);

    /**
     * @hidden
     */
    trackByHourColumn = (index: number, day: SchedulerViewDay) => day.hours[0] ? day.hours[0].segments[0].date.toISOString() : day;

    /**
     * @hidden
     */
    trackByHour = (index: number, hour: DayViewHour) => hour.segments[0].date.toISOString();

    /**
     * @hidden
     */
    roundToNearest = (amount: number, precision: number) => Math.round(amount / precision) * precision;

    /**
     * @hidden
     */
    getMinutesMoved = (movedY: number, hourSegments: number, hourSegmentHeight: number, eventSnapSize: number): number => {
        const draggedInPixelsSnapSize = this.roundToNearest(movedY, eventSnapSize || hourSegmentHeight);
        const pixelAmountInMinutes = MINUTES_IN_HOUR / (hourSegments * hourSegmentHeight);
        return draggedInPixelsSnapSize * pixelAmountInMinutes;
    }

    /**
     * @hidden
     */
    isDraggedWithinPeriod = (newStart: Date, newEnd: Date, period: SchedulerViewPeriod): boolean => {
        const end = newEnd || newStart;
        return (
            (period.start <= newStart && newStart <= period.end) ||
            (period.start <= end && end <= period.end)
        );
    }

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
        if (changes.viewDate || changes.excludeDays || changes.weekendDays) {
            this.refreshHeader();
        }

        if (changes.viewDate ||
            changes.events ||
            changes.dayStartHour ||
            changes.dayEndHour ||
            changes.dayStartMinute ||
            changes.dayEndMinute ||
            changes.excludeDays ||
            changes.eventWidth
        ) {
            this.refreshHourGrid();
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
            if (isSameDay(date, event.end)) {
                leftDurationInMinutes = differenceInMinutes(event.end, startOfDay(date));
                if (this.dayStartHour > 0) { leftDurationInMinutes = (event.end.getHours() - this.dayStartHour) * MINUTES_IN_HOUR; }
            } else {
                leftDurationInMinutes = ((this.dayEndHour + 1) - this.dayStartHour) * MINUTES_IN_HOUR;
            }
            return `length${leftDurationInMinutes}`;
        }
    }


    private refreshHourGrid(): void {
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
    }

    private refreshHeader(): void {
        this.headerDays = this.getSchedulerViewDays({
            viewDate: this.viewDate,
            weekStartsOn: this.weekStartsOn,
            startsWithToday: this.startsWithToday,
            excluded: this.excludeDays,
            weekendDays: this.weekendDays
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
            eventWidth: this.eventWidthPercent,
            hourSegmentHeight: this.hourSegmentHeight
        });

        this.view.days.forEach((day: SchedulerViewDay) => {
            day.events.forEach((event: SchedulerViewEvent) => {
                this.scaleOverlappingEvents(event.event.start, event.event.end, day.events);
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
        this.refreshHourGrid();
        this.refreshBody();
    }


    private getSchedulerView(args: GetSchedulerViewArgs, days?: SchedulerViewDay[]): SchedulerView {
        let events: CalendarSchedulerEvent[] = args.events || [];
        if (!events) { events = []; }

        const viewDate: Date = args.viewDate;
        const weekStartsOn: number = args.weekStartsOn;
        const startsWithToday: boolean = args.startsWithToday;
        const excluded: number[] = args.excluded || [];
        const hourSegments: number = args.hourSegments || DEFAULT_HOUR_SEGMENTS;
        const hourSegmentHeight: number = args.hourSegmentHeight || DEFAULT_HOUR_SEGMENT_HEIGHT_PX;
        const eventWidth: number = args.eventWidth || DEFAULT_EVENT_WIDTH_PERCENT;
        const dayStart: any = args.dayStart, dayEnd: any = args.dayEnd;

        const startOfViewWeek: Date = startsWithToday ? startOfDay(viewDate) : startOfWeek(viewDate, { weekStartsOn: weekStartsOn });
        const endOfViewWeek: Date = startsWithToday ? addDays(endOfDay(viewDate), 6) : endOfWeek(viewDate, { weekStartsOn: weekStartsOn });

        const eventsInWeek: CalendarSchedulerEvent[] = this.getEventsInPeriod({
            events: events,
            periodStart: startOfViewWeek,
            periodEnd: endOfViewWeek
        });

        this.days = days || this.getSchedulerViewDays({
            viewDate: viewDate,
            weekStartsOn: weekStartsOn,
            startsWithToday: startsWithToday,
            excluded: excluded
        });
        this.days.forEach((day: SchedulerViewDay) => {
            const startOfView: Date = setMinutes(setHours(startOfDay(day.date), dayStart.hour), dayStart.minute);
            const endOfView: Date = setMinutes(setHours(startOfMinute(endOfDay(day.date)), dayEnd.hour), dayEnd.minute);
            const previousDayEvents: SchedulerViewEvent[] = [];

            const eventsInDay: CalendarSchedulerEvent[] = this.getEventsInPeriod({
                events: eventsInWeek,
                periodStart: startOfDay(day.date),
                periodEnd: endOfDay(day.date)
            });

            day.events = eventsInDay
                .sort((eventA: CalendarSchedulerEvent, eventB: CalendarSchedulerEvent) => eventA.start.valueOf() - eventB.start.valueOf())
                .map((ev: CalendarSchedulerEvent) => {
                    const eventStart: Date = ev.start;
                    const eventEnd: Date = ev.end || eventStart;
                    const startsBeforeDay: boolean = eventStart < startOfView;
                    const endsAfterDay: boolean = eventEnd > endOfView;
                    const hourHeightModifier: number = ((hourSegments * hourSegmentHeight) + 1) / MINUTES_IN_HOUR; // +1 for the 1px top border

                    let top: number = 0;
                    if (eventStart > startOfView) {
                        top += differenceInMinutes(eventStart, startOfView);
                    }
                    top *= hourHeightModifier;

                    const startDate: Date = startsBeforeDay ? startOfView : eventStart;
                    const endDate: Date = endsAfterDay ? endOfView : eventEnd;
                    let height: number = differenceInMinutes(endDate, startDate);
                    if (!ev.end) {
                        height = hourSegmentHeight;
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

                    const event: SchedulerViewEvent =
                    <SchedulerViewEvent>{
                        event: ev,
                        top: top,
                        height: height,
                        width: eventWidth,
                        left: left,
                        startsBeforeDay: startsBeforeDay,
                        endsAfterDay: endsAfterDay,
                        isProcessed: false
                    };

                    previousDayEvents.push(event);

                    return event;
                });

            day.hours = this.hours.map((hour: DayViewHour) => {
                const date: Date = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate(), hour.segments[0].date.getHours());

                const startOfHour: Date = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate(), hour.segments[0].date.getHours());
                const endOfHour: Date = subMinutes(addHours(startOfHour, 1), 1);

                const eventsInHour: CalendarSchedulerEvent[] = this.getEventsInPeriod({
                    events: eventsInDay,
                    periodStart: startOfHour,
                    periodEnd: endOfHour
                });

                const segments: SchedulerViewHourSegment[] =
                    hour.segments.map((segment: DayViewHourSegment) => {
                        segment.date = setDate(setMonth(setYear(segment.date, day.date.getFullYear()), day.date.getMonth()), day.date.getDate());

                        const startOfSegment: Date = segment.date;
                        const endOfSegment: Date = addMinutes(segment.date, MINUTES_IN_HOUR / this.hourSegments);

                        const eventsInSegment: CalendarSchedulerEvent[] = this.getEventsInPeriod({
                            events: eventsInHour,
                            periodStart: startOfSegment,
                            periodEnd: endOfSegment
                        });

                        return <SchedulerViewHourSegment>{
                            segment: segment,
                            date: new Date(segment.date),
                            events: eventsInSegment
                        };
                    });

                return <SchedulerViewHour>{
                    hour: hour,
                    date: date,
                    events: eventsInHour,
                    segments: segments
                };
            });
        });

        return <SchedulerView>{
            days: this.days,
            period: {
                events: eventsInWeek,
                start: startOfViewWeek,
                end: endOfViewWeek
            }
        };
    }

    private refreshSchedulerView(events: CalendarSchedulerEvent[]): SchedulerView {
        return this.getSchedulerView({
            events: events,
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
            eventWidth: this.eventWidthPercent,
            hourSegmentHeight: this.hourSegmentHeight
        },
        this.days);
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

    private scaleOverlappingEvents(startTime: Date, endTime: Date, events: SchedulerViewEvent[]): void {
        let newStartTime: Date = startTime;
        let newEndTime: Date = endTime;
        const overlappingEvents: SchedulerViewEvent[] = [];
        let maxLeft = 0;
        events.forEach((event: SchedulerViewEvent) => {
            if (event.isProcessed) {
                return;
            }
            if (event.event.start < startTime && event.event.end > startTime) {
                newStartTime = event.event.start;
            } else if (event.event.end > endTime && event.event.start < endTime) {
                newEndTime = event.event.end;
            } else if (event.event.end <= endTime && event.event.start >= startTime) {
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
            const divisorFactor = Math.floor(maxLeft / this.eventWidthPercent) + 1;
            overlappingEvents.forEach((event: SchedulerViewEvent) => {
                event.isProcessed = true;
                event.left /= divisorFactor;
                event.width /= divisorFactor;
            });
        } else {
            this.scaleOverlappingEvents(newStartTime, newEndTime, events);
        }
    }

    private getOverLappingDayViewEvents(events: SchedulerViewEvent[], top: number, bottom: number): SchedulerViewEvent[] {
        return events.filter((previousEvent: SchedulerViewEvent) => {
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
        const weekendDays: number[] = args.weekendDays || DEFAULT_WEEKEND_DAYS;

        const start = startsWithToday ? new Date(viewDate) : startOfWeek(viewDate, { weekStartsOn: weekStartsOn });
        const days: SchedulerViewDay[] = [];
        const loop = (i: number) => {
            const date = addDays(start, i);
            if (!excluded.some((e: number) => date.getDay() === e)) {
                days.push(this.getSchedulerDay({ date, weekendDays }));
            }
        };
        for (let i = 0; i < DAYS_IN_WEEK; i++) {
            loop(i);
        }
        return days;
    }

    private getSchedulerDay(args: { date: Date, weekendDays: number[] }): SchedulerViewDay {
        const date: Date = args.date;
        const today: Date = startOfDay(new Date());

        return <SchedulerViewDay>{
            date: date,
            isPast: date < today,
            isToday: isSameDay(date, today),
            isFuture: date >= addDays(today, 1),
            isWeekend: args.weekendDays.indexOf(getDay(date)) > -1,
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

    //#region RESIZE

    /**
     * @hidden
     */
    resizeStarted(eventsContainer: HTMLElement, event: SchedulerViewEvent, resizeEvent: ResizeEvent): void {
        // this.resizes.set(event.event, <SchedulerResizeEvent>{
        //     rectangle: resizeEvent.rectangle,
        //     edges: resizeEvent.edges,
        //     originalTop: event.top,
        //     originalHeight: event.height,
        //     edge: typeof resizeEvent.edges.top !== 'undefined' ? 'top' : 'bottom'
        // });

        // const resizeHelper: CalendarResizeHelper = new CalendarResizeHelper(eventsContainer);
        // this.validateResize = ({ rectangle }) => resizeHelper.validateResize({ rectangle });
        // this.cdr.markForCheck();

        this.resizes.set(event.event, resizeEvent);
        this.dayColumnWidth = Math.floor(eventsContainer.offsetWidth / this.days.length);

        const resizeHelper: CalendarResizeHelper = new CalendarResizeHelper(eventsContainer);
        this.validateResize = ({ rectangle }) => resizeHelper.validateResize({ rectangle });
        this.cdr.markForCheck();
    }

    /**
     * @hidden
     */
    resizing(event: SchedulerViewEvent, resizeEvent: ResizeEvent): void {
        // const currentResize: SchedulerResizeEvent = this.resizes.get(event.event);
        // if (resizeEvent.edges.top) {
        //     event.top = currentResize.originalTop + +resizeEvent.edges.top;
        //     event.height = currentResize.originalHeight - +resizeEvent.edges.top;
        // } else if (resizeEvent.edges.bottom) {
        //     event.height = currentResize.originalHeight + +resizeEvent.edges.bottom;
        // }

        // this.resizes.set(event.event, <SchedulerResizeEvent>{
        //     rectangle: resizeEvent.rectangle,
        //     edges: resizeEvent.edges,
        //     originalTop: currentResize.originalTop,
        //     originalHeight: currentResize.originalHeight,
        //     edge: typeof resizeEvent.edges.top !== 'undefined' ? 'top' : 'bottom'
        // });

        this.resizes.set(event.event, resizeEvent);
        const adjustedEvents = new Map<CalendarSchedulerEvent, CalendarSchedulerEvent>();

        const tempEvents = [...this.events];

        this.resizes.forEach((lastResizeEvent, ev) => {
            const newEventDates = this.getResizedEventDates(
                ev,
                lastResizeEvent
            );
            const adjustedEvent = { ...ev, ...newEventDates };
            adjustedEvents.set(adjustedEvent, ev);
            const eventIndex = tempEvents.indexOf(ev);
            tempEvents[eventIndex] = adjustedEvent;
        });

        this.restoreOriginalEvents(tempEvents, adjustedEvents);
    }

    /**
     * @hidden
     */
    resizeEnded(event: SchedulerViewEvent): void {
        // const lastResizeEvent: SchedulerResizeEvent = this.resizes.get(event.event);
        // this.resizes.delete(event.event);
        // const newEventDates = this.getTimeEventResizedDates(event.event, lastResizeEvent);
        // this.eventTimesChanged.emit({
        //     newStart: newEventDates.start,
        //     newEnd: newEventDates.end,
        //     event: event.event,
        //     type: SchedulerEventTimesChangedEventType.Resize
        // });

        this.view = this.refreshSchedulerView(this.events);
        const lastResizeEvent = this.resizes.get(event.event);
        this.resizes.delete(event.event);
        const newEventDates = this.getResizedEventDates(
            event.event,
            lastResizeEvent
        );
        this.eventTimesChanged.emit(
            <SchedulerEventTimesChangedEvent>{
                newStart: newEventDates.start,
                newEnd: newEventDates.end,
                event: event.event,
                type: CalendarEventTimesChangedEventType.Resize
            });
    }

    private getResizedEventDates(event: CalendarSchedulerEvent, resizeEvent: ResizeEvent): { start: Date, end: Date} {
        const minimumEventHeight = (MINUTES_IN_HOUR / (this.hourSegments * this.hourSegmentHeight)) * 30;
        const newEventDates = {
            start: event.start,
            end: event.end ? event.end : addMinutes(event.start, minimumEventHeight)
        };
        const { end, ...eventWithoutEnd } = event;
        const smallestResizes = {
            start: addMinutes(newEventDates.end, minimumEventHeight * -1),
            end: addMinutes(eventWithoutEnd.start, minimumEventHeight)
        };

        if (resizeEvent.edges.left) {
            const daysDiff = Math.round(
                +resizeEvent.edges.left / this.dayColumnWidth
            );
            const newStart = addDays(newEventDates.start, daysDiff);
            if (newStart < smallestResizes.start) {
                newEventDates.start = newStart;
            } else {
                newEventDates.start = smallestResizes.start;
            }
        } else if (resizeEvent.edges.right) {
            const daysDiff = Math.round(
                +resizeEvent.edges.right / this.dayColumnWidth
            );
            const newEnd = addDays(newEventDates.end, daysDiff);
            if (newEnd > smallestResizes.end) {
                newEventDates.end = newEnd;
            } else {
                newEventDates.end = smallestResizes.end;
            }
        }

        if (resizeEvent.edges.top) {
            const precision: number = this.eventSnapSize || this.hourSegmentHeight;
            const draggedInPixelsSnapSize = Math.round((resizeEvent.edges.top as number) / precision) * precision;

            const pixelAmountInMinutes = MINUTES_IN_HOUR / (this.hourSegments * this.hourSegmentHeight);
            const minutesMoved = draggedInPixelsSnapSize * pixelAmountInMinutes;

            const newStart = addMinutes(newEventDates.start, minutesMoved);
            if (newStart < smallestResizes.start) {
                newEventDates.start = newStart;
            } else {
                newEventDates.start = smallestResizes.start;
            }
        } else if (resizeEvent.edges.bottom) {
            const precision: number = this.eventSnapSize || this.hourSegmentHeight;
            const draggedInPixelsSnapSize = Math.round((resizeEvent.edges.bottom as number) / precision) * precision;

            const pixelAmountInMinutes = MINUTES_IN_HOUR / (this.hourSegments * this.hourSegmentHeight);
            const minutesMoved = draggedInPixelsSnapSize * pixelAmountInMinutes;

            const newEnd = addMinutes(newEventDates.end, minutesMoved);
            if (newEnd > smallestResizes.end) {
                newEventDates.end = newEnd;
            } else {
                newEventDates.end = smallestResizes.end;
            }
        }
        return newEventDates;
    }

    //#endregion

    //#region DRAG & DROP

    /*
        [dragAxis]="{x: false, y: event.event.draggable && resizes.size === 0}"
        [dragSnapGrid]="{y: eventSnapSize || segmentHeight}"
        [validateDrag]="validateDrag"
        (dragStart)="dragStart(eventContainer, dayColumns)"
        (dragEnd)="eventDragged(event, $event.y)">
    */

    /**
     * @hidden
     */
    dragStarted(eventsContainer: HTMLElement, eventContainer: HTMLElement, event?: SchedulerViewEvent): void {
        // const dragHelper: CalendarDragHelper = new CalendarDragHelper(
        //     dayContainer,
        //     eventsContainer
        // );
        // this.validateDrag = ({x, y}) =>
        //     this.resizes.size === 0 && dragHelper.validateDrag({x, y, snapDraggedEvents: this.snapDraggedEvents});
        // this.cdr.markForCheck();

        this.dayColumnWidth = Math.floor(eventsContainer.offsetWidth / this.days.length);
        const dragHelper: CalendarDragHelper = new CalendarDragHelper(
            eventsContainer,
            eventContainer
        );
        this.validateDrag = ({ x, y }) =>
            this.resizes.size === 0 && dragHelper.validateDrag({ x, y, snapDraggedEvents: this.snapDraggedEvents });
            this.dragActive = true;
            this.eventDragEnter = 0;
            if (!this.snapDraggedEvents && event) {
                this.view.days.forEach((day: SchedulerViewDay) => {
                const linkedEvent = day.events.find(dayEvent => dayEvent.event === event.event && dayEvent !== event);
                // hide any linked events while dragging
                if (linkedEvent) {
                    linkedEvent.width = 0;
                    linkedEvent.height = 0;
                }
            });
          }
          this.cdr.markForCheck();
    }

    /**
     * @hidden
     */
    dragMove(event: SchedulerViewEvent, dragEvent: DragMoveEvent) {
        if (this.snapDraggedEvents) {
            const newEventTimes = this.getDragMovedEventTimes(
                event,
                dragEvent,
                this.dayColumnWidth,
                true
            );
            const originalEvent = event.event;
            const adjustedEvent = { ...originalEvent, ...newEventTimes };
            const tempEvents = this.events.map(ev => {
                if (ev === originalEvent) {
                    return adjustedEvent;
                }
                return ev;
            });

            this.restoreOriginalEvents(tempEvents, new Map([[adjustedEvent, originalEvent]]));
        }
    }

    /**
     * @hidden
     */
    // eventDragged(event: SchedulerViewEvent, draggedInPixels: number): void {
    //     const pixelAmountInMinutes: number =
    //         MINUTES_IN_HOUR / (this.hourSegments * this.hourSegmentHeight);
    //     const minutesMoved: number = draggedInPixels * pixelAmountInMinutes;
    //     // TODO - remove this check once https://github.com/mattlewis92/angular-draggable-droppable/issues/21 is fixed
    //     if (minutesMoved !== 0) {
    //         const newStart: Date = addMinutes(event.event.start, minutesMoved);
    //         let newEnd: Date;
    //         if (event.event.end) {
    //             newEnd = addMinutes(event.event.end, minutesMoved);
    //         }
    //         this.eventTimesChanged.emit({newStart, newEnd, event: event.event});
    //     }
    // }

    dragEnded(event: SchedulerViewEvent, dragEndEvent: DragEndEvent, dayWidth: number, useY = false): void {
        this.view = this.refreshSchedulerView(this.events);
        this.dragActive = false;
        const { start, end } = this.getDragMovedEventTimes(event, dragEndEvent, dayWidth, useY);
        if (this.eventDragEnter > 0 && this.isDraggedWithinPeriod(start, end, this.view.period)) {
            this.eventTimesChanged.emit({
                newStart: start,
                newEnd: end,
                event: event.event,
                type: CalendarEventTimesChangedEventType.Drag
            });
        }
    }

    private getDragMovedEventTimes(event: SchedulerViewEvent, dragEndEvent: DragEndEvent | DragMoveEvent, dayWidth: number, useY: boolean): { start: Date, end: Date} {
        const daysDragged = this.roundToNearest(dragEndEvent.x, dayWidth) / dayWidth;
        const minutesMoved = useY ?
        this.getMinutesMoved(
            dragEndEvent.y,
            this.hourSegments,
            this.hourSegmentHeight,
            this.eventSnapSize)
        : 0;

        const start = addMinutes(
            addDays(event.event.start, daysDragged),
            minutesMoved
        );
        let end: Date;
        if (event.event.end) {
            end = addMinutes(
                addDays(event.event.end, daysDragged),
                minutesMoved
            );
        }

        return { start, end };
    }

    private restoreOriginalEvents(tempEvents: CalendarSchedulerEvent[], adjustedEvents: Map<CalendarSchedulerEvent, CalendarSchedulerEvent>) {
        this.view = this.refreshSchedulerView(tempEvents);
        const adjustedEventsArray = tempEvents.filter(event => adjustedEvents.has(event));
        this.view.days.forEach(day => {
            adjustedEventsArray.forEach(adjustedEvent => {
                const originalEvent = adjustedEvents.get(adjustedEvent);
                const existingColumnEvent = day.events.find(dayEvent => dayEvent.event === adjustedEvent);
                if (existingColumnEvent) {
                    // restore the original event so trackBy kicks in and the dom isn't changed
                    existingColumnEvent.event = originalEvent;
                } else {
                    // add a dummy event to the drop so if the event was removed from the original column the drag doesn't end early
                    day.events.push({
                        event: originalEvent,
                        left: 0,
                        top: 0,
                        height: 0,
                        width: 0,
                        startsBeforeDay: false,
                        endsAfterDay: false
                    });
                }
            });
        });
        adjustedEvents.clear();
      }

    //#endregion
}

export interface GetSchedulerViewDayArgs {
    viewDate: Date;
    weekStartsOn: number;
    startsWithToday: boolean;
    excluded?: number[];
    weekendDays?: number[];
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
    hourSegmentHeight: number;
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
