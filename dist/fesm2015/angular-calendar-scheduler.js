import { Injectable, Component, Input, Output, EventEmitter, ChangeDetectorRef, LOCALE_ID, Inject, ViewEncapsulation, Renderer2, Pipe, NgModule, InjectionToken } from '@angular/core';
import 'rxjs';
import { startOfMinute, startOfDay, startOfWeek, endOfDay, endOfWeek, addMinutes, addHours, addDays, subSeconds, setMinutes, setHours, setDate, setMonth, setYear, isSameSecond, isSameDay, getDay, startOfMonth, endOfMonth, addWeeks, addMonths, subDays, subWeeks, subMonths } from 'date-fns';
import * as momentImported from 'moment';
import { CalendarEventTitleFormatter, CalendarDateFormatter, CalendarModule } from 'angular-calendar';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Auth configuration.
 */
class SchedulerConfig {
    /**
     * @param {?=} config
     */
    constructor(config = {}) {
        this.locale = 'en';
        this.headerDateFormat = 'daysRange';
        /**
         * @template T
         * @param {?} source
         * @param {?} defaultValue
         * @return {?}
         */
        function use(source, defaultValue) {
            return config && source !== undefined ? source : defaultValue;
        }
        this.locale = use(config.locale, this.locale);
        this.headerDateFormat = use(config.headerDateFormat, this.headerDateFormat);
    }
}
SchedulerConfig.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SchedulerConfig.ctorParameters = () => [
    { type: SchedulerConfig }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const WEEKEND_DAY_NUMBERS = [0, 6];
/** @type {?} */
const DAYS_IN_WEEK = 7;
/** @type {?} */
const MINUTES_IN_HOUR = 60;
class CalendarSchedulerViewComponent {
    /**
     * @hidden
     * @param {?} cdr
     * @param {?} locale
     * @param {?} config
     */
    constructor(cdr, locale, config) {
        this.cdr = cdr;
        this.config = config;
        /**
         * An array of events to display on view
         */
        this.events = [];
        /**
         * The number of segments in an hour. Must be <= 6
         */
        this.hourSegments = 2;
        /**
         * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
         */
        this.excludeDays = [];
        /**
         * Specify if the first day of current scheduler view has to be today or the first day of the week
         */
        this.startsWithToday = false;
        /**
         * Specify if actions must be shown or not
         */
        this.showActions = true;
        /**
         * The placement of the event tooltip
         */
        this.tooltipPlacement = 'bottom';
        /**
         * The precision to display events.
         * `days` will round event start and end dates to the nearest day and `minutes` will not do this rounding
         */
        this.precision = 'days';
        /**
         * The day start hours in 24 hour time. Must be 0-23
         */
        this.dayStartHour = 0;
        /**
         * The day start minutes. Must be 0-59
         */
        this.dayStartMinute = 0;
        /**
         * The day end hours in 24 hour time. Must be 0-23
         */
        this.dayEndHour = 23;
        /**
         * The day end minutes. Must be 0-59
         */
        this.dayEndMinute = 59;
        /**
         * Called when a header week day is clicked
         */
        this.dayClicked = new EventEmitter();
        /**
         * Called when the segment is clicked
         */
        this.segmentClicked = new EventEmitter();
        /**
         * Called when the event is clicked
         */
        this.eventClicked = new EventEmitter();
        /**
         * @hidden
         */
        this.hours = [];
        this.locale = config.locale || locale;
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnInit() {
        if (this.refresh) {
            this.refreshSubscription = this.refresh.subscribe(() => {
                this.refreshAll();
                this.cdr.markForCheck();
            });
        }
    }
    /**
     * @hidden
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
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
     * @return {?}
     */
    ngOnDestroy() {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }
    /**
     * @hidden
     * @param {?} event
     * @param {?} isHighlighted
     * @return {?}
     */
    toggleSegmentHighlight(event, isHighlighted) {
        this.days.forEach((day) => {
            day.hours.forEach((hour) => {
                // hour.segments.forEach((segment: SchedulerViewHourSegment) => {
                //    if (isHighlighted && segment.events.indexOf(event) > -1) {
                //        segment.backgroundColor = event.color.secondary;
                //    } else {
                //        delete segment.backgroundColor;
                //    }
                // });
                hour.segments.filter((segment) => segment.events.some((ev) => ev.id === event.id && ev.start.getDay() === event.start.getDay()))
                    .forEach((segment) => {
                    segment.events.filter((ev) => ev.id === event.id && ev.start.getDay() === event.start.getDay())
                        .forEach((e) => {
                        if (isHighlighted) {
                            segment.backgroundColor = e.color.secondary;
                        }
                        else {
                            delete segment.backgroundColor;
                        }
                    });
                });
            });
        });
    }
    /**
     * @return {?}
     */
    refreshHeader() {
        this.headerDays = this.getSchedulerViewDays({
            viewDate: this.viewDate,
            weekStartsOn: this.weekStartsOn,
            startsWithToday: this.startsWithToday,
            excluded: this.excludeDays
        });
    }
    /**
     * @return {?}
     */
    refreshBody() {
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
                day.hours.forEach((hour) => {
                    if (this.hourModifier) {
                        this.hourModifier(hour);
                    }
                    hour.segments.forEach((segment) => {
                        if (this.segmentModifier) {
                            this.segmentModifier(segment);
                        }
                    });
                });
            });
        }
    }
    /**
     * @return {?}
     */
    refreshAll() {
        this.refreshHeader();
        this.refreshBody();
    }
    /**
     * @param {?} args
     * @return {?}
     */
    getSchedulerView(args) {
        /** @type {?} */
        let events = args.events || [];
        /** @type {?} */
        const viewDate = args.viewDate;
        /** @type {?} */
        const weekStartsOn = args.weekStartsOn;
        /** @type {?} */
        const startsWithToday = args.startsWithToday;
        /** @type {?} */
        const excluded = args.excluded || [];
        /** @type {?} */
        const precision = args.precision || 'days';
        if (!events) {
            events = [];
        }
        /** @type {?} */
        const startOfViewWeek = startsWithToday ? startOfDay(viewDate) : startOfWeek(viewDate, { weekStartsOn: weekStartsOn });
        /** @type {?} */
        const endOfViewWeek = startsWithToday ? addDays(endOfDay(viewDate), 6) : endOfWeek(viewDate, { weekStartsOn: weekStartsOn });
        /** @type {?} */
        const eventsInWeek = this.getEventsInPeriod({ events: events, periodStart: startOfViewWeek, periodEnd: endOfViewWeek });
        this.days = this.getSchedulerViewDays({
            viewDate: viewDate,
            weekStartsOn: weekStartsOn,
            startsWithToday: startsWithToday,
            excluded: excluded
        });
        this.days.forEach((day, dayIndex) => {
            /** @type {?} */
            const hours = [];
            this.hours.forEach((hour, hourIndex) => {
                /** @type {?} */
                const segments = [];
                hour.segments.forEach((segment, segmentIndex) => {
                    segment.date = setDate(setMonth(setYear(segment.date, day.date.getFullYear()), day.date.getMonth()), day.date.getDate());
                    /** @type {?} */
                    const startOfSegment = segment.date;
                    /** @type {?} */
                    const endOfSegment = addMinutes(segment.date, MINUTES_IN_HOUR / this.hourSegments);
                    /** @type {?} */
                    const evts = this.getEventsInPeriod({
                        events: eventsInWeek,
                        periodStart: startOfSegment,
                        periodEnd: endOfSegment
                    }).map((event) => /** @type {?} */ ({
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
                    }));
                    segments.push(/** @type {?} */ ({
                        segment: segment,
                        date: new Date(segment.date),
                        events: evts,
                        hasBorder: true
                    }));
                });
                /** @type {?} */
                const hourDate = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate(), hour.segments[0].date.getHours());
                hours.push(/** @type {?} */ ({ hour: hour, date: hourDate, segments: segments, hasBorder: true }));
            });
            day.hours = hours;
        });
        return /** @type {?} */ ({
            days: this.days
        });
    }
    /**
     * @param {?} args
     * @return {?}
     */
    isEventInPeriod(args) {
        /** @type {?} */
        const event = args.event;
        /** @type {?} */
        const periodStart = args.periodStart;
        /** @type {?} */
        const periodEnd = args.periodEnd;
        /** @type {?} */
        const eventStart = event.start;
        /** @type {?} */
        const eventEnd = event.end || event.start;
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
    /**
     * @param {?} args
     * @return {?}
     */
    getEventsInPeriod(args) {
        /** @type {?} */
        const events = args.events;
        /** @type {?} */
        const periodStart = args.periodStart;
        /** @type {?} */
        const periodEnd = args.periodEnd;
        return events.filter((event) => this.isEventInPeriod({ event: event, periodStart: periodStart, periodEnd: periodEnd }));
    }
    /**
     * @param {?} args
     * @return {?}
     */
    getSchedulerViewDays(args) {
        /** @type {?} */
        const viewDate = args.viewDate;
        /** @type {?} */
        const weekStartsOn = args.weekStartsOn;
        /** @type {?} */
        const startsWithToday = args.startsWithToday;
        /** @type {?} */
        const excluded = args.excluded || [];
        /** @type {?} */
        const start = startsWithToday ? new Date(viewDate) : startOfWeek(viewDate, { weekStartsOn: weekStartsOn });
        /** @type {?} */
        const days = [];
        /** @type {?} */
        const loop = (i) => {
            /** @type {?} */
            const date = addDays(start, i);
            if (!excluded.some((e) => date.getDay() === e)) {
                days.push(this.getSchedulerDay({ date: date }));
            }
        };
        for (let i = 0; i < DAYS_IN_WEEK; i++) {
            loop(i);
        }
        return days;
    }
    /**
     * @param {?} args
     * @return {?}
     */
    getSchedulerDay(args) {
        /** @type {?} */
        const date = args.date;
        /** @type {?} */
        const today = startOfDay(new Date());
        return /** @type {?} */ ({
            date: date,
            isPast: date < today,
            isToday: isSameDay(date, today),
            isFuture: date > today,
            isWeekend: WEEKEND_DAY_NUMBERS.indexOf(getDay(date)) > -1,
            hours: []
        });
    }
    /**
     * @param {?} args
     * @return {?}
     */
    getSchedulerViewHourGrid(args) {
        /** @type {?} */
        const viewDate = args.viewDate;
        /** @type {?} */
        const hourSegments = args.hourSegments;
        /** @type {?} */
        const dayStart = args.dayStart;
        /** @type {?} */
        const dayEnd = args.dayEnd;
        /** @type {?} */
        const hours = [];
        /** @type {?} */
        const startOfView = setMinutes(setHours(startOfDay(viewDate), dayStart.hour), dayStart.minute);
        /** @type {?} */
        const endOfView = setMinutes(setHours(startOfMinute(endOfDay(viewDate)), dayEnd.hour), dayEnd.minute);
        /** @type {?} */
        const segmentDuration = MINUTES_IN_HOUR / hourSegments;
        /** @type {?} */
        const startOfViewDay = startOfDay(viewDate);
        /** @type {?} */
        const range = (start, end) => Array.from({ length: ((end + 1) - start) }, (v, k) => k + start);
        /** @type {?} */
        const hoursInView = range(dayStart.hour, dayEnd.hour);
        // for (var i = 0; i < HOURS_IN_DAY; i++) {
        hoursInView.forEach((hour, i) => {
            /** @type {?} */
            const segments = [];
            for (let j = 0; j < hourSegments; j++) {
                /** @type {?} */
                const date = addMinutes(addHours(startOfViewDay, hour), j * segmentDuration);
                if (date >= startOfView && date < endOfView) {
                    segments.push({
                        date: date,
                        isStart: j === 0
                    });
                }
            }
            if (segments.length > 0) {
                hours.push(/** @type {?} */ ({ segments: segments }));
            }
        });
        return hours;
    }
}
CalendarSchedulerViewComponent.decorators = [
    { type: Component, args: [{
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
                styles: [`.cal-scheduler-view .cal-scheduler-headers{display:flex;flex-flow:row wrap;margin-bottom:3px;border:1px solid #e1e1e1}.cal-scheduler-view .cal-scheduler-headers .aside{flex:1 0}.cal-scheduler-view .cal-scheduler-headers .aside.cal-header-clock{max-width:5em}.cal-scheduler-view .cal-scheduler-headers .cal-header{flex:1;text-align:center;padding:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cal-scheduler-view .cal-scheduler-headers .cal-header:not(:last-child){border-right:1px solid #e1e1e1}.cal-scheduler-view .cal-scheduler-headers .cal-header:hover{background-color:#ededed}.cal-scheduler-view .cal-scheduler-headers .cal-header.cal-today{background-color:#e8fde7}.cal-scheduler-view .cal-scheduler-headers .cal-header.cal-weekend span{color:#8b0000}.cal-scheduler-view .cal-scheduler-headers .cal-header span{font-weight:400;opacity:.5}.cal-scheduler-view .cal-scheduler,.cal-scheduler-view .cal-scheduler-headers .cal-header-cols{display:flex;flex-flow:row wrap}.cal-scheduler-view .cal-scheduler .aside{flex:1 0}.cal-scheduler-view .cal-scheduler .aside.cal-scheduler-hour-rows{max-width:5em}.cal-scheduler-view .cal-scheduler .cal-scheduler-hour-rows{width:auto!important;border:1px solid #e1e1e1;overflow:hidden;position:relative}.cal-scheduler-view .cal-scheduler .cal-scheduler-hour-rows .cal-scheduler-hour{display:flex;height:7.25em}.cal-scheduler-view .cal-scheduler .cal-scheduler-hour-rows .cal-scheduler-hour:nth-child(odd){background-color:#fafafa}.cal-scheduler-view .cal-scheduler .cal-scheduler-hour-rows .cal-scheduler-hour:not(:last-child){border-bottom:1px solid #e1e1e1}.cal-scheduler-view .cal-scheduler .cal-scheduler-hour-rows .cal-scheduler-hour .cal-scheduler-time{display:flex;flex-flow:column wrap;width:100%;font-weight:700;text-align:center}.cal-scheduler-view .cal-scheduler .cal-scheduler-hour-rows .cal-scheduler-hour .cal-scheduler-time .cal-scheduler-hour-segment{flex:1 0}.cal-scheduler-view .cal-scheduler .cal-scheduler-hour-rows .cal-scheduler-hour .cal-scheduler-time .cal-scheduler-hour-segment:hover{background-color:#ededed}.cal-scheduler-view .cal-scheduler .cal-scheduler-hour-rows .cal-scheduler-hour .cal-scheduler-time .cal-scheduler-hour-segment:not(:last-child){border-bottom:thin dashed #e1e1e1}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols{display:flex;flex-flow:row wrap;border-top:1px solid #e1e1e1}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col{display:flex;flex-flow:column wrap;flex:1 0;border-right:1px solid #e1e1e1}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell{display:flex;flex-flow:column wrap;flex:1 0}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell.cal-today{background-color:#e8fde7}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell.cal-disabled{background-color:#eee;pointer-events:none}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell.cal-disabled .cal-scheduler-events{filter:opacity(50%);-webkit-filter:opacity(50%)}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments{display:flex;flex-flow:column wrap;flex:1 0;border-bottom:1px solid #e1e1e1}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments.no-border{border-bottom:0!important}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments.cal-disabled{background-color:#eee;pointer-events:none}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments.cal-disabled .cal-scheduler-event{filter:opacity(50%);-webkit-filter:opacity(50%)}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment{flex:1 0;display:flex;flex-flow:column wrap}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment:not(.has-events):hover{background-color:#ededed}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment:not(:last-child){border-bottom:thin dashed #e1e1e1}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment.no-border{border-bottom:0!important}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment.cal-disabled{background-color:#eee;pointer-events:none}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events,.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container{flex:1 0;display:flex;flex-flow:column wrap}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event{flex:1 0;display:flex;flex-flow:row wrap;padding:0 10px;font-size:12px;margin:0 2px;line-height:30px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:all ease-out .2s;filter:brightness(100%);-webkit-filter:brightness(100%);-webkit-backface-visibility:hidden}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event.cal-starts-within-segment{border-top-left-radius:.3em;border-top-right-radius:.3em;margin-top:2px}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event.cal-ends-within-segment{border-bottom-left-radius:.3em;border-bottom-right-radius:.3em;margin-bottom:2px}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event.cal-disabled{background-color:gray!important;filter:grayscale(100%);-webkit-filter:grayscale(100%)}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event.cal-not-clickable{cursor:not-allowed!important}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event:not(.cal-disabled).hovered,.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event:not(.cal-disabled):hover{cursor:pointer;filter:brightness(80%);-webkit-filter:brightness(80%)}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-title-container{position:relative;width:100%}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-title-container .cal-scheduler-event-title{font-size:16px;font-weight:700}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-title-container .cal-scheduler-event-status{position:absolute;top:25%;right:1%;width:16px;height:16px;background:grey;border-radius:50px;border:1px solid #000}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-title-container .cal-scheduler-event-status.ok{background:green}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-title-container .cal-scheduler-event-status.warning{background:orange}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-title-container .cal-scheduler-event-status.danger{background:red}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-content-container{width:100%}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-actions-container{flex:1 0;position:relative}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-actions-container .cal-scheduler-event-actions{position:absolute;bottom:5px;right:0}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-actions-container .cal-scheduler-event-actions .cal-scheduler-event-action{text-decoration:none}`],
                encapsulation: ViewEncapsulation.None
            },] },
];
/** @nocollapse */
CalendarSchedulerViewComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] },
    { type: SchedulerConfig }
];
CalendarSchedulerViewComponent.propDecorators = {
    viewDate: [{ type: Input }],
    events: [{ type: Input }],
    hourSegments: [{ type: Input }],
    excludeDays: [{ type: Input }],
    startsWithToday: [{ type: Input }],
    showActions: [{ type: Input }],
    dayModifier: [{ type: Input }],
    hourModifier: [{ type: Input }],
    segmentModifier: [{ type: Input }],
    refresh: [{ type: Input }],
    locale: [{ type: Input }],
    tooltipPlacement: [{ type: Input }],
    weekStartsOn: [{ type: Input }],
    headerTemplate: [{ type: Input }],
    cellTemplate: [{ type: Input }],
    eventTemplate: [{ type: Input }],
    precision: [{ type: Input }],
    dayStartHour: [{ type: Input }],
    dayStartMinute: [{ type: Input }],
    dayEndHour: [{ type: Input }],
    dayEndMinute: [{ type: Input }],
    dayClicked: [{ type: Output }],
    segmentClicked: [{ type: Output }],
    eventClicked: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const moment = momentImported;
class CalendarSchedulerCellComponent {
    constructor() {
        this.showActions = true;
        this.highlightSegment = new EventEmitter();
        this.unhighlightSegment = new EventEmitter();
        this.segmentClicked = new EventEmitter();
        this.eventClicked = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.title = moment(this.day.date).format('dddd L');
    }
    /**
     * @param {?} mouseEvent
     * @param {?} segment
     * @param {?} event
     * @return {?}
     */
    onMouseEnter(mouseEvent, segment, event) {
        if (!event.isDisabled && !segment.isDisabled) {
            this.highlightSegment.emit({ event: event });
        }
    }
    /**
     * @param {?} mouseEvent
     * @param {?} segment
     * @param {?} event
     * @return {?}
     */
    onMouseLeave(mouseEvent, segment, event) {
        if (!event.isDisabled && !segment.isDisabled) {
            this.unhighlightSegment.emit({ event: event });
        }
    }
    /**
     * @hidden
     * @param {?} mouseEvent
     * @param {?} segment
     * @return {?}
     */
    onSegmentClick(mouseEvent, segment) {
        if (mouseEvent.stopPropagation) {
            mouseEvent.stopPropagation();
        }
        if (segment.events.length === 0) {
            this.segmentClicked.emit({ segment: segment });
        }
    }
    /**
     * @hidden
     * @param {?} mouseEvent
     * @param {?} event
     * @return {?}
     */
    onEventClick(mouseEvent, event) {
        if (mouseEvent.stopPropagation) {
            mouseEvent.stopPropagation();
        }
        if (event.isClickable) {
            this.eventClicked.emit({ event: event });
        }
    }
}
CalendarSchedulerCellComponent.decorators = [
    { type: Component, args: [{
                // [class.no-border]': '!day.hasBorder
                selector: 'calendar-scheduler-cell',
                template: `
        <ng-template #defaultTemplate>
            <div class="cal-scheduler-segments" *ngIf="hour.segments.length > 0"
                [ngClass]="hour?.cssClass"
                [class.no-border]="!hour.hasBorder">
                <div class="cal-scheduler-segment"
                    *ngFor="let segment of hour.segments; let si = index"
                    [title]="title"
                    [ngClass]="segment?.cssClass"
                    [class.has-events]="segment.events.length > 0"
                    [class.cal-disabled]="segment.isDisabled"
                    [style.backgroundColor]="segment.backgroundColor"
                    [class.no-border]="!segment.hasBorder"
                    (mwlClick)="onSegmentClick($event, segment)">

                    <div class="cal-scheduler-events" *ngIf="segment.events.length > 0">
                        <calendar-scheduler-event
                            *ngFor="let event of segment.events"
                            [day]="day"
                            [hour]="hour"
                            [segment]="segment"
                            [event]="event"
                            (mouseenter)="onMouseEnter($event, segment, event)"
                            (mouseleave)="onMouseLeave($event, segment, event)"
                            [tooltipPlacement]="tooltipPlacement"
                            [showActions]="showActions"
                            [customTemplate]="eventTemplate"
                            (eventClicked)="onEventClick($event, event)">
                        </calendar-scheduler-event>
                    </div>
                </div>
            </div>
        </ng-template>
        <ng-template
            [ngTemplateOutlet]="customTemplate || defaultTemplate"
            [ngTemplateOutletContext]="{
                day: day,
                hour: hour,
                locale: locale,
                tooltipPlacement: tooltipPlacement,
                showActions: showActions,
                eventTemplate: eventTemplate,
                highlightSegment: highlightSegment,
                unhighlightSegment: unhighlightSegment,
                segmentClicked: segmentClicked,
                eventClicked: eventClicked
            }">
        </ng-template>
    `,
                host: {
                    'class': 'cal-scheduler-cell',
                    '[class.cal-past]': 'day.isPast',
                    '[class.cal-today]': 'day.isToday',
                    '[class.cal-future]': 'day.isFuture',
                    '[class.cal-weekend]': 'day.isWeekend',
                    '[class.cal-in-month]': 'day.inMonth',
                    '[class.cal-out-month]': '!day.inMonth',
                    '[style.backgroundColor]': 'day.backgroundColor'
                }
            },] },
];
CalendarSchedulerCellComponent.propDecorators = {
    title: [{ type: Input }],
    day: [{ type: Input }],
    hour: [{ type: Input }],
    locale: [{ type: Input }],
    tooltipPlacement: [{ type: Input }],
    showActions: [{ type: Input }],
    customTemplate: [{ type: Input }],
    eventTemplate: [{ type: Input }],
    highlightSegment: [{ type: Output }],
    unhighlightSegment: [{ type: Output }],
    segmentClicked: [{ type: Output }],
    eventClicked: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class CalendarSchedulerHeaderComponent {
    constructor() {
        this.dayClicked = new EventEmitter();
    }
}
CalendarSchedulerHeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'calendar-scheduler-header',
                template: `
        <ng-template #defaultTemplate>
            <div class="cal-scheduler-headers">
                <div class="cal-header aside cal-header-clock align-center">
                    <i class="material-icons md-32" style="margin:auto;">schedule</i>
                </div>

                <div class="cal-header-cols aside">
                    <div
                        class="cal-header"
                        *ngFor="let day of days"
                        [class.cal-past]="day.isPast"
                        [class.cal-today]="day.isToday"
                        [class.cal-future]="day.isFuture"
                        [class.cal-weekend]="day.isWeekend"
                        [class.cal-drag-over]="day.dragOver"
                        (mwlClick)="dayClicked.emit({date: day.date})">
                        <b>{{ day.date | calendarDate:'weekViewColumnHeader':locale }}</b><br>
                        <span>{{ day.date | calendarDate:'weekViewColumnSubHeader':locale }}</span>
                    </div>
                </div>
            </div>
        </ng-template>
        <ng-template
            [ngTemplateOutlet]="customTemplate || defaultTemplate"
            [ngTemplateOutletContext]="{days: days, locale: locale, dayClicked: dayClicked}">
        </ng-template>
    `
            },] },
];
CalendarSchedulerHeaderComponent.propDecorators = {
    days: [{ type: Input }],
    locale: [{ type: Input }],
    customTemplate: [{ type: Input }],
    dayClicked: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const moment$1 = momentImported;
/**
 * [mwlCalendarTooltip]="event.title | calendarEventTitle:'weekTooltip':event"
 * [tooltipPlacement]="tooltipPlacement"
 */
class CalendarSchedulerEventComponent {
    /**
     * @param {?} renderer
     */
    constructor(renderer) {
        this.renderer = renderer;
        this.showActions = true;
        this.eventClicked = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.segment.hasBorder = this.hour.hasBorder = !this.event.endsAfterSegment;
        this.title = moment$1(this.event.start).format('dddd L');
        this.checkEnableState();
    }
    /**
     * @return {?}
     */
    checkEnableState() {
        if (this.segment.isDisabled) {
            this.day.hours.forEach((hour) => {
                hour.segments.forEach((segment) => {
                    segment.events.filter((event) => event.id === this.event.id && isSameDay(event.start, this.event.start))
                        .forEach((event) => {
                        event.isDisabled = true;
                    });
                });
            });
        }
    }
    /**
     * @return {?}
     */
    highlightEvent() {
        // let events: CalendarSchedulerEvent[] = this.day.hours
        //    .filter(h => h.segments.some(s => s.events.some(e => e.id === this.event.id)))
        //    .map(h =>
        //        h.segments.map(s =>
        //            s.events.filter(e => e.id === this.event.id)
        //        ).reduce((prev, curr) => prev.concat(curr))
        //    )
        //    .reduce((prev, curr) => prev.concat(curr));
        this.day.hours.forEach((hour) => {
            hour.segments.forEach((segment) => {
                segment.events.filter((event) => event.id === this.event.id && isSameDay(event.start, this.event.start))
                    .forEach((event) => {
                    event.isHovered = true;
                });
            });
        });
    }
    /**
     * @return {?}
     */
    unhighlightEvent() {
        this.day.hours.forEach((hour) => {
            hour.segments.forEach((segment) => {
                segment.events.filter((event) => event.id === this.event.id && isSameDay(event.start, this.event.start))
                    .forEach((event) => {
                    event.isHovered = false;
                });
            });
        });
    }
}
CalendarSchedulerEventComponent.decorators = [
    { type: Component, args: [{
                selector: 'calendar-scheduler-event',
                template: `
        <ng-template #defaultTemplate>
            <div
                class="cal-scheduler-event"
                [title]="title"
                [class.cal-starts-within-segment]="!event.startsBeforeSegment"
                [class.cal-ends-within-segment]="!event.endsAfterSegment"
                [class.hovered]="event.isHovered"
                [class.cal-disabled]="event.isDisabled || segment.isDisabled"
                [class.cal-not-clickable]="!event.isClickable"
                [style.backgroundColor]="event.color.primary"
                [ngClass]="event?.cssClass"
                (mwlClick)="eventClicked.emit({event: event})"
                (mouseenter)="highlightEvent()"
                (mouseleave)="unhighlightEvent()">
                <calendar-scheduler-event-title *ngIf="!event.startsBeforeSegment"
                    [event]="event"
                    view="week">
                </calendar-scheduler-event-title>
                <calendar-scheduler-event-content *ngIf="!event.startsBeforeSegment"
                    [event]="event">
                </calendar-scheduler-event-content>
                <calendar-scheduler-event-actions [event]="event" *ngIf="showActions && event.isClickable && !event.endsAfterSegment"></calendar-scheduler-event-actions>
                <calendar-scheduler-event-actions [event]="event" *ngIf="showActions && event.isDisabled && !event.endsAfterSegment"></calendar-scheduler-event-actions>
            </div>
        </ng-template>
        <ng-template
            [ngTemplateOutlet]="customTemplate || defaultTemplate"
            [ngTemplateOutletContext]="{
                day: day,
                hour: hour,
                segment: segment,
                event: event,
                tooltipPlacement: tooltipPlacement,
                showActions: showActions,
                customTemplate: customTemplate,
                eventClicked: eventClicked
            }">
        </ng-template>
    `,
                host: {
                    'class': 'cal-scheduler-event-container'
                }
            },] },
];
/** @nocollapse */
CalendarSchedulerEventComponent.ctorParameters = () => [
    { type: Renderer2 }
];
CalendarSchedulerEventComponent.propDecorators = {
    title: [{ type: Input }],
    day: [{ type: Input }],
    hour: [{ type: Input }],
    segment: [{ type: Input }],
    event: [{ type: Input }],
    tooltipPlacement: [{ type: Input }],
    showActions: [{ type: Input }],
    customTemplate: [{ type: Input }],
    eventClicked: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class CalendarSchedulerEventTitleComponent {
}
CalendarSchedulerEventTitleComponent.decorators = [
    { type: Component, args: [{
                selector: 'calendar-scheduler-event-title',
                template: `
        <div
            class="cal-scheduler-event-title"
            [innerHTML]="event.title | schedulerEventTitle:view:event">
        </div>
        <div *ngIf="event.status"
            class="cal-scheduler-event-status"
            [class.ok]="event.status === 'ok'"
            [class.warning]="event.status === 'warning'"
            [class.danger]="event.status === 'danger'">
        </div>
    `,
                host: {
                    'class': 'cal-scheduler-event-title-container'
                }
            },] },
];
CalendarSchedulerEventTitleComponent.propDecorators = {
    event: [{ type: Input }],
    view: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class CalendarSchedulerEventContentComponent {
}
CalendarSchedulerEventContentComponent.decorators = [
    { type: Component, args: [{
                selector: 'calendar-scheduler-event-content',
                template: `
        <div *ngIf="event.content"
            class="cal-scheduler-event-content"
            [innerHTML]="event.content">
        </div>
    `,
                host: {
                    'class': 'cal-scheduler-event-content-container'
                }
            },] },
];
CalendarSchedulerEventContentComponent.propDecorators = {
    event: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class CalendarSchedulerEventActionsComponent {
    constructor() {
        this.actions = [];
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.actions = this.event.isDisabled ?
            this.event.actions.filter((a) => !a.when || a.when === 'disabled') :
            this.event.actions.filter((a) => !a.when || a.when === 'enabled');
    }
    /**
     * @hidden
     * @param {?} mouseEvent
     * @param {?} action
     * @param {?} event
     * @return {?}
     */
    onActionClick(mouseEvent, action, event) {
        if (mouseEvent.stopPropagation) {
            mouseEvent.stopPropagation();
        }
        action.onClick(event);
    }
}
CalendarSchedulerEventActionsComponent.decorators = [
    { type: Component, args: [{
                selector: 'calendar-scheduler-event-actions',
                template: `
        <span *ngIf="event.actions" class="cal-scheduler-event-actions">
            <a
                class="cal-scheduler-event-action"
                href="javascript:;"
                *ngFor="let action of actions"
                (mwlClick)="onActionClick($event, action, event)"
                [ngClass]="action.cssClass"
                [innerHtml]="action.label"
                [title]="action.title">
            </a>
        </span>
    `,
                host: {
                    'class': 'cal-scheduler-event-actions-container'
                }
            },] },
];
CalendarSchedulerEventActionsComponent.propDecorators = {
    event: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class SchedulerEventTitleFormatter extends CalendarEventTitleFormatter {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class SchedulerEventTitlePipe {
    /**
     * @param {?} schedulerEventTitle
     */
    constructor(schedulerEventTitle) {
        this.schedulerEventTitle = schedulerEventTitle;
    }
    /**
     * @param {?} title
     * @param {?} titleType
     * @param {?} event
     * @return {?}
     */
    transform(title, titleType, event) {
        return this.schedulerEventTitle[titleType](event);
    }
}
SchedulerEventTitlePipe.decorators = [
    { type: Pipe, args: [{
                name: 'schedulerEventTitle'
            },] },
];
/** @nocollapse */
SchedulerEventTitlePipe.ctorParameters = () => [
    { type: SchedulerEventTitleFormatter }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class SchedulerDateFormatter extends CalendarDateFormatter {
    /**
     * The time formatting down the left hand side of the day view
     * @param {?} __0
     * @return {?}
     */
    dayViewHour({ date, locale }) {
        return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: 'numeric' }).format(date);
    }
    /**
     * @param {?} __0
     * @return {?}
     */
    weekViewTitle({ date, locale }) {
        /** @type {?} */
        const year = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(date);
        /** @type {?} */
        const month = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);
        /** @type {?} */
        let firstDay = date.getDate();
        if (date.getDay() === 0) {
            firstDay += 1;
        }
        /** @type {?} */
        let lastDay = firstDay + 6;
        /** @type {?} */
        let firstDayMonth = month;
        /** @type {?} */
        let lastDayMonth = month;
        /** @type {?} */
        let firstDayYear = year;
        /** @type {?} */
        let lastDayYear = year;
        if (firstDay < 1) {
            /** @type {?} */
            const prevMonthDate = new Date(date.getFullYear(), date.getMonth() - 1);
            firstDayMonth = new Intl.DateTimeFormat(locale, { month: 'short' }).format(prevMonthDate);
            /** @type {?} */
            const daysInPrevMonth = this.daysInMonth(prevMonthDate);
            /** @type {?} */
            let i = 0;
            /** @type {?} */
            let prevMonthDay = daysInPrevMonth;
            for (i = 0; i < Math.abs(firstDay); i++) {
                prevMonthDay--;
            }
            firstDay = prevMonthDay;
            /** @type {?} */
            const prevMonthYear = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(prevMonthDate);
            if (Number(prevMonthYear) < Number(year)) {
                firstDayYear = prevMonthYear;
            }
        }
        /** @type {?} */
        const daysInMonth = this.daysInMonth(date);
        if (lastDay > daysInMonth) {
            /** @type {?} */
            const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1);
            lastDayMonth = new Intl.DateTimeFormat(locale, { month: 'short' }).format(nextMonthDate);
            /** @type {?} */
            let i = 0;
            /** @type {?} */
            let nextMonthDay = 0;
            for (i = 0; i < (lastDay - daysInMonth); i++) {
                nextMonthDay++;
            }
            lastDay = nextMonthDay;
            /** @type {?} */
            const nextMonthYear = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(nextMonthDate);
            if (Number(nextMonthYear) > Number(year)) {
                lastDayYear = nextMonthYear;
            }
        }
        return `${firstDay}` + (firstDayMonth !== lastDayMonth ? ' ' + firstDayMonth : '') +
            (firstDayYear !== lastDayYear ? ' ' + firstDayYear : '') +
            ` - ${lastDay} ${lastDayMonth} ${lastDayYear}`;
    }
    /**
     * @param {?} anyDateInMonth
     * @return {?}
     */
    daysInMonth(anyDateInMonth) {
        return new Date(anyDateInMonth.getFullYear(), anyDateInMonth.getMonth() + 1, 0).getDate();
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} period
 * @param {?} date
 * @param {?} amount
 * @return {?}
 */
function addPeriod(period, date, amount) {
    return {
        day: addDays,
        week: addWeeks,
        month: addMonths
    }[period](date, amount);
}
/**
 * @param {?} period
 * @param {?} date
 * @param {?} amount
 * @return {?}
 */
function subPeriod(period, date, amount) {
    return {
        day: subDays,
        week: subWeeks,
        month: subMonths
    }[period](date, amount);
}
/**
 * @param {?} period
 * @param {?} date
 * @return {?}
 */
function startOfPeriod(period, date) {
    return {
        day: startOfDay,
        week: startOfWeek,
        month: startOfMonth
    }[period](date);
}
/**
 * @param {?} period
 * @param {?} date
 * @return {?}
 */
function endOfPeriod(period, date) {
    return {
        day: endOfDay,
        week: endOfWeek,
        month: endOfMonth
    }[period](date);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const SCHEDULER_CONFIG = new InjectionToken('SchedulerConfig');
/**
 * @param {?} config
 * @return {?}
 */
function provideAuthConfig(config) {
    return new SchedulerConfig(config);
}
class SchedulerModule {
    /**
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: SchedulerModule,
            providers: [
                { provide: SCHEDULER_CONFIG, useValue: config },
                { provide: SchedulerConfig, useFactory: provideAuthConfig, deps: [SCHEDULER_CONFIG] }
            ]
        };
    }
}
SchedulerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    CalendarModule.forRoot()
                ],
                declarations: [
                    CalendarSchedulerViewComponent,
                    CalendarSchedulerCellComponent,
                    CalendarSchedulerHeaderComponent,
                    CalendarSchedulerEventComponent,
                    CalendarSchedulerEventTitleComponent,
                    CalendarSchedulerEventContentComponent,
                    CalendarSchedulerEventActionsComponent,
                    SchedulerEventTitlePipe
                ],
                providers: [
                    SchedulerEventTitlePipe,
                    SchedulerEventTitleFormatter
                ],
                exports: [
                    CalendarSchedulerViewComponent,
                    CalendarSchedulerCellComponent,
                    CalendarSchedulerHeaderComponent,
                    CalendarSchedulerEventComponent,
                    CalendarSchedulerEventTitleComponent,
                    CalendarSchedulerEventContentComponent,
                    CalendarSchedulerEventActionsComponent
                ]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { SCHEDULER_CONFIG, provideAuthConfig, SchedulerModule, CalendarSchedulerViewComponent, SchedulerDateFormatter, SchedulerEventTitleFormatter, SchedulerEventTitlePipe, addPeriod, subPeriod, startOfPeriod, endOfPeriod, CalendarSchedulerCellComponent as ɵb, CalendarSchedulerEventActionsComponent as ɵg, CalendarSchedulerEventContentComponent as ɵf, CalendarSchedulerEventTitleComponent as ɵe, CalendarSchedulerEventComponent as ɵd, CalendarSchedulerHeaderComponent as ɵc, SchedulerEventTitleFormatter as ɵi, SchedulerEventTitlePipe as ɵh, SchedulerConfig as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIuanMubWFwIiwic291cmNlcyI6WyJuZzovL2FuZ3VsYXItY2FsZW5kYXItc2NoZWR1bGVyL3NyYy9hcHAvbW9kdWxlcy9zY2hlZHVsZXIvc2NoZWR1bGVyLWNvbmZpZy50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIvc3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9jYWxlbmRhci1zY2hlZHVsZXItdmlldy5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXItc2NoZWR1bGVyL3NyYy9hcHAvbW9kdWxlcy9zY2hlZHVsZXIvY2FsZW5kYXItc2NoZWR1bGVyLWNlbGwuY29tcG9uZW50LnRzIiwibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLXNjaGVkdWxlci9zcmMvYXBwL21vZHVsZXMvc2NoZWR1bGVyL2NhbGVuZGFyLXNjaGVkdWxlci1oZWFkZXIuY29tcG9uZW50LnRzIiwibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLXNjaGVkdWxlci9zcmMvYXBwL21vZHVsZXMvc2NoZWR1bGVyL2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXItc2NoZWR1bGVyL3NyYy9hcHAvbW9kdWxlcy9zY2hlZHVsZXIvY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LXRpdGxlLmNvbXBvbmVudC50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIvc3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9jYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtY29udGVudC5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXItc2NoZWR1bGVyL3NyYy9hcHAvbW9kdWxlcy9zY2hlZHVsZXIvY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LWFjdGlvbnMuY29tcG9uZW50LnRzIiwibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLXNjaGVkdWxlci9zcmMvYXBwL21vZHVsZXMvc2NoZWR1bGVyL2Zvcm1hdHRlcnMvc2NoZWR1bGVyLWV2ZW50LXRpdGxlLWZvcm1hdHRlci5wcm92aWRlci50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIvc3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9waXBlcy9zY2hlZHVsZXItZXZlbnQtdGl0bGUucGlwZS50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIvc3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9mb3JtYXR0ZXJzL3NjaGVkdWxlci1kYXRlLWZvcm1hdHRlci5wcm92aWRlci50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIvc3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9jYWxlbmRhci11dGlscy50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIvc3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9zY2hlZHVsZXIubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbi8qKlxyXG4gKiBBdXRoIGNvbmZpZ3VyYXRpb24uXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBTY2hlZHVsZXJDb25maWcge1xyXG4gICAgbG9jYWxlPzogc3RyaW5nID0gJ2VuJztcclxuICAgIGhlYWRlckRhdGVGb3JtYXQ/OiAnd2Vla051bWJlcicgfCAnZGF5c1JhbmdlJyA9ICdkYXlzUmFuZ2UnO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogU2NoZWR1bGVyQ29uZmlnID0ge30pIHtcclxuICAgICAgICBmdW5jdGlvbiB1c2U8VD4oc291cmNlOiBULCBkZWZhdWx0VmFsdWU6IFQpOiBUIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZyAmJiBzb3VyY2UgIT09IHVuZGVmaW5lZCA/IHNvdXJjZSA6IGRlZmF1bHRWYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubG9jYWxlID0gdXNlKGNvbmZpZy5sb2NhbGUsIHRoaXMubG9jYWxlKTtcclxuICAgICAgICB0aGlzLmhlYWRlckRhdGVGb3JtYXQgPSB1c2UoY29uZmlnLmhlYWRlckRhdGVGb3JtYXQsIHRoaXMuaGVhZGVyRGF0ZUZvcm1hdCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtcclxuICAgIENvbXBvbmVudCxcclxuICAgIElucHV0LFxyXG4gICAgT3V0cHV0LFxyXG4gICAgRXZlbnRFbWl0dGVyLFxyXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgICBPbkNoYW5nZXMsXHJcbiAgICBPbkluaXQsXHJcbiAgICBPbkRlc3Ryb3ksXHJcbiAgICBMT0NBTEVfSUQsXHJcbiAgICBJbmplY3QsXHJcbiAgICBUZW1wbGF0ZVJlZixcclxuICAgIFZpZXdFbmNhcHN1bGF0aW9uXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1xyXG4gICAgRXZlbnRDb2xvcixcclxuICAgIERheVZpZXdIb3VyLFxyXG4gICAgRGF5Vmlld0hvdXJTZWdtZW50XHJcbn0gZnJvbSAnY2FsZW5kYXItdXRpbHMnO1xyXG5pbXBvcnQge1xyXG4gICAgc3RhcnRPZk1pbnV0ZSxcclxuICAgIHN0YXJ0T2ZEYXksXHJcbiAgICBzdGFydE9mV2VlayxcclxuICAgIGVuZE9mRGF5LFxyXG4gICAgZW5kT2ZXZWVrLFxyXG4gICAgYWRkTWludXRlcyxcclxuICAgIGFkZEhvdXJzLFxyXG4gICAgYWRkRGF5cyxcclxuICAgIHN1YlNlY29uZHMsXHJcbiAgICBzZXRNaW51dGVzLFxyXG4gICAgc2V0SG91cnMsXHJcbiAgICBzZXREYXRlLFxyXG4gICAgc2V0TW9udGgsXHJcbiAgICBzZXRZZWFyLFxyXG4gICAgaXNTYW1lU2Vjb25kLFxyXG4gICAgaXNTYW1lRGF5LFxyXG4gICAgZ2V0RGF5XHJcbn0gZnJvbSAnZGF0ZS1mbnMnO1xyXG5pbXBvcnQgeyBTY2hlZHVsZXJDb25maWcgfSBmcm9tICcuL3NjaGVkdWxlci1jb25maWcnO1xyXG5cclxuXHJcbmNvbnN0IFdFRUtFTkRfREFZX05VTUJFUlMgPSBbMCwgNl07XHJcbmNvbnN0IERBWVNfSU5fV0VFSyA9IDc7XHJcbmNvbnN0IEhPVVJTX0lOX0RBWSA9IDI0O1xyXG5jb25zdCBNSU5VVEVTX0lOX0hPVVIgPSA2MDtcclxuY29uc3QgU0VDT05EU19JTl9EQVkgPSA2MCAqIDYwICogMjQ7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNjaGVkdWxlclZpZXcge1xyXG4gICAgZGF5czogU2NoZWR1bGVyVmlld0RheVtdO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNjaGVkdWxlclZpZXdEYXkge1xyXG4gICAgZGF0ZTogRGF0ZTtcclxuICAgIGlzUGFzdDogYm9vbGVhbjtcclxuICAgIGlzVG9kYXk6IGJvb2xlYW47XHJcbiAgICBpc0Z1dHVyZTogYm9vbGVhbjtcclxuICAgIGlzV2Vla2VuZDogYm9vbGVhbjtcclxuICAgIGluTW9udGg6IGJvb2xlYW47XHJcbiAgICBkcmFnT3ZlcjogYm9vbGVhbjtcclxuICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAgIGNzc0NsYXNzPzogc3RyaW5nO1xyXG4gICAgaG91cnM6IFNjaGVkdWxlclZpZXdIb3VyW107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2NoZWR1bGVyVmlld0hvdXIge1xyXG4gICAgaG91cjogRGF5Vmlld0hvdXI7XHJcbiAgICBkYXRlOiBEYXRlO1xyXG4gICAgc2VnbWVudHM6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudFtdO1xyXG4gICAgaXNQYXN0OiBib29sZWFuO1xyXG4gICAgaXNGdXR1cmU6IGJvb2xlYW47XHJcbiAgICBoYXNCb3JkZXI6IGJvb2xlYW47XHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XHJcbiAgICBjc3NDbGFzcz86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQge1xyXG4gICAgc2VnbWVudDogRGF5Vmlld0hvdXJTZWdtZW50O1xyXG4gICAgZGF0ZTogRGF0ZTtcclxuICAgIGV2ZW50czogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudFtdO1xyXG4gICAgaXNQYXN0OiBib29sZWFuO1xyXG4gICAgaXNGdXR1cmU6IGJvb2xlYW47XHJcbiAgICBpc0Rpc2FibGVkOiBib29sZWFuO1xyXG4gICAgaGFzQm9yZGVyOiBib29sZWFuO1xyXG4gICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG4gICAgY3NzQ2xhc3M/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgc3RhcnQ6IERhdGU7XHJcbiAgICBlbmQ/OiBEYXRlO1xyXG4gICAgdGl0bGU6IHN0cmluZztcclxuICAgIGNvbnRlbnQ/OiBzdHJpbmc7XHJcbiAgICBjb2xvcjogRXZlbnRDb2xvcjtcclxuICAgIGFjdGlvbnM/OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50QWN0aW9uW107XHJcbiAgICBzdGF0dXM/OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50U3RhdHVzO1xyXG4gICAgY3NzQ2xhc3M/OiBzdHJpbmc7XHJcbiAgICBzdGFydHNCZWZvcmVTZWdtZW50PzogYm9vbGVhbjtcclxuICAgIGVuZHNBZnRlclNlZ21lbnQ/OiBib29sZWFuO1xyXG4gICAgaXNIb3ZlcmVkPzogYm9vbGVhbjtcclxuICAgIGlzRGlzYWJsZWQ/OiBib29sZWFuO1xyXG4gICAgaXNDbGlja2FibGU/OiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBDYWxlbmRhclNjaGVkdWxlckV2ZW50U3RhdHVzID0gJ29rJyB8ICd3YXJuaW5nJyB8ICdkYW5nZXInO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDYWxlbmRhclNjaGVkdWxlckV2ZW50QWN0aW9uIHtcclxuICAgIHdoZW4/OiAnZW5hYmxlZCcgfCAnZGlzYWJsZWQnO1xyXG4gICAgbGFiZWw6IHN0cmluZztcclxuICAgIHRpdGxlOiBzdHJpbmc7XHJcbiAgICBjc3NDbGFzcz86IHN0cmluZztcclxuICAgIG9uQ2xpY2soZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpOiB2b2lkO1xyXG59XHJcblxyXG4gLy8gaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9zbmlwcGV0cy9jc3MvYS1ndWlkZS10by1mbGV4Ym94L1xyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnY2FsZW5kYXItc2NoZWR1bGVyLXZpZXcnLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXNjaGVkdWxlci12aWV3XCIgI3dlZWtWaWV3Q29udGFpbmVyPlxyXG4gICAgICAgICAgICA8Y2FsZW5kYXItc2NoZWR1bGVyLWhlYWRlclxyXG4gICAgICAgICAgICAgICAgW2RheXNdPVwiaGVhZGVyRGF5c1wiXHJcbiAgICAgICAgICAgICAgICBbbG9jYWxlXT1cImxvY2FsZVwiXHJcbiAgICAgICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiaGVhZGVyVGVtcGxhdGVcIlxyXG4gICAgICAgICAgICAgICAgKGRheUNsaWNrZWQpPVwiZGF5Q2xpY2tlZC5lbWl0KCRldmVudClcIj5cclxuICAgICAgICAgICAgPC9jYWxlbmRhci1zY2hlZHVsZXItaGVhZGVyPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhbC1zY2hlZHVsZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLWhvdXItcm93cyBhc2lkZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLWhvdXIgYWxpZ24tY2VudGVyIGhvcml6b250YWxcIiAqbmdGb3I9XCJsZXQgaG91ciBvZiBob3Vyc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhbC1zY2hlZHVsZXItdGltZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXNjaGVkdWxlci1ob3VyLXNlZ21lbnRcIiAqbmdGb3I9XCJsZXQgc2VnbWVudCBvZiBob3VyLnNlZ21lbnRzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7eyBzZWdtZW50LmRhdGUgfCBjYWxlbmRhckRhdGU6J2RheVZpZXdIb3VyJzpsb2NhbGUgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLWNvbHMgYXNpZGVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXNjaGVkdWxlci1jb2xcIiAqbmdGb3I9XCJsZXQgZGF5IG9mIHZpZXcuZGF5c1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y2FsZW5kYXItc2NoZWR1bGVyLWNlbGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICpuZ0Zvcj1cImxldCBob3VyIG9mIGRheS5ob3Vyc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJkYXk/LmNzc0NsYXNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkYXldPVwiZGF5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtob3VyXT1cImhvdXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2xvY2FsZV09XCJsb2NhbGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3Rvb2x0aXBQbGFjZW1lbnRdPVwidG9vbHRpcFBsYWNlbWVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc2hvd0FjdGlvbnNdPVwic2hvd0FjdGlvbnNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cImNlbGxUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZXZlbnRUZW1wbGF0ZV09XCJldmVudFRlbXBsYXRlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJkYXlDbGlja2VkLmVtaXQoe2RhdGU6IGRheX0pXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChoaWdobGlnaHRTZWdtZW50KT1cInRvZ2dsZVNlZ21lbnRIaWdobGlnaHQoJGV2ZW50LmV2ZW50LCB0cnVlKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodW5oaWdobGlnaHRTZWdtZW50KT1cInRvZ2dsZVNlZ21lbnRIaWdobGlnaHQoJGV2ZW50LmV2ZW50LCBmYWxzZSlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNlZ21lbnRDbGlja2VkKT1cInNlZ21lbnRDbGlja2VkLmVtaXQoe3NlZ21lbnQ6ICRldmVudC5zZWdtZW50fSlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGV2ZW50Q2xpY2tlZCk9XCJldmVudENsaWNrZWQuZW1pdCh7ZXZlbnQ6ICRldmVudC5ldmVudH0pXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvY2FsZW5kYXItc2NoZWR1bGVyLWNlbGw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICBgLFxyXG4gICAgc3R5bGVzOiBbYC5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXItaGVhZGVyc3tkaXNwbGF5OmZsZXg7ZmxleC1mbG93OnJvdyB3cmFwO21hcmdpbi1ib3R0b206M3B4O2JvcmRlcjoxcHggc29saWQgI2UxZTFlMX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyLWhlYWRlcnMgLmFzaWRle2ZsZXg6MSAwfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXItaGVhZGVycyAuYXNpZGUuY2FsLWhlYWRlci1jbG9ja3ttYXgtd2lkdGg6NWVtfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXItaGVhZGVycyAuY2FsLWhlYWRlcntmbGV4OjE7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzo1cHg7b3ZlcmZsb3c6aGlkZGVuO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7d2hpdGUtc3BhY2U6bm93cmFwfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXItaGVhZGVycyAuY2FsLWhlYWRlcjpub3QoOmxhc3QtY2hpbGQpe2JvcmRlci1yaWdodDoxcHggc29saWQgI2UxZTFlMX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyLWhlYWRlcnMgLmNhbC1oZWFkZXI6aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojZWRlZGVkfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXItaGVhZGVycyAuY2FsLWhlYWRlci5jYWwtdG9kYXl7YmFja2dyb3VuZC1jb2xvcjojZThmZGU3fS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXItaGVhZGVycyAuY2FsLWhlYWRlci5jYWwtd2Vla2VuZCBzcGFue2NvbG9yOiM4YjAwMDB9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlci1oZWFkZXJzIC5jYWwtaGVhZGVyIHNwYW57Zm9udC13ZWlnaHQ6NDAwO29wYWNpdHk6LjV9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciwuY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyLWhlYWRlcnMgLmNhbC1oZWFkZXItY29sc3tkaXNwbGF5OmZsZXg7ZmxleC1mbG93OnJvdyB3cmFwfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmFzaWRle2ZsZXg6MSAwfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmFzaWRlLmNhbC1zY2hlZHVsZXItaG91ci1yb3dze21heC13aWR0aDo1ZW19LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1ob3VyLXJvd3N7d2lkdGg6YXV0byFpbXBvcnRhbnQ7Ym9yZGVyOjFweCBzb2xpZCAjZTFlMWUxO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjpyZWxhdGl2ZX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWhvdXItcm93cyAuY2FsLXNjaGVkdWxlci1ob3Vye2Rpc3BsYXk6ZmxleDtoZWlnaHQ6Ny4yNWVtfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItaG91ci1yb3dzIC5jYWwtc2NoZWR1bGVyLWhvdXI6bnRoLWNoaWxkKG9kZCl7YmFja2dyb3VuZC1jb2xvcjojZmFmYWZhfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItaG91ci1yb3dzIC5jYWwtc2NoZWR1bGVyLWhvdXI6bm90KDpsYXN0LWNoaWxkKXtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZTFlMWUxfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItaG91ci1yb3dzIC5jYWwtc2NoZWR1bGVyLWhvdXIgLmNhbC1zY2hlZHVsZXItdGltZXtkaXNwbGF5OmZsZXg7ZmxleC1mbG93OmNvbHVtbiB3cmFwO3dpZHRoOjEwMCU7Zm9udC13ZWlnaHQ6NzAwO3RleHQtYWxpZ246Y2VudGVyfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItaG91ci1yb3dzIC5jYWwtc2NoZWR1bGVyLWhvdXIgLmNhbC1zY2hlZHVsZXItdGltZSAuY2FsLXNjaGVkdWxlci1ob3VyLXNlZ21lbnR7ZmxleDoxIDB9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1ob3VyLXJvd3MgLmNhbC1zY2hlZHVsZXItaG91ciAuY2FsLXNjaGVkdWxlci10aW1lIC5jYWwtc2NoZWR1bGVyLWhvdXItc2VnbWVudDpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOiNlZGVkZWR9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1ob3VyLXJvd3MgLmNhbC1zY2hlZHVsZXItaG91ciAuY2FsLXNjaGVkdWxlci10aW1lIC5jYWwtc2NoZWR1bGVyLWhvdXItc2VnbWVudDpub3QoOmxhc3QtY2hpbGQpe2JvcmRlci1ib3R0b206dGhpbiBkYXNoZWQgI2UxZTFlMX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHN7ZGlzcGxheTpmbGV4O2ZsZXgtZmxvdzpyb3cgd3JhcDtib3JkZXItdG9wOjFweCBzb2xpZCAjZTFlMWUxfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2x7ZGlzcGxheTpmbGV4O2ZsZXgtZmxvdzpjb2x1bW4gd3JhcDtmbGV4OjEgMDtib3JkZXItcmlnaHQ6MXB4IHNvbGlkICNlMWUxZTF9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxse2Rpc3BsYXk6ZmxleDtmbGV4LWZsb3c6Y29sdW1uIHdyYXA7ZmxleDoxIDB9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsLmNhbC10b2RheXtiYWNrZ3JvdW5kLWNvbG9yOiNlOGZkZTd9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsLmNhbC1kaXNhYmxlZHtiYWNrZ3JvdW5kLWNvbG9yOiNlZWU7cG9pbnRlci1ldmVudHM6bm9uZX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwuY2FsLWRpc2FibGVkIC5jYWwtc2NoZWR1bGVyLWV2ZW50c3tmaWx0ZXI6b3BhY2l0eSg1MCUpOy13ZWJraXQtZmlsdGVyOm9wYWNpdHkoNTAlKX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHN7ZGlzcGxheTpmbGV4O2ZsZXgtZmxvdzpjb2x1bW4gd3JhcDtmbGV4OjEgMDtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZTFlMWUxfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cy5uby1ib3JkZXJ7Ym9yZGVyLWJvdHRvbTowIWltcG9ydGFudH0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMuY2FsLWRpc2FibGVke2JhY2tncm91bmQtY29sb3I6I2VlZTtwb2ludGVyLWV2ZW50czpub25lfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cy5jYWwtZGlzYWJsZWQgLmNhbC1zY2hlZHVsZXItZXZlbnR7ZmlsdGVyOm9wYWNpdHkoNTAlKTstd2Via2l0LWZpbHRlcjpvcGFjaXR5KDUwJSl9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnRzIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnR7ZmxleDoxIDA7ZGlzcGxheTpmbGV4O2ZsZXgtZmxvdzpjb2x1bW4gd3JhcH0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudDpub3QoLmhhcy1ldmVudHMpOmhvdmVye2JhY2tncm91bmQtY29sb3I6I2VkZWRlZH0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudDpub3QoOmxhc3QtY2hpbGQpe2JvcmRlci1ib3R0b206dGhpbiBkYXNoZWQgI2UxZTFlMX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudC5uby1ib3JkZXJ7Ym9yZGVyLWJvdHRvbTowIWltcG9ydGFudH0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudC5jYWwtZGlzYWJsZWR7YmFja2dyb3VuZC1jb2xvcjojZWVlO3BvaW50ZXItZXZlbnRzOm5vbmV9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnRzIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnQgLmNhbC1zY2hlZHVsZXItZXZlbnRzLC5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cyAuY2FsLXNjaGVkdWxlci1zZWdtZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50cyAuY2FsLXNjaGVkdWxlci1ldmVudC1jb250YWluZXJ7ZmxleDoxIDA7ZGlzcGxheTpmbGV4O2ZsZXgtZmxvdzpjb2x1bW4gd3JhcH0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudCAuY2FsLXNjaGVkdWxlci1ldmVudHMgLmNhbC1zY2hlZHVsZXItZXZlbnQtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50e2ZsZXg6MSAwO2Rpc3BsYXk6ZmxleDtmbGV4LWZsb3c6cm93IHdyYXA7cGFkZGluZzowIDEwcHg7Zm9udC1zaXplOjEycHg7bWFyZ2luOjAgMnB4O2xpbmUtaGVpZ2h0OjMwcHg7b3ZlcmZsb3c6aGlkZGVuO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7d2hpdGUtc3BhY2U6bm93cmFwO3RyYW5zaXRpb246YWxsIGVhc2Utb3V0IC4ycztmaWx0ZXI6YnJpZ2h0bmVzcygxMDAlKTstd2Via2l0LWZpbHRlcjpicmlnaHRuZXNzKDEwMCUpOy13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eTpoaWRkZW59LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnRzIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnQgLmNhbC1zY2hlZHVsZXItZXZlbnRzIC5jYWwtc2NoZWR1bGVyLWV2ZW50LWNvbnRhaW5lciAuY2FsLXNjaGVkdWxlci1ldmVudC5jYWwtc3RhcnRzLXdpdGhpbi1zZWdtZW50e2JvcmRlci10b3AtbGVmdC1yYWRpdXM6LjNlbTtib3JkZXItdG9wLXJpZ2h0LXJhZGl1czouM2VtO21hcmdpbi10b3A6MnB4fS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cyAuY2FsLXNjaGVkdWxlci1zZWdtZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50cyAuY2FsLXNjaGVkdWxlci1ldmVudC1jb250YWluZXIgLmNhbC1zY2hlZHVsZXItZXZlbnQuY2FsLWVuZHMtd2l0aGluLXNlZ21lbnR7Ym9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czouM2VtO2JvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOi4zZW07bWFyZ2luLWJvdHRvbToycHh9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnRzIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnQgLmNhbC1zY2hlZHVsZXItZXZlbnRzIC5jYWwtc2NoZWR1bGVyLWV2ZW50LWNvbnRhaW5lciAuY2FsLXNjaGVkdWxlci1ldmVudC5jYWwtZGlzYWJsZWR7YmFja2dyb3VuZC1jb2xvcjpncmF5IWltcG9ydGFudDtmaWx0ZXI6Z3JheXNjYWxlKDEwMCUpOy13ZWJraXQtZmlsdGVyOmdyYXlzY2FsZSgxMDAlKX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudCAuY2FsLXNjaGVkdWxlci1ldmVudHMgLmNhbC1zY2hlZHVsZXItZXZlbnQtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50LmNhbC1ub3QtY2xpY2thYmxle2N1cnNvcjpub3QtYWxsb3dlZCFpbXBvcnRhbnR9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnRzIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnQgLmNhbC1zY2hlZHVsZXItZXZlbnRzIC5jYWwtc2NoZWR1bGVyLWV2ZW50LWNvbnRhaW5lciAuY2FsLXNjaGVkdWxlci1ldmVudDpub3QoLmNhbC1kaXNhYmxlZCkuaG92ZXJlZCwuY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudCAuY2FsLXNjaGVkdWxlci1ldmVudHMgLmNhbC1zY2hlZHVsZXItZXZlbnQtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50Om5vdCguY2FsLWRpc2FibGVkKTpob3ZlcntjdXJzb3I6cG9pbnRlcjtmaWx0ZXI6YnJpZ2h0bmVzcyg4MCUpOy13ZWJraXQtZmlsdGVyOmJyaWdodG5lc3MoODAlKX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudCAuY2FsLXNjaGVkdWxlci1ldmVudHMgLmNhbC1zY2hlZHVsZXItZXZlbnQtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50LXRpdGxlLWNvbnRhaW5lcntwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDoxMDAlfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cyAuY2FsLXNjaGVkdWxlci1zZWdtZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50cyAuY2FsLXNjaGVkdWxlci1ldmVudC1jb250YWluZXIgLmNhbC1zY2hlZHVsZXItZXZlbnQgLmNhbC1zY2hlZHVsZXItZXZlbnQtdGl0bGUtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50LXRpdGxle2ZvbnQtc2l6ZToxNnB4O2ZvbnQtd2VpZ2h0OjcwMH0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudCAuY2FsLXNjaGVkdWxlci1ldmVudHMgLmNhbC1zY2hlZHVsZXItZXZlbnQtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50LXRpdGxlLWNvbnRhaW5lciAuY2FsLXNjaGVkdWxlci1ldmVudC1zdGF0dXN7cG9zaXRpb246YWJzb2x1dGU7dG9wOjI1JTtyaWdodDoxJTt3aWR0aDoxNnB4O2hlaWdodDoxNnB4O2JhY2tncm91bmQ6Z3JleTtib3JkZXItcmFkaXVzOjUwcHg7Ym9yZGVyOjFweCBzb2xpZCAjMDAwfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cyAuY2FsLXNjaGVkdWxlci1zZWdtZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50cyAuY2FsLXNjaGVkdWxlci1ldmVudC1jb250YWluZXIgLmNhbC1zY2hlZHVsZXItZXZlbnQgLmNhbC1zY2hlZHVsZXItZXZlbnQtdGl0bGUtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50LXN0YXR1cy5va3tiYWNrZ3JvdW5kOmdyZWVufS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cyAuY2FsLXNjaGVkdWxlci1zZWdtZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50cyAuY2FsLXNjaGVkdWxlci1ldmVudC1jb250YWluZXIgLmNhbC1zY2hlZHVsZXItZXZlbnQgLmNhbC1zY2hlZHVsZXItZXZlbnQtdGl0bGUtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50LXN0YXR1cy53YXJuaW5ne2JhY2tncm91bmQ6b3JhbmdlfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cyAuY2FsLXNjaGVkdWxlci1zZWdtZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50cyAuY2FsLXNjaGVkdWxlci1ldmVudC1jb250YWluZXIgLmNhbC1zY2hlZHVsZXItZXZlbnQgLmNhbC1zY2hlZHVsZXItZXZlbnQtdGl0bGUtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50LXN0YXR1cy5kYW5nZXJ7YmFja2dyb3VuZDpyZWR9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnRzIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnQgLmNhbC1zY2hlZHVsZXItZXZlbnRzIC5jYWwtc2NoZWR1bGVyLWV2ZW50LWNvbnRhaW5lciAuY2FsLXNjaGVkdWxlci1ldmVudCAuY2FsLXNjaGVkdWxlci1ldmVudC1jb250ZW50LWNvbnRhaW5lcnt3aWR0aDoxMDAlfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cyAuY2FsLXNjaGVkdWxlci1zZWdtZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50cyAuY2FsLXNjaGVkdWxlci1ldmVudC1jb250YWluZXIgLmNhbC1zY2hlZHVsZXItZXZlbnQgLmNhbC1zY2hlZHVsZXItZXZlbnQtYWN0aW9ucy1jb250YWluZXJ7ZmxleDoxIDA7cG9zaXRpb246cmVsYXRpdmV9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnRzIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnQgLmNhbC1zY2hlZHVsZXItZXZlbnRzIC5jYWwtc2NoZWR1bGVyLWV2ZW50LWNvbnRhaW5lciAuY2FsLXNjaGVkdWxlci1ldmVudCAuY2FsLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zLWNvbnRhaW5lciAuY2FsLXNjaGVkdWxlci1ldmVudC1hY3Rpb25ze3Bvc2l0aW9uOmFic29sdXRlO2JvdHRvbTo1cHg7cmlnaHQ6MH0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudCAuY2FsLXNjaGVkdWxlci1ldmVudHMgLmNhbC1zY2hlZHVsZXItZXZlbnQtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50LWFjdGlvbnMtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50LWFjdGlvbnMgLmNhbC1zY2hlZHVsZXItZXZlbnQtYWN0aW9ue3RleHQtZGVjb3JhdGlvbjpub25lfWBdLFxyXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJTY2hlZHVsZXJWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIE9uRGVzdHJveSB7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBjdXJyZW50IHZpZXcgZGF0ZVxyXG4gICAgICovXHJcbiAgICBASW5wdXQoKSB2aWV3RGF0ZTogRGF0ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFuIGFycmF5IG9mIGV2ZW50cyB0byBkaXNwbGF5IG9uIHZpZXdcclxuICAgICAqL1xyXG4gICAgQElucHV0KCkgZXZlbnRzOiBDYWxlbmRhclNjaGVkdWxlckV2ZW50W10gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBudW1iZXIgb2Ygc2VnbWVudHMgaW4gYW4gaG91ci4gTXVzdCBiZSA8PSA2XHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIGhvdXJTZWdtZW50czogbnVtYmVyID0gMjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFuIGFycmF5IG9mIGRheSBpbmRleGVzICgwID0gc3VuZGF5LCAxID0gbW9uZGF5IGV0YykgdGhhdCB3aWxsIGJlIGhpZGRlbiBvbiB0aGUgdmlld1xyXG4gICAgICovXHJcbiAgICBASW5wdXQoKSBleGNsdWRlRGF5czogbnVtYmVyW10gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNwZWNpZnkgaWYgdGhlIGZpcnN0IGRheSBvZiBjdXJyZW50IHNjaGVkdWxlciB2aWV3IGhhcyB0byBiZSB0b2RheSBvciB0aGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrXHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIHN0YXJ0c1dpdGhUb2RheTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3BlY2lmeSBpZiBhY3Rpb25zIG11c3QgYmUgc2hvd24gb3Igbm90XHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIHNob3dBY3Rpb25zOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgZWFjaCBjZWxsIGlzIHJlbmRlcmVkLiBUaGUgZmlyc3QgYXJndW1lbnQgd2lsbCBjb250YWluIHRoZSBjYWxlbmRhciAoZGF5LCBob3VyIG9yIHNlZ21lbnQpIGNlbGwuXHJcbiAgICAgKiBJZiB5b3UgYWRkIHRoZSBgY3NzQ2xhc3NgIHByb3BlcnR5IHRvIHRoZSBjZWxsIGl0IHdpbGwgYWRkIHRoYXQgY2xhc3MgdG8gdGhlIGNlbGwgaW4gdGhlIHRlbXBsYXRlXHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIGRheU1vZGlmaWVyOiBGdW5jdGlvbjtcclxuICAgIEBJbnB1dCgpIGhvdXJNb2RpZmllcjogRnVuY3Rpb247XHJcbiAgICBASW5wdXQoKSBzZWdtZW50TW9kaWZpZXI6IEZ1bmN0aW9uO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW4gb2JzZXJ2YWJsZSB0aGF0IHdoZW4gZW1pdHRlZCBvbiB3aWxsIHJlLXJlbmRlciB0aGUgY3VycmVudCB2aWV3XHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIHJlZnJlc2g6IFN1YmplY3Q8YW55PjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBsb2NhbGUgdXNlZCB0byBmb3JtYXQgZGF0ZXNcclxuICAgICAqL1xyXG4gICAgQElucHV0KCkgbG9jYWxlOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgcGxhY2VtZW50IG9mIHRoZSBldmVudCB0b29sdGlwXHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIHRvb2x0aXBQbGFjZW1lbnQ6IHN0cmluZyA9ICdib3R0b20nO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIHN0YXJ0IG51bWJlciBvZiB0aGUgd2Vla1xyXG4gICAgICovXHJcbiAgICBASW5wdXQoKSB3ZWVrU3RhcnRzT246IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSB0byByZXBsYWNlIHRoZSBoZWFkZXJcclxuICAgICAqL1xyXG4gICAgQElucHV0KCkgaGVhZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgdG8gcmVwbGFjZSB0aGUgZGF5IGNlbGxcclxuICAgICAqL1xyXG4gICAgQElucHV0KCkgY2VsbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQSBjdXN0b20gdGVtcGxhdGUgdG8gdXNlIGZvciB3ZWVrIHZpZXcgZXZlbnRzXHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIGV2ZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgcHJlY2lzaW9uIHRvIGRpc3BsYXkgZXZlbnRzLlxyXG4gICAgICogYGRheXNgIHdpbGwgcm91bmQgZXZlbnQgc3RhcnQgYW5kIGVuZCBkYXRlcyB0byB0aGUgbmVhcmVzdCBkYXkgYW5kIGBtaW51dGVzYCB3aWxsIG5vdCBkbyB0aGlzIHJvdW5kaW5nXHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIHByZWNpc2lvbjogJ2RheXMnIHwgJ21pbnV0ZXMnID0gJ2RheXMnO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGRheSBzdGFydCBob3VycyBpbiAyNCBob3VyIHRpbWUuIE11c3QgYmUgMC0yM1xyXG4gICAgICovXHJcbiAgICBASW5wdXQoKSBkYXlTdGFydEhvdXI6IG51bWJlciA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGF5IHN0YXJ0IG1pbnV0ZXMuIE11c3QgYmUgMC01OVxyXG4gICAgICovXHJcbiAgICBASW5wdXQoKSBkYXlTdGFydE1pbnV0ZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkYXkgZW5kIGhvdXJzIGluIDI0IGhvdXIgdGltZS4gTXVzdCBiZSAwLTIzXHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIGRheUVuZEhvdXI6IG51bWJlciA9IDIzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGRheSBlbmQgbWludXRlcy4gTXVzdCBiZSAwLTU5XHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIGRheUVuZE1pbnV0ZTogbnVtYmVyID0gNTk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsZWQgd2hlbiBhIGhlYWRlciB3ZWVrIGRheSBpcyBjbGlja2VkXHJcbiAgICAgKi9cclxuICAgIEBPdXRwdXQoKSBkYXlDbGlja2VkOiBFdmVudEVtaXR0ZXI8eyBkYXRlOiBEYXRlIH0+ID0gbmV3IEV2ZW50RW1pdHRlcjx7IGRhdGU6IERhdGUgfT4oKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBzZWdtZW50IGlzIGNsaWNrZWRcclxuICAgICAqL1xyXG4gICAgQE91dHB1dCgpIHNlZ21lbnRDbGlja2VkOiBFdmVudEVtaXR0ZXI8eyBzZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQgfT4gPSBuZXcgRXZlbnRFbWl0dGVyPHsgc2VnbWVudDogU2NoZWR1bGVyVmlld0hvdXJTZWdtZW50IH0+KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgZXZlbnQgaXMgY2xpY2tlZFxyXG4gICAgICovXHJcbiAgICBAT3V0cHV0KCkgZXZlbnRDbGlja2VkOiBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB9PiA9IG5ldyBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB9PigpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGhpZGRlblxyXG4gICAgICovXHJcbiAgICBkYXlzOiBTY2hlZHVsZXJWaWV3RGF5W107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaGlkZGVuXHJcbiAgICAgKi9cclxuICAgIGhlYWRlckRheXM6IFNjaGVkdWxlclZpZXdEYXlbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBoaWRkZW5cclxuICAgICAqL1xyXG4gICAgdmlldzogU2NoZWR1bGVyVmlldztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBoaWRkZW5cclxuICAgICAqL1xyXG4gICAgcmVmcmVzaFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGhpZGRlblxyXG4gICAgICovXHJcbiAgICBob3VyczogRGF5Vmlld0hvdXJbXSA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGhpZGRlblxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsIEBJbmplY3QoTE9DQUxFX0lEKSBsb2NhbGU6IHN0cmluZywgcHJpdmF0ZSBjb25maWc6IFNjaGVkdWxlckNvbmZpZykge1xyXG4gICAgICAgIHRoaXMubG9jYWxlID0gY29uZmlnLmxvY2FsZSB8fCBsb2NhbGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaGlkZGVuXHJcbiAgICAgKi9cclxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLnJlZnJlc2gpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoU3Vic2NyaXB0aW9uID0gdGhpcy5yZWZyZXNoLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2hBbGwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaGlkZGVuXHJcbiAgICAgKi9cclxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaG91cnMgPSB0aGlzLmdldFNjaGVkdWxlclZpZXdIb3VyR3JpZCh7XHJcbiAgICAgICAgICAgIHZpZXdEYXRlOiB0aGlzLnZpZXdEYXRlLFxyXG4gICAgICAgICAgICBob3VyU2VnbWVudHM6IHRoaXMuaG91clNlZ21lbnRzLFxyXG4gICAgICAgICAgICBkYXlTdGFydDoge1xyXG4gICAgICAgICAgICAgICAgaG91cjogdGhpcy5kYXlTdGFydEhvdXIsXHJcbiAgICAgICAgICAgICAgICBtaW51dGU6IHRoaXMuZGF5U3RhcnRNaW51dGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF5RW5kOiB7XHJcbiAgICAgICAgICAgICAgICBob3VyOiB0aGlzLmRheUVuZEhvdXIsXHJcbiAgICAgICAgICAgICAgICBtaW51dGU6IHRoaXMuZGF5RW5kTWludXRlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGNoYW5nZXMudmlld0RhdGUgfHwgY2hhbmdlcy5leGNsdWRlRGF5cykge1xyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hIZWFkZXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjaGFuZ2VzLmV2ZW50cyB8fCBjaGFuZ2VzLnZpZXdEYXRlIHx8IGNoYW5nZXMuZXhjbHVkZURheXMgfHwgY2hhbmdlcy5kYXlTdGFydEhvdXIgfHwgY2hhbmdlcy5kYXlFbmRIb3VyIHx8IGNoYW5nZXMuZGF5U3RhcnRNaW51dGUgfHwgY2hhbmdlcy5kYXlFbmRNaW51dGUpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoQm9keSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBoaWRkZW5cclxuICAgICAqL1xyXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVmcmVzaFN1YnNjcmlwdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaGlkZGVuXHJcbiAgICAgKi9cclxuICAgIHRvZ2dsZVNlZ21lbnRIaWdobGlnaHQoZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQsIGlzSGlnaGxpZ2h0ZWQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRheXMuZm9yRWFjaCgoZGF5OiBTY2hlZHVsZXJWaWV3RGF5KSA9PiB7XHJcbiAgICAgICAgICAgIGRheS5ob3Vycy5mb3JFYWNoKChob3VyOiBTY2hlZHVsZXJWaWV3SG91cikgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gaG91ci5zZWdtZW50cy5mb3JFYWNoKChzZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vICAgIGlmIChpc0hpZ2hsaWdodGVkICYmIHNlZ21lbnQuZXZlbnRzLmluZGV4T2YoZXZlbnQpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICBzZWdtZW50LmJhY2tncm91bmRDb2xvciA9IGV2ZW50LmNvbG9yLnNlY29uZGFyeTtcclxuICAgICAgICAgICAgICAgIC8vICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgZGVsZXRlIHNlZ21lbnQuYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgICAgICAgICBob3VyLnNlZ21lbnRzLmZpbHRlcigoc2VnbWVudDogU2NoZWR1bGVyVmlld0hvdXJTZWdtZW50KSA9PiBzZWdtZW50LmV2ZW50cy5zb21lKChldjogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCkgPT4gZXYuaWQgPT09IGV2ZW50LmlkICYmIGV2LnN0YXJ0LmdldERheSgpID09PSBldmVudC5zdGFydC5nZXREYXkoKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50LmV2ZW50cy5maWx0ZXIoKGV2OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50KSA9PiBldi5pZCA9PT0gZXZlbnQuaWQgJiYgZXYuc3RhcnQuZ2V0RGF5KCkgPT09IGV2ZW50LnN0YXJ0LmdldERheSgpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKGU6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNIaWdobGlnaHRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50LmJhY2tncm91bmRDb2xvciA9IGUuY29sb3Iuc2Vjb25kYXJ5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzZWdtZW50LmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVmcmVzaEhlYWRlcigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmhlYWRlckRheXMgPSB0aGlzLmdldFNjaGVkdWxlclZpZXdEYXlzKHtcclxuICAgICAgICAgICAgdmlld0RhdGU6IHRoaXMudmlld0RhdGUsXHJcbiAgICAgICAgICAgIHdlZWtTdGFydHNPbjogdGhpcy53ZWVrU3RhcnRzT24sXHJcbiAgICAgICAgICAgIHN0YXJ0c1dpdGhUb2RheTogdGhpcy5zdGFydHNXaXRoVG9kYXksXHJcbiAgICAgICAgICAgIGV4Y2x1ZGVkOiB0aGlzLmV4Y2x1ZGVEYXlzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWZyZXNoQm9keSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnZpZXcgPSB0aGlzLmdldFNjaGVkdWxlclZpZXcoe1xyXG4gICAgICAgICAgICBldmVudHM6IHRoaXMuZXZlbnRzLFxyXG4gICAgICAgICAgICB2aWV3RGF0ZTogdGhpcy52aWV3RGF0ZSxcclxuICAgICAgICAgICAgd2Vla1N0YXJ0c09uOiB0aGlzLndlZWtTdGFydHNPbixcclxuICAgICAgICAgICAgc3RhcnRzV2l0aFRvZGF5OiB0aGlzLnN0YXJ0c1dpdGhUb2RheSxcclxuICAgICAgICAgICAgZXhjbHVkZWQ6IHRoaXMuZXhjbHVkZURheXNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF5TW9kaWZpZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXlzLmZvckVhY2goZGF5ID0+IHRoaXMuZGF5TW9kaWZpZXIoZGF5KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXlNb2RpZmllciB8fCB0aGlzLmhvdXJNb2RpZmllciB8fCB0aGlzLnNlZ21lbnRNb2RpZmllcikge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXcuZGF5cy5mb3JFYWNoKGRheSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXlNb2RpZmllcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF5TW9kaWZpZXIoZGF5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRheS5ob3Vycy5mb3JFYWNoKChob3VyOiBTY2hlZHVsZXJWaWV3SG91cikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhvdXJNb2RpZmllcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdXJNb2RpZmllcihob3VyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaG91ci5zZWdtZW50cy5mb3JFYWNoKChzZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VnbWVudE1vZGlmaWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlZ21lbnRNb2RpZmllcihzZWdtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlZnJlc2hBbGwoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoSGVhZGVyKCk7XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoQm9keSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIGdldFNjaGVkdWxlclZpZXcoYXJnczogR2V0U2NoZWR1bGVyVmlld0FyZ3MpOiBTY2hlZHVsZXJWaWV3IHtcclxuICAgICAgICBsZXQgZXZlbnRzOiBDYWxlbmRhclNjaGVkdWxlckV2ZW50W10gPSBhcmdzLmV2ZW50cyB8fCBbXTtcclxuICAgICAgICBjb25zdCB2aWV3RGF0ZTogRGF0ZSA9IGFyZ3Mudmlld0RhdGU7XHJcbiAgICAgICAgY29uc3Qgd2Vla1N0YXJ0c09uOiBudW1iZXIgPSBhcmdzLndlZWtTdGFydHNPbjtcclxuICAgICAgICBjb25zdCBzdGFydHNXaXRoVG9kYXk6IGJvb2xlYW4gPSBhcmdzLnN0YXJ0c1dpdGhUb2RheTtcclxuICAgICAgICBjb25zdCBleGNsdWRlZDogbnVtYmVyW10gPSBhcmdzLmV4Y2x1ZGVkIHx8IFtdO1xyXG4gICAgICAgIGNvbnN0IHByZWNpc2lvbjogc3RyaW5nID0gYXJncy5wcmVjaXNpb24gfHwgJ2RheXMnO1xyXG5cclxuICAgICAgICBpZiAoIWV2ZW50cykge1xyXG4gICAgICAgICAgICBldmVudHMgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0YXJ0T2ZWaWV3V2VlazogRGF0ZSA9IHN0YXJ0c1dpdGhUb2RheSA/IHN0YXJ0T2ZEYXkodmlld0RhdGUpIDogc3RhcnRPZldlZWsodmlld0RhdGUsIHsgd2Vla1N0YXJ0c09uOiB3ZWVrU3RhcnRzT24gfSk7XHJcbiAgICAgICAgY29uc3QgZW5kT2ZWaWV3V2VlazogRGF0ZSA9IHN0YXJ0c1dpdGhUb2RheSA/IGFkZERheXMoZW5kT2ZEYXkodmlld0RhdGUpLCA2KSA6IGVuZE9mV2Vlayh2aWV3RGF0ZSwgeyB3ZWVrU3RhcnRzT246IHdlZWtTdGFydHNPbiB9KTtcclxuICAgICAgICAvLyBsZXQgbWF4UmFuZ2U6IG51bWJlciA9IERBWVNfSU5fV0VFSyAtIGV4Y2x1ZGVkLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBldmVudHNJbldlZWs6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRbXSA9IHRoaXMuZ2V0RXZlbnRzSW5QZXJpb2QoeyBldmVudHM6IGV2ZW50cywgcGVyaW9kU3RhcnQ6IHN0YXJ0T2ZWaWV3V2VlaywgcGVyaW9kRW5kOiBlbmRPZlZpZXdXZWVrIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmRheXMgPSB0aGlzLmdldFNjaGVkdWxlclZpZXdEYXlzKHtcclxuICAgICAgICAgICAgdmlld0RhdGU6IHZpZXdEYXRlLFxyXG4gICAgICAgICAgICB3ZWVrU3RhcnRzT246IHdlZWtTdGFydHNPbixcclxuICAgICAgICAgICAgc3RhcnRzV2l0aFRvZGF5OiBzdGFydHNXaXRoVG9kYXksXHJcbiAgICAgICAgICAgIGV4Y2x1ZGVkOiBleGNsdWRlZFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZGF5cy5mb3JFYWNoKChkYXk6IFNjaGVkdWxlclZpZXdEYXksIGRheUluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaG91cnM6IFNjaGVkdWxlclZpZXdIb3VyW10gPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5ob3Vycy5mb3JFYWNoKChob3VyOiBEYXlWaWV3SG91ciwgaG91ckluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZ21lbnRzOiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnRbXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgaG91ci5zZWdtZW50cy5mb3JFYWNoKChzZWdtZW50OiBEYXlWaWV3SG91clNlZ21lbnQsIHNlZ21lbnRJbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudC5kYXRlID0gc2V0RGF0ZShzZXRNb250aChzZXRZZWFyKHNlZ21lbnQuZGF0ZSwgZGF5LmRhdGUuZ2V0RnVsbFllYXIoKSksIGRheS5kYXRlLmdldE1vbnRoKCkpLCBkYXkuZGF0ZS5nZXREYXRlKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGFydE9mU2VnbWVudDogRGF0ZSA9IHNlZ21lbnQuZGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmRPZlNlZ21lbnQ6IERhdGUgPSBhZGRNaW51dGVzKHNlZ21lbnQuZGF0ZSwgTUlOVVRFU19JTl9IT1VSIC8gdGhpcy5ob3VyU2VnbWVudHMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBldnRzOiBDYWxlbmRhclNjaGVkdWxlckV2ZW50W10gPSB0aGlzLmdldEV2ZW50c0luUGVyaW9kKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiBldmVudHNJbldlZWssXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZFN0YXJ0OiBzdGFydE9mU2VnbWVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kRW5kOiBlbmRPZlNlZ21lbnRcclxuICAgICAgICAgICAgICAgICAgICB9KS5tYXAoKGV2ZW50OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q2FsZW5kYXJTY2hlZHVsZXJFdmVudD57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogZXZlbnQuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogZXZlbnQuc3RhcnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IGV2ZW50LmVuZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBldmVudC50aXRsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGV2ZW50LmNvbnRlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogZXZlbnQuY29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zOiBldmVudC5hY3Rpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBldmVudC5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczogZXZlbnQuY3NzQ2xhc3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydHNCZWZvcmVTZWdtZW50OiBldmVudC5zdGFydCA8IHN0YXJ0T2ZTZWdtZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kc0FmdGVyU2VnbWVudDogZXZlbnQuZW5kID4gZW5kT2ZTZWdtZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNIb3ZlcmVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGlzYWJsZWQ6IGV2ZW50LmlzRGlzYWJsZWQgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NsaWNrYWJsZTogZXZlbnQuaXNDbGlja2FibGUgIT09IHVuZGVmaW5lZCAmJiBldmVudC5pc0NsaWNrYWJsZSAhPT0gbnVsbCA/IGV2ZW50LmlzQ2xpY2thYmxlIDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50cy5wdXNoKDxTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQ+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50OiBzZWdtZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShzZWdtZW50LmRhdGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHM6IGV2dHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0JvcmRlcjogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgaG91ckRhdGU6IERhdGUgPSBuZXcgRGF0ZShkYXkuZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXkuZGF0ZS5nZXRNb250aCgpLCBkYXkuZGF0ZS5nZXREYXRlKCksIGhvdXIuc2VnbWVudHNbMF0uZGF0ZS5nZXRIb3VycygpKTtcclxuICAgICAgICAgICAgICAgIGhvdXJzLnB1c2goPFNjaGVkdWxlclZpZXdIb3VyPnsgaG91cjogaG91ciwgZGF0ZTogaG91ckRhdGUsIHNlZ21lbnRzOiBzZWdtZW50cywgaGFzQm9yZGVyOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZGF5LmhvdXJzID0gaG91cnM7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiA8U2NoZWR1bGVyVmlldz57XHJcbiAgICAgICAgICAgIGRheXM6IHRoaXMuZGF5c1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgaXNFdmVudEluUGVyaW9kKGFyZ3M6IHsgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQsIHBlcmlvZFN0YXJ0OiBzdHJpbmcgfCBudW1iZXIgfCBEYXRlLCBwZXJpb2RFbmQ6IHN0cmluZyB8IG51bWJlciB8IERhdGUgfSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50ID0gYXJncy5ldmVudCwgcGVyaW9kU3RhcnQ6IHN0cmluZyB8IG51bWJlciB8IERhdGUgPSBhcmdzLnBlcmlvZFN0YXJ0LCBwZXJpb2RFbmQ6IHN0cmluZyB8IG51bWJlciB8IERhdGUgPSBhcmdzLnBlcmlvZEVuZDtcclxuICAgICAgICBjb25zdCBldmVudFN0YXJ0OiBEYXRlID0gZXZlbnQuc3RhcnQ7XHJcbiAgICAgICAgY29uc3QgZXZlbnRFbmQ6IERhdGUgPSBldmVudC5lbmQgfHwgZXZlbnQuc3RhcnQ7XHJcblxyXG4gICAgICAgIGlmIChldmVudFN0YXJ0ID4gcGVyaW9kU3RhcnQgJiYgZXZlbnRTdGFydCA8IHBlcmlvZEVuZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGV2ZW50RW5kID4gcGVyaW9kU3RhcnQgJiYgZXZlbnRFbmQgPCBwZXJpb2RFbmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChldmVudFN0YXJ0IDwgcGVyaW9kU3RhcnQgJiYgZXZlbnRFbmQgPiBwZXJpb2RFbmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc1NhbWVTZWNvbmQoZXZlbnRTdGFydCwgcGVyaW9kU3RhcnQpIHx8IGlzU2FtZVNlY29uZChldmVudFN0YXJ0LCBzdWJTZWNvbmRzKHBlcmlvZEVuZCwgMSkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNTYW1lU2Vjb25kKHN1YlNlY29uZHMoZXZlbnRFbmQsIDEpLCBwZXJpb2RTdGFydCkgfHwgaXNTYW1lU2Vjb25kKGV2ZW50RW5kLCBwZXJpb2RFbmQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRFdmVudHNJblBlcmlvZChhcmdzOiB7IGV2ZW50czogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudFtdLCBwZXJpb2RTdGFydDogc3RyaW5nIHwgbnVtYmVyIHwgRGF0ZSwgcGVyaW9kRW5kOiBzdHJpbmcgfCBudW1iZXIgfCBEYXRlIH0pOiBDYWxlbmRhclNjaGVkdWxlckV2ZW50W10ge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50czogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudFtdID0gYXJncy5ldmVudHMsIHBlcmlvZFN0YXJ0OiBzdHJpbmcgfCBudW1iZXIgfCBEYXRlID0gYXJncy5wZXJpb2RTdGFydCwgcGVyaW9kRW5kOiBzdHJpbmcgfCBudW1iZXIgfCBEYXRlID0gYXJncy5wZXJpb2RFbmQ7XHJcbiAgICAgICAgcmV0dXJuIGV2ZW50cy5maWx0ZXIoKGV2ZW50KSA9PiB0aGlzLmlzRXZlbnRJblBlcmlvZCh7IGV2ZW50OiBldmVudCwgcGVyaW9kU3RhcnQ6IHBlcmlvZFN0YXJ0LCBwZXJpb2RFbmQ6IHBlcmlvZEVuZCB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTY2hlZHVsZXJWaWV3RGF5cyhhcmdzOiBHZXRTY2hlZHVsZXJWaWV3QXJncyk6IFNjaGVkdWxlclZpZXdEYXlbXSB7XHJcbiAgICAgICAgY29uc3Qgdmlld0RhdGU6IERhdGUgPSBhcmdzLnZpZXdEYXRlO1xyXG4gICAgICAgIGNvbnN0IHdlZWtTdGFydHNPbjogbnVtYmVyID0gYXJncy53ZWVrU3RhcnRzT247XHJcbiAgICAgICAgY29uc3Qgc3RhcnRzV2l0aFRvZGF5OiBib29sZWFuID0gYXJncy5zdGFydHNXaXRoVG9kYXk7XHJcbiAgICAgICAgY29uc3QgZXhjbHVkZWQ6IG51bWJlcltdID0gYXJncy5leGNsdWRlZCB8fCBbXTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBzdGFydHNXaXRoVG9kYXkgPyBuZXcgRGF0ZSh2aWV3RGF0ZSkgOiBzdGFydE9mV2Vlayh2aWV3RGF0ZSwgeyB3ZWVrU3RhcnRzT246IHdlZWtTdGFydHNPbiB9KTtcclxuICAgICAgICBjb25zdCBkYXlzOiBTY2hlZHVsZXJWaWV3RGF5W10gPSBbXTtcclxuICAgICAgICBjb25zdCBsb29wID0gKGk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlID0gYWRkRGF5cyhzdGFydCwgaSk7XHJcbiAgICAgICAgICAgIGlmICghZXhjbHVkZWQuc29tZSgoZTogbnVtYmVyKSA9PiBkYXRlLmdldERheSgpID09PSBlKSkge1xyXG4gICAgICAgICAgICAgICAgZGF5cy5wdXNoKHRoaXMuZ2V0U2NoZWR1bGVyRGF5KHsgZGF0ZTogZGF0ZSB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgREFZU19JTl9XRUVLOyBpKyspIHtcclxuICAgICAgICAgICAgbG9vcChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRheXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTY2hlZHVsZXJEYXkoYXJnczogeyBkYXRlOiBEYXRlIH0pOiBTY2hlZHVsZXJWaWV3RGF5IHtcclxuICAgICAgICBjb25zdCBkYXRlOiBEYXRlID0gYXJncy5kYXRlO1xyXG4gICAgICAgIGNvbnN0IHRvZGF5OiBEYXRlID0gc3RhcnRPZkRheShuZXcgRGF0ZSgpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIDxTY2hlZHVsZXJWaWV3RGF5PntcclxuICAgICAgICAgICAgZGF0ZTogZGF0ZSxcclxuICAgICAgICAgICAgaXNQYXN0OiBkYXRlIDwgdG9kYXksXHJcbiAgICAgICAgICAgIGlzVG9kYXk6IGlzU2FtZURheShkYXRlLCB0b2RheSksXHJcbiAgICAgICAgICAgIGlzRnV0dXJlOiBkYXRlID4gdG9kYXksXHJcbiAgICAgICAgICAgIGlzV2Vla2VuZDogV0VFS0VORF9EQVlfTlVNQkVSUy5pbmRleE9mKGdldERheShkYXRlKSkgPiAtMSxcclxuICAgICAgICAgICAgaG91cnM6IFtdXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFNjaGVkdWxlclZpZXdIb3VyR3JpZChhcmdzOiBHZXRTY2hlZHVsZXJWaWV3SG91ckdyaWRBcmdzKTogRGF5Vmlld0hvdXJbXSB7XHJcbiAgICAgICAgY29uc3Qgdmlld0RhdGU6IERhdGUgPSBhcmdzLnZpZXdEYXRlLCBob3VyU2VnbWVudHM6IG51bWJlciA9IGFyZ3MuaG91clNlZ21lbnRzLCBkYXlTdGFydDogYW55ID0gYXJncy5kYXlTdGFydCwgZGF5RW5kOiBhbnkgPSBhcmdzLmRheUVuZDtcclxuICAgICAgICBjb25zdCBob3VyczogRGF5Vmlld0hvdXJbXSA9IFtdO1xyXG5cclxuICAgICAgICBjb25zdCBzdGFydE9mVmlldzogRGF0ZSA9IHNldE1pbnV0ZXMoc2V0SG91cnMoc3RhcnRPZkRheSh2aWV3RGF0ZSksIGRheVN0YXJ0LmhvdXIpLCBkYXlTdGFydC5taW51dGUpO1xyXG4gICAgICAgIGNvbnN0IGVuZE9mVmlldzogRGF0ZSA9IHNldE1pbnV0ZXMoc2V0SG91cnMoc3RhcnRPZk1pbnV0ZShlbmRPZkRheSh2aWV3RGF0ZSkpLCBkYXlFbmQuaG91ciksIGRheUVuZC5taW51dGUpO1xyXG4gICAgICAgIGNvbnN0IHNlZ21lbnREdXJhdGlvbjogbnVtYmVyID0gTUlOVVRFU19JTl9IT1VSIC8gaG91clNlZ21lbnRzO1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0T2ZWaWV3RGF5OiBEYXRlID0gc3RhcnRPZkRheSh2aWV3RGF0ZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJhbmdlID0gKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyKTogbnVtYmVyW10gPT4gQXJyYXkuZnJvbSh7IGxlbmd0aDogKChlbmQgKyAxKSAtIHN0YXJ0KSB9LCAodiwgaykgPT4gayArIHN0YXJ0KTtcclxuICAgICAgICBjb25zdCBob3Vyc0luVmlldzogbnVtYmVyW10gPSByYW5nZShkYXlTdGFydC5ob3VyLCBkYXlFbmQuaG91cik7XHJcblxyXG4gICAgICAgIC8vIGZvciAodmFyIGkgPSAwOyBpIDwgSE9VUlNfSU5fREFZOyBpKyspIHtcclxuICAgICAgICBob3Vyc0luVmlldy5mb3JFYWNoKChob3VyOiBudW1iZXIsIGk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzZWdtZW50cyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGhvdXJTZWdtZW50czsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRlID0gYWRkTWludXRlcyhhZGRIb3VycyhzdGFydE9mVmlld0RheSwgaG91ciksIGogKiBzZWdtZW50RHVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGUgPj0gc3RhcnRPZlZpZXcgJiYgZGF0ZSA8IGVuZE9mVmlldykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBkYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1N0YXJ0OiBqID09PSAwXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGhvdXJzLnB1c2goPERheVZpZXdIb3VyPnsgc2VnbWVudHM6IHNlZ21lbnRzIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGhvdXJzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEdldFNjaGVkdWxlclZpZXdBcmdzIHtcclxuICAgIGV2ZW50cz86IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRbXTtcclxuICAgIHZpZXdEYXRlOiBEYXRlO1xyXG4gICAgd2Vla1N0YXJ0c09uOiBudW1iZXI7XHJcbiAgICBzdGFydHNXaXRoVG9kYXk6IGJvb2xlYW47XHJcbiAgICBleGNsdWRlZD86IG51bWJlcltdO1xyXG4gICAgcHJlY2lzaW9uPzogJ21pbnV0ZXMnIHwgJ2RheXMnO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEdldFNjaGVkdWxlclZpZXdIb3VyR3JpZEFyZ3Mge1xyXG4gICAgdmlld0RhdGU6IERhdGU7XHJcbiAgICBob3VyU2VnbWVudHM6IG51bWJlcjtcclxuICAgIGRheVN0YXJ0OiBhbnk7XHJcbiAgICBkYXlFbmQ6IGFueTtcclxufVxyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBUZW1wbGF0ZVJlZiwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICAgIFNjaGVkdWxlclZpZXdEYXksXHJcbiAgICBTY2hlZHVsZXJWaWV3SG91cixcclxuICAgIFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRcclxufSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci12aWV3LmNvbXBvbmVudCc7XHJcblxyXG4vLyBXT1JLQVJPVU5EOiBodHRwczovL2dpdGh1Yi5jb20vZGhlcmdlcy9uZy1wYWNrYWdyL2lzc3Vlcy8yMTcjaXNzdWVjb21tZW50LTMzOTQ2MDI1NVxyXG5pbXBvcnQgKiBhcyBtb21lbnRJbXBvcnRlZCBmcm9tICdtb21lbnQnO1xyXG5jb25zdCBtb21lbnQgPSBtb21lbnRJbXBvcnRlZDtcclxuXHJcbkBDb21wb25lbnQoeyAvLyBbY2xhc3Mubm8tYm9yZGVyXSc6ICchZGF5Lmhhc0JvcmRlclxyXG4gICAgc2VsZWN0b3I6ICdjYWxlbmRhci1zY2hlZHVsZXItY2VsbCcsXHJcbiAgICB0ZW1wbGF0ZTogYFxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdFRlbXBsYXRlPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXNjaGVkdWxlci1zZWdtZW50c1wiICpuZ0lmPVwiaG91ci5zZWdtZW50cy5sZW5ndGggPiAwXCJcclxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cImhvdXI/LmNzc0NsYXNzXCJcclxuICAgICAgICAgICAgICAgIFtjbGFzcy5uby1ib3JkZXJdPVwiIWhvdXIuaGFzQm9yZGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXNjaGVkdWxlci1zZWdtZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgc2VnbWVudCBvZiBob3VyLnNlZ21lbnRzOyBsZXQgc2kgPSBpbmRleFwiXHJcbiAgICAgICAgICAgICAgICAgICAgW3RpdGxlXT1cInRpdGxlXCJcclxuICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJzZWdtZW50Py5jc3NDbGFzc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgW2NsYXNzLmhhcy1ldmVudHNdPVwic2VnbWVudC5ldmVudHMubGVuZ3RoID4gMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgW2NsYXNzLmNhbC1kaXNhYmxlZF09XCJzZWdtZW50LmlzRGlzYWJsZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIFtzdHlsZS5iYWNrZ3JvdW5kQ29sb3JdPVwic2VnbWVudC5iYWNrZ3JvdW5kQ29sb3JcIlxyXG4gICAgICAgICAgICAgICAgICAgIFtjbGFzcy5uby1ib3JkZXJdPVwiIXNlZ21lbnQuaGFzQm9yZGVyXCJcclxuICAgICAgICAgICAgICAgICAgICAobXdsQ2xpY2spPVwib25TZWdtZW50Q2xpY2soJGV2ZW50LCBzZWdtZW50KVwiPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXNjaGVkdWxlci1ldmVudHNcIiAqbmdJZj1cInNlZ21lbnQuZXZlbnRzLmxlbmd0aCA+IDBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGNhbGVuZGFyLXNjaGVkdWxlci1ldmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IGV2ZW50IG9mIHNlZ21lbnQuZXZlbnRzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkYXldPVwiZGF5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtob3VyXT1cImhvdXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3NlZ21lbnRdPVwic2VnbWVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZXZlbnRdPVwiZXZlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG1vdXNlZW50ZXIpPVwib25Nb3VzZUVudGVyKCRldmVudCwgc2VnbWVudCwgZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtb3VzZWxlYXZlKT1cIm9uTW91c2VMZWF2ZSgkZXZlbnQsIHNlZ21lbnQsIGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdG9vbHRpcFBsYWNlbWVudF09XCJ0b29sdGlwUGxhY2VtZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzaG93QWN0aW9uc109XCJzaG93QWN0aW9uc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiZXZlbnRUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZXZlbnRDbGlja2VkKT1cIm9uRXZlbnRDbGljaygkZXZlbnQsIGV2ZW50KVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZVxyXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxyXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie1xyXG4gICAgICAgICAgICAgICAgZGF5OiBkYXksXHJcbiAgICAgICAgICAgICAgICBob3VyOiBob3VyLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxlOiBsb2NhbGUsXHJcbiAgICAgICAgICAgICAgICB0b29sdGlwUGxhY2VtZW50OiB0b29sdGlwUGxhY2VtZW50LFxyXG4gICAgICAgICAgICAgICAgc2hvd0FjdGlvbnM6IHNob3dBY3Rpb25zLFxyXG4gICAgICAgICAgICAgICAgZXZlbnRUZW1wbGF0ZTogZXZlbnRUZW1wbGF0ZSxcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodFNlZ21lbnQ6IGhpZ2hsaWdodFNlZ21lbnQsXHJcbiAgICAgICAgICAgICAgICB1bmhpZ2hsaWdodFNlZ21lbnQ6IHVuaGlnaGxpZ2h0U2VnbWVudCxcclxuICAgICAgICAgICAgICAgIHNlZ21lbnRDbGlja2VkOiBzZWdtZW50Q2xpY2tlZCxcclxuICAgICAgICAgICAgICAgIGV2ZW50Q2xpY2tlZDogZXZlbnRDbGlja2VkXHJcbiAgICAgICAgICAgIH1cIj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgYCxcclxuICAgIGhvc3Q6IHtcclxuICAgICAgICAnY2xhc3MnOiAnY2FsLXNjaGVkdWxlci1jZWxsJyxcclxuICAgICAgICAnW2NsYXNzLmNhbC1wYXN0XSc6ICdkYXkuaXNQYXN0JyxcclxuICAgICAgICAnW2NsYXNzLmNhbC10b2RheV0nOiAnZGF5LmlzVG9kYXknLFxyXG4gICAgICAgICdbY2xhc3MuY2FsLWZ1dHVyZV0nOiAnZGF5LmlzRnV0dXJlJyxcclxuICAgICAgICAnW2NsYXNzLmNhbC13ZWVrZW5kXSc6ICdkYXkuaXNXZWVrZW5kJyxcclxuICAgICAgICAnW2NsYXNzLmNhbC1pbi1tb250aF0nOiAnZGF5LmluTW9udGgnLFxyXG4gICAgICAgICdbY2xhc3MuY2FsLW91dC1tb250aF0nOiAnIWRheS5pbk1vbnRoJyxcclxuICAgICAgICAnW3N0eWxlLmJhY2tncm91bmRDb2xvcl0nOiAnZGF5LmJhY2tncm91bmRDb2xvcidcclxuICAgIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIENhbGVuZGFyU2NoZWR1bGVyQ2VsbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gICAgQElucHV0KCkgdGl0bGU6IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoKSBkYXk6IFNjaGVkdWxlclZpZXdEYXk7XHJcblxyXG4gICAgQElucHV0KCkgaG91cjogU2NoZWR1bGVyVmlld0hvdXI7XHJcblxyXG4gICAgQElucHV0KCkgbG9jYWxlOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KCkgdG9vbHRpcFBsYWNlbWVudDogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dCgpIHNob3dBY3Rpb25zOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICBASW5wdXQoKSBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgICBASW5wdXQoKSBldmVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICAgIEBPdXRwdXQoKSBoaWdobGlnaHRTZWdtZW50OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBAT3V0cHV0KCkgdW5oaWdobGlnaHRTZWdtZW50OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBAT3V0cHV0KCkgc2VnbWVudENsaWNrZWQ6IEV2ZW50RW1pdHRlcjx7IHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCB9PiA9IG5ldyBFdmVudEVtaXR0ZXI8eyBzZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQgfT4oKTtcclxuXHJcbiAgICBAT3V0cHV0KCkgZXZlbnRDbGlja2VkOiBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB9PiA9IG5ldyBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB9PigpO1xyXG5cclxuXHJcbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnRpdGxlID0gbW9tZW50KHRoaXMuZGF5LmRhdGUpLmZvcm1hdCgnZGRkZCBMJyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZUVudGVyKG1vdXNlRXZlbnQ6IE1vdXNlRXZlbnQsIHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCwgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIWV2ZW50LmlzRGlzYWJsZWQgJiYgIXNlZ21lbnQuaXNEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodFNlZ21lbnQuZW1pdCh7IGV2ZW50OiBldmVudCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZUxlYXZlKG1vdXNlRXZlbnQ6IE1vdXNlRXZlbnQsIHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCwgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIWV2ZW50LmlzRGlzYWJsZWQgJiYgIXNlZ21lbnQuaXNEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnVuaGlnaGxpZ2h0U2VnbWVudC5lbWl0KHsgZXZlbnQ6IGV2ZW50IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBoaWRkZW5cclxuICAgICAqL1xyXG4gICAgb25TZWdtZW50Q2xpY2sobW91c2VFdmVudDogTW91c2VFdmVudCwgc2VnbWVudDogU2NoZWR1bGVyVmlld0hvdXJTZWdtZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKG1vdXNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKSB7XHJcbiAgICAgICAgICAgIG1vdXNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VnbWVudC5ldmVudHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudENsaWNrZWQuZW1pdCh7IHNlZ21lbnQ6IHNlZ21lbnQgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGhpZGRlblxyXG4gICAgICovXHJcbiAgICBvbkV2ZW50Q2xpY2sobW91c2VFdmVudDogTW91c2VFdmVudCwgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAobW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24pIHtcclxuICAgICAgICAgICAgbW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGV2ZW50LmlzQ2xpY2thYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRDbGlja2VkLmVtaXQoeyBldmVudDogZXZlbnQgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTY2hlZHVsZXJWaWV3RGF5IH0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItdmlldy5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2NhbGVuZGFyLXNjaGVkdWxlci1oZWFkZXInLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgICAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHRUZW1wbGF0ZT5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhbC1zY2hlZHVsZXItaGVhZGVyc1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhbC1oZWFkZXIgYXNpZGUgY2FsLWhlYWRlci1jbG9jayBhbGlnbi1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zIG1kLTMyXCIgc3R5bGU9XCJtYXJnaW46YXV0bztcIj5zY2hlZHVsZTwvaT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtaGVhZGVyLWNvbHMgYXNpZGVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiY2FsLWhlYWRlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICpuZ0Zvcj1cImxldCBkYXkgb2YgZGF5c1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjbGFzcy5jYWwtcGFzdF09XCJkYXkuaXNQYXN0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgW2NsYXNzLmNhbC10b2RheV09XCJkYXkuaXNUb2RheVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjbGFzcy5jYWwtZnV0dXJlXT1cImRheS5pc0Z1dHVyZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjbGFzcy5jYWwtd2Vla2VuZF09XCJkYXkuaXNXZWVrZW5kXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgW2NsYXNzLmNhbC1kcmFnLW92ZXJdPVwiZGF5LmRyYWdPdmVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgKG13bENsaWNrKT1cImRheUNsaWNrZWQuZW1pdCh7ZGF0ZTogZGF5LmRhdGV9KVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Yj57eyBkYXkuZGF0ZSB8IGNhbGVuZGFyRGF0ZTond2Vla1ZpZXdDb2x1bW5IZWFkZXInOmxvY2FsZSB9fTwvYj48YnI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPnt7IGRheS5kYXRlIHwgY2FsZW5kYXJEYXRlOid3ZWVrVmlld0NvbHVtblN1YkhlYWRlcic6bG9jYWxlIH19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlXHJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImN1c3RvbVRlbXBsYXRlIHx8IGRlZmF1bHRUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ZGF5czogZGF5cywgbG9jYWxlOiBsb2NhbGUsIGRheUNsaWNrZWQ6IGRheUNsaWNrZWR9XCI+XHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgIGBcclxufSlcclxuZXhwb3J0IGNsYXNzIENhbGVuZGFyU2NoZWR1bGVySGVhZGVyQ29tcG9uZW50IHtcclxuXHJcbiAgICBASW5wdXQoKSBkYXlzOiBTY2hlZHVsZXJWaWV3RGF5W107XHJcblxyXG4gICAgQElucHV0KCkgbG9jYWxlOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KCkgY3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gICAgQE91dHB1dCgpIGRheUNsaWNrZWQ6IEV2ZW50RW1pdHRlcjx7IGRhdGU6IERhdGUgfT4gPSBuZXcgRXZlbnRFbWl0dGVyPHsgZGF0ZTogRGF0ZSB9PigpO1xyXG59XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBUZW1wbGF0ZVJlZiwgT25Jbml0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICAgIFNjaGVkdWxlclZpZXdEYXksXHJcbiAgICBTY2hlZHVsZXJWaWV3SG91cixcclxuICAgIFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRcclxufSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci12aWV3LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7XHJcbiAgICBpc1NhbWVEYXlcclxufSBmcm9tICdkYXRlLWZucyc7XHJcblxyXG4vLyBXT1JLQVJPVU5EOiBodHRwczovL2dpdGh1Yi5jb20vZGhlcmdlcy9uZy1wYWNrYWdyL2lzc3Vlcy8yMTcjaXNzdWVjb21tZW50LTMzOTQ2MDI1NVxyXG5pbXBvcnQgKiBhcyBtb21lbnRJbXBvcnRlZCBmcm9tICdtb21lbnQnO1xyXG5jb25zdCBtb21lbnQgPSBtb21lbnRJbXBvcnRlZDtcclxuXHJcbi8qKlxyXG4gKiBbbXdsQ2FsZW5kYXJUb29sdGlwXT1cImV2ZW50LnRpdGxlIHwgY2FsZW5kYXJFdmVudFRpdGxlOid3ZWVrVG9vbHRpcCc6ZXZlbnRcIlxyXG4gKiBbdG9vbHRpcFBsYWNlbWVudF09XCJ0b29sdGlwUGxhY2VtZW50XCJcclxuICovXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdjYWxlbmRhci1zY2hlZHVsZXItZXZlbnQnLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgICAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHRUZW1wbGF0ZT5cclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLWV2ZW50XCJcclxuICAgICAgICAgICAgICAgIFt0aXRsZV09XCJ0aXRsZVwiXHJcbiAgICAgICAgICAgICAgICBbY2xhc3MuY2FsLXN0YXJ0cy13aXRoaW4tc2VnbWVudF09XCIhZXZlbnQuc3RhcnRzQmVmb3JlU2VnbWVudFwiXHJcbiAgICAgICAgICAgICAgICBbY2xhc3MuY2FsLWVuZHMtd2l0aGluLXNlZ21lbnRdPVwiIWV2ZW50LmVuZHNBZnRlclNlZ21lbnRcIlxyXG4gICAgICAgICAgICAgICAgW2NsYXNzLmhvdmVyZWRdPVwiZXZlbnQuaXNIb3ZlcmVkXCJcclxuICAgICAgICAgICAgICAgIFtjbGFzcy5jYWwtZGlzYWJsZWRdPVwiZXZlbnQuaXNEaXNhYmxlZCB8fCBzZWdtZW50LmlzRGlzYWJsZWRcIlxyXG4gICAgICAgICAgICAgICAgW2NsYXNzLmNhbC1ub3QtY2xpY2thYmxlXT1cIiFldmVudC5pc0NsaWNrYWJsZVwiXHJcbiAgICAgICAgICAgICAgICBbc3R5bGUuYmFja2dyb3VuZENvbG9yXT1cImV2ZW50LmNvbG9yLnByaW1hcnlcIlxyXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwiZXZlbnQ/LmNzc0NsYXNzXCJcclxuICAgICAgICAgICAgICAgIChtd2xDbGljayk9XCJldmVudENsaWNrZWQuZW1pdCh7ZXZlbnQ6IGV2ZW50fSlcIlxyXG4gICAgICAgICAgICAgICAgKG1vdXNlZW50ZXIpPVwiaGlnaGxpZ2h0RXZlbnQoKVwiXHJcbiAgICAgICAgICAgICAgICAobW91c2VsZWF2ZSk9XCJ1bmhpZ2hsaWdodEV2ZW50KClcIj5cclxuICAgICAgICAgICAgICAgIDxjYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtdGl0bGUgKm5nSWY9XCIhZXZlbnQuc3RhcnRzQmVmb3JlU2VnbWVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgW2V2ZW50XT1cImV2ZW50XCJcclxuICAgICAgICAgICAgICAgICAgICB2aWV3PVwid2Vla1wiPlxyXG4gICAgICAgICAgICAgICAgPC9jYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtdGl0bGU+XHJcbiAgICAgICAgICAgICAgICA8Y2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LWNvbnRlbnQgKm5nSWY9XCIhZXZlbnQuc3RhcnRzQmVmb3JlU2VnbWVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgW2V2ZW50XT1cImV2ZW50XCI+XHJcbiAgICAgICAgICAgICAgICA8L2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1jb250ZW50PlxyXG4gICAgICAgICAgICAgICAgPGNhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zIFtldmVudF09XCJldmVudFwiICpuZ0lmPVwic2hvd0FjdGlvbnMgJiYgZXZlbnQuaXNDbGlja2FibGUgJiYgIWV2ZW50LmVuZHNBZnRlclNlZ21lbnRcIj48L2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zPlxyXG4gICAgICAgICAgICAgICAgPGNhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zIFtldmVudF09XCJldmVudFwiICpuZ0lmPVwic2hvd0FjdGlvbnMgJiYgZXZlbnQuaXNEaXNhYmxlZCAmJiAhZXZlbnQuZW5kc0FmdGVyU2VnbWVudFwiPjwvY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LWFjdGlvbnM+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlXHJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImN1c3RvbVRlbXBsYXRlIHx8IGRlZmF1bHRUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7XHJcbiAgICAgICAgICAgICAgICBkYXk6IGRheSxcclxuICAgICAgICAgICAgICAgIGhvdXI6IGhvdXIsXHJcbiAgICAgICAgICAgICAgICBzZWdtZW50OiBzZWdtZW50LFxyXG4gICAgICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LFxyXG4gICAgICAgICAgICAgICAgdG9vbHRpcFBsYWNlbWVudDogdG9vbHRpcFBsYWNlbWVudCxcclxuICAgICAgICAgICAgICAgIHNob3dBY3Rpb25zOiBzaG93QWN0aW9ucyxcclxuICAgICAgICAgICAgICAgIGN1c3RvbVRlbXBsYXRlOiBjdXN0b21UZW1wbGF0ZSxcclxuICAgICAgICAgICAgICAgIGV2ZW50Q2xpY2tlZDogZXZlbnRDbGlja2VkXHJcbiAgICAgICAgICAgIH1cIj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgYCxcclxuICAgIGhvc3Q6IHtcclxuICAgICAgICAnY2xhc3MnOiAnY2FsLXNjaGVkdWxlci1ldmVudC1jb250YWluZXInXHJcbiAgICB9XHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDYWxlbmRhclNjaGVkdWxlckV2ZW50Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgICBASW5wdXQoKSB0aXRsZTogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dCgpIGRheTogU2NoZWR1bGVyVmlld0RheTtcclxuXHJcbiAgICBASW5wdXQoKSBob3VyOiBTY2hlZHVsZXJWaWV3SG91cjtcclxuXHJcbiAgICBASW5wdXQoKSBzZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQ7XHJcblxyXG4gICAgQElucHV0KCkgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQ7XHJcblxyXG4gICAgQElucHV0KCkgdG9vbHRpcFBsYWNlbWVudDogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dCgpIHNob3dBY3Rpb25zOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICBASW5wdXQoKSBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgICBAT3V0cHV0KCkgZXZlbnRDbGlja2VkOiBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB9PiA9IG5ldyBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB9PigpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikgeyAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zZWdtZW50Lmhhc0JvcmRlciA9IHRoaXMuaG91ci5oYXNCb3JkZXIgPSAhdGhpcy5ldmVudC5lbmRzQWZ0ZXJTZWdtZW50O1xyXG5cclxuICAgICAgICB0aGlzLnRpdGxlID0gbW9tZW50KHRoaXMuZXZlbnQuc3RhcnQpLmZvcm1hdCgnZGRkZCBMJyk7XHJcblxyXG4gICAgICAgIHRoaXMuY2hlY2tFbmFibGVTdGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hlY2tFbmFibGVTdGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5zZWdtZW50LmlzRGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXkuaG91cnMuZm9yRWFjaCgoaG91cjogU2NoZWR1bGVyVmlld0hvdXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGhvdXIuc2VnbWVudHMuZm9yRWFjaCgoc2VnbWVudDogU2NoZWR1bGVyVmlld0hvdXJTZWdtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudC5ldmVudHMuZmlsdGVyKChldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCkgPT4gZXZlbnQuaWQgPT09IHRoaXMuZXZlbnQuaWQgJiYgaXNTYW1lRGF5KGV2ZW50LnN0YXJ0LCB0aGlzLmV2ZW50LnN0YXJ0KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKGV2ZW50OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5pc0Rpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhpZ2hsaWdodEV2ZW50KCk6IHZvaWQge1xyXG4gICAgICAgIC8vIGxldCBldmVudHM6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRbXSA9IHRoaXMuZGF5LmhvdXJzXHJcbiAgICAgICAgLy8gICAgLmZpbHRlcihoID0+IGguc2VnbWVudHMuc29tZShzID0+IHMuZXZlbnRzLnNvbWUoZSA9PiBlLmlkID09PSB0aGlzLmV2ZW50LmlkKSkpXHJcbiAgICAgICAgLy8gICAgLm1hcChoID0+XHJcbiAgICAgICAgLy8gICAgICAgIGguc2VnbWVudHMubWFwKHMgPT5cclxuICAgICAgICAvLyAgICAgICAgICAgIHMuZXZlbnRzLmZpbHRlcihlID0+IGUuaWQgPT09IHRoaXMuZXZlbnQuaWQpXHJcbiAgICAgICAgLy8gICAgICAgICkucmVkdWNlKChwcmV2LCBjdXJyKSA9PiBwcmV2LmNvbmNhdChjdXJyKSlcclxuICAgICAgICAvLyAgICApXHJcbiAgICAgICAgLy8gICAgLnJlZHVjZSgocHJldiwgY3VycikgPT4gcHJldi5jb25jYXQoY3VycikpO1xyXG5cclxuICAgICAgICB0aGlzLmRheS5ob3Vycy5mb3JFYWNoKChob3VyOiBTY2hlZHVsZXJWaWV3SG91cikgPT4ge1xyXG4gICAgICAgICAgICBob3VyLnNlZ21lbnRzLmZvckVhY2goKHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudC5ldmVudHMuZmlsdGVyKChldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCkgPT4gZXZlbnQuaWQgPT09IHRoaXMuZXZlbnQuaWQgJiYgaXNTYW1lRGF5KGV2ZW50LnN0YXJ0LCB0aGlzLmV2ZW50LnN0YXJ0KSlcclxuICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaCgoZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuaXNIb3ZlcmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdW5oaWdobGlnaHRFdmVudCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRheS5ob3Vycy5mb3JFYWNoKChob3VyOiBTY2hlZHVsZXJWaWV3SG91cikgPT4ge1xyXG4gICAgICAgICAgICBob3VyLnNlZ21lbnRzLmZvckVhY2goKHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudC5ldmVudHMuZmlsdGVyKChldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCkgPT4gZXZlbnQuaWQgPT09IHRoaXMuZXZlbnQuaWQgJiYgaXNTYW1lRGF5KGV2ZW50LnN0YXJ0LCB0aGlzLmV2ZW50LnN0YXJ0KSlcclxuICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaCgoZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuaXNIb3ZlcmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgc2FtZUV2ZW50SW5QcmV2aW91c0hvdXIoZGF5OiBTY2hlZHVsZXJWaWV3RGF5LCBob3VyOiBTY2hlZHVsZXJWaWV3SG91cik6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQge1xyXG4gICAgLy8gICAgbGV0IGhvdXJJbmRleDogbnVtYmVyID0gZGF5LmhvdXJzLmluZGV4T2YoaG91cik7XHJcbiAgICAvLyAgICBsZXQgcHJldmlvdXNIb3VyID0gZGF5LmhvdXJzW2hvdXJJbmRleCAtIDFdO1xyXG4gICAgLy8gICAgaWYgKHByZXZpb3VzSG91cikge1xyXG4gICAgLy8gICAgICAgIGxldCBwcmV2aW91c1NlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCA9IHByZXZpb3VzSG91ci5zZWdtZW50c1twcmV2aW91c0hvdXIuc2VnbWVudHMubGVuZ3RoIC0gMV07XHJcbiAgICAvLyAgICAgICAgcmV0dXJuIHByZXZpb3VzU2VnbWVudC5ldmVudHNbcHJldmlvdXNTZWdtZW50LmV2ZW50cy5sZW5ndGggLSAxXTtcclxuICAgIC8vICAgIH1cclxuICAgIC8vICAgIHJldHVybiBudWxsO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHByaXZhdGUgc2FtZUV2ZW50SW5QcmV2aW91c1NlZ21lbnQoc2VnbWVudEluZGV4OiBudW1iZXIpOiBDYWxlbmRhclNjaGVkdWxlckV2ZW50IHtcclxuICAgIC8vICAgIGxldCBwcmV2aW91c1NlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCA9IHRoaXMuaG91ci5zZWdtZW50c1tzZWdtZW50SW5kZXggLSAxXTtcclxuICAgIC8vICAgIGlmIChwcmV2aW91c1NlZ21lbnQpIHtcclxuICAgIC8vICAgICAgICByZXR1cm4gcHJldmlvdXNTZWdtZW50LmV2ZW50c1twcmV2aW91c1NlZ21lbnQuZXZlbnRzLmxlbmd0aCAtIDFdO1xyXG4gICAgLy8gICAgfVxyXG4gICAgLy8gICAgcmV0dXJuIG51bGw7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBzYW1lRXZlbnRJbk5leHRIb3VyKCk6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQge1xyXG4gICAgLy8gICAgbGV0IGhvdXJJbmRleDogbnVtYmVyID0gdGhpcy5kYXkuaG91cnMuaW5kZXhPZih0aGlzLmhvdXIpO1xyXG4gICAgLy8gICAgbGV0IG5leHRIb3VyOiBTY2hlZHVsZXJWaWV3SG91ciA9IHRoaXMuZGF5LmhvdXJzW2hvdXJJbmRleCArIDFdO1xyXG4gICAgLy8gICAgaWYgKG5leHRIb3VyKSB7XHJcbiAgICAvLyAgICAgICAgbGV0IG5leHRTZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQgPSBuZXh0SG91ci5zZWdtZW50c1swXTtcclxuICAgIC8vICAgICAgICByZXR1cm4gbmV4dFNlZ21lbnQuZXZlbnRzWzBdO1xyXG4gICAgLy8gICAgfVxyXG4gICAgLy8gICAgcmV0dXJuIG51bGw7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBzYW1lRXZlbnRJbk5leHRTZWdtZW50KHNlZ21lbnRJbmRleDogbnVtYmVyKTogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB7XHJcbiAgICAvLyAgICBsZXQgbmV4dFNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCA9IHRoaXMuaG91ci5zZWdtZW50c1tzZWdtZW50SW5kZXggKyAxXTtcclxuICAgIC8vICAgIGlmIChuZXh0U2VnbWVudCkge1xyXG4gICAgLy8gICAgICAgIHJldHVybiBuZXh0U2VnbWVudC5ldmVudHNbMF07XHJcbiAgICAvLyAgICB9XHJcbiAgICAvLyAgICByZXR1cm4gbnVsbDtcclxuICAgIC8vIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgICBDYWxlbmRhclNjaGVkdWxlckV2ZW50XHJcbn0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItdmlldy5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC10aXRsZScsXHJcbiAgICB0ZW1wbGF0ZTogYFxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgICAgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLWV2ZW50LXRpdGxlXCJcclxuICAgICAgICAgICAgW2lubmVySFRNTF09XCJldmVudC50aXRsZSB8IHNjaGVkdWxlckV2ZW50VGl0bGU6dmlldzpldmVudFwiPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgKm5nSWY9XCJldmVudC5zdGF0dXNcIlxyXG4gICAgICAgICAgICBjbGFzcz1cImNhbC1zY2hlZHVsZXItZXZlbnQtc3RhdHVzXCJcclxuICAgICAgICAgICAgW2NsYXNzLm9rXT1cImV2ZW50LnN0YXR1cyA9PT0gJ29rJ1wiXHJcbiAgICAgICAgICAgIFtjbGFzcy53YXJuaW5nXT1cImV2ZW50LnN0YXR1cyA9PT0gJ3dhcm5pbmcnXCJcclxuICAgICAgICAgICAgW2NsYXNzLmRhbmdlcl09XCJldmVudC5zdGF0dXMgPT09ICdkYW5nZXInXCI+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICBgLFxyXG4gICAgaG9zdDoge1xyXG4gICAgICAgICdjbGFzcyc6ICdjYWwtc2NoZWR1bGVyLWV2ZW50LXRpdGxlLWNvbnRhaW5lcidcclxuICAgIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRUaXRsZUNvbXBvbmVudCB7XHJcblxyXG4gICAgQElucHV0KCkgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQ7XHJcblxyXG4gICAgQElucHV0KCkgdmlldzogc3RyaW5nO1xyXG59XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRcclxufSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci12aWV3LmNvbXBvbmVudCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LWNvbnRlbnQnLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgICAgICA8ZGl2ICpuZ0lmPVwiZXZlbnQuY29udGVudFwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiY2FsLXNjaGVkdWxlci1ldmVudC1jb250ZW50XCJcclxuICAgICAgICAgICAgW2lubmVySFRNTF09XCJldmVudC5jb250ZW50XCI+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICBgLFxyXG4gICAgaG9zdDoge1xyXG4gICAgICAgICdjbGFzcyc6ICdjYWwtc2NoZWR1bGVyLWV2ZW50LWNvbnRlbnQtY29udGFpbmVyJ1xyXG4gICAgfVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudENvbnRlbnRDb21wb25lbnQge1xyXG5cclxuICAgIEBJbnB1dCgpIGV2ZW50OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50O1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnQsXHJcbiAgICBDYWxlbmRhclNjaGVkdWxlckV2ZW50QWN0aW9uXHJcbn0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItdmlldy5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zJyxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICAgICAgPHNwYW4gKm5nSWY9XCJldmVudC5hY3Rpb25zXCIgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLWV2ZW50LWFjdGlvbnNcIj5cclxuICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiY2FsLXNjaGVkdWxlci1ldmVudC1hY3Rpb25cIlxyXG4gICAgICAgICAgICAgICAgaHJlZj1cImphdmFzY3JpcHQ6O1wiXHJcbiAgICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgYWN0aW9uIG9mIGFjdGlvbnNcIlxyXG4gICAgICAgICAgICAgICAgKG13bENsaWNrKT1cIm9uQWN0aW9uQ2xpY2soJGV2ZW50LCBhY3Rpb24sIGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJhY3Rpb24uY3NzQ2xhc3NcIlxyXG4gICAgICAgICAgICAgICAgW2lubmVySHRtbF09XCJhY3Rpb24ubGFiZWxcIlxyXG4gICAgICAgICAgICAgICAgW3RpdGxlXT1cImFjdGlvbi50aXRsZVwiPlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9zcGFuPlxyXG4gICAgYCxcclxuICAgIGhvc3Q6IHtcclxuICAgICAgICAnY2xhc3MnOiAnY2FsLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zLWNvbnRhaW5lcidcclxuICAgIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRBY3Rpb25zQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgICBASW5wdXQoKSBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudDtcclxuXHJcbiAgICBwdWJsaWMgYWN0aW9uczogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudEFjdGlvbltdID0gW107XHJcblxyXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucyA9IHRoaXMuZXZlbnQuaXNEaXNhYmxlZCA/XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnQuYWN0aW9ucy5maWx0ZXIoKGE6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRBY3Rpb24pID0+ICFhLndoZW4gfHwgYS53aGVuID09PSAnZGlzYWJsZWQnKSA6XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnQuYWN0aW9ucy5maWx0ZXIoKGE6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRBY3Rpb24pID0+ICFhLndoZW4gfHwgYS53aGVuID09PSAnZW5hYmxlZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGhpZGRlblxyXG4gICAgICovXHJcbiAgICBvbkFjdGlvbkNsaWNrKG1vdXNlRXZlbnQ6IE1vdXNlRXZlbnQsIGFjdGlvbjogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudEFjdGlvbiwgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAobW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24pIHtcclxuICAgICAgICAgICAgbW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFjdGlvbi5vbkNsaWNrKGV2ZW50KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDYWxlbmRhckV2ZW50VGl0bGVGb3JtYXR0ZXIgfSBmcm9tICdhbmd1bGFyLWNhbGVuZGFyJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2hlZHVsZXJFdmVudFRpdGxlRm9ybWF0dGVyIGV4dGVuZHMgQ2FsZW5kYXJFdmVudFRpdGxlRm9ybWF0dGVyIHtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDYWxlbmRhclNjaGVkdWxlckV2ZW50IH0gZnJvbSAnLi4vY2FsZW5kYXItc2NoZWR1bGVyLXZpZXcuY29tcG9uZW50JztcclxuaW1wb3J0IHsgU2NoZWR1bGVyRXZlbnRUaXRsZUZvcm1hdHRlciB9IGZyb20gJy4uL2Zvcm1hdHRlcnMvc2NoZWR1bGVyLWV2ZW50LXRpdGxlLWZvcm1hdHRlci5wcm92aWRlcic7XHJcblxyXG5AUGlwZSh7XHJcbiAgbmFtZTogJ3NjaGVkdWxlckV2ZW50VGl0bGUnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTY2hlZHVsZXJFdmVudFRpdGxlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2NoZWR1bGVyRXZlbnRUaXRsZTogU2NoZWR1bGVyRXZlbnRUaXRsZUZvcm1hdHRlcikge31cclxuXHJcbiAgdHJhbnNmb3JtKHRpdGxlOiBzdHJpbmcsIHRpdGxlVHlwZTogc3RyaW5nLCBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5zY2hlZHVsZXJFdmVudFRpdGxlW3RpdGxlVHlwZV0oZXZlbnQpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDYWxlbmRhckRhdGVGb3JtYXR0ZXIsIERhdGVGb3JtYXR0ZXJQYXJhbXMgfSBmcm9tICdhbmd1bGFyLWNhbGVuZGFyJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2hlZHVsZXJEYXRlRm9ybWF0dGVyIGV4dGVuZHMgQ2FsZW5kYXJEYXRlRm9ybWF0dGVyIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSB0aW1lIGZvcm1hdHRpbmcgZG93biB0aGUgbGVmdCBoYW5kIHNpZGUgb2YgdGhlIGRheSB2aWV3XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkYXlWaWV3SG91cih7IGRhdGUsIGxvY2FsZSB9OiBEYXRlRm9ybWF0dGVyUGFyYW1zKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobG9jYWxlLCB7IGhvdXI6ICdudW1lcmljJywgbWludXRlOiAnbnVtZXJpYycgfSkuZm9ybWF0KGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB3ZWVrVmlld1RpdGxlKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xyXG4gICAgICAgIC8vIGh0dHA6Ly9nZW5lcmF0ZWRjb250ZW50Lm9yZy9wb3N0LzU5NDAzMTY4MDE2L2VzaW50bGFwaVxyXG4gICAgICAgIGNvbnN0IHllYXI6IHN0cmluZyA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZSwgeyB5ZWFyOiAnbnVtZXJpYycgfSkuZm9ybWF0KGRhdGUpO1xyXG4gICAgICAgIGNvbnN0IG1vbnRoOiBzdHJpbmcgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIHsgbW9udGg6ICdzaG9ydCcgfSkuZm9ybWF0KGRhdGUpO1xyXG5cclxuICAgICAgICAvLyB2YXIgZmlyc3REYXk6IG51bWJlciA9IGRhdGUuZ2V0RGF0ZSgpIC0gZGF0ZS5nZXREYXkoKSArIDE7IC8vIEZpcnN0IGRheSBpcyB0aGUgZGF5IG9mIHRoZSBtb250aCAtIHRoZSBkYXkgb2YgdGhlIHdlZWtcclxuICAgICAgICBsZXQgZmlyc3REYXk6IG51bWJlciA9IGRhdGUuZ2V0RGF0ZSgpO1xyXG4gICAgICAgIGlmIChkYXRlLmdldERheSgpID09PSAwKSB7XHJcbiAgICAgICAgICAgIGZpcnN0RGF5ICs9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbGFzdERheTogbnVtYmVyID0gZmlyc3REYXkgKyA2OyAvLyBsYXN0IGRheSBpcyB0aGUgZmlyc3QgZGF5ICsgNlxyXG5cclxuICAgICAgICBsZXQgZmlyc3REYXlNb250aDogc3RyaW5nID0gbW9udGg7XHJcbiAgICAgICAgbGV0IGxhc3REYXlNb250aDogc3RyaW5nID0gbW9udGg7XHJcblxyXG4gICAgICAgIGxldCBmaXJzdERheVllYXI6IHN0cmluZyA9IHllYXI7XHJcbiAgICAgICAgbGV0IGxhc3REYXlZZWFyOiBzdHJpbmcgPSB5ZWFyO1xyXG5cclxuICAgICAgICBpZiAoZmlyc3REYXkgPCAxKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZNb250aERhdGU6IERhdGUgPSBuZXcgRGF0ZShkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSAtIDEpO1xyXG4gICAgICAgICAgICBmaXJzdERheU1vbnRoID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobG9jYWxlLCB7IG1vbnRoOiAnc2hvcnQnIH0pLmZvcm1hdChwcmV2TW9udGhEYXRlKTtcclxuICAgICAgICAgICAgY29uc3QgZGF5c0luUHJldk1vbnRoOiBudW1iZXIgPSB0aGlzLmRheXNJbk1vbnRoKHByZXZNb250aERhdGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgIGxldCBwcmV2TW9udGhEYXk6IG51bWJlciA9IGRheXNJblByZXZNb250aDtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IE1hdGguYWJzKGZpcnN0RGF5KTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2TW9udGhEYXktLTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaXJzdERheSA9IHByZXZNb250aERheTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZNb250aFllYXI6IHN0cmluZyA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZSwgeyB5ZWFyOiAnbnVtZXJpYycgfSkuZm9ybWF0KHByZXZNb250aERhdGUpO1xyXG4gICAgICAgICAgICBpZiAoTnVtYmVyKHByZXZNb250aFllYXIpIDwgTnVtYmVyKHllYXIpKSB7XHJcbiAgICAgICAgICAgICAgICBmaXJzdERheVllYXIgPSBwcmV2TW9udGhZZWFyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkYXlzSW5Nb250aDogbnVtYmVyID0gdGhpcy5kYXlzSW5Nb250aChkYXRlKTtcclxuICAgICAgICBpZiAobGFzdERheSA+IGRheXNJbk1vbnRoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRNb250aERhdGU6IERhdGUgPSBuZXcgRGF0ZShkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgICAgICAgICBsYXN0RGF5TW9udGggPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIHsgbW9udGg6ICdzaG9ydCcgfSkuZm9ybWF0KG5leHRNb250aERhdGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgIGxldCBuZXh0TW9udGhEYXk6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCAobGFzdERheSAtIGRheXNJbk1vbnRoKTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0TW9udGhEYXkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsYXN0RGF5ID0gbmV4dE1vbnRoRGF5O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbmV4dE1vbnRoWWVhcjogc3RyaW5nID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobG9jYWxlLCB7IHllYXI6ICdudW1lcmljJyB9KS5mb3JtYXQobmV4dE1vbnRoRGF0ZSk7XHJcbiAgICAgICAgICAgIGlmIChOdW1iZXIobmV4dE1vbnRoWWVhcikgPiBOdW1iZXIoeWVhcikpIHtcclxuICAgICAgICAgICAgICAgIGxhc3REYXlZZWFyID0gbmV4dE1vbnRoWWVhcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGAke2ZpcnN0RGF5fWAgKyAoZmlyc3REYXlNb250aCAhPT0gbGFzdERheU1vbnRoID8gJyAnICsgZmlyc3REYXlNb250aCA6ICcnKSArXHJcbiAgICAgICAgICAgIChmaXJzdERheVllYXIgIT09IGxhc3REYXlZZWFyID8gJyAnICsgZmlyc3REYXlZZWFyIDogJycpICtcclxuICAgICAgICAgICAgYCAtICR7bGFzdERheX0gJHtsYXN0RGF5TW9udGh9ICR7bGFzdERheVllYXJ9YDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRheXNJbk1vbnRoKGFueURhdGVJbk1vbnRoOiBEYXRlKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gbmV3IERhdGUoYW55RGF0ZUluTW9udGguZ2V0RnVsbFllYXIoKSwgYW55RGF0ZUluTW9udGguZ2V0TW9udGgoKSArIDEsIDApLmdldERhdGUoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge1xyXG4gICAgc3RhcnRPZkRheSxcclxuICAgIHN0YXJ0T2ZXZWVrLFxyXG4gICAgc3RhcnRPZk1vbnRoLFxyXG4gICAgZW5kT2ZEYXksXHJcbiAgICBlbmRPZldlZWssXHJcbiAgICBlbmRPZk1vbnRoLFxyXG4gICAgYWRkRGF5cyxcclxuICAgIGFkZFdlZWtzLFxyXG4gICAgYWRkTW9udGhzLFxyXG4gICAgc3ViRGF5cyxcclxuICAgIHN1YldlZWtzLFxyXG4gICAgc3ViTW9udGhzXHJcbn0gZnJvbSAnZGF0ZS1mbnMnO1xyXG5cclxuZXhwb3J0IHR5cGUgQ2FsZW5kYXJQZXJpb2QgPSAnZGF5JyB8ICd3ZWVrJyB8ICdtb250aCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkUGVyaW9kKHBlcmlvZDogQ2FsZW5kYXJQZXJpb2QsIGRhdGU6IERhdGUsIGFtb3VudDogbnVtYmVyKTogRGF0ZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGRheTogYWRkRGF5cyxcclxuICAgICAgICB3ZWVrOiBhZGRXZWVrcyxcclxuICAgICAgICBtb250aDogYWRkTW9udGhzXHJcbiAgICB9W3BlcmlvZF0oZGF0ZSwgYW1vdW50KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN1YlBlcmlvZChwZXJpb2Q6IENhbGVuZGFyUGVyaW9kLCBkYXRlOiBEYXRlLCBhbW91bnQ6IG51bWJlcik6IERhdGUge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBkYXk6IHN1YkRheXMsXHJcbiAgICAgICAgd2Vlazogc3ViV2Vla3MsXHJcbiAgICAgICAgbW9udGg6IHN1Yk1vbnRoc1xyXG4gICAgfVtwZXJpb2RdKGRhdGUsIGFtb3VudCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdGFydE9mUGVyaW9kKHBlcmlvZDogQ2FsZW5kYXJQZXJpb2QsIGRhdGU6IERhdGUpOiBEYXRlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF5OiBzdGFydE9mRGF5LFxyXG4gICAgICAgIHdlZWs6IHN0YXJ0T2ZXZWVrLFxyXG4gICAgICAgIG1vbnRoOiBzdGFydE9mTW9udGhcclxuICAgIH1bcGVyaW9kXShkYXRlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVuZE9mUGVyaW9kKHBlcmlvZDogQ2FsZW5kYXJQZXJpb2QsIGRhdGU6IERhdGUpOiBEYXRlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF5OiBlbmRPZkRheSxcclxuICAgICAgICB3ZWVrOiBlbmRPZldlZWssXHJcbiAgICAgICAgbW9udGg6IGVuZE9mTW9udGhcclxuICAgIH1bcGVyaW9kXShkYXRlKTtcclxufVxyXG4iLCJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycywgSW5qZWN0aW9uVG9rZW4gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbmltcG9ydCB7IENhbGVuZGFyTW9kdWxlIH0gZnJvbSAnYW5ndWxhci1jYWxlbmRhcic7XHJcbmltcG9ydCB7IENhbGVuZGFyU2NoZWR1bGVyVmlld0NvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItc2NoZWR1bGVyLXZpZXcuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ2FsZW5kYXJTY2hlZHVsZXJDZWxsQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItY2VsbC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDYWxlbmRhclNjaGVkdWxlckhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItc2NoZWR1bGVyLWhlYWRlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDYWxlbmRhclNjaGVkdWxlckV2ZW50Q29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItZXZlbnQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudFRpdGxlQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtdGl0bGUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudENvbnRlbnRDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1jb250ZW50LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRBY3Rpb25zQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtYWN0aW9ucy5jb21wb25lbnQnO1xyXG5cclxuaW1wb3J0IHsgU2NoZWR1bGVyRXZlbnRUaXRsZVBpcGUgfSBmcm9tICcuL3BpcGVzJztcclxuaW1wb3J0IHsgU2NoZWR1bGVyRXZlbnRUaXRsZUZvcm1hdHRlciB9IGZyb20gJy4vZm9ybWF0dGVycyc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci12aWV3LmNvbXBvbmVudCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vZm9ybWF0dGVycyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vcGlwZXMnO1xyXG5leHBvcnQgKiBmcm9tICcuL2NhbGVuZGFyLXV0aWxzJztcclxuXHJcbmltcG9ydCB7IFNjaGVkdWxlckNvbmZpZyB9IGZyb20gJy4vc2NoZWR1bGVyLWNvbmZpZyc7XHJcblxyXG5leHBvcnQgY29uc3QgU0NIRURVTEVSX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbignU2NoZWR1bGVyQ29uZmlnJyk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZUF1dGhDb25maWcoY29uZmlnOiBTY2hlZHVsZXJDb25maWcpIHtcclxuICAgIHJldHVybiBuZXcgU2NoZWR1bGVyQ29uZmlnKGNvbmZpZyk7XHJcbn1cclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgQ2FsZW5kYXJNb2R1bGUuZm9yUm9vdCgpXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyVmlld0NvbXBvbmVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyQ2VsbENvbXBvbmVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVySGVhZGVyQ29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudENvbXBvbmVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRUaXRsZUNvbXBvbmVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRDb250ZW50Q29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudEFjdGlvbnNDb21wb25lbnQsXHJcbiAgICBTY2hlZHVsZXJFdmVudFRpdGxlUGlwZVxyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICBTY2hlZHVsZXJFdmVudFRpdGxlUGlwZSxcclxuICAgIFNjaGVkdWxlckV2ZW50VGl0bGVGb3JtYXR0ZXJcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyVmlld0NvbXBvbmVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyQ2VsbENvbXBvbmVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVySGVhZGVyQ29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudENvbXBvbmVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRUaXRsZUNvbXBvbmVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRDb250ZW50Q29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudEFjdGlvbnNDb21wb25lbnRcclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTY2hlZHVsZXJNb2R1bGUge1xyXG4gIHN0YXRpYyBmb3JSb290KGNvbmZpZz86IFNjaGVkdWxlckNvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZ01vZHVsZTogU2NoZWR1bGVyTW9kdWxlLFxyXG4gICAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgICAgICB7IHByb3ZpZGU6IFNDSEVEVUxFUl9DT05GSUcsIHVzZVZhbHVlOiBjb25maWcgfSxcclxuICAgICAgICAgICAgeyBwcm92aWRlOiBTY2hlZHVsZXJDb25maWcsIHVzZUZhY3Rvcnk6IHByb3ZpZGVBdXRoQ29uZmlnLCBkZXBzOiBbU0NIRURVTEVSX0NPTkZJR10gfVxyXG4gICAgICAgIF1cclxuICAgIH07XHJcbn1cclxufVxyXG4iXSwibmFtZXMiOlsibW9tZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7QUFNQTs7OztJQUlJLFlBQVksU0FBMEIsRUFBRTtzQkFIdEIsSUFBSTtnQ0FDMEIsV0FBVzs7Ozs7OztRQUd2RCxhQUFnQixNQUFTLEVBQUUsWUFBZTtZQUN0QyxPQUFPLE1BQU0sSUFBSSxNQUFNLEtBQUssU0FBUyxHQUFHLE1BQU0sR0FBRyxZQUFZLENBQUM7U0FDakU7UUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLEdB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