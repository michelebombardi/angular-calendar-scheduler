import { EventEmitter, ChangeDetectorRef, OnChanges, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { EventColor, DayViewHour, DayViewHourSegment } from 'calendar-utils';
import { SchedulerConfig } from './scheduler-config';
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
export declare type CalendarSchedulerEventStatus = 'ok' | 'warning' | 'danger';
export interface CalendarSchedulerEventAction {
    when?: 'enabled' | 'disabled';
    label: string;
    title: string;
    cssClass?: string;
    onClick(event: CalendarSchedulerEvent): void;
}
export declare class CalendarSchedulerViewComponent implements OnChanges, OnInit, OnDestroy {
    private cdr;
    private config;
    /**
     * The current view date
     */
    viewDate: Date;
    /**
     * An array of events to display on view
     */
    events: CalendarSchedulerEvent[];
    /**
     * The number of segments in an hour. Must be <= 6
     */
    hourSegments: number;
    /**
     * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
     */
    excludeDays: number[];
    /**
     * Specify if the first day of current scheduler view has to be today or the first day of the week
     */
    startsWithToday: boolean;
    /**
     * Specify if actions must be shown or not
     */
    showActions: boolean;
    /**
     * A function that will be called before each cell is rendered. The first argument will contain the calendar (day, hour or segment) cell.
     * If you add the `cssClass` property to the cell it will add that class to the cell in the template
     */
    dayModifier: Function;
    hourModifier: Function;
    segmentModifier: Function;
    /**
     * An observable that when emitted on will re-render the current view
     */
    refresh: Subject<any>;
    /**
     * The locale used to format dates
     */
    locale: string;
    /**
     * The placement of the event tooltip
     */
    tooltipPlacement: string;
    /**
     * The start number of the week
     */
    weekStartsOn: number;
    /**
     * A custom template to use to replace the header
     */
    headerTemplate: TemplateRef<any>;
    /**
     * A custom template to use to replace the day cell
     */
    cellTemplate: TemplateRef<any>;
    /**
     * A custom template to use for week view events
     */
    eventTemplate: TemplateRef<any>;
    /**
     * The precision to display events.
     * `days` will round event start and end dates to the nearest day and `minutes` will not do this rounding
     */
    precision: 'days' | 'minutes';
    /**
     * The day start hours in 24 hour time. Must be 0-23
     */
    dayStartHour: number;
    /**
     * The day start minutes. Must be 0-59
     */
    dayStartMinute: number;
    /**
     * The day end hours in 24 hour time. Must be 0-23
     */
    dayEndHour: number;
    /**
     * The day end minutes. Must be 0-59
     */
    dayEndMinute: number;
    /**
     * Called when a header week day is clicked
     */
    dayClicked: EventEmitter<{
        date: Date;
    }>;
    /**
     * Called when the segment is clicked
     */
    segmentClicked: EventEmitter<{
        segment: SchedulerViewHourSegment;
    }>;
    /**
     * Called when the event is clicked
     */
    eventClicked: EventEmitter<{
        event: CalendarSchedulerEvent;
    }>;
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
    hours: DayViewHour[];
    /**
     * @hidden
     */
    constructor(cdr: ChangeDetectorRef, locale: string, config: SchedulerConfig);
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngOnChanges(changes: any): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    toggleSegmentHighlight(event: CalendarSchedulerEvent, isHighlighted: boolean): void;
    private refreshHeader();
    private refreshBody();
    private refreshAll();
    private getSchedulerView(args);
    private isEventInPeriod(args);
    private getEventsInPeriod(args);
    private getSchedulerViewDays(args);
    private getSchedulerDay(args);
    private getSchedulerViewHourGrid(args);
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
