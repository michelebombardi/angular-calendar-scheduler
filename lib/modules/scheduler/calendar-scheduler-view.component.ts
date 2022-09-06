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
    ViewEncapsulation,
    HostListener
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subject, Subscription } from 'rxjs';
import {
    WeekViewHour
} from 'calendar-utils';
import {
    isBefore
} from 'date-fns';
import { ResizeEvent } from 'angular-resizable-element';
// import { CalendarDragHelper } from 'angular-calendar/modules/common/calendar-drag-helper.provider';
// import { CalendarResizeHelper } from 'angular-calendar/modules/common/calendar-resize-helper.provider';
import { SchedulerConfig } from './scheduler-config';
import { CalendarEventTimesChangedEventType, DateAdapter } from 'angular-calendar';
import { DragMoveEvent, DragEndEvent, DropEvent } from 'angular-draggable-droppable';

import {
    CalendarSchedulerEvent,
    SchedulerViewDay,
    SchedulerViewHour,
    SchedulerViewHourSegment,
    SchedulerEventTimesChangedEvent,
    SchedulerViewEvent,
    SchedulerView
} from './models';
import {
    shouldFireDroppedEvent,
    isDraggedWithinPeriod,
    roundToNearest,
    getMinutesMoved,
    trackByHourColumn,
    trackByDayOrEvent,
    trackByHour,
    trackByHourSegment,
    getMinimumEventHeightInMinutes,
    getDefaultEventEnd
} from '../common/utils';
import {
    DEFAULT_HOUR_SEGMENTS,
    DEFAULT_HOUR_SEGMENT_HEIGHT_PX,
    MINUTES_IN_HOUR,
    Time,
    DAYS_IN_WEEK
} from './utils/calendar-scheduler-utils';
import { CalendarSchedulerUtils } from './utils/calendar-scheduler-utils.provider';
import { CalendarResizeHelper } from '../common/temp/calendar-resize-helper.provider';
import { CalendarDragHelper } from '../common/temp/calendar-drag-helper.provider';

/**
 *  [ngClass]="getPositioningClasses(event)"
 *
 *  [style.top.px]="event.top"
 *  [style.height.px]="event.height"
 *  [style.left.%]="event.left"
 *  [style.width.%]="event.width"
 *
 *  DRAG & DROP & RESIZE -> https://github.com/mattlewis92/angular-calendar/blob/main/projects/angular-calendar/src/modules/week/calendar-week-view.component.ts
 *  FLEXBOX -> https://css-tricks.com/snippets/css/a-guide-to-flexbox/
 */
@Component({
    selector: 'calendar-scheduler-view',
    template: `
        <div class="cal-scheduler-view">
            <calendar-scheduler-header
                [days]="days"
                [locale]="locale"
                [customTemplate]="headerTemplate"
                (dayHeaderClicked)="dayHeaderClicked.emit($event)">
            </calendar-scheduler-header>

            <div class="cal-scheduler" #calendarContainer>
                <div class="cal-scheduler-hour-rows aside">
                    <div class="cal-scheduler-hour align-center horizontal" *ngFor="let hour of hours; trackBy:trackByHour">
                      <div class="cal-scheduler-time">
                        <div class="cal-scheduler-time-segment" *ngFor="let segment of hour.segments"
                            [style.height.px]="hourSegmentHeight">
                            {{ segment.date | calendarDate:'dayViewHour':locale }}
                        </div>
                      </div>
                    </div>
                </div>

                <div class="cal-scheduler-cols aside" #dayColumns
                    [class.cal-resize-active]="resizes.size > 0"
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
                            [hidden]="event.height === 0 && event.width === 0"
                            [style.top.px]="event.top"
                            [style.height.px]="event.height"
                            [style.left.%]="event.left"
                            [style.width.%]="event.width"
                            [class.zoom-on-hover]="zoomEventOnHover"

                            mwlResizable
                            [resizeSnapGrid]="{left: dayColumnWidth, right: dayColumnWidth, top: eventSnapSize || hourSegmentHeight, bottom: eventSnapSize || hourSegmentHeight}"
                            [validateResize]="validateResize"
                            [allowNegativeResizes]="true"
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
                                [container]="eventContainer"
                                [showContent]="showEventContent && event.height >= 75"
                                [showActions]="showEventActions"
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

                        <div class="cal-scheduler-hour"
                            *ngFor="let hour of day.hours; let i = index; trackBy:trackByHour"
                            [class.cal-even]="i % 2 === 0"
                            [class.cal-odd]="i % 2 === 1"
                            [ngClass]="hour.cssClass"
                            [style.backgroundColor]="hour.backgroundColor"
                            (mwlClick)="hourClicked.emit({hour: hour})"
                            [class.cal-past]="day.isPast"
                            [class.cal-today]="day.isToday"
                            [class.cal-future]="day.isFuture"
                            [class.cal-weekend]="day.isWeekend"
                            [class.cal-in-month]="day.inMonth"
                            [class.cal-out-month]="!day.inMonth">
                            <div class="cal-scheduler-hour-segments">
                                <calendar-scheduler-hour-segment
                                    *ngFor="let segment of hour.segments; trackBy:trackByHourSegment"
                                    [day]="day"
                                    [segment]="segment"
                                    [locale]="locale"
                                    [customTemplate]="cellTemplate"
                                    [hourSegmentHeight]="hourSegmentHeight"
                                    [showHour]="showSegmentHour"
                                    (segmentClicked)="segmentClicked.emit($event)"
                                    mwlDroppable
                                    [dragOverClass]="!dragActive || !snapDraggedEvents ? 'cal-drag-over' : 'null'"
                                    dragActiveClass="cal-drag-active"
                                    (drop)="eventDropped($event, segment.date)">
                                </calendar-scheduler-hour-segment>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./calendar-scheduler-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CalendarSchedulerViewComponent implements OnInit, OnChanges, OnDestroy {

    /**
     * Number of days shown. This value will be always normalized to DAYS_IN_WEEK (7)
     */
    _viewDays: number = DAYS_IN_WEEK;
    get viewDays(): number {
        return this._viewDays;
    }
    @Input() set viewDays(value: number) {
        this._viewDays = Math.min(value, DAYS_IN_WEEK);
    }

    /**
     * The current view date
     */
    @Input() viewDate: Date;

    /**
     * Specify if the calendar must be resposive on window resize, changing the days showed automatically
     */
    @Input() responsive: boolean = false;

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
     * Specify if content must be shown or not
     */
    @Input() showEventContent: boolean = true;

    /**
     * Specify if actions must be shown or not
     */
    @Input() showEventActions: boolean = true;

    /**
     * Specify if status must be shown or not
     */
    @Input() showEventStatus: boolean = true;

    /**
     * Specify if hour must be shown on segment or not
     */
    @Input() showSegmentHour: boolean = false;

    /**
     * Specify if event must zoom on mouse hover or not
     */
    @Input() zoomEventOnHover: boolean = false;

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
     * Called when view days value changes
     */
    @Output() viewDaysChanged: EventEmitter<number> = new EventEmitter<number>();

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
    view: SchedulerView;

    /**
     * @hidden
     */
    refreshSubscription: Subscription;

    /**
     * @hidden
     */
    days: SchedulerViewDay[];

    /**
     * @hidden
     */
    hours: WeekViewHour[] = [];

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
    dragAlreadyMoved = false;

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
    calendarId: symbol = Symbol('angular calendar scheduler view id');

    /**
     * @hidden
     */
    rtl = false;

    /**
     * @hidden
     */
    trackByHourColumn = trackByHourColumn;

    /**
     * @hidden
     */
    trackByDayOrEvent = trackByDayOrEvent;

    /**
     * @hidden
     */
    trackByHour = trackByHour;

    /**
     * @hidden
     */
    trackByHourSegment = trackByHourSegment;

    mobileQueryXs: MediaQueryList;
    mobileQuerySm: MediaQueryList;
    mobileQueryListener: (this: MediaQueryList, ev: MediaQueryListEvent) => any;
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.adjustViewDays();
    }

    /**
     * @hidden
     */
    constructor(private cdr: ChangeDetectorRef, @Inject(LOCALE_ID) locale: string, private config: SchedulerConfig,
        private utils: CalendarSchedulerUtils, private dateAdapter: DateAdapter, private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef) {

        this.locale = this.config.locale || locale;

        // See 'Responsive breakpoints' at https://getbootstrap.com/docs/4.1/layout/overview/
        this.mobileQueryXs = this.media.matchMedia('(max-width: 576px)');           // Extra small devices (portrait phones, less than 576px)
        this.mobileQuerySm = this.media.matchMedia('(max-width: 768px)');           // Small devices (landscape phones, less than 768px)

        this.mobileQueryListener = () => this.changeDetectorRef.detectChanges();

        // this.mobileQueryXs.addEventListener('change', this.mobileQueryListener);
        this.mobileQueryXs.addListener(this.mobileQueryListener);
        // this.mobileQuerySm.addEventListener('change', this.mobileQueryListener);
        this.mobileQuerySm.addListener(this.mobileQueryListener);
    }

    /**
     * @hidden
     */
    ngOnInit(): void {
        this.adjustViewDays();

        if (this.refresh) {
            this.refreshSubscription = this.refresh
                // tslint:disable-next-line: deprecation
                .subscribe({
                    next: () => {
                        this.refreshAll();
                        this.cdr.markForCheck();
                    },
                    error: () => {},
                    complete: () => {}
                });
        }
    }

    /**
     * @hidden
     */
    ngOnChanges(changes: any): void {
        if (changes.viewDays || changes.viewDate || changes.excludeDays || changes.weekendDays) {
            this.refreshHeader();
        }

        if (changes.viewDays ||
            changes.viewDate ||
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

        // this.mobileQueryXs.removeEventListener('change', this.mobileQueryListener);
        this.mobileQueryXs.removeListener(this.mobileQueryListener);
        // this.mobileQuerySm.removeEventListener('change', this.mobileQueryListener);
        this.mobileQuerySm.removeListener(this.mobileQueryListener);
    }

    setViewDays(viewDays: number) {
        const oldViewDays: number = this._viewDays;

        this.viewDays = viewDays;

        if (this._viewDays !== oldViewDays) {
            this.viewDaysChanged.emit(this._viewDays);
            this.refreshAll();
        }
    }

    protected adjustViewDays(): void {
        const oldViewDays: number = this._viewDays;

        if (this.responsive) {
            // https://www.digitalocean.com/community/tutorials/angular-breakpoints-angular-cdk
            // With a Component: https://www.digitalocean.com/community/tutorials/detect-responsive-screen-sizes-in-angular
            // check/set the size
            if (this.mobileQueryXs.matches) {
                this.viewDays = 1;
            } else if (this.mobileQuerySm.matches) {
                this.viewDays = 3;
            } else {
                this.viewDays = DAYS_IN_WEEK;
            }
        }

        if (this._viewDays !== oldViewDays) {
            this.viewDaysChanged.emit(this._viewDays);
            this.refreshAll();
        }
    }

    protected getPositioningClasses(day: SchedulerViewDay, event: CalendarSchedulerEvent): string {
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
        if (this.dateAdapter.isSameDay(date, event.start)) {
            let hours: number = event.start.getHours();
            if (this.dayStartHour > 0) { hours = event.start.getHours() - this.dayStartHour; }
            const hoursString: string = hours < 10 ? `0${hours}` : `${hours}`;
            const minutesString: string = event.start.getMinutes() < 10 ? `0${event.start.getMinutes()}` : `${event.start.getMinutes()}`;
            return `time${hoursString}${minutesString}`;
        } else if (isBefore(event.start, this.dateAdapter.startOfDay(date))) {
            return `time0000`;
        }
    }

    private getLengthClass(date: Date, event: CalendarSchedulerEvent): string {
        if (this.dateAdapter.isSameDay(date, event.start)) {
            const durationInMinutes: number = this.dateAdapter.differenceInMinutes(event.end, event.start);
            const leftToEndOfDay: number = this.dateAdapter.differenceInMinutes(this.dateAdapter.setMinutes(this.dateAdapter.setHours(event.start, this.dayEndHour + 1), 0), event.start);
            return leftToEndOfDay > durationInMinutes ? `length${durationInMinutes}` : `length${leftToEndOfDay}`;
        } else if (isBefore(event.start, this.dateAdapter.startOfDay(date))) {
            let leftDurationInMinutes: number = 0;
            if (this.dateAdapter.isSameDay(date, event.end)) {
                leftDurationInMinutes = this.dateAdapter.differenceInMinutes(event.end, this.dateAdapter.startOfDay(date));
                if (this.dayStartHour > 0) { leftDurationInMinutes = (event.end.getHours() - this.dayStartHour) * MINUTES_IN_HOUR; }
            } else {
                leftDurationInMinutes = ((this.dayEndHour + 1) - this.dayStartHour) * MINUTES_IN_HOUR;
            }
            return `length${leftDurationInMinutes}`;
        }
    }


    private refreshHourGrid(): void {
        this.hours = this.utils.getSchedulerViewHourGrid({
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
        this.days = this.utils.getSchedulerViewDays({
            viewDate: this.viewDate,
            viewDays: this.viewDays,
            weekStartsOn: this.weekStartsOn,
            startsWithToday: this.startsWithToday,
            excluded: this.excludeDays,
            weekendDays: this.weekendDays
        });
    }

    private refreshBody(events?: CalendarSchedulerEvent[]): void {
        this.view = this.getSchedulerView(events || this.events);

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


    private getSchedulerView(events: CalendarSchedulerEvent[]): SchedulerView {
        return this.utils.getSchedulerView({
            events: events,
            viewDate: this.viewDate,
            viewDays: this.viewDays,
            hourSegments: this.hourSegments,
            weekStartsOn: this.weekStartsOn,
            startsWithToday: this.startsWithToday,
            dayStart: <Time>{
                hour: this.dayStartHour,
                minute: this.dayStartMinute
            },
            dayEnd: <Time>{
                hour: this.dayEndHour,
                minute: this.dayEndMinute
            },
            excluded: this.excludeDays,
            eventWidth: 1,
            hourSegmentHeight: this.hourSegmentHeight,
            logEnabled: this.config.logEnabled
        });
    }


    //#region RESIZE

    /**
     * @hidden
     */
    resizeStarted(eventsContainer: HTMLElement, event: SchedulerViewEvent, resizeEvent: ResizeEvent): void {
        this.resizes.set(event.event, resizeEvent);
        this.dayColumnWidth = Math.floor(eventsContainer.offsetWidth / this.days.length);

        const resizeHelper: CalendarResizeHelper = new CalendarResizeHelper(eventsContainer, this.dayColumnWidth, this.rtl);
        this.validateResize = ({ rectangle, edges }) => resizeHelper.validateResize({
            rectangle: { ...rectangle },
            edges
        });
        this.cdr.markForCheck();
    }

    /**
     * @hidden
     */
    resizing(event: SchedulerViewEvent, resizeEvent: ResizeEvent): void {
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
        this.view = this.getSchedulerView(this.events);
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
        const minimumEventHeight = getMinimumEventHeightInMinutes(this.hourSegments, this.hourSegmentHeight);
        const newEventDates = {
            start: event.start,
            end: getDefaultEventEnd(this.dateAdapter, event, minimumEventHeight)
        };
        const { end, ...eventWithoutEnd } = event;
        const smallestResizes = {
            start: this.dateAdapter.addMinutes(newEventDates.end, minimumEventHeight * -1),
            end: getDefaultEventEnd(this.dateAdapter, eventWithoutEnd, minimumEventHeight)
        };

        if (resizeEvent.edges.left) {
            const daysDiff = Math.round(
                +resizeEvent.edges.left / this.dayColumnWidth
            );
            const newStart = this.dateAdapter.addDays(newEventDates.start, daysDiff);
            if (newStart < smallestResizes.start) {
                newEventDates.start = newStart;
            } else {
                newEventDates.start = smallestResizes.start;
            }
        } else if (resizeEvent.edges.right) {
            const daysDiff = Math.round(
                +resizeEvent.edges.right / this.dayColumnWidth
            );
            const newEnd = this.dateAdapter.addDays(newEventDates.end, daysDiff);
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

            const newStart = this.dateAdapter.addMinutes(newEventDates.start, minutesMoved);
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

            const newEnd = this.dateAdapter.addMinutes(newEventDates.end, minutesMoved);
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

    /**
     * @hidden
     */
    eventDropped(dropEvent: DropEvent<{ event?: CalendarSchedulerEvent; calendarId?: symbol }>, date: Date): void {
        if (shouldFireDroppedEvent(dropEvent, date, this.calendarId)) {
            this.eventTimesChanged.emit(
                <SchedulerEventTimesChangedEvent>{
                    type: CalendarEventTimesChangedEventType.Drop,
                    event: dropEvent.dropData.event,
                    newStart: date,
                    newEnd: null
                });
        }
    }

    /**
     * @hidden
     */
    dragStarted(eventsContainer: HTMLElement, eventContainer: HTMLElement, event?: SchedulerViewEvent): void {
        this.dayColumnWidth = Math.floor(eventsContainer.offsetWidth / this.days.length);
        const dragHelper: CalendarDragHelper = new CalendarDragHelper(
            eventsContainer,
            eventContainer
        );
        this.validateDrag = ({ x, y, transform }) =>
            this.resizes.size === 0 && dragHelper.validateDrag({
                x,
                y,
                snapDraggedEvents: this.snapDraggedEvents,
                dragAlreadyMoved: this.dragAlreadyMoved,
                transform
            });
            this.dragActive = true;
            this.dragAlreadyMoved = false;
            this.eventDragEnter = 0;
            if (!this.snapDraggedEvents && event) {
                this.view.days.forEach((day: SchedulerViewDay) => {
                const linkedEvent = day.events.find(ev => ev.event === event.event && ev !== event);
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
        this.dragAlreadyMoved = true;
    }

    dragEnded(event: SchedulerViewEvent, dragEndEvent: DragEndEvent, dayWidth: number, useY = false): void {
        this.view = this.getSchedulerView(this.events);
        this.dragActive = false;
        const { start, end } = this.getDragMovedEventTimes(event, dragEndEvent, dayWidth, useY);
        if (
            this.eventDragEnter > 0 &&
            isDraggedWithinPeriod(start, end, this.view.period)
        ) {
            this.eventTimesChanged.emit(
                <SchedulerEventTimesChangedEvent>{
                    newStart: start,
                    newEnd: end,
                    event: event.event,
                    type: CalendarEventTimesChangedEventType.Drag
                });
        }
    }

    private getDragMovedEventTimes(event: SchedulerViewEvent, dragEndEvent: DragEndEvent | DragMoveEvent, dayWidth: number, useY: boolean): { start: Date, end: Date} {
        const daysDragged = roundToNearest(dragEndEvent.x, dayWidth) / dayWidth;
        const minutesMoved = useY ?
            getMinutesMoved(
                dragEndEvent.y,
                this.hourSegments,
                this.hourSegmentHeight,
                this.eventSnapSize)
            : 0;

        const start = this.dateAdapter.addMinutes(
            this.dateAdapter.addDays(event.event.start, daysDragged),
            minutesMoved
        );
        let end: Date;
        if (event.event.end) {
            end = this.dateAdapter.addMinutes(
                this.dateAdapter.addDays(event.event.end, daysDragged),
                minutesMoved
            );
        }

        return { start, end };
    }

    private restoreOriginalEvents(tempEvents: CalendarSchedulerEvent[], adjustedEvents: Map<CalendarSchedulerEvent, CalendarSchedulerEvent>) {
        this.refreshBody(tempEvents);
        const adjustedEventsArray = tempEvents.filter(event => adjustedEvents.has(event));
        this.view.days.forEach(day => {
            adjustedEventsArray.forEach(adjustedEvent => {
                const originalEvent = adjustedEvents.get(adjustedEvent);
                const existingColumnEvent = day.events.find(ev => ev.event === adjustedEvent);
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
