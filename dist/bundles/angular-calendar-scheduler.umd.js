(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('date-fns'), require('moment'), require('angular-calendar'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('angular-calendar-scheduler', ['exports', '@angular/core', 'date-fns', 'moment', 'angular-calendar', '@angular/common'], factory) :
    (factory((global['angular-calendar-scheduler'] = {}),global.ng.core,null,null,null,global.ng.common));
}(this, (function (exports,core,dateFns,momentImported,angularCalendar,common) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Auth configuration.
     */
    var SchedulerConfig = (function () {
        function SchedulerConfig(config) {
            if (config === void 0) {
                config = {};
            }
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
        SchedulerConfig.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        SchedulerConfig.ctorParameters = function () {
            return [
                { type: SchedulerConfig }
            ];
        };
        return SchedulerConfig;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var WEEKEND_DAY_NUMBERS = [0, 6];
    /** @type {?} */
    var DAYS_IN_WEEK = 7;
    /** @type {?} */
    var MINUTES_IN_HOUR = 60;
    var CalendarSchedulerViewComponent = (function () {
        /**
         * @hidden
         */
        function CalendarSchedulerViewComponent(cdr, locale, config) {
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
            this.dayClicked = new core.EventEmitter();
            /**
             * Called when the segment is clicked
             */
            this.segmentClicked = new core.EventEmitter();
            /**
             * Called when the event is clicked
             */
            this.eventClicked = new core.EventEmitter();
            /**
             * @hidden
             */
            this.hours = [];
            this.locale = config.locale || locale;
        }
        /**
         * @hidden
         */
        /**
         * @hidden
         * @return {?}
         */
        CalendarSchedulerViewComponent.prototype.ngOnInit = /**
         * @hidden
         * @return {?}
         */
            function () {
                var _this = this;
                if (this.refresh) {
                    this.refreshSubscription = this.refresh.subscribe(function () {
                        _this.refreshAll();
                        _this.cdr.markForCheck();
                    });
                }
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} changes
         * @return {?}
         */
        CalendarSchedulerViewComponent.prototype.ngOnChanges = /**
         * @hidden
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
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
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @return {?}
         */
        CalendarSchedulerViewComponent.prototype.ngOnDestroy = /**
         * @hidden
         * @return {?}
         */
            function () {
                if (this.refreshSubscription) {
                    this.refreshSubscription.unsubscribe();
                }
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} event
         * @param {?} isHighlighted
         * @return {?}
         */
        CalendarSchedulerViewComponent.prototype.toggleSegmentHighlight = /**
         * @hidden
         * @param {?} event
         * @param {?} isHighlighted
         * @return {?}
         */
            function (event, isHighlighted) {
                this.days.forEach(function (day) {
                    day.hours.forEach(function (hour) {
                        // hour.segments.forEach((segment: SchedulerViewHourSegment) => {
                        //    if (isHighlighted && segment.events.indexOf(event) > -1) {
                        //        segment.backgroundColor = event.color.secondary;
                        //    } else {
                        //        delete segment.backgroundColor;
                        //    }
                        // });
                        hour.segments.filter(function (segment) { return segment.events.some(function (ev) { return ev.id === event.id && ev.start.getDay() === event.start.getDay(); }); })
                            .forEach(function (segment) {
                            segment.events.filter(function (ev) { return ev.id === event.id && ev.start.getDay() === event.start.getDay(); })
                                .forEach(function (e) {
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
            };
        /**
         * @return {?}
         */
        CalendarSchedulerViewComponent.prototype.refreshHeader = /**
         * @return {?}
         */
            function () {
                this.headerDays = this.getSchedulerViewDays({
                    viewDate: this.viewDate,
                    weekStartsOn: this.weekStartsOn,
                    startsWithToday: this.startsWithToday,
                    excluded: this.excludeDays
                });
            };
        /**
         * @return {?}
         */
        CalendarSchedulerViewComponent.prototype.refreshBody = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.view = this.getSchedulerView({
                    events: this.events,
                    viewDate: this.viewDate,
                    weekStartsOn: this.weekStartsOn,
                    startsWithToday: this.startsWithToday,
                    excluded: this.excludeDays
                });
                if (this.dayModifier) {
                    this.days.forEach(function (day) { return _this.dayModifier(day); });
                }
                if (this.dayModifier || this.hourModifier || this.segmentModifier) {
                    this.view.days.forEach(function (day) {
                        if (_this.dayModifier) {
                            _this.dayModifier(day);
                        }
                        day.hours.forEach(function (hour) {
                            if (_this.hourModifier) {
                                _this.hourModifier(hour);
                            }
                            hour.segments.forEach(function (segment) {
                                if (_this.segmentModifier) {
                                    _this.segmentModifier(segment);
                                }
                            });
                        });
                    });
                }
            };
        /**
         * @return {?}
         */
        CalendarSchedulerViewComponent.prototype.refreshAll = /**
         * @return {?}
         */
            function () {
                this.refreshHeader();
                this.refreshBody();
            };
        /**
         * @param {?} args
         * @return {?}
         */
        CalendarSchedulerViewComponent.prototype.getSchedulerView = /**
         * @param {?} args
         * @return {?}
         */
            function (args) {
                var _this = this;
                /** @type {?} */
                var events = args.events || [];
                /** @type {?} */
                var viewDate = args.viewDate;
                /** @type {?} */
                var weekStartsOn = args.weekStartsOn;
                /** @type {?} */
                var startsWithToday = args.startsWithToday;
                /** @type {?} */
                var excluded = args.excluded || [];
                /** @type {?} */
                var precision = args.precision || 'days';
                if (!events) {
                    events = [];
                }
                /** @type {?} */
                var startOfViewWeek = startsWithToday ? dateFns.startOfDay(viewDate) : dateFns.startOfWeek(viewDate, { weekStartsOn: weekStartsOn });
                /** @type {?} */
                var endOfViewWeek = startsWithToday ? dateFns.addDays(dateFns.endOfDay(viewDate), 6) : dateFns.endOfWeek(viewDate, { weekStartsOn: weekStartsOn });
                /** @type {?} */
                var eventsInWeek = this.getEventsInPeriod({ events: events, periodStart: startOfViewWeek, periodEnd: endOfViewWeek });
                this.days = this.getSchedulerViewDays({
                    viewDate: viewDate,
                    weekStartsOn: weekStartsOn,
                    startsWithToday: startsWithToday,
                    excluded: excluded
                });
                this.days.forEach(function (day, dayIndex) {
                    /** @type {?} */
                    var hours = [];
                    _this.hours.forEach(function (hour, hourIndex) {
                        /** @type {?} */
                        var segments = [];
                        hour.segments.forEach(function (segment, segmentIndex) {
                            segment.date = dateFns.setDate(dateFns.setMonth(dateFns.setYear(segment.date, day.date.getFullYear()), day.date.getMonth()), day.date.getDate());
                            /** @type {?} */
                            var startOfSegment = segment.date;
                            /** @type {?} */
                            var endOfSegment = dateFns.addMinutes(segment.date, MINUTES_IN_HOUR / _this.hourSegments);
                            /** @type {?} */
                            var evts = _this.getEventsInPeriod({
                                events: eventsInWeek,
                                periodStart: startOfSegment,
                                periodEnd: endOfSegment
                            }).map(function (event) {
                                return ({
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
                            });
                            segments.push(/** @type {?} */ ({
                                segment: segment,
                                date: new Date(segment.date),
                                events: evts,
                                hasBorder: true
                            }));
                        });
                        /** @type {?} */
                        var hourDate = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate(), hour.segments[0].date.getHours());
                        hours.push(/** @type {?} */ ({ hour: hour, date: hourDate, segments: segments, hasBorder: true }));
                    });
                    day.hours = hours;
                });
                return /** @type {?} */ ({
                    days: this.days
                });
            };
        /**
         * @param {?} args
         * @return {?}
         */
        CalendarSchedulerViewComponent.prototype.isEventInPeriod = /**
         * @param {?} args
         * @return {?}
         */
            function (args) {
                /** @type {?} */
                var event = args.event;
                /** @type {?} */
                var periodStart = args.periodStart;
                /** @type {?} */
                var periodEnd = args.periodEnd;
                /** @type {?} */
                var eventStart = event.start;
                /** @type {?} */
                var eventEnd = event.end || event.start;
                if (eventStart > periodStart && eventStart < periodEnd) {
                    return true;
                }
                if (eventEnd > periodStart && eventEnd < periodEnd) {
                    return true;
                }
                if (eventStart < periodStart && eventEnd > periodEnd) {
                    return true;
                }
                if (dateFns.isSameSecond(eventStart, periodStart) || dateFns.isSameSecond(eventStart, dateFns.subSeconds(periodEnd, 1))) {
                    return true;
                }
                if (dateFns.isSameSecond(dateFns.subSeconds(eventEnd, 1), periodStart) || dateFns.isSameSecond(eventEnd, periodEnd)) {
                    return true;
                }
                return false;
            };
        /**
         * @param {?} args
         * @return {?}
         */
        CalendarSchedulerViewComponent.prototype.getEventsInPeriod = /**
         * @param {?} args
         * @return {?}
         */
            function (args) {
                var _this = this;
                /** @type {?} */
                var events = args.events;
                /** @type {?} */
                var periodStart = args.periodStart;
                /** @type {?} */
                var periodEnd = args.periodEnd;
                return events.filter(function (event) { return _this.isEventInPeriod({ event: event, periodStart: periodStart, periodEnd: periodEnd }); });
            };
        /**
         * @param {?} args
         * @return {?}
         */
        CalendarSchedulerViewComponent.prototype.getSchedulerViewDays = /**
         * @param {?} args
         * @return {?}
         */
            function (args) {
                var _this = this;
                /** @type {?} */
                var viewDate = args.viewDate;
                /** @type {?} */
                var weekStartsOn = args.weekStartsOn;
                /** @type {?} */
                var startsWithToday = args.startsWithToday;
                /** @type {?} */
                var excluded = args.excluded || [];
                /** @type {?} */
                var start = startsWithToday ? new Date(viewDate) : dateFns.startOfWeek(viewDate, { weekStartsOn: weekStartsOn });
                /** @type {?} */
                var days = [];
                /** @type {?} */
                var loop = function (i) {
                    /** @type {?} */
                    var date = dateFns.addDays(start, i);
                    if (!excluded.some(function (e) { return date.getDay() === e; })) {
                        days.push(_this.getSchedulerDay({ date: date }));
                    }
                };
                for (var i = 0; i < DAYS_IN_WEEK; i++) {
                    loop(i);
                }
                return days;
            };
        /**
         * @param {?} args
         * @return {?}
         */
        CalendarSchedulerViewComponent.prototype.getSchedulerDay = /**
         * @param {?} args
         * @return {?}
         */
            function (args) {
                /** @type {?} */
                var date = args.date;
                /** @type {?} */
                var today = dateFns.startOfDay(new Date());
                return /** @type {?} */ ({
                    date: date,
                    isPast: date < today,
                    isToday: dateFns.isSameDay(date, today),
                    isFuture: date > today,
                    isWeekend: WEEKEND_DAY_NUMBERS.indexOf(dateFns.getDay(date)) > -1,
                    hours: []
                });
            };
        /**
         * @param {?} args
         * @return {?}
         */
        CalendarSchedulerViewComponent.prototype.getSchedulerViewHourGrid = /**
         * @param {?} args
         * @return {?}
         */
            function (args) {
                /** @type {?} */
                var viewDate = args.viewDate;
                /** @type {?} */
                var hourSegments = args.hourSegments;
                /** @type {?} */
                var dayStart = args.dayStart;
                /** @type {?} */
                var dayEnd = args.dayEnd;
                /** @type {?} */
                var hours = [];
                /** @type {?} */
                var startOfView = dateFns.setMinutes(dateFns.setHours(dateFns.startOfDay(viewDate), dayStart.hour), dayStart.minute);
                /** @type {?} */
                var endOfView = dateFns.setMinutes(dateFns.setHours(dateFns.startOfMinute(dateFns.endOfDay(viewDate)), dayEnd.hour), dayEnd.minute);
                /** @type {?} */
                var segmentDuration = MINUTES_IN_HOUR / hourSegments;
                /** @type {?} */
                var startOfViewDay = dateFns.startOfDay(viewDate);
                /** @type {?} */
                var range = function (start, end) { return Array.from({ length: ((end + 1) - start) }, function (v, k) { return k + start; }); };
                /** @type {?} */
                var hoursInView = range(dayStart.hour, dayEnd.hour);
                // for (var i = 0; i < HOURS_IN_DAY; i++) {
                hoursInView.forEach(function (hour, i) {
                    /** @type {?} */
                    var segments = [];
                    for (var j = 0; j < hourSegments; j++) {
                        /** @type {?} */
                        var date = dateFns.addMinutes(dateFns.addHours(startOfViewDay, hour), j * segmentDuration);
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
            };
        CalendarSchedulerViewComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'calendar-scheduler-view',
                        template: "\n        <div class=\"cal-scheduler-view\" #weekViewContainer>\n            <calendar-scheduler-header\n                [days]=\"headerDays\"\n                [locale]=\"locale\"\n                [customTemplate]=\"headerTemplate\"\n                (dayClicked)=\"dayClicked.emit($event)\">\n            </calendar-scheduler-header>\n\n            <div class=\"cal-scheduler\">\n                <div class=\"cal-scheduler-hour-rows aside\">\n                    <div class=\"cal-scheduler-hour align-center horizontal\" *ngFor=\"let hour of hours\">\n                      <div class=\"cal-scheduler-time\">\n                        <div class=\"cal-scheduler-hour-segment\" *ngFor=\"let segment of hour.segments\">\n                            {{ segment.date | calendarDate:'dayViewHour':locale }}\n                        </div>\n                      </div>\n                    </div>\n                </div>\n\n                <div class=\"cal-scheduler-cols aside\">\n                    <div class=\"cal-scheduler-col\" *ngFor=\"let day of view.days\">\n                        <calendar-scheduler-cell\n                            *ngFor=\"let hour of day.hours\"\n                            [ngClass]=\"day?.cssClass\"\n                            [day]=\"day\"\n                            [hour]=\"hour\"\n                            [locale]=\"locale\"\n                            [tooltipPlacement]=\"tooltipPlacement\"\n                            [showActions]=\"showActions\"\n                            [customTemplate]=\"cellTemplate\"\n                            [eventTemplate]=\"eventTemplate\"\n                            (click)=\"dayClicked.emit({date: day})\"\n                            (highlightSegment)=\"toggleSegmentHighlight($event.event, true)\"\n                            (unhighlightSegment)=\"toggleSegmentHighlight($event.event, false)\"\n                            (segmentClicked)=\"segmentClicked.emit({segment: $event.segment})\"\n                            (eventClicked)=\"eventClicked.emit({event: $event.event})\">\n                        </calendar-scheduler-cell>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ",
                        styles: [".cal-scheduler-view .cal-scheduler-headers{display:flex;flex-flow:row wrap;margin-bottom:3px;border:1px solid #e1e1e1}.cal-scheduler-view .cal-scheduler-headers .aside{flex:1 0}.cal-scheduler-view .cal-scheduler-headers .aside.cal-header-clock{max-width:5em}.cal-scheduler-view .cal-scheduler-headers .cal-header{flex:1;text-align:center;padding:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cal-scheduler-view .cal-scheduler-headers .cal-header:not(:last-child){border-right:1px solid #e1e1e1}.cal-scheduler-view .cal-scheduler-headers .cal-header:hover{background-color:#ededed}.cal-scheduler-view .cal-scheduler-headers .cal-header.cal-today{background-color:#e8fde7}.cal-scheduler-view .cal-scheduler-headers .cal-header.cal-weekend span{color:#8b0000}.cal-scheduler-view .cal-scheduler-headers .cal-header span{font-weight:400;opacity:.5}.cal-scheduler-view .cal-scheduler,.cal-scheduler-view .cal-scheduler-headers .cal-header-cols{display:flex;flex-flow:row wrap}.cal-scheduler-view .cal-scheduler .aside{flex:1 0}.cal-scheduler-view .cal-scheduler .aside.cal-scheduler-hour-rows{max-width:5em}.cal-scheduler-view .cal-scheduler .cal-scheduler-hour-rows{width:auto!important;border:1px solid #e1e1e1;overflow:hidden;position:relative}.cal-scheduler-view .cal-scheduler .cal-scheduler-hour-rows .cal-scheduler-hour{display:flex;height:7.25em}.cal-scheduler-view .cal-scheduler .cal-scheduler-hour-rows .cal-scheduler-hour:nth-child(odd){background-color:#fafafa}.cal-scheduler-view .cal-scheduler .cal-scheduler-hour-rows .cal-scheduler-hour:not(:last-child){border-bottom:1px solid #e1e1e1}.cal-scheduler-view .cal-scheduler .cal-scheduler-hour-rows .cal-scheduler-hour .cal-scheduler-time{display:flex;flex-flow:column wrap;width:100%;font-weight:700;text-align:center}.cal-scheduler-view .cal-scheduler .cal-scheduler-hour-rows .cal-scheduler-hour .cal-scheduler-time .cal-scheduler-hour-segment{flex:1 0}.cal-scheduler-view .cal-scheduler .cal-scheduler-hour-rows .cal-scheduler-hour .cal-scheduler-time .cal-scheduler-hour-segment:hover{background-color:#ededed}.cal-scheduler-view .cal-scheduler .cal-scheduler-hour-rows .cal-scheduler-hour .cal-scheduler-time .cal-scheduler-hour-segment:not(:last-child){border-bottom:thin dashed #e1e1e1}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols{display:flex;flex-flow:row wrap;border-top:1px solid #e1e1e1}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col{display:flex;flex-flow:column wrap;flex:1 0;border-right:1px solid #e1e1e1}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell{display:flex;flex-flow:column wrap;flex:1 0}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell.cal-today{background-color:#e8fde7}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell.cal-disabled{background-color:#eee;pointer-events:none}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell.cal-disabled .cal-scheduler-events{filter:opacity(50%);-webkit-filter:opacity(50%)}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments{display:flex;flex-flow:column wrap;flex:1 0;border-bottom:1px solid #e1e1e1}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments.no-border{border-bottom:0!important}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments.cal-disabled{background-color:#eee;pointer-events:none}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments.cal-disabled .cal-scheduler-event{filter:opacity(50%);-webkit-filter:opacity(50%)}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment{flex:1 0;display:flex;flex-flow:column wrap}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment:not(.has-events):hover{background-color:#ededed}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment:not(:last-child){border-bottom:thin dashed #e1e1e1}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment.no-border{border-bottom:0!important}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment.cal-disabled{background-color:#eee;pointer-events:none}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events,.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container{flex:1 0;display:flex;flex-flow:column wrap}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event{flex:1 0;display:flex;flex-flow:row wrap;padding:0 10px;font-size:12px;margin:0 2px;line-height:30px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:all ease-out .2s;filter:brightness(100%);-webkit-filter:brightness(100%);-webkit-backface-visibility:hidden}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event.cal-starts-within-segment{border-top-left-radius:.3em;border-top-right-radius:.3em;margin-top:2px}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event.cal-ends-within-segment{border-bottom-left-radius:.3em;border-bottom-right-radius:.3em;margin-bottom:2px}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event.cal-disabled{background-color:gray!important;filter:grayscale(100%);-webkit-filter:grayscale(100%)}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event.cal-not-clickable{cursor:not-allowed!important}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event:not(.cal-disabled).hovered,.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event:not(.cal-disabled):hover{cursor:pointer;filter:brightness(80%);-webkit-filter:brightness(80%)}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-title-container{position:relative;width:100%}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-title-container .cal-scheduler-event-title{font-size:16px;font-weight:700}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-title-container .cal-scheduler-event-status{position:absolute;top:25%;right:1%;width:16px;height:16px;background:grey;border-radius:50px;border:1px solid #000}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-title-container .cal-scheduler-event-status.ok{background:green}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-title-container .cal-scheduler-event-status.warning{background:orange}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-title-container .cal-scheduler-event-status.danger{background:red}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-content-container{width:100%}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-actions-container{flex:1 0;position:relative}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-actions-container .cal-scheduler-event-actions{position:absolute;bottom:5px;right:0}.cal-scheduler-view .cal-scheduler .cal-scheduler-cols .cal-scheduler-col .cal-scheduler-cell .cal-scheduler-segments .cal-scheduler-segment .cal-scheduler-events .cal-scheduler-event-container .cal-scheduler-event .cal-scheduler-event-actions-container .cal-scheduler-event-actions .cal-scheduler-event-action{text-decoration:none}"],
                        encapsulation: core.ViewEncapsulation.None
                    },] },
        ];
        /** @nocollapse */
        CalendarSchedulerViewComponent.ctorParameters = function () {
            return [
                { type: core.ChangeDetectorRef },
                { type: String, decorators: [{ type: core.Inject, args: [core.LOCALE_ID,] }] },
                { type: SchedulerConfig }
            ];
        };
        CalendarSchedulerViewComponent.propDecorators = {
            viewDate: [{ type: core.Input }],
            events: [{ type: core.Input }],
            hourSegments: [{ type: core.Input }],
            excludeDays: [{ type: core.Input }],
            startsWithToday: [{ type: core.Input }],
            showActions: [{ type: core.Input }],
            dayModifier: [{ type: core.Input }],
            hourModifier: [{ type: core.Input }],
            segmentModifier: [{ type: core.Input }],
            refresh: [{ type: core.Input }],
            locale: [{ type: core.Input }],
            tooltipPlacement: [{ type: core.Input }],
            weekStartsOn: [{ type: core.Input }],
            headerTemplate: [{ type: core.Input }],
            cellTemplate: [{ type: core.Input }],
            eventTemplate: [{ type: core.Input }],
            precision: [{ type: core.Input }],
            dayStartHour: [{ type: core.Input }],
            dayStartMinute: [{ type: core.Input }],
            dayEndHour: [{ type: core.Input }],
            dayEndMinute: [{ type: core.Input }],
            dayClicked: [{ type: core.Output }],
            segmentClicked: [{ type: core.Output }],
            eventClicked: [{ type: core.Output }]
        };
        return CalendarSchedulerViewComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var moment = momentImported;
    var CalendarSchedulerCellComponent = (function () {
        function CalendarSchedulerCellComponent() {
            this.showActions = true;
            this.highlightSegment = new core.EventEmitter();
            this.unhighlightSegment = new core.EventEmitter();
            this.segmentClicked = new core.EventEmitter();
            this.eventClicked = new core.EventEmitter();
        }
        /**
         * @return {?}
         */
        CalendarSchedulerCellComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                this.title = moment(this.day.date).format('dddd L');
            };
        /**
         * @param {?} mouseEvent
         * @param {?} segment
         * @param {?} event
         * @return {?}
         */
        CalendarSchedulerCellComponent.prototype.onMouseEnter = /**
         * @param {?} mouseEvent
         * @param {?} segment
         * @param {?} event
         * @return {?}
         */
            function (mouseEvent, segment, event) {
                if (!event.isDisabled && !segment.isDisabled) {
                    this.highlightSegment.emit({ event: event });
                }
            };
        /**
         * @param {?} mouseEvent
         * @param {?} segment
         * @param {?} event
         * @return {?}
         */
        CalendarSchedulerCellComponent.prototype.onMouseLeave = /**
         * @param {?} mouseEvent
         * @param {?} segment
         * @param {?} event
         * @return {?}
         */
            function (mouseEvent, segment, event) {
                if (!event.isDisabled && !segment.isDisabled) {
                    this.unhighlightSegment.emit({ event: event });
                }
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} mouseEvent
         * @param {?} segment
         * @return {?}
         */
        CalendarSchedulerCellComponent.prototype.onSegmentClick = /**
         * @hidden
         * @param {?} mouseEvent
         * @param {?} segment
         * @return {?}
         */
            function (mouseEvent, segment) {
                if (mouseEvent.stopPropagation) {
                    mouseEvent.stopPropagation();
                }
                if (segment.events.length === 0) {
                    this.segmentClicked.emit({ segment: segment });
                }
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} mouseEvent
         * @param {?} event
         * @return {?}
         */
        CalendarSchedulerCellComponent.prototype.onEventClick = /**
         * @hidden
         * @param {?} mouseEvent
         * @param {?} event
         * @return {?}
         */
            function (mouseEvent, event) {
                if (mouseEvent.stopPropagation) {
                    mouseEvent.stopPropagation();
                }
                if (event.isClickable) {
                    this.eventClicked.emit({ event: event });
                }
            };
        CalendarSchedulerCellComponent.decorators = [
            { type: core.Component, args: [{
                        // [class.no-border]': '!day.hasBorder
                        selector: 'calendar-scheduler-cell',
                        template: "\n        <ng-template #defaultTemplate>\n            <div class=\"cal-scheduler-segments\" *ngIf=\"hour.segments.length > 0\"\n                [ngClass]=\"hour?.cssClass\"\n                [class.no-border]=\"!hour.hasBorder\">\n                <div class=\"cal-scheduler-segment\"\n                    *ngFor=\"let segment of hour.segments; let si = index\"\n                    [title]=\"title\"\n                    [ngClass]=\"segment?.cssClass\"\n                    [class.has-events]=\"segment.events.length > 0\"\n                    [class.cal-disabled]=\"segment.isDisabled\"\n                    [style.backgroundColor]=\"segment.backgroundColor\"\n                    [class.no-border]=\"!segment.hasBorder\"\n                    (mwlClick)=\"onSegmentClick($event, segment)\">\n\n                    <div class=\"cal-scheduler-events\" *ngIf=\"segment.events.length > 0\">\n                        <calendar-scheduler-event\n                            *ngFor=\"let event of segment.events\"\n                            [day]=\"day\"\n                            [hour]=\"hour\"\n                            [segment]=\"segment\"\n                            [event]=\"event\"\n                            (mouseenter)=\"onMouseEnter($event, segment, event)\"\n                            (mouseleave)=\"onMouseLeave($event, segment, event)\"\n                            [tooltipPlacement]=\"tooltipPlacement\"\n                            [showActions]=\"showActions\"\n                            [customTemplate]=\"eventTemplate\"\n                            (eventClicked)=\"onEventClick($event, event)\">\n                        </calendar-scheduler-event>\n                    </div>\n                </div>\n            </div>\n        </ng-template>\n        <ng-template\n            [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n            [ngTemplateOutletContext]=\"{\n                day: day,\n                hour: hour,\n                locale: locale,\n                tooltipPlacement: tooltipPlacement,\n                showActions: showActions,\n                eventTemplate: eventTemplate,\n                highlightSegment: highlightSegment,\n                unhighlightSegment: unhighlightSegment,\n                segmentClicked: segmentClicked,\n                eventClicked: eventClicked\n            }\">\n        </ng-template>\n    ",
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
            title: [{ type: core.Input }],
            day: [{ type: core.Input }],
            hour: [{ type: core.Input }],
            locale: [{ type: core.Input }],
            tooltipPlacement: [{ type: core.Input }],
            showActions: [{ type: core.Input }],
            customTemplate: [{ type: core.Input }],
            eventTemplate: [{ type: core.Input }],
            highlightSegment: [{ type: core.Output }],
            unhighlightSegment: [{ type: core.Output }],
            segmentClicked: [{ type: core.Output }],
            eventClicked: [{ type: core.Output }]
        };
        return CalendarSchedulerCellComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarSchedulerHeaderComponent = (function () {
        function CalendarSchedulerHeaderComponent() {
            this.dayClicked = new core.EventEmitter();
        }
        CalendarSchedulerHeaderComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'calendar-scheduler-header',
                        template: "\n        <ng-template #defaultTemplate>\n            <div class=\"cal-scheduler-headers\">\n                <div class=\"cal-header aside cal-header-clock align-center\">\n                    <i class=\"material-icons md-32\" style=\"margin:auto;\">schedule</i>\n                </div>\n\n                <div class=\"cal-header-cols aside\">\n                    <div\n                        class=\"cal-header\"\n                        *ngFor=\"let day of days\"\n                        [class.cal-past]=\"day.isPast\"\n                        [class.cal-today]=\"day.isToday\"\n                        [class.cal-future]=\"day.isFuture\"\n                        [class.cal-weekend]=\"day.isWeekend\"\n                        [class.cal-drag-over]=\"day.dragOver\"\n                        (mwlClick)=\"dayClicked.emit({date: day.date})\">\n                        <b>{{ day.date | calendarDate:'weekViewColumnHeader':locale }}</b><br>\n                        <span>{{ day.date | calendarDate:'weekViewColumnSubHeader':locale }}</span>\n                    </div>\n                </div>\n            </div>\n        </ng-template>\n        <ng-template\n            [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n            [ngTemplateOutletContext]=\"{days: days, locale: locale, dayClicked: dayClicked}\">\n        </ng-template>\n    "
                    },] },
        ];
        CalendarSchedulerHeaderComponent.propDecorators = {
            days: [{ type: core.Input }],
            locale: [{ type: core.Input }],
            customTemplate: [{ type: core.Input }],
            dayClicked: [{ type: core.Output }]
        };
        return CalendarSchedulerHeaderComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var moment$1 = momentImported;
    /**
     * [mwlCalendarTooltip]="event.title | calendarEventTitle:'weekTooltip':event"
     * [tooltipPlacement]="tooltipPlacement"
     */
    var CalendarSchedulerEventComponent = (function () {
        function CalendarSchedulerEventComponent(renderer) {
            this.renderer = renderer;
            this.showActions = true;
            this.eventClicked = new core.EventEmitter();
        }
        /**
         * @return {?}
         */
        CalendarSchedulerEventComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                this.segment.hasBorder = this.hour.hasBorder = !this.event.endsAfterSegment;
                this.title = moment$1(this.event.start).format('dddd L');
                this.checkEnableState();
            };
        /**
         * @return {?}
         */
        CalendarSchedulerEventComponent.prototype.checkEnableState = /**
         * @return {?}
         */
            function () {
                var _this = this;
                if (this.segment.isDisabled) {
                    this.day.hours.forEach(function (hour) {
                        hour.segments.forEach(function (segment) {
                            segment.events.filter(function (event) { return event.id === _this.event.id && dateFns.isSameDay(event.start, _this.event.start); })
                                .forEach(function (event) {
                                event.isDisabled = true;
                            });
                        });
                    });
                }
            };
        /**
         * @return {?}
         */
        CalendarSchedulerEventComponent.prototype.highlightEvent = /**
         * @return {?}
         */
            function () {
                var _this = this;
                // let events: CalendarSchedulerEvent[] = this.day.hours
                //    .filter(h => h.segments.some(s => s.events.some(e => e.id === this.event.id)))
                //    .map(h =>
                //        h.segments.map(s =>
                //            s.events.filter(e => e.id === this.event.id)
                //        ).reduce((prev, curr) => prev.concat(curr))
                //    )
                //    .reduce((prev, curr) => prev.concat(curr));
                this.day.hours.forEach(function (hour) {
                    hour.segments.forEach(function (segment) {
                        segment.events.filter(function (event) { return event.id === _this.event.id && dateFns.isSameDay(event.start, _this.event.start); })
                            .forEach(function (event) {
                            event.isHovered = true;
                        });
                    });
                });
            };
        /**
         * @return {?}
         */
        CalendarSchedulerEventComponent.prototype.unhighlightEvent = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.day.hours.forEach(function (hour) {
                    hour.segments.forEach(function (segment) {
                        segment.events.filter(function (event) { return event.id === _this.event.id && dateFns.isSameDay(event.start, _this.event.start); })
                            .forEach(function (event) {
                            event.isHovered = false;
                        });
                    });
                });
            };
        CalendarSchedulerEventComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'calendar-scheduler-event',
                        template: "\n        <ng-template #defaultTemplate>\n            <div\n                class=\"cal-scheduler-event\"\n                [title]=\"title\"\n                [class.cal-starts-within-segment]=\"!event.startsBeforeSegment\"\n                [class.cal-ends-within-segment]=\"!event.endsAfterSegment\"\n                [class.hovered]=\"event.isHovered\"\n                [class.cal-disabled]=\"event.isDisabled || segment.isDisabled\"\n                [class.cal-not-clickable]=\"!event.isClickable\"\n                [style.backgroundColor]=\"event.color.primary\"\n                [ngClass]=\"event?.cssClass\"\n                (mwlClick)=\"eventClicked.emit({event: event})\"\n                (mouseenter)=\"highlightEvent()\"\n                (mouseleave)=\"unhighlightEvent()\">\n                <calendar-scheduler-event-title *ngIf=\"!event.startsBeforeSegment\"\n                    [event]=\"event\"\n                    view=\"week\">\n                </calendar-scheduler-event-title>\n                <calendar-scheduler-event-content *ngIf=\"!event.startsBeforeSegment\"\n                    [event]=\"event\">\n                </calendar-scheduler-event-content>\n                <calendar-scheduler-event-actions [event]=\"event\" *ngIf=\"showActions && event.isClickable && !event.endsAfterSegment\"></calendar-scheduler-event-actions>\n                <calendar-scheduler-event-actions [event]=\"event\" *ngIf=\"showActions && event.isDisabled && !event.endsAfterSegment\"></calendar-scheduler-event-actions>\n            </div>\n        </ng-template>\n        <ng-template\n            [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n            [ngTemplateOutletContext]=\"{\n                day: day,\n                hour: hour,\n                segment: segment,\n                event: event,\n                tooltipPlacement: tooltipPlacement,\n                showActions: showActions,\n                customTemplate: customTemplate,\n                eventClicked: eventClicked\n            }\">\n        </ng-template>\n    ",
                        host: {
                            'class': 'cal-scheduler-event-container'
                        }
                    },] },
        ];
        /** @nocollapse */
        CalendarSchedulerEventComponent.ctorParameters = function () {
            return [
                { type: core.Renderer2 }
            ];
        };
        CalendarSchedulerEventComponent.propDecorators = {
            title: [{ type: core.Input }],
            day: [{ type: core.Input }],
            hour: [{ type: core.Input }],
            segment: [{ type: core.Input }],
            event: [{ type: core.Input }],
            tooltipPlacement: [{ type: core.Input }],
            showActions: [{ type: core.Input }],
            customTemplate: [{ type: core.Input }],
            eventClicked: [{ type: core.Output }]
        };
        return CalendarSchedulerEventComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarSchedulerEventTitleComponent = (function () {
        function CalendarSchedulerEventTitleComponent() {
        }
        CalendarSchedulerEventTitleComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'calendar-scheduler-event-title',
                        template: "\n        <div\n            class=\"cal-scheduler-event-title\"\n            [innerHTML]=\"event.title | schedulerEventTitle:view:event\">\n        </div>\n        <div *ngIf=\"event.status\"\n            class=\"cal-scheduler-event-status\"\n            [class.ok]=\"event.status === 'ok'\"\n            [class.warning]=\"event.status === 'warning'\"\n            [class.danger]=\"event.status === 'danger'\">\n        </div>\n    ",
                        host: {
                            'class': 'cal-scheduler-event-title-container'
                        }
                    },] },
        ];
        CalendarSchedulerEventTitleComponent.propDecorators = {
            event: [{ type: core.Input }],
            view: [{ type: core.Input }]
        };
        return CalendarSchedulerEventTitleComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarSchedulerEventContentComponent = (function () {
        function CalendarSchedulerEventContentComponent() {
        }
        CalendarSchedulerEventContentComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'calendar-scheduler-event-content',
                        template: "\n        <div *ngIf=\"event.content\"\n            class=\"cal-scheduler-event-content\"\n            [innerHTML]=\"event.content\">\n        </div>\n    ",
                        host: {
                            'class': 'cal-scheduler-event-content-container'
                        }
                    },] },
        ];
        CalendarSchedulerEventContentComponent.propDecorators = {
            event: [{ type: core.Input }]
        };
        return CalendarSchedulerEventContentComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CalendarSchedulerEventActionsComponent = (function () {
        function CalendarSchedulerEventActionsComponent() {
            this.actions = [];
        }
        /**
         * @return {?}
         */
        CalendarSchedulerEventActionsComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                this.actions = this.event.isDisabled ?
                    this.event.actions.filter(function (a) { return !a.when || a.when === 'disabled'; }) :
                    this.event.actions.filter(function (a) { return !a.when || a.when === 'enabled'; });
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} mouseEvent
         * @param {?} action
         * @param {?} event
         * @return {?}
         */
        CalendarSchedulerEventActionsComponent.prototype.onActionClick = /**
         * @hidden
         * @param {?} mouseEvent
         * @param {?} action
         * @param {?} event
         * @return {?}
         */
            function (mouseEvent, action, event) {
                if (mouseEvent.stopPropagation) {
                    mouseEvent.stopPropagation();
                }
                action.onClick(event);
            };
        CalendarSchedulerEventActionsComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'calendar-scheduler-event-actions',
                        template: "\n        <span *ngIf=\"event.actions\" class=\"cal-scheduler-event-actions\">\n            <a\n                class=\"cal-scheduler-event-action\"\n                href=\"javascript:;\"\n                *ngFor=\"let action of actions\"\n                (mwlClick)=\"onActionClick($event, action, event)\"\n                [ngClass]=\"action.cssClass\"\n                [innerHtml]=\"action.label\"\n                [title]=\"action.title\">\n            </a>\n        </span>\n    ",
                        host: {
                            'class': 'cal-scheduler-event-actions-container'
                        }
                    },] },
        ];
        CalendarSchedulerEventActionsComponent.propDecorators = {
            event: [{ type: core.Input }]
        };
        return CalendarSchedulerEventActionsComponent;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var SchedulerEventTitleFormatter = (function (_super) {
        __extends(SchedulerEventTitleFormatter, _super);
        function SchedulerEventTitleFormatter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SchedulerEventTitleFormatter;
    }(angularCalendar.CalendarEventTitleFormatter));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var SchedulerEventTitlePipe = (function () {
        function SchedulerEventTitlePipe(schedulerEventTitle) {
            this.schedulerEventTitle = schedulerEventTitle;
        }
        /**
         * @param {?} title
         * @param {?} titleType
         * @param {?} event
         * @return {?}
         */
        SchedulerEventTitlePipe.prototype.transform = /**
         * @param {?} title
         * @param {?} titleType
         * @param {?} event
         * @return {?}
         */
            function (title, titleType, event) {
                return this.schedulerEventTitle[titleType](event);
            };
        SchedulerEventTitlePipe.decorators = [
            { type: core.Pipe, args: [{
                        name: 'schedulerEventTitle'
                    },] },
        ];
        /** @nocollapse */
        SchedulerEventTitlePipe.ctorParameters = function () {
            return [
                { type: SchedulerEventTitleFormatter }
            ];
        };
        return SchedulerEventTitlePipe;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var SchedulerDateFormatter = (function (_super) {
        __extends(SchedulerDateFormatter, _super);
        function SchedulerDateFormatter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * The time formatting down the left hand side of the day view
         * @param {?} __0
         * @return {?}
         */
        SchedulerDateFormatter.prototype.dayViewHour = /**
         * The time formatting down the left hand side of the day view
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: 'numeric' }).format(date);
            };
        /**
         * @param {?} __0
         * @return {?}
         */
        SchedulerDateFormatter.prototype.weekViewTitle = /**
         * @param {?} __0
         * @return {?}
         */
            function (_a) {
                var date = _a.date, locale = _a.locale;
                /** @type {?} */
                var year = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(date);
                /** @type {?} */
                var month = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);
                /** @type {?} */
                var firstDay = date.getDate();
                if (date.getDay() === 0) {
                    firstDay += 1;
                }
                /** @type {?} */
                var lastDay = firstDay + 6;
                /** @type {?} */
                var firstDayMonth = month;
                /** @type {?} */
                var lastDayMonth = month;
                /** @type {?} */
                var firstDayYear = year;
                /** @type {?} */
                var lastDayYear = year;
                if (firstDay < 1) {
                    /** @type {?} */
                    var prevMonthDate = new Date(date.getFullYear(), date.getMonth() - 1);
                    firstDayMonth = new Intl.DateTimeFormat(locale, { month: 'short' }).format(prevMonthDate);
                    /** @type {?} */
                    var daysInPrevMonth = this.daysInMonth(prevMonthDate);
                    /** @type {?} */
                    var i = 0;
                    /** @type {?} */
                    var prevMonthDay = daysInPrevMonth;
                    for (i = 0; i < Math.abs(firstDay); i++) {
                        prevMonthDay--;
                    }
                    firstDay = prevMonthDay;
                    /** @type {?} */
                    var prevMonthYear = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(prevMonthDate);
                    if (Number(prevMonthYear) < Number(year)) {
                        firstDayYear = prevMonthYear;
                    }
                }
                /** @type {?} */
                var daysInMonth = this.daysInMonth(date);
                if (lastDay > daysInMonth) {
                    /** @type {?} */
                    var nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1);
                    lastDayMonth = new Intl.DateTimeFormat(locale, { month: 'short' }).format(nextMonthDate);
                    /** @type {?} */
                    var i = 0;
                    /** @type {?} */
                    var nextMonthDay = 0;
                    for (i = 0; i < (lastDay - daysInMonth); i++) {
                        nextMonthDay++;
                    }
                    lastDay = nextMonthDay;
                    /** @type {?} */
                    var nextMonthYear = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(nextMonthDate);
                    if (Number(nextMonthYear) > Number(year)) {
                        lastDayYear = nextMonthYear;
                    }
                }
                return "" + firstDay + (firstDayMonth !== lastDayMonth ? ' ' + firstDayMonth : '') +
                    (firstDayYear !== lastDayYear ? ' ' + firstDayYear : '') +
                    (" - " + lastDay + " " + lastDayMonth + " " + lastDayYear);
            };
        /**
         * @param {?} anyDateInMonth
         * @return {?}
         */
        SchedulerDateFormatter.prototype.daysInMonth = /**
         * @param {?} anyDateInMonth
         * @return {?}
         */
            function (anyDateInMonth) {
                return new Date(anyDateInMonth.getFullYear(), anyDateInMonth.getMonth() + 1, 0).getDate();
            };
        return SchedulerDateFormatter;
    }(angularCalendar.CalendarDateFormatter));

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
            day: dateFns.addDays,
            week: dateFns.addWeeks,
            month: dateFns.addMonths
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
            day: dateFns.subDays,
            week: dateFns.subWeeks,
            month: dateFns.subMonths
        }[period](date, amount);
    }
    /**
     * @param {?} period
     * @param {?} date
     * @return {?}
     */
    function startOfPeriod(period, date) {
        return {
            day: dateFns.startOfDay,
            week: dateFns.startOfWeek,
            month: dateFns.startOfMonth
        }[period](date);
    }
    /**
     * @param {?} period
     * @param {?} date
     * @return {?}
     */
    function endOfPeriod(period, date) {
        return {
            day: dateFns.endOfDay,
            week: dateFns.endOfWeek,
            month: dateFns.endOfMonth
        }[period](date);
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var SCHEDULER_CONFIG = new core.InjectionToken('SchedulerConfig');
    /**
     * @param {?} config
     * @return {?}
     */
    function provideAuthConfig(config) {
        return new SchedulerConfig(config);
    }
    var SchedulerModule = (function () {
        function SchedulerModule() {
        }
        /**
         * @param {?=} config
         * @return {?}
         */
        SchedulerModule.forRoot = /**
         * @param {?=} config
         * @return {?}
         */
            function (config) {
                return {
                    ngModule: SchedulerModule,
                    providers: [
                        { provide: SCHEDULER_CONFIG, useValue: config },
                        { provide: SchedulerConfig, useFactory: provideAuthConfig, deps: [SCHEDULER_CONFIG] }
                    ]
                };
            };
        SchedulerModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule,
                            angularCalendar.CalendarModule.forRoot()
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
        return SchedulerModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.SCHEDULER_CONFIG = SCHEDULER_CONFIG;
    exports.provideAuthConfig = provideAuthConfig;
    exports.SchedulerModule = SchedulerModule;
    exports.CalendarSchedulerViewComponent = CalendarSchedulerViewComponent;
    exports.SchedulerDateFormatter = SchedulerDateFormatter;
    exports.SchedulerEventTitleFormatter = SchedulerEventTitleFormatter;
    exports.SchedulerEventTitlePipe = SchedulerEventTitlePipe;
    exports.addPeriod = addPeriod;
    exports.subPeriod = subPeriod;
    exports.startOfPeriod = startOfPeriod;
    exports.endOfPeriod = endOfPeriod;
    exports.ɵb = CalendarSchedulerCellComponent;
    exports.ɵg = CalendarSchedulerEventActionsComponent;
    exports.ɵf = CalendarSchedulerEventContentComponent;
    exports.ɵe = CalendarSchedulerEventTitleComponent;
    exports.ɵd = CalendarSchedulerEventComponent;
    exports.ɵc = CalendarSchedulerHeaderComponent;
    exports.ɵi = SchedulerEventTitleFormatter;
    exports.ɵh = SchedulerEventTitlePipe;
    exports.ɵa = SchedulerConfig;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLXNjaGVkdWxlci9zcmMvYXBwL21vZHVsZXMvc2NoZWR1bGVyL3NjaGVkdWxlci1jb25maWcudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXItc2NoZWR1bGVyL3NyYy9hcHAvbW9kdWxlcy9zY2hlZHVsZXIvY2FsZW5kYXItc2NoZWR1bGVyLXZpZXcuY29tcG9uZW50LnRzIiwibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLXNjaGVkdWxlci9zcmMvYXBwL21vZHVsZXMvc2NoZWR1bGVyL2NhbGVuZGFyLXNjaGVkdWxlci1jZWxsLmNvbXBvbmVudC50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIvc3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9jYWxlbmRhci1zY2hlZHVsZXItaGVhZGVyLmNvbXBvbmVudC50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIvc3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9jYWxlbmRhci1zY2hlZHVsZXItZXZlbnQuY29tcG9uZW50LnRzIiwibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLXNjaGVkdWxlci9zcmMvYXBwL21vZHVsZXMvc2NoZWR1bGVyL2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC10aXRsZS5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItY2FsZW5kYXItc2NoZWR1bGVyL3NyYy9hcHAvbW9kdWxlcy9zY2hlZHVsZXIvY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LWNvbnRlbnQuY29tcG9uZW50LnRzIiwibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLXNjaGVkdWxlci9zcmMvYXBwL21vZHVsZXMvc2NoZWR1bGVyL2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zLmNvbXBvbmVudC50cyIsbnVsbCwibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLXNjaGVkdWxlci9zcmMvYXBwL21vZHVsZXMvc2NoZWR1bGVyL2Zvcm1hdHRlcnMvc2NoZWR1bGVyLWV2ZW50LXRpdGxlLWZvcm1hdHRlci5wcm92aWRlci50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIvc3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9waXBlcy9zY2hlZHVsZXItZXZlbnQtdGl0bGUucGlwZS50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIvc3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9mb3JtYXR0ZXJzL3NjaGVkdWxlci1kYXRlLWZvcm1hdHRlci5wcm92aWRlci50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIvc3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9jYWxlbmRhci11dGlscy50cyIsIm5nOi8vYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIvc3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9zY2hlZHVsZXIubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbi8qKlxyXG4gKiBBdXRoIGNvbmZpZ3VyYXRpb24uXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBTY2hlZHVsZXJDb25maWcge1xyXG4gICAgbG9jYWxlPzogc3RyaW5nID0gJ2VuJztcclxuICAgIGhlYWRlckRhdGVGb3JtYXQ/OiAnd2Vla051bWJlcicgfCAnZGF5c1JhbmdlJyA9ICdkYXlzUmFuZ2UnO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogU2NoZWR1bGVyQ29uZmlnID0ge30pIHtcclxuICAgICAgICBmdW5jdGlvbiB1c2U8VD4oc291cmNlOiBULCBkZWZhdWx0VmFsdWU6IFQpOiBUIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZyAmJiBzb3VyY2UgIT09IHVuZGVmaW5lZCA/IHNvdXJjZSA6IGRlZmF1bHRWYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubG9jYWxlID0gdXNlKGNvbmZpZy5sb2NhbGUsIHRoaXMubG9jYWxlKTtcclxuICAgICAgICB0aGlzLmhlYWRlckRhdGVGb3JtYXQgPSB1c2UoY29uZmlnLmhlYWRlckRhdGVGb3JtYXQsIHRoaXMuaGVhZGVyRGF0ZUZvcm1hdCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtcclxuICAgIENvbXBvbmVudCxcclxuICAgIElucHV0LFxyXG4gICAgT3V0cHV0LFxyXG4gICAgRXZlbnRFbWl0dGVyLFxyXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgICBPbkNoYW5nZXMsXHJcbiAgICBPbkluaXQsXHJcbiAgICBPbkRlc3Ryb3ksXHJcbiAgICBMT0NBTEVfSUQsXHJcbiAgICBJbmplY3QsXHJcbiAgICBUZW1wbGF0ZVJlZixcclxuICAgIFZpZXdFbmNhcHN1bGF0aW9uXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1xyXG4gICAgRXZlbnRDb2xvcixcclxuICAgIERheVZpZXdIb3VyLFxyXG4gICAgRGF5Vmlld0hvdXJTZWdtZW50XHJcbn0gZnJvbSAnY2FsZW5kYXItdXRpbHMnO1xyXG5pbXBvcnQge1xyXG4gICAgc3RhcnRPZk1pbnV0ZSxcclxuICAgIHN0YXJ0T2ZEYXksXHJcbiAgICBzdGFydE9mV2VlayxcclxuICAgIGVuZE9mRGF5LFxyXG4gICAgZW5kT2ZXZWVrLFxyXG4gICAgYWRkTWludXRlcyxcclxuICAgIGFkZEhvdXJzLFxyXG4gICAgYWRkRGF5cyxcclxuICAgIHN1YlNlY29uZHMsXHJcbiAgICBzZXRNaW51dGVzLFxyXG4gICAgc2V0SG91cnMsXHJcbiAgICBzZXREYXRlLFxyXG4gICAgc2V0TW9udGgsXHJcbiAgICBzZXRZZWFyLFxyXG4gICAgaXNTYW1lU2Vjb25kLFxyXG4gICAgaXNTYW1lRGF5LFxyXG4gICAgZ2V0RGF5XHJcbn0gZnJvbSAnZGF0ZS1mbnMnO1xyXG5pbXBvcnQgeyBTY2hlZHVsZXJDb25maWcgfSBmcm9tICcuL3NjaGVkdWxlci1jb25maWcnO1xyXG5cclxuXHJcbmNvbnN0IFdFRUtFTkRfREFZX05VTUJFUlMgPSBbMCwgNl07XHJcbmNvbnN0IERBWVNfSU5fV0VFSyA9IDc7XHJcbmNvbnN0IEhPVVJTX0lOX0RBWSA9IDI0O1xyXG5jb25zdCBNSU5VVEVTX0lOX0hPVVIgPSA2MDtcclxuY29uc3QgU0VDT05EU19JTl9EQVkgPSA2MCAqIDYwICogMjQ7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNjaGVkdWxlclZpZXcge1xyXG4gICAgZGF5czogU2NoZWR1bGVyVmlld0RheVtdO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNjaGVkdWxlclZpZXdEYXkge1xyXG4gICAgZGF0ZTogRGF0ZTtcclxuICAgIGlzUGFzdDogYm9vbGVhbjtcclxuICAgIGlzVG9kYXk6IGJvb2xlYW47XHJcbiAgICBpc0Z1dHVyZTogYm9vbGVhbjtcclxuICAgIGlzV2Vla2VuZDogYm9vbGVhbjtcclxuICAgIGluTW9udGg6IGJvb2xlYW47XHJcbiAgICBkcmFnT3ZlcjogYm9vbGVhbjtcclxuICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAgIGNzc0NsYXNzPzogc3RyaW5nO1xyXG4gICAgaG91cnM6IFNjaGVkdWxlclZpZXdIb3VyW107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2NoZWR1bGVyVmlld0hvdXIge1xyXG4gICAgaG91cjogRGF5Vmlld0hvdXI7XHJcbiAgICBkYXRlOiBEYXRlO1xyXG4gICAgc2VnbWVudHM6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudFtdO1xyXG4gICAgaXNQYXN0OiBib29sZWFuO1xyXG4gICAgaXNGdXR1cmU6IGJvb2xlYW47XHJcbiAgICBoYXNCb3JkZXI6IGJvb2xlYW47XHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XHJcbiAgICBjc3NDbGFzcz86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQge1xyXG4gICAgc2VnbWVudDogRGF5Vmlld0hvdXJTZWdtZW50O1xyXG4gICAgZGF0ZTogRGF0ZTtcclxuICAgIGV2ZW50czogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudFtdO1xyXG4gICAgaXNQYXN0OiBib29sZWFuO1xyXG4gICAgaXNGdXR1cmU6IGJvb2xlYW47XHJcbiAgICBpc0Rpc2FibGVkOiBib29sZWFuO1xyXG4gICAgaGFzQm9yZGVyOiBib29sZWFuO1xyXG4gICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG4gICAgY3NzQ2xhc3M/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgc3RhcnQ6IERhdGU7XHJcbiAgICBlbmQ/OiBEYXRlO1xyXG4gICAgdGl0bGU6IHN0cmluZztcclxuICAgIGNvbnRlbnQ/OiBzdHJpbmc7XHJcbiAgICBjb2xvcjogRXZlbnRDb2xvcjtcclxuICAgIGFjdGlvbnM/OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50QWN0aW9uW107XHJcbiAgICBzdGF0dXM/OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50U3RhdHVzO1xyXG4gICAgY3NzQ2xhc3M/OiBzdHJpbmc7XHJcbiAgICBzdGFydHNCZWZvcmVTZWdtZW50PzogYm9vbGVhbjtcclxuICAgIGVuZHNBZnRlclNlZ21lbnQ/OiBib29sZWFuO1xyXG4gICAgaXNIb3ZlcmVkPzogYm9vbGVhbjtcclxuICAgIGlzRGlzYWJsZWQ/OiBib29sZWFuO1xyXG4gICAgaXNDbGlja2FibGU/OiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBDYWxlbmRhclNjaGVkdWxlckV2ZW50U3RhdHVzID0gJ29rJyB8ICd3YXJuaW5nJyB8ICdkYW5nZXInO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDYWxlbmRhclNjaGVkdWxlckV2ZW50QWN0aW9uIHtcclxuICAgIHdoZW4/OiAnZW5hYmxlZCcgfCAnZGlzYWJsZWQnO1xyXG4gICAgbGFiZWw6IHN0cmluZztcclxuICAgIHRpdGxlOiBzdHJpbmc7XHJcbiAgICBjc3NDbGFzcz86IHN0cmluZztcclxuICAgIG9uQ2xpY2soZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpOiB2b2lkO1xyXG59XHJcblxyXG4gLy8gaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9zbmlwcGV0cy9jc3MvYS1ndWlkZS10by1mbGV4Ym94L1xyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnY2FsZW5kYXItc2NoZWR1bGVyLXZpZXcnLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXNjaGVkdWxlci12aWV3XCIgI3dlZWtWaWV3Q29udGFpbmVyPlxyXG4gICAgICAgICAgICA8Y2FsZW5kYXItc2NoZWR1bGVyLWhlYWRlclxyXG4gICAgICAgICAgICAgICAgW2RheXNdPVwiaGVhZGVyRGF5c1wiXHJcbiAgICAgICAgICAgICAgICBbbG9jYWxlXT1cImxvY2FsZVwiXHJcbiAgICAgICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiaGVhZGVyVGVtcGxhdGVcIlxyXG4gICAgICAgICAgICAgICAgKGRheUNsaWNrZWQpPVwiZGF5Q2xpY2tlZC5lbWl0KCRldmVudClcIj5cclxuICAgICAgICAgICAgPC9jYWxlbmRhci1zY2hlZHVsZXItaGVhZGVyPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhbC1zY2hlZHVsZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLWhvdXItcm93cyBhc2lkZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLWhvdXIgYWxpZ24tY2VudGVyIGhvcml6b250YWxcIiAqbmdGb3I9XCJsZXQgaG91ciBvZiBob3Vyc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhbC1zY2hlZHVsZXItdGltZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXNjaGVkdWxlci1ob3VyLXNlZ21lbnRcIiAqbmdGb3I9XCJsZXQgc2VnbWVudCBvZiBob3VyLnNlZ21lbnRzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7eyBzZWdtZW50LmRhdGUgfCBjYWxlbmRhckRhdGU6J2RheVZpZXdIb3VyJzpsb2NhbGUgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLWNvbHMgYXNpZGVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXNjaGVkdWxlci1jb2xcIiAqbmdGb3I9XCJsZXQgZGF5IG9mIHZpZXcuZGF5c1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y2FsZW5kYXItc2NoZWR1bGVyLWNlbGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICpuZ0Zvcj1cImxldCBob3VyIG9mIGRheS5ob3Vyc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJkYXk/LmNzc0NsYXNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkYXldPVwiZGF5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtob3VyXT1cImhvdXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2xvY2FsZV09XCJsb2NhbGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3Rvb2x0aXBQbGFjZW1lbnRdPVwidG9vbHRpcFBsYWNlbWVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc2hvd0FjdGlvbnNdPVwic2hvd0FjdGlvbnNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cImNlbGxUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZXZlbnRUZW1wbGF0ZV09XCJldmVudFRlbXBsYXRlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJkYXlDbGlja2VkLmVtaXQoe2RhdGU6IGRheX0pXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChoaWdobGlnaHRTZWdtZW50KT1cInRvZ2dsZVNlZ21lbnRIaWdobGlnaHQoJGV2ZW50LmV2ZW50LCB0cnVlKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodW5oaWdobGlnaHRTZWdtZW50KT1cInRvZ2dsZVNlZ21lbnRIaWdobGlnaHQoJGV2ZW50LmV2ZW50LCBmYWxzZSlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNlZ21lbnRDbGlja2VkKT1cInNlZ21lbnRDbGlja2VkLmVtaXQoe3NlZ21lbnQ6ICRldmVudC5zZWdtZW50fSlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGV2ZW50Q2xpY2tlZCk9XCJldmVudENsaWNrZWQuZW1pdCh7ZXZlbnQ6ICRldmVudC5ldmVudH0pXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvY2FsZW5kYXItc2NoZWR1bGVyLWNlbGw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICBgLFxyXG4gICAgc3R5bGVzOiBbYC5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXItaGVhZGVyc3tkaXNwbGF5OmZsZXg7ZmxleC1mbG93OnJvdyB3cmFwO21hcmdpbi1ib3R0b206M3B4O2JvcmRlcjoxcHggc29saWQgI2UxZTFlMX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyLWhlYWRlcnMgLmFzaWRle2ZsZXg6MSAwfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXItaGVhZGVycyAuYXNpZGUuY2FsLWhlYWRlci1jbG9ja3ttYXgtd2lkdGg6NWVtfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXItaGVhZGVycyAuY2FsLWhlYWRlcntmbGV4OjE7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzo1cHg7b3ZlcmZsb3c6aGlkZGVuO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7d2hpdGUtc3BhY2U6bm93cmFwfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXItaGVhZGVycyAuY2FsLWhlYWRlcjpub3QoOmxhc3QtY2hpbGQpe2JvcmRlci1yaWdodDoxcHggc29saWQgI2UxZTFlMX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyLWhlYWRlcnMgLmNhbC1oZWFkZXI6aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojZWRlZGVkfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXItaGVhZGVycyAuY2FsLWhlYWRlci5jYWwtdG9kYXl7YmFja2dyb3VuZC1jb2xvcjojZThmZGU3fS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXItaGVhZGVycyAuY2FsLWhlYWRlci5jYWwtd2Vla2VuZCBzcGFue2NvbG9yOiM4YjAwMDB9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlci1oZWFkZXJzIC5jYWwtaGVhZGVyIHNwYW57Zm9udC13ZWlnaHQ6NDAwO29wYWNpdHk6LjV9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciwuY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyLWhlYWRlcnMgLmNhbC1oZWFkZXItY29sc3tkaXNwbGF5OmZsZXg7ZmxleC1mbG93OnJvdyB3cmFwfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmFzaWRle2ZsZXg6MSAwfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmFzaWRlLmNhbC1zY2hlZHVsZXItaG91ci1yb3dze21heC13aWR0aDo1ZW19LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1ob3VyLXJvd3N7d2lkdGg6YXV0byFpbXBvcnRhbnQ7Ym9yZGVyOjFweCBzb2xpZCAjZTFlMWUxO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjpyZWxhdGl2ZX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWhvdXItcm93cyAuY2FsLXNjaGVkdWxlci1ob3Vye2Rpc3BsYXk6ZmxleDtoZWlnaHQ6Ny4yNWVtfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItaG91ci1yb3dzIC5jYWwtc2NoZWR1bGVyLWhvdXI6bnRoLWNoaWxkKG9kZCl7YmFja2dyb3VuZC1jb2xvcjojZmFmYWZhfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItaG91ci1yb3dzIC5jYWwtc2NoZWR1bGVyLWhvdXI6bm90KDpsYXN0LWNoaWxkKXtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZTFlMWUxfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItaG91ci1yb3dzIC5jYWwtc2NoZWR1bGVyLWhvdXIgLmNhbC1zY2hlZHVsZXItdGltZXtkaXNwbGF5OmZsZXg7ZmxleC1mbG93OmNvbHVtbiB3cmFwO3dpZHRoOjEwMCU7Zm9udC13ZWlnaHQ6NzAwO3RleHQtYWxpZ246Y2VudGVyfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItaG91ci1yb3dzIC5jYWwtc2NoZWR1bGVyLWhvdXIgLmNhbC1zY2hlZHVsZXItdGltZSAuY2FsLXNjaGVkdWxlci1ob3VyLXNlZ21lbnR7ZmxleDoxIDB9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1ob3VyLXJvd3MgLmNhbC1zY2hlZHVsZXItaG91ciAuY2FsLXNjaGVkdWxlci10aW1lIC5jYWwtc2NoZWR1bGVyLWhvdXItc2VnbWVudDpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOiNlZGVkZWR9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1ob3VyLXJvd3MgLmNhbC1zY2hlZHVsZXItaG91ciAuY2FsLXNjaGVkdWxlci10aW1lIC5jYWwtc2NoZWR1bGVyLWhvdXItc2VnbWVudDpub3QoOmxhc3QtY2hpbGQpe2JvcmRlci1ib3R0b206dGhpbiBkYXNoZWQgI2UxZTFlMX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHN7ZGlzcGxheTpmbGV4O2ZsZXgtZmxvdzpyb3cgd3JhcDtib3JkZXItdG9wOjFweCBzb2xpZCAjZTFlMWUxfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2x7ZGlzcGxheTpmbGV4O2ZsZXgtZmxvdzpjb2x1bW4gd3JhcDtmbGV4OjEgMDtib3JkZXItcmlnaHQ6MXB4IHNvbGlkICNlMWUxZTF9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxse2Rpc3BsYXk6ZmxleDtmbGV4LWZsb3c6Y29sdW1uIHdyYXA7ZmxleDoxIDB9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsLmNhbC10b2RheXtiYWNrZ3JvdW5kLWNvbG9yOiNlOGZkZTd9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsLmNhbC1kaXNhYmxlZHtiYWNrZ3JvdW5kLWNvbG9yOiNlZWU7cG9pbnRlci1ldmVudHM6bm9uZX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwuY2FsLWRpc2FibGVkIC5jYWwtc2NoZWR1bGVyLWV2ZW50c3tmaWx0ZXI6b3BhY2l0eSg1MCUpOy13ZWJraXQtZmlsdGVyOm9wYWNpdHkoNTAlKX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHN7ZGlzcGxheTpmbGV4O2ZsZXgtZmxvdzpjb2x1bW4gd3JhcDtmbGV4OjEgMDtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZTFlMWUxfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cy5uby1ib3JkZXJ7Ym9yZGVyLWJvdHRvbTowIWltcG9ydGFudH0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMuY2FsLWRpc2FibGVke2JhY2tncm91bmQtY29sb3I6I2VlZTtwb2ludGVyLWV2ZW50czpub25lfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cy5jYWwtZGlzYWJsZWQgLmNhbC1zY2hlZHVsZXItZXZlbnR7ZmlsdGVyOm9wYWNpdHkoNTAlKTstd2Via2l0LWZpbHRlcjpvcGFjaXR5KDUwJSl9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnRzIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnR7ZmxleDoxIDA7ZGlzcGxheTpmbGV4O2ZsZXgtZmxvdzpjb2x1bW4gd3JhcH0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudDpub3QoLmhhcy1ldmVudHMpOmhvdmVye2JhY2tncm91bmQtY29sb3I6I2VkZWRlZH0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudDpub3QoOmxhc3QtY2hpbGQpe2JvcmRlci1ib3R0b206dGhpbiBkYXNoZWQgI2UxZTFlMX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudC5uby1ib3JkZXJ7Ym9yZGVyLWJvdHRvbTowIWltcG9ydGFudH0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudC5jYWwtZGlzYWJsZWR7YmFja2dyb3VuZC1jb2xvcjojZWVlO3BvaW50ZXItZXZlbnRzOm5vbmV9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnRzIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnQgLmNhbC1zY2hlZHVsZXItZXZlbnRzLC5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cyAuY2FsLXNjaGVkdWxlci1zZWdtZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50cyAuY2FsLXNjaGVkdWxlci1ldmVudC1jb250YWluZXJ7ZmxleDoxIDA7ZGlzcGxheTpmbGV4O2ZsZXgtZmxvdzpjb2x1bW4gd3JhcH0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudCAuY2FsLXNjaGVkdWxlci1ldmVudHMgLmNhbC1zY2hlZHVsZXItZXZlbnQtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50e2ZsZXg6MSAwO2Rpc3BsYXk6ZmxleDtmbGV4LWZsb3c6cm93IHdyYXA7cGFkZGluZzowIDEwcHg7Zm9udC1zaXplOjEycHg7bWFyZ2luOjAgMnB4O2xpbmUtaGVpZ2h0OjMwcHg7b3ZlcmZsb3c6aGlkZGVuO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7d2hpdGUtc3BhY2U6bm93cmFwO3RyYW5zaXRpb246YWxsIGVhc2Utb3V0IC4ycztmaWx0ZXI6YnJpZ2h0bmVzcygxMDAlKTstd2Via2l0LWZpbHRlcjpicmlnaHRuZXNzKDEwMCUpOy13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eTpoaWRkZW59LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnRzIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnQgLmNhbC1zY2hlZHVsZXItZXZlbnRzIC5jYWwtc2NoZWR1bGVyLWV2ZW50LWNvbnRhaW5lciAuY2FsLXNjaGVkdWxlci1ldmVudC5jYWwtc3RhcnRzLXdpdGhpbi1zZWdtZW50e2JvcmRlci10b3AtbGVmdC1yYWRpdXM6LjNlbTtib3JkZXItdG9wLXJpZ2h0LXJhZGl1czouM2VtO21hcmdpbi10b3A6MnB4fS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cyAuY2FsLXNjaGVkdWxlci1zZWdtZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50cyAuY2FsLXNjaGVkdWxlci1ldmVudC1jb250YWluZXIgLmNhbC1zY2hlZHVsZXItZXZlbnQuY2FsLWVuZHMtd2l0aGluLXNlZ21lbnR7Ym9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czouM2VtO2JvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOi4zZW07bWFyZ2luLWJvdHRvbToycHh9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnRzIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnQgLmNhbC1zY2hlZHVsZXItZXZlbnRzIC5jYWwtc2NoZWR1bGVyLWV2ZW50LWNvbnRhaW5lciAuY2FsLXNjaGVkdWxlci1ldmVudC5jYWwtZGlzYWJsZWR7YmFja2dyb3VuZC1jb2xvcjpncmF5IWltcG9ydGFudDtmaWx0ZXI6Z3JheXNjYWxlKDEwMCUpOy13ZWJraXQtZmlsdGVyOmdyYXlzY2FsZSgxMDAlKX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudCAuY2FsLXNjaGVkdWxlci1ldmVudHMgLmNhbC1zY2hlZHVsZXItZXZlbnQtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50LmNhbC1ub3QtY2xpY2thYmxle2N1cnNvcjpub3QtYWxsb3dlZCFpbXBvcnRhbnR9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnRzIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnQgLmNhbC1zY2hlZHVsZXItZXZlbnRzIC5jYWwtc2NoZWR1bGVyLWV2ZW50LWNvbnRhaW5lciAuY2FsLXNjaGVkdWxlci1ldmVudDpub3QoLmNhbC1kaXNhYmxlZCkuaG92ZXJlZCwuY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudCAuY2FsLXNjaGVkdWxlci1ldmVudHMgLmNhbC1zY2hlZHVsZXItZXZlbnQtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50Om5vdCguY2FsLWRpc2FibGVkKTpob3ZlcntjdXJzb3I6cG9pbnRlcjtmaWx0ZXI6YnJpZ2h0bmVzcyg4MCUpOy13ZWJraXQtZmlsdGVyOmJyaWdodG5lc3MoODAlKX0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudCAuY2FsLXNjaGVkdWxlci1ldmVudHMgLmNhbC1zY2hlZHVsZXItZXZlbnQtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50LXRpdGxlLWNvbnRhaW5lcntwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDoxMDAlfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cyAuY2FsLXNjaGVkdWxlci1zZWdtZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50cyAuY2FsLXNjaGVkdWxlci1ldmVudC1jb250YWluZXIgLmNhbC1zY2hlZHVsZXItZXZlbnQgLmNhbC1zY2hlZHVsZXItZXZlbnQtdGl0bGUtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50LXRpdGxle2ZvbnQtc2l6ZToxNnB4O2ZvbnQtd2VpZ2h0OjcwMH0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudCAuY2FsLXNjaGVkdWxlci1ldmVudHMgLmNhbC1zY2hlZHVsZXItZXZlbnQtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50LXRpdGxlLWNvbnRhaW5lciAuY2FsLXNjaGVkdWxlci1ldmVudC1zdGF0dXN7cG9zaXRpb246YWJzb2x1dGU7dG9wOjI1JTtyaWdodDoxJTt3aWR0aDoxNnB4O2hlaWdodDoxNnB4O2JhY2tncm91bmQ6Z3JleTtib3JkZXItcmFkaXVzOjUwcHg7Ym9yZGVyOjFweCBzb2xpZCAjMDAwfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cyAuY2FsLXNjaGVkdWxlci1zZWdtZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50cyAuY2FsLXNjaGVkdWxlci1ldmVudC1jb250YWluZXIgLmNhbC1zY2hlZHVsZXItZXZlbnQgLmNhbC1zY2hlZHVsZXItZXZlbnQtdGl0bGUtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50LXN0YXR1cy5va3tiYWNrZ3JvdW5kOmdyZWVufS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cyAuY2FsLXNjaGVkdWxlci1zZWdtZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50cyAuY2FsLXNjaGVkdWxlci1ldmVudC1jb250YWluZXIgLmNhbC1zY2hlZHVsZXItZXZlbnQgLmNhbC1zY2hlZHVsZXItZXZlbnQtdGl0bGUtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50LXN0YXR1cy53YXJuaW5ne2JhY2tncm91bmQ6b3JhbmdlfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cyAuY2FsLXNjaGVkdWxlci1zZWdtZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50cyAuY2FsLXNjaGVkdWxlci1ldmVudC1jb250YWluZXIgLmNhbC1zY2hlZHVsZXItZXZlbnQgLmNhbC1zY2hlZHVsZXItZXZlbnQtdGl0bGUtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50LXN0YXR1cy5kYW5nZXJ7YmFja2dyb3VuZDpyZWR9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnRzIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnQgLmNhbC1zY2hlZHVsZXItZXZlbnRzIC5jYWwtc2NoZWR1bGVyLWV2ZW50LWNvbnRhaW5lciAuY2FsLXNjaGVkdWxlci1ldmVudCAuY2FsLXNjaGVkdWxlci1ldmVudC1jb250ZW50LWNvbnRhaW5lcnt3aWR0aDoxMDAlfS5jYWwtc2NoZWR1bGVyLXZpZXcgLmNhbC1zY2hlZHVsZXIgLmNhbC1zY2hlZHVsZXItY29scyAuY2FsLXNjaGVkdWxlci1jb2wgLmNhbC1zY2hlZHVsZXItY2VsbCAuY2FsLXNjaGVkdWxlci1zZWdtZW50cyAuY2FsLXNjaGVkdWxlci1zZWdtZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50cyAuY2FsLXNjaGVkdWxlci1ldmVudC1jb250YWluZXIgLmNhbC1zY2hlZHVsZXItZXZlbnQgLmNhbC1zY2hlZHVsZXItZXZlbnQtYWN0aW9ucy1jb250YWluZXJ7ZmxleDoxIDA7cG9zaXRpb246cmVsYXRpdmV9LmNhbC1zY2hlZHVsZXItdmlldyAuY2FsLXNjaGVkdWxlciAuY2FsLXNjaGVkdWxlci1jb2xzIC5jYWwtc2NoZWR1bGVyLWNvbCAuY2FsLXNjaGVkdWxlci1jZWxsIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnRzIC5jYWwtc2NoZWR1bGVyLXNlZ21lbnQgLmNhbC1zY2hlZHVsZXItZXZlbnRzIC5jYWwtc2NoZWR1bGVyLWV2ZW50LWNvbnRhaW5lciAuY2FsLXNjaGVkdWxlci1ldmVudCAuY2FsLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zLWNvbnRhaW5lciAuY2FsLXNjaGVkdWxlci1ldmVudC1hY3Rpb25ze3Bvc2l0aW9uOmFic29sdXRlO2JvdHRvbTo1cHg7cmlnaHQ6MH0uY2FsLXNjaGVkdWxlci12aWV3IC5jYWwtc2NoZWR1bGVyIC5jYWwtc2NoZWR1bGVyLWNvbHMgLmNhbC1zY2hlZHVsZXItY29sIC5jYWwtc2NoZWR1bGVyLWNlbGwgLmNhbC1zY2hlZHVsZXItc2VnbWVudHMgLmNhbC1zY2hlZHVsZXItc2VnbWVudCAuY2FsLXNjaGVkdWxlci1ldmVudHMgLmNhbC1zY2hlZHVsZXItZXZlbnQtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50IC5jYWwtc2NoZWR1bGVyLWV2ZW50LWFjdGlvbnMtY29udGFpbmVyIC5jYWwtc2NoZWR1bGVyLWV2ZW50LWFjdGlvbnMgLmNhbC1zY2hlZHVsZXItZXZlbnQtYWN0aW9ue3RleHQtZGVjb3JhdGlvbjpub25lfWBdLFxyXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJTY2hlZHVsZXJWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIE9uRGVzdHJveSB7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBjdXJyZW50IHZpZXcgZGF0ZVxyXG4gICAgICovXHJcbiAgICBASW5wdXQoKSB2aWV3RGF0ZTogRGF0ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFuIGFycmF5IG9mIGV2ZW50cyB0byBkaXNwbGF5IG9uIHZpZXdcclxuICAgICAqL1xyXG4gICAgQElucHV0KCkgZXZlbnRzOiBDYWxlbmRhclNjaGVkdWxlckV2ZW50W10gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBudW1iZXIgb2Ygc2VnbWVudHMgaW4gYW4gaG91ci4gTXVzdCBiZSA8PSA2XHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIGhvdXJTZWdtZW50czogbnVtYmVyID0gMjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFuIGFycmF5IG9mIGRheSBpbmRleGVzICgwID0gc3VuZGF5LCAxID0gbW9uZGF5IGV0YykgdGhhdCB3aWxsIGJlIGhpZGRlbiBvbiB0aGUgdmlld1xyXG4gICAgICovXHJcbiAgICBASW5wdXQoKSBleGNsdWRlRGF5czogbnVtYmVyW10gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNwZWNpZnkgaWYgdGhlIGZpcnN0IGRheSBvZiBjdXJyZW50IHNjaGVkdWxlciB2aWV3IGhhcyB0byBiZSB0b2RheSBvciB0aGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrXHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIHN0YXJ0c1dpdGhUb2RheTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3BlY2lmeSBpZiBhY3Rpb25zIG11c3QgYmUgc2hvd24gb3Igbm90XHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIHNob3dBY3Rpb25zOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgZWFjaCBjZWxsIGlzIHJlbmRlcmVkLiBUaGUgZmlyc3QgYXJndW1lbnQgd2lsbCBjb250YWluIHRoZSBjYWxlbmRhciAoZGF5LCBob3VyIG9yIHNlZ21lbnQpIGNlbGwuXHJcbiAgICAgKiBJZiB5b3UgYWRkIHRoZSBgY3NzQ2xhc3NgIHByb3BlcnR5IHRvIHRoZSBjZWxsIGl0IHdpbGwgYWRkIHRoYXQgY2xhc3MgdG8gdGhlIGNlbGwgaW4gdGhlIHRlbXBsYXRlXHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIGRheU1vZGlmaWVyOiBGdW5jdGlvbjtcclxuICAgIEBJbnB1dCgpIGhvdXJNb2RpZmllcjogRnVuY3Rpb247XHJcbiAgICBASW5wdXQoKSBzZWdtZW50TW9kaWZpZXI6IEZ1bmN0aW9uO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW4gb2JzZXJ2YWJsZSB0aGF0IHdoZW4gZW1pdHRlZCBvbiB3aWxsIHJlLXJlbmRlciB0aGUgY3VycmVudCB2aWV3XHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIHJlZnJlc2g6IFN1YmplY3Q8YW55PjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBsb2NhbGUgdXNlZCB0byBmb3JtYXQgZGF0ZXNcclxuICAgICAqL1xyXG4gICAgQElucHV0KCkgbG9jYWxlOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgcGxhY2VtZW50IG9mIHRoZSBldmVudCB0b29sdGlwXHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIHRvb2x0aXBQbGFjZW1lbnQ6IHN0cmluZyA9ICdib3R0b20nO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIHN0YXJ0IG51bWJlciBvZiB0aGUgd2Vla1xyXG4gICAgICovXHJcbiAgICBASW5wdXQoKSB3ZWVrU3RhcnRzT246IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSB0byByZXBsYWNlIHRoZSBoZWFkZXJcclxuICAgICAqL1xyXG4gICAgQElucHV0KCkgaGVhZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgdG8gcmVwbGFjZSB0aGUgZGF5IGNlbGxcclxuICAgICAqL1xyXG4gICAgQElucHV0KCkgY2VsbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQSBjdXN0b20gdGVtcGxhdGUgdG8gdXNlIGZvciB3ZWVrIHZpZXcgZXZlbnRzXHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIGV2ZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgcHJlY2lzaW9uIHRvIGRpc3BsYXkgZXZlbnRzLlxyXG4gICAgICogYGRheXNgIHdpbGwgcm91bmQgZXZlbnQgc3RhcnQgYW5kIGVuZCBkYXRlcyB0byB0aGUgbmVhcmVzdCBkYXkgYW5kIGBtaW51dGVzYCB3aWxsIG5vdCBkbyB0aGlzIHJvdW5kaW5nXHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIHByZWNpc2lvbjogJ2RheXMnIHwgJ21pbnV0ZXMnID0gJ2RheXMnO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGRheSBzdGFydCBob3VycyBpbiAyNCBob3VyIHRpbWUuIE11c3QgYmUgMC0yM1xyXG4gICAgICovXHJcbiAgICBASW5wdXQoKSBkYXlTdGFydEhvdXI6IG51bWJlciA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGF5IHN0YXJ0IG1pbnV0ZXMuIE11c3QgYmUgMC01OVxyXG4gICAgICovXHJcbiAgICBASW5wdXQoKSBkYXlTdGFydE1pbnV0ZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkYXkgZW5kIGhvdXJzIGluIDI0IGhvdXIgdGltZS4gTXVzdCBiZSAwLTIzXHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIGRheUVuZEhvdXI6IG51bWJlciA9IDIzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGRheSBlbmQgbWludXRlcy4gTXVzdCBiZSAwLTU5XHJcbiAgICAgKi9cclxuICAgIEBJbnB1dCgpIGRheUVuZE1pbnV0ZTogbnVtYmVyID0gNTk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsZWQgd2hlbiBhIGhlYWRlciB3ZWVrIGRheSBpcyBjbGlja2VkXHJcbiAgICAgKi9cclxuICAgIEBPdXRwdXQoKSBkYXlDbGlja2VkOiBFdmVudEVtaXR0ZXI8eyBkYXRlOiBEYXRlIH0+ID0gbmV3IEV2ZW50RW1pdHRlcjx7IGRhdGU6IERhdGUgfT4oKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBzZWdtZW50IGlzIGNsaWNrZWRcclxuICAgICAqL1xyXG4gICAgQE91dHB1dCgpIHNlZ21lbnRDbGlja2VkOiBFdmVudEVtaXR0ZXI8eyBzZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQgfT4gPSBuZXcgRXZlbnRFbWl0dGVyPHsgc2VnbWVudDogU2NoZWR1bGVyVmlld0hvdXJTZWdtZW50IH0+KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgZXZlbnQgaXMgY2xpY2tlZFxyXG4gICAgICovXHJcbiAgICBAT3V0cHV0KCkgZXZlbnRDbGlja2VkOiBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB9PiA9IG5ldyBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB9PigpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGhpZGRlblxyXG4gICAgICovXHJcbiAgICBkYXlzOiBTY2hlZHVsZXJWaWV3RGF5W107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaGlkZGVuXHJcbiAgICAgKi9cclxuICAgIGhlYWRlckRheXM6IFNjaGVkdWxlclZpZXdEYXlbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBoaWRkZW5cclxuICAgICAqL1xyXG4gICAgdmlldzogU2NoZWR1bGVyVmlldztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBoaWRkZW5cclxuICAgICAqL1xyXG4gICAgcmVmcmVzaFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGhpZGRlblxyXG4gICAgICovXHJcbiAgICBob3VyczogRGF5Vmlld0hvdXJbXSA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGhpZGRlblxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsIEBJbmplY3QoTE9DQUxFX0lEKSBsb2NhbGU6IHN0cmluZywgcHJpdmF0ZSBjb25maWc6IFNjaGVkdWxlckNvbmZpZykge1xyXG4gICAgICAgIHRoaXMubG9jYWxlID0gY29uZmlnLmxvY2FsZSB8fCBsb2NhbGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaGlkZGVuXHJcbiAgICAgKi9cclxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLnJlZnJlc2gpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoU3Vic2NyaXB0aW9uID0gdGhpcy5yZWZyZXNoLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2hBbGwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaGlkZGVuXHJcbiAgICAgKi9cclxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaG91cnMgPSB0aGlzLmdldFNjaGVkdWxlclZpZXdIb3VyR3JpZCh7XHJcbiAgICAgICAgICAgIHZpZXdEYXRlOiB0aGlzLnZpZXdEYXRlLFxyXG4gICAgICAgICAgICBob3VyU2VnbWVudHM6IHRoaXMuaG91clNlZ21lbnRzLFxyXG4gICAgICAgICAgICBkYXlTdGFydDoge1xyXG4gICAgICAgICAgICAgICAgaG91cjogdGhpcy5kYXlTdGFydEhvdXIsXHJcbiAgICAgICAgICAgICAgICBtaW51dGU6IHRoaXMuZGF5U3RhcnRNaW51dGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF5RW5kOiB7XHJcbiAgICAgICAgICAgICAgICBob3VyOiB0aGlzLmRheUVuZEhvdXIsXHJcbiAgICAgICAgICAgICAgICBtaW51dGU6IHRoaXMuZGF5RW5kTWludXRlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGNoYW5nZXMudmlld0RhdGUgfHwgY2hhbmdlcy5leGNsdWRlRGF5cykge1xyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hIZWFkZXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjaGFuZ2VzLmV2ZW50cyB8fCBjaGFuZ2VzLnZpZXdEYXRlIHx8IGNoYW5nZXMuZXhjbHVkZURheXMgfHwgY2hhbmdlcy5kYXlTdGFydEhvdXIgfHwgY2hhbmdlcy5kYXlFbmRIb3VyIHx8IGNoYW5nZXMuZGF5U3RhcnRNaW51dGUgfHwgY2hhbmdlcy5kYXlFbmRNaW51dGUpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoQm9keSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBoaWRkZW5cclxuICAgICAqL1xyXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVmcmVzaFN1YnNjcmlwdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaGlkZGVuXHJcbiAgICAgKi9cclxuICAgIHRvZ2dsZVNlZ21lbnRIaWdobGlnaHQoZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQsIGlzSGlnaGxpZ2h0ZWQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRheXMuZm9yRWFjaCgoZGF5OiBTY2hlZHVsZXJWaWV3RGF5KSA9PiB7XHJcbiAgICAgICAgICAgIGRheS5ob3Vycy5mb3JFYWNoKChob3VyOiBTY2hlZHVsZXJWaWV3SG91cikgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gaG91ci5zZWdtZW50cy5mb3JFYWNoKChzZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vICAgIGlmIChpc0hpZ2hsaWdodGVkICYmIHNlZ21lbnQuZXZlbnRzLmluZGV4T2YoZXZlbnQpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICBzZWdtZW50LmJhY2tncm91bmRDb2xvciA9IGV2ZW50LmNvbG9yLnNlY29uZGFyeTtcclxuICAgICAgICAgICAgICAgIC8vICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgZGVsZXRlIHNlZ21lbnQuYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgICAgICAgICBob3VyLnNlZ21lbnRzLmZpbHRlcigoc2VnbWVudDogU2NoZWR1bGVyVmlld0hvdXJTZWdtZW50KSA9PiBzZWdtZW50LmV2ZW50cy5zb21lKChldjogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCkgPT4gZXYuaWQgPT09IGV2ZW50LmlkICYmIGV2LnN0YXJ0LmdldERheSgpID09PSBldmVudC5zdGFydC5nZXREYXkoKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50LmV2ZW50cy5maWx0ZXIoKGV2OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50KSA9PiBldi5pZCA9PT0gZXZlbnQuaWQgJiYgZXYuc3RhcnQuZ2V0RGF5KCkgPT09IGV2ZW50LnN0YXJ0LmdldERheSgpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKGU6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNIaWdobGlnaHRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50LmJhY2tncm91bmRDb2xvciA9IGUuY29sb3Iuc2Vjb25kYXJ5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzZWdtZW50LmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVmcmVzaEhlYWRlcigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmhlYWRlckRheXMgPSB0aGlzLmdldFNjaGVkdWxlclZpZXdEYXlzKHtcclxuICAgICAgICAgICAgdmlld0RhdGU6IHRoaXMudmlld0RhdGUsXHJcbiAgICAgICAgICAgIHdlZWtTdGFydHNPbjogdGhpcy53ZWVrU3RhcnRzT24sXHJcbiAgICAgICAgICAgIHN0YXJ0c1dpdGhUb2RheTogdGhpcy5zdGFydHNXaXRoVG9kYXksXHJcbiAgICAgICAgICAgIGV4Y2x1ZGVkOiB0aGlzLmV4Y2x1ZGVEYXlzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWZyZXNoQm9keSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnZpZXcgPSB0aGlzLmdldFNjaGVkdWxlclZpZXcoe1xyXG4gICAgICAgICAgICBldmVudHM6IHRoaXMuZXZlbnRzLFxyXG4gICAgICAgICAgICB2aWV3RGF0ZTogdGhpcy52aWV3RGF0ZSxcclxuICAgICAgICAgICAgd2Vla1N0YXJ0c09uOiB0aGlzLndlZWtTdGFydHNPbixcclxuICAgICAgICAgICAgc3RhcnRzV2l0aFRvZGF5OiB0aGlzLnN0YXJ0c1dpdGhUb2RheSxcclxuICAgICAgICAgICAgZXhjbHVkZWQ6IHRoaXMuZXhjbHVkZURheXNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF5TW9kaWZpZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXlzLmZvckVhY2goZGF5ID0+IHRoaXMuZGF5TW9kaWZpZXIoZGF5KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXlNb2RpZmllciB8fCB0aGlzLmhvdXJNb2RpZmllciB8fCB0aGlzLnNlZ21lbnRNb2RpZmllcikge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXcuZGF5cy5mb3JFYWNoKGRheSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXlNb2RpZmllcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF5TW9kaWZpZXIoZGF5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRheS5ob3Vycy5mb3JFYWNoKChob3VyOiBTY2hlZHVsZXJWaWV3SG91cikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhvdXJNb2RpZmllcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdXJNb2RpZmllcihob3VyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaG91ci5zZWdtZW50cy5mb3JFYWNoKChzZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VnbWVudE1vZGlmaWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlZ21lbnRNb2RpZmllcihzZWdtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlZnJlc2hBbGwoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoSGVhZGVyKCk7XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoQm9keSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIGdldFNjaGVkdWxlclZpZXcoYXJnczogR2V0U2NoZWR1bGVyVmlld0FyZ3MpOiBTY2hlZHVsZXJWaWV3IHtcclxuICAgICAgICBsZXQgZXZlbnRzOiBDYWxlbmRhclNjaGVkdWxlckV2ZW50W10gPSBhcmdzLmV2ZW50cyB8fCBbXTtcclxuICAgICAgICBjb25zdCB2aWV3RGF0ZTogRGF0ZSA9IGFyZ3Mudmlld0RhdGU7XHJcbiAgICAgICAgY29uc3Qgd2Vla1N0YXJ0c09uOiBudW1iZXIgPSBhcmdzLndlZWtTdGFydHNPbjtcclxuICAgICAgICBjb25zdCBzdGFydHNXaXRoVG9kYXk6IGJvb2xlYW4gPSBhcmdzLnN0YXJ0c1dpdGhUb2RheTtcclxuICAgICAgICBjb25zdCBleGNsdWRlZDogbnVtYmVyW10gPSBhcmdzLmV4Y2x1ZGVkIHx8IFtdO1xyXG4gICAgICAgIGNvbnN0IHByZWNpc2lvbjogc3RyaW5nID0gYXJncy5wcmVjaXNpb24gfHwgJ2RheXMnO1xyXG5cclxuICAgICAgICBpZiAoIWV2ZW50cykge1xyXG4gICAgICAgICAgICBldmVudHMgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0YXJ0T2ZWaWV3V2VlazogRGF0ZSA9IHN0YXJ0c1dpdGhUb2RheSA/IHN0YXJ0T2ZEYXkodmlld0RhdGUpIDogc3RhcnRPZldlZWsodmlld0RhdGUsIHsgd2Vla1N0YXJ0c09uOiB3ZWVrU3RhcnRzT24gfSk7XHJcbiAgICAgICAgY29uc3QgZW5kT2ZWaWV3V2VlazogRGF0ZSA9IHN0YXJ0c1dpdGhUb2RheSA/IGFkZERheXMoZW5kT2ZEYXkodmlld0RhdGUpLCA2KSA6IGVuZE9mV2Vlayh2aWV3RGF0ZSwgeyB3ZWVrU3RhcnRzT246IHdlZWtTdGFydHNPbiB9KTtcclxuICAgICAgICAvLyBsZXQgbWF4UmFuZ2U6IG51bWJlciA9IERBWVNfSU5fV0VFSyAtIGV4Y2x1ZGVkLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBldmVudHNJbldlZWs6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRbXSA9IHRoaXMuZ2V0RXZlbnRzSW5QZXJpb2QoeyBldmVudHM6IGV2ZW50cywgcGVyaW9kU3RhcnQ6IHN0YXJ0T2ZWaWV3V2VlaywgcGVyaW9kRW5kOiBlbmRPZlZpZXdXZWVrIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmRheXMgPSB0aGlzLmdldFNjaGVkdWxlclZpZXdEYXlzKHtcclxuICAgICAgICAgICAgdmlld0RhdGU6IHZpZXdEYXRlLFxyXG4gICAgICAgICAgICB3ZWVrU3RhcnRzT246IHdlZWtTdGFydHNPbixcclxuICAgICAgICAgICAgc3RhcnRzV2l0aFRvZGF5OiBzdGFydHNXaXRoVG9kYXksXHJcbiAgICAgICAgICAgIGV4Y2x1ZGVkOiBleGNsdWRlZFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZGF5cy5mb3JFYWNoKChkYXk6IFNjaGVkdWxlclZpZXdEYXksIGRheUluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaG91cnM6IFNjaGVkdWxlclZpZXdIb3VyW10gPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5ob3Vycy5mb3JFYWNoKChob3VyOiBEYXlWaWV3SG91ciwgaG91ckluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZ21lbnRzOiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnRbXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgaG91ci5zZWdtZW50cy5mb3JFYWNoKChzZWdtZW50OiBEYXlWaWV3SG91clNlZ21lbnQsIHNlZ21lbnRJbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudC5kYXRlID0gc2V0RGF0ZShzZXRNb250aChzZXRZZWFyKHNlZ21lbnQuZGF0ZSwgZGF5LmRhdGUuZ2V0RnVsbFllYXIoKSksIGRheS5kYXRlLmdldE1vbnRoKCkpLCBkYXkuZGF0ZS5nZXREYXRlKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGFydE9mU2VnbWVudDogRGF0ZSA9IHNlZ21lbnQuZGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmRPZlNlZ21lbnQ6IERhdGUgPSBhZGRNaW51dGVzKHNlZ21lbnQuZGF0ZSwgTUlOVVRFU19JTl9IT1VSIC8gdGhpcy5ob3VyU2VnbWVudHMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBldnRzOiBDYWxlbmRhclNjaGVkdWxlckV2ZW50W10gPSB0aGlzLmdldEV2ZW50c0luUGVyaW9kKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiBldmVudHNJbldlZWssXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZFN0YXJ0OiBzdGFydE9mU2VnbWVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kRW5kOiBlbmRPZlNlZ21lbnRcclxuICAgICAgICAgICAgICAgICAgICB9KS5tYXAoKGV2ZW50OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q2FsZW5kYXJTY2hlZHVsZXJFdmVudD57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogZXZlbnQuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogZXZlbnQuc3RhcnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IGV2ZW50LmVuZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBldmVudC50aXRsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGV2ZW50LmNvbnRlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogZXZlbnQuY29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zOiBldmVudC5hY3Rpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBldmVudC5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczogZXZlbnQuY3NzQ2xhc3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydHNCZWZvcmVTZWdtZW50OiBldmVudC5zdGFydCA8IHN0YXJ0T2ZTZWdtZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kc0FmdGVyU2VnbWVudDogZXZlbnQuZW5kID4gZW5kT2ZTZWdtZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNIb3ZlcmVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGlzYWJsZWQ6IGV2ZW50LmlzRGlzYWJsZWQgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NsaWNrYWJsZTogZXZlbnQuaXNDbGlja2FibGUgIT09IHVuZGVmaW5lZCAmJiBldmVudC5pc0NsaWNrYWJsZSAhPT0gbnVsbCA/IGV2ZW50LmlzQ2xpY2thYmxlIDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50cy5wdXNoKDxTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQ+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50OiBzZWdtZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShzZWdtZW50LmRhdGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHM6IGV2dHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0JvcmRlcjogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgaG91ckRhdGU6IERhdGUgPSBuZXcgRGF0ZShkYXkuZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXkuZGF0ZS5nZXRNb250aCgpLCBkYXkuZGF0ZS5nZXREYXRlKCksIGhvdXIuc2VnbWVudHNbMF0uZGF0ZS5nZXRIb3VycygpKTtcclxuICAgICAgICAgICAgICAgIGhvdXJzLnB1c2goPFNjaGVkdWxlclZpZXdIb3VyPnsgaG91cjogaG91ciwgZGF0ZTogaG91ckRhdGUsIHNlZ21lbnRzOiBzZWdtZW50cywgaGFzQm9yZGVyOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZGF5LmhvdXJzID0gaG91cnM7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiA8U2NoZWR1bGVyVmlldz57XHJcbiAgICAgICAgICAgIGRheXM6IHRoaXMuZGF5c1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgaXNFdmVudEluUGVyaW9kKGFyZ3M6IHsgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQsIHBlcmlvZFN0YXJ0OiBzdHJpbmcgfCBudW1iZXIgfCBEYXRlLCBwZXJpb2RFbmQ6IHN0cmluZyB8IG51bWJlciB8IERhdGUgfSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50ID0gYXJncy5ldmVudCwgcGVyaW9kU3RhcnQ6IHN0cmluZyB8IG51bWJlciB8IERhdGUgPSBhcmdzLnBlcmlvZFN0YXJ0LCBwZXJpb2RFbmQ6IHN0cmluZyB8IG51bWJlciB8IERhdGUgPSBhcmdzLnBlcmlvZEVuZDtcclxuICAgICAgICBjb25zdCBldmVudFN0YXJ0OiBEYXRlID0gZXZlbnQuc3RhcnQ7XHJcbiAgICAgICAgY29uc3QgZXZlbnRFbmQ6IERhdGUgPSBldmVudC5lbmQgfHwgZXZlbnQuc3RhcnQ7XHJcblxyXG4gICAgICAgIGlmIChldmVudFN0YXJ0ID4gcGVyaW9kU3RhcnQgJiYgZXZlbnRTdGFydCA8IHBlcmlvZEVuZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGV2ZW50RW5kID4gcGVyaW9kU3RhcnQgJiYgZXZlbnRFbmQgPCBwZXJpb2RFbmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChldmVudFN0YXJ0IDwgcGVyaW9kU3RhcnQgJiYgZXZlbnRFbmQgPiBwZXJpb2RFbmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc1NhbWVTZWNvbmQoZXZlbnRTdGFydCwgcGVyaW9kU3RhcnQpIHx8IGlzU2FtZVNlY29uZChldmVudFN0YXJ0LCBzdWJTZWNvbmRzKHBlcmlvZEVuZCwgMSkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNTYW1lU2Vjb25kKHN1YlNlY29uZHMoZXZlbnRFbmQsIDEpLCBwZXJpb2RTdGFydCkgfHwgaXNTYW1lU2Vjb25kKGV2ZW50RW5kLCBwZXJpb2RFbmQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRFdmVudHNJblBlcmlvZChhcmdzOiB7IGV2ZW50czogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudFtdLCBwZXJpb2RTdGFydDogc3RyaW5nIHwgbnVtYmVyIHwgRGF0ZSwgcGVyaW9kRW5kOiBzdHJpbmcgfCBudW1iZXIgfCBEYXRlIH0pOiBDYWxlbmRhclNjaGVkdWxlckV2ZW50W10ge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50czogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudFtdID0gYXJncy5ldmVudHMsIHBlcmlvZFN0YXJ0OiBzdHJpbmcgfCBudW1iZXIgfCBEYXRlID0gYXJncy5wZXJpb2RTdGFydCwgcGVyaW9kRW5kOiBzdHJpbmcgfCBudW1iZXIgfCBEYXRlID0gYXJncy5wZXJpb2RFbmQ7XHJcbiAgICAgICAgcmV0dXJuIGV2ZW50cy5maWx0ZXIoKGV2ZW50KSA9PiB0aGlzLmlzRXZlbnRJblBlcmlvZCh7IGV2ZW50OiBldmVudCwgcGVyaW9kU3RhcnQ6IHBlcmlvZFN0YXJ0LCBwZXJpb2RFbmQ6IHBlcmlvZEVuZCB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTY2hlZHVsZXJWaWV3RGF5cyhhcmdzOiBHZXRTY2hlZHVsZXJWaWV3QXJncyk6IFNjaGVkdWxlclZpZXdEYXlbXSB7XHJcbiAgICAgICAgY29uc3Qgdmlld0RhdGU6IERhdGUgPSBhcmdzLnZpZXdEYXRlO1xyXG4gICAgICAgIGNvbnN0IHdlZWtTdGFydHNPbjogbnVtYmVyID0gYXJncy53ZWVrU3RhcnRzT247XHJcbiAgICAgICAgY29uc3Qgc3RhcnRzV2l0aFRvZGF5OiBib29sZWFuID0gYXJncy5zdGFydHNXaXRoVG9kYXk7XHJcbiAgICAgICAgY29uc3QgZXhjbHVkZWQ6IG51bWJlcltdID0gYXJncy5leGNsdWRlZCB8fCBbXTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBzdGFydHNXaXRoVG9kYXkgPyBuZXcgRGF0ZSh2aWV3RGF0ZSkgOiBzdGFydE9mV2Vlayh2aWV3RGF0ZSwgeyB3ZWVrU3RhcnRzT246IHdlZWtTdGFydHNPbiB9KTtcclxuICAgICAgICBjb25zdCBkYXlzOiBTY2hlZHVsZXJWaWV3RGF5W10gPSBbXTtcclxuICAgICAgICBjb25zdCBsb29wID0gKGk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlID0gYWRkRGF5cyhzdGFydCwgaSk7XHJcbiAgICAgICAgICAgIGlmICghZXhjbHVkZWQuc29tZSgoZTogbnVtYmVyKSA9PiBkYXRlLmdldERheSgpID09PSBlKSkge1xyXG4gICAgICAgICAgICAgICAgZGF5cy5wdXNoKHRoaXMuZ2V0U2NoZWR1bGVyRGF5KHsgZGF0ZTogZGF0ZSB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgREFZU19JTl9XRUVLOyBpKyspIHtcclxuICAgICAgICAgICAgbG9vcChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRheXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTY2hlZHVsZXJEYXkoYXJnczogeyBkYXRlOiBEYXRlIH0pOiBTY2hlZHVsZXJWaWV3RGF5IHtcclxuICAgICAgICBjb25zdCBkYXRlOiBEYXRlID0gYXJncy5kYXRlO1xyXG4gICAgICAgIGNvbnN0IHRvZGF5OiBEYXRlID0gc3RhcnRPZkRheShuZXcgRGF0ZSgpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIDxTY2hlZHVsZXJWaWV3RGF5PntcclxuICAgICAgICAgICAgZGF0ZTogZGF0ZSxcclxuICAgICAgICAgICAgaXNQYXN0OiBkYXRlIDwgdG9kYXksXHJcbiAgICAgICAgICAgIGlzVG9kYXk6IGlzU2FtZURheShkYXRlLCB0b2RheSksXHJcbiAgICAgICAgICAgIGlzRnV0dXJlOiBkYXRlID4gdG9kYXksXHJcbiAgICAgICAgICAgIGlzV2Vla2VuZDogV0VFS0VORF9EQVlfTlVNQkVSUy5pbmRleE9mKGdldERheShkYXRlKSkgPiAtMSxcclxuICAgICAgICAgICAgaG91cnM6IFtdXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFNjaGVkdWxlclZpZXdIb3VyR3JpZChhcmdzOiBHZXRTY2hlZHVsZXJWaWV3SG91ckdyaWRBcmdzKTogRGF5Vmlld0hvdXJbXSB7XHJcbiAgICAgICAgY29uc3Qgdmlld0RhdGU6IERhdGUgPSBhcmdzLnZpZXdEYXRlLCBob3VyU2VnbWVudHM6IG51bWJlciA9IGFyZ3MuaG91clNlZ21lbnRzLCBkYXlTdGFydDogYW55ID0gYXJncy5kYXlTdGFydCwgZGF5RW5kOiBhbnkgPSBhcmdzLmRheUVuZDtcclxuICAgICAgICBjb25zdCBob3VyczogRGF5Vmlld0hvdXJbXSA9IFtdO1xyXG5cclxuICAgICAgICBjb25zdCBzdGFydE9mVmlldzogRGF0ZSA9IHNldE1pbnV0ZXMoc2V0SG91cnMoc3RhcnRPZkRheSh2aWV3RGF0ZSksIGRheVN0YXJ0LmhvdXIpLCBkYXlTdGFydC5taW51dGUpO1xyXG4gICAgICAgIGNvbnN0IGVuZE9mVmlldzogRGF0ZSA9IHNldE1pbnV0ZXMoc2V0SG91cnMoc3RhcnRPZk1pbnV0ZShlbmRPZkRheSh2aWV3RGF0ZSkpLCBkYXlFbmQuaG91ciksIGRheUVuZC5taW51dGUpO1xyXG4gICAgICAgIGNvbnN0IHNlZ21lbnREdXJhdGlvbjogbnVtYmVyID0gTUlOVVRFU19JTl9IT1VSIC8gaG91clNlZ21lbnRzO1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0T2ZWaWV3RGF5OiBEYXRlID0gc3RhcnRPZkRheSh2aWV3RGF0ZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJhbmdlID0gKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyKTogbnVtYmVyW10gPT4gQXJyYXkuZnJvbSh7IGxlbmd0aDogKChlbmQgKyAxKSAtIHN0YXJ0KSB9LCAodiwgaykgPT4gayArIHN0YXJ0KTtcclxuICAgICAgICBjb25zdCBob3Vyc0luVmlldzogbnVtYmVyW10gPSByYW5nZShkYXlTdGFydC5ob3VyLCBkYXlFbmQuaG91cik7XHJcblxyXG4gICAgICAgIC8vIGZvciAodmFyIGkgPSAwOyBpIDwgSE9VUlNfSU5fREFZOyBpKyspIHtcclxuICAgICAgICBob3Vyc0luVmlldy5mb3JFYWNoKChob3VyOiBudW1iZXIsIGk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzZWdtZW50cyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGhvdXJTZWdtZW50czsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRlID0gYWRkTWludXRlcyhhZGRIb3VycyhzdGFydE9mVmlld0RheSwgaG91ciksIGogKiBzZWdtZW50RHVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGUgPj0gc3RhcnRPZlZpZXcgJiYgZGF0ZSA8IGVuZE9mVmlldykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBkYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1N0YXJ0OiBqID09PSAwXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGhvdXJzLnB1c2goPERheVZpZXdIb3VyPnsgc2VnbWVudHM6IHNlZ21lbnRzIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGhvdXJzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEdldFNjaGVkdWxlclZpZXdBcmdzIHtcclxuICAgIGV2ZW50cz86IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRbXTtcclxuICAgIHZpZXdEYXRlOiBEYXRlO1xyXG4gICAgd2Vla1N0YXJ0c09uOiBudW1iZXI7XHJcbiAgICBzdGFydHNXaXRoVG9kYXk6IGJvb2xlYW47XHJcbiAgICBleGNsdWRlZD86IG51bWJlcltdO1xyXG4gICAgcHJlY2lzaW9uPzogJ21pbnV0ZXMnIHwgJ2RheXMnO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEdldFNjaGVkdWxlclZpZXdIb3VyR3JpZEFyZ3Mge1xyXG4gICAgdmlld0RhdGU6IERhdGU7XHJcbiAgICBob3VyU2VnbWVudHM6IG51bWJlcjtcclxuICAgIGRheVN0YXJ0OiBhbnk7XHJcbiAgICBkYXlFbmQ6IGFueTtcclxufVxyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBUZW1wbGF0ZVJlZiwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICAgIFNjaGVkdWxlclZpZXdEYXksXHJcbiAgICBTY2hlZHVsZXJWaWV3SG91cixcclxuICAgIFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRcclxufSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci12aWV3LmNvbXBvbmVudCc7XHJcblxyXG4vLyBXT1JLQVJPVU5EOiBodHRwczovL2dpdGh1Yi5jb20vZGhlcmdlcy9uZy1wYWNrYWdyL2lzc3Vlcy8yMTcjaXNzdWVjb21tZW50LTMzOTQ2MDI1NVxyXG5pbXBvcnQgKiBhcyBtb21lbnRJbXBvcnRlZCBmcm9tICdtb21lbnQnO1xyXG5jb25zdCBtb21lbnQgPSBtb21lbnRJbXBvcnRlZDtcclxuXHJcbkBDb21wb25lbnQoeyAvLyBbY2xhc3Mubm8tYm9yZGVyXSc6ICchZGF5Lmhhc0JvcmRlclxyXG4gICAgc2VsZWN0b3I6ICdjYWxlbmRhci1zY2hlZHVsZXItY2VsbCcsXHJcbiAgICB0ZW1wbGF0ZTogYFxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdFRlbXBsYXRlPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXNjaGVkdWxlci1zZWdtZW50c1wiICpuZ0lmPVwiaG91ci5zZWdtZW50cy5sZW5ndGggPiAwXCJcclxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cImhvdXI/LmNzc0NsYXNzXCJcclxuICAgICAgICAgICAgICAgIFtjbGFzcy5uby1ib3JkZXJdPVwiIWhvdXIuaGFzQm9yZGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXNjaGVkdWxlci1zZWdtZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgc2VnbWVudCBvZiBob3VyLnNlZ21lbnRzOyBsZXQgc2kgPSBpbmRleFwiXHJcbiAgICAgICAgICAgICAgICAgICAgW3RpdGxlXT1cInRpdGxlXCJcclxuICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJzZWdtZW50Py5jc3NDbGFzc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgW2NsYXNzLmhhcy1ldmVudHNdPVwic2VnbWVudC5ldmVudHMubGVuZ3RoID4gMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgW2NsYXNzLmNhbC1kaXNhYmxlZF09XCJzZWdtZW50LmlzRGlzYWJsZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIFtzdHlsZS5iYWNrZ3JvdW5kQ29sb3JdPVwic2VnbWVudC5iYWNrZ3JvdW5kQ29sb3JcIlxyXG4gICAgICAgICAgICAgICAgICAgIFtjbGFzcy5uby1ib3JkZXJdPVwiIXNlZ21lbnQuaGFzQm9yZGVyXCJcclxuICAgICAgICAgICAgICAgICAgICAobXdsQ2xpY2spPVwib25TZWdtZW50Q2xpY2soJGV2ZW50LCBzZWdtZW50KVwiPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXNjaGVkdWxlci1ldmVudHNcIiAqbmdJZj1cInNlZ21lbnQuZXZlbnRzLmxlbmd0aCA+IDBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGNhbGVuZGFyLXNjaGVkdWxlci1ldmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IGV2ZW50IG9mIHNlZ21lbnQuZXZlbnRzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkYXldPVwiZGF5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtob3VyXT1cImhvdXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3NlZ21lbnRdPVwic2VnbWVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZXZlbnRdPVwiZXZlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG1vdXNlZW50ZXIpPVwib25Nb3VzZUVudGVyKCRldmVudCwgc2VnbWVudCwgZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtb3VzZWxlYXZlKT1cIm9uTW91c2VMZWF2ZSgkZXZlbnQsIHNlZ21lbnQsIGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdG9vbHRpcFBsYWNlbWVudF09XCJ0b29sdGlwUGxhY2VtZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzaG93QWN0aW9uc109XCJzaG93QWN0aW9uc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiZXZlbnRUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZXZlbnRDbGlja2VkKT1cIm9uRXZlbnRDbGljaygkZXZlbnQsIGV2ZW50KVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZVxyXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxyXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie1xyXG4gICAgICAgICAgICAgICAgZGF5OiBkYXksXHJcbiAgICAgICAgICAgICAgICBob3VyOiBob3VyLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxlOiBsb2NhbGUsXHJcbiAgICAgICAgICAgICAgICB0b29sdGlwUGxhY2VtZW50OiB0b29sdGlwUGxhY2VtZW50LFxyXG4gICAgICAgICAgICAgICAgc2hvd0FjdGlvbnM6IHNob3dBY3Rpb25zLFxyXG4gICAgICAgICAgICAgICAgZXZlbnRUZW1wbGF0ZTogZXZlbnRUZW1wbGF0ZSxcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodFNlZ21lbnQ6IGhpZ2hsaWdodFNlZ21lbnQsXHJcbiAgICAgICAgICAgICAgICB1bmhpZ2hsaWdodFNlZ21lbnQ6IHVuaGlnaGxpZ2h0U2VnbWVudCxcclxuICAgICAgICAgICAgICAgIHNlZ21lbnRDbGlja2VkOiBzZWdtZW50Q2xpY2tlZCxcclxuICAgICAgICAgICAgICAgIGV2ZW50Q2xpY2tlZDogZXZlbnRDbGlja2VkXHJcbiAgICAgICAgICAgIH1cIj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgYCxcclxuICAgIGhvc3Q6IHtcclxuICAgICAgICAnY2xhc3MnOiAnY2FsLXNjaGVkdWxlci1jZWxsJyxcclxuICAgICAgICAnW2NsYXNzLmNhbC1wYXN0XSc6ICdkYXkuaXNQYXN0JyxcclxuICAgICAgICAnW2NsYXNzLmNhbC10b2RheV0nOiAnZGF5LmlzVG9kYXknLFxyXG4gICAgICAgICdbY2xhc3MuY2FsLWZ1dHVyZV0nOiAnZGF5LmlzRnV0dXJlJyxcclxuICAgICAgICAnW2NsYXNzLmNhbC13ZWVrZW5kXSc6ICdkYXkuaXNXZWVrZW5kJyxcclxuICAgICAgICAnW2NsYXNzLmNhbC1pbi1tb250aF0nOiAnZGF5LmluTW9udGgnLFxyXG4gICAgICAgICdbY2xhc3MuY2FsLW91dC1tb250aF0nOiAnIWRheS5pbk1vbnRoJyxcclxuICAgICAgICAnW3N0eWxlLmJhY2tncm91bmRDb2xvcl0nOiAnZGF5LmJhY2tncm91bmRDb2xvcidcclxuICAgIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIENhbGVuZGFyU2NoZWR1bGVyQ2VsbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gICAgQElucHV0KCkgdGl0bGU6IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoKSBkYXk6IFNjaGVkdWxlclZpZXdEYXk7XHJcblxyXG4gICAgQElucHV0KCkgaG91cjogU2NoZWR1bGVyVmlld0hvdXI7XHJcblxyXG4gICAgQElucHV0KCkgbG9jYWxlOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KCkgdG9vbHRpcFBsYWNlbWVudDogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dCgpIHNob3dBY3Rpb25zOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICBASW5wdXQoKSBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgICBASW5wdXQoKSBldmVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICAgIEBPdXRwdXQoKSBoaWdobGlnaHRTZWdtZW50OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBAT3V0cHV0KCkgdW5oaWdobGlnaHRTZWdtZW50OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBAT3V0cHV0KCkgc2VnbWVudENsaWNrZWQ6IEV2ZW50RW1pdHRlcjx7IHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCB9PiA9IG5ldyBFdmVudEVtaXR0ZXI8eyBzZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQgfT4oKTtcclxuXHJcbiAgICBAT3V0cHV0KCkgZXZlbnRDbGlja2VkOiBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB9PiA9IG5ldyBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB9PigpO1xyXG5cclxuXHJcbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnRpdGxlID0gbW9tZW50KHRoaXMuZGF5LmRhdGUpLmZvcm1hdCgnZGRkZCBMJyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZUVudGVyKG1vdXNlRXZlbnQ6IE1vdXNlRXZlbnQsIHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCwgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIWV2ZW50LmlzRGlzYWJsZWQgJiYgIXNlZ21lbnQuaXNEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodFNlZ21lbnQuZW1pdCh7IGV2ZW50OiBldmVudCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZUxlYXZlKG1vdXNlRXZlbnQ6IE1vdXNlRXZlbnQsIHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCwgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIWV2ZW50LmlzRGlzYWJsZWQgJiYgIXNlZ21lbnQuaXNEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnVuaGlnaGxpZ2h0U2VnbWVudC5lbWl0KHsgZXZlbnQ6IGV2ZW50IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBoaWRkZW5cclxuICAgICAqL1xyXG4gICAgb25TZWdtZW50Q2xpY2sobW91c2VFdmVudDogTW91c2VFdmVudCwgc2VnbWVudDogU2NoZWR1bGVyVmlld0hvdXJTZWdtZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKG1vdXNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKSB7XHJcbiAgICAgICAgICAgIG1vdXNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VnbWVudC5ldmVudHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudENsaWNrZWQuZW1pdCh7IHNlZ21lbnQ6IHNlZ21lbnQgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGhpZGRlblxyXG4gICAgICovXHJcbiAgICBvbkV2ZW50Q2xpY2sobW91c2VFdmVudDogTW91c2VFdmVudCwgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAobW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24pIHtcclxuICAgICAgICAgICAgbW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGV2ZW50LmlzQ2xpY2thYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRDbGlja2VkLmVtaXQoeyBldmVudDogZXZlbnQgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTY2hlZHVsZXJWaWV3RGF5IH0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItdmlldy5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2NhbGVuZGFyLXNjaGVkdWxlci1oZWFkZXInLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgICAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHRUZW1wbGF0ZT5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhbC1zY2hlZHVsZXItaGVhZGVyc1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhbC1oZWFkZXIgYXNpZGUgY2FsLWhlYWRlci1jbG9jayBhbGlnbi1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zIG1kLTMyXCIgc3R5bGU9XCJtYXJnaW46YXV0bztcIj5zY2hlZHVsZTwvaT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtaGVhZGVyLWNvbHMgYXNpZGVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiY2FsLWhlYWRlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICpuZ0Zvcj1cImxldCBkYXkgb2YgZGF5c1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjbGFzcy5jYWwtcGFzdF09XCJkYXkuaXNQYXN0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgW2NsYXNzLmNhbC10b2RheV09XCJkYXkuaXNUb2RheVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjbGFzcy5jYWwtZnV0dXJlXT1cImRheS5pc0Z1dHVyZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjbGFzcy5jYWwtd2Vla2VuZF09XCJkYXkuaXNXZWVrZW5kXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgW2NsYXNzLmNhbC1kcmFnLW92ZXJdPVwiZGF5LmRyYWdPdmVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgKG13bENsaWNrKT1cImRheUNsaWNrZWQuZW1pdCh7ZGF0ZTogZGF5LmRhdGV9KVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Yj57eyBkYXkuZGF0ZSB8IGNhbGVuZGFyRGF0ZTond2Vla1ZpZXdDb2x1bW5IZWFkZXInOmxvY2FsZSB9fTwvYj48YnI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPnt7IGRheS5kYXRlIHwgY2FsZW5kYXJEYXRlOid3ZWVrVmlld0NvbHVtblN1YkhlYWRlcic6bG9jYWxlIH19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlXHJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImN1c3RvbVRlbXBsYXRlIHx8IGRlZmF1bHRUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ZGF5czogZGF5cywgbG9jYWxlOiBsb2NhbGUsIGRheUNsaWNrZWQ6IGRheUNsaWNrZWR9XCI+XHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgIGBcclxufSlcclxuZXhwb3J0IGNsYXNzIENhbGVuZGFyU2NoZWR1bGVySGVhZGVyQ29tcG9uZW50IHtcclxuXHJcbiAgICBASW5wdXQoKSBkYXlzOiBTY2hlZHVsZXJWaWV3RGF5W107XHJcblxyXG4gICAgQElucHV0KCkgbG9jYWxlOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KCkgY3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gICAgQE91dHB1dCgpIGRheUNsaWNrZWQ6IEV2ZW50RW1pdHRlcjx7IGRhdGU6IERhdGUgfT4gPSBuZXcgRXZlbnRFbWl0dGVyPHsgZGF0ZTogRGF0ZSB9PigpO1xyXG59XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBUZW1wbGF0ZVJlZiwgT25Jbml0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICAgIFNjaGVkdWxlclZpZXdEYXksXHJcbiAgICBTY2hlZHVsZXJWaWV3SG91cixcclxuICAgIFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCxcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRcclxufSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci12aWV3LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7XHJcbiAgICBpc1NhbWVEYXlcclxufSBmcm9tICdkYXRlLWZucyc7XHJcblxyXG4vLyBXT1JLQVJPVU5EOiBodHRwczovL2dpdGh1Yi5jb20vZGhlcmdlcy9uZy1wYWNrYWdyL2lzc3Vlcy8yMTcjaXNzdWVjb21tZW50LTMzOTQ2MDI1NVxyXG5pbXBvcnQgKiBhcyBtb21lbnRJbXBvcnRlZCBmcm9tICdtb21lbnQnO1xyXG5jb25zdCBtb21lbnQgPSBtb21lbnRJbXBvcnRlZDtcclxuXHJcbi8qKlxyXG4gKiBbbXdsQ2FsZW5kYXJUb29sdGlwXT1cImV2ZW50LnRpdGxlIHwgY2FsZW5kYXJFdmVudFRpdGxlOid3ZWVrVG9vbHRpcCc6ZXZlbnRcIlxyXG4gKiBbdG9vbHRpcFBsYWNlbWVudF09XCJ0b29sdGlwUGxhY2VtZW50XCJcclxuICovXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdjYWxlbmRhci1zY2hlZHVsZXItZXZlbnQnLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgICAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHRUZW1wbGF0ZT5cclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLWV2ZW50XCJcclxuICAgICAgICAgICAgICAgIFt0aXRsZV09XCJ0aXRsZVwiXHJcbiAgICAgICAgICAgICAgICBbY2xhc3MuY2FsLXN0YXJ0cy13aXRoaW4tc2VnbWVudF09XCIhZXZlbnQuc3RhcnRzQmVmb3JlU2VnbWVudFwiXHJcbiAgICAgICAgICAgICAgICBbY2xhc3MuY2FsLWVuZHMtd2l0aGluLXNlZ21lbnRdPVwiIWV2ZW50LmVuZHNBZnRlclNlZ21lbnRcIlxyXG4gICAgICAgICAgICAgICAgW2NsYXNzLmhvdmVyZWRdPVwiZXZlbnQuaXNIb3ZlcmVkXCJcclxuICAgICAgICAgICAgICAgIFtjbGFzcy5jYWwtZGlzYWJsZWRdPVwiZXZlbnQuaXNEaXNhYmxlZCB8fCBzZWdtZW50LmlzRGlzYWJsZWRcIlxyXG4gICAgICAgICAgICAgICAgW2NsYXNzLmNhbC1ub3QtY2xpY2thYmxlXT1cIiFldmVudC5pc0NsaWNrYWJsZVwiXHJcbiAgICAgICAgICAgICAgICBbc3R5bGUuYmFja2dyb3VuZENvbG9yXT1cImV2ZW50LmNvbG9yLnByaW1hcnlcIlxyXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwiZXZlbnQ/LmNzc0NsYXNzXCJcclxuICAgICAgICAgICAgICAgIChtd2xDbGljayk9XCJldmVudENsaWNrZWQuZW1pdCh7ZXZlbnQ6IGV2ZW50fSlcIlxyXG4gICAgICAgICAgICAgICAgKG1vdXNlZW50ZXIpPVwiaGlnaGxpZ2h0RXZlbnQoKVwiXHJcbiAgICAgICAgICAgICAgICAobW91c2VsZWF2ZSk9XCJ1bmhpZ2hsaWdodEV2ZW50KClcIj5cclxuICAgICAgICAgICAgICAgIDxjYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtdGl0bGUgKm5nSWY9XCIhZXZlbnQuc3RhcnRzQmVmb3JlU2VnbWVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgW2V2ZW50XT1cImV2ZW50XCJcclxuICAgICAgICAgICAgICAgICAgICB2aWV3PVwid2Vla1wiPlxyXG4gICAgICAgICAgICAgICAgPC9jYWxlbmRhci1zY2hlZHVsZXItZXZlbnQtdGl0bGU+XHJcbiAgICAgICAgICAgICAgICA8Y2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LWNvbnRlbnQgKm5nSWY9XCIhZXZlbnQuc3RhcnRzQmVmb3JlU2VnbWVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgW2V2ZW50XT1cImV2ZW50XCI+XHJcbiAgICAgICAgICAgICAgICA8L2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1jb250ZW50PlxyXG4gICAgICAgICAgICAgICAgPGNhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zIFtldmVudF09XCJldmVudFwiICpuZ0lmPVwic2hvd0FjdGlvbnMgJiYgZXZlbnQuaXNDbGlja2FibGUgJiYgIWV2ZW50LmVuZHNBZnRlclNlZ21lbnRcIj48L2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zPlxyXG4gICAgICAgICAgICAgICAgPGNhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zIFtldmVudF09XCJldmVudFwiICpuZ0lmPVwic2hvd0FjdGlvbnMgJiYgZXZlbnQuaXNEaXNhYmxlZCAmJiAhZXZlbnQuZW5kc0FmdGVyU2VnbWVudFwiPjwvY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LWFjdGlvbnM+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlXHJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImN1c3RvbVRlbXBsYXRlIHx8IGRlZmF1bHRUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7XHJcbiAgICAgICAgICAgICAgICBkYXk6IGRheSxcclxuICAgICAgICAgICAgICAgIGhvdXI6IGhvdXIsXHJcbiAgICAgICAgICAgICAgICBzZWdtZW50OiBzZWdtZW50LFxyXG4gICAgICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LFxyXG4gICAgICAgICAgICAgICAgdG9vbHRpcFBsYWNlbWVudDogdG9vbHRpcFBsYWNlbWVudCxcclxuICAgICAgICAgICAgICAgIHNob3dBY3Rpb25zOiBzaG93QWN0aW9ucyxcclxuICAgICAgICAgICAgICAgIGN1c3RvbVRlbXBsYXRlOiBjdXN0b21UZW1wbGF0ZSxcclxuICAgICAgICAgICAgICAgIGV2ZW50Q2xpY2tlZDogZXZlbnRDbGlja2VkXHJcbiAgICAgICAgICAgIH1cIj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgYCxcclxuICAgIGhvc3Q6IHtcclxuICAgICAgICAnY2xhc3MnOiAnY2FsLXNjaGVkdWxlci1ldmVudC1jb250YWluZXInXHJcbiAgICB9XHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDYWxlbmRhclNjaGVkdWxlckV2ZW50Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgICBASW5wdXQoKSB0aXRsZTogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dCgpIGRheTogU2NoZWR1bGVyVmlld0RheTtcclxuXHJcbiAgICBASW5wdXQoKSBob3VyOiBTY2hlZHVsZXJWaWV3SG91cjtcclxuXHJcbiAgICBASW5wdXQoKSBzZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQ7XHJcblxyXG4gICAgQElucHV0KCkgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQ7XHJcblxyXG4gICAgQElucHV0KCkgdG9vbHRpcFBsYWNlbWVudDogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dCgpIHNob3dBY3Rpb25zOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICBASW5wdXQoKSBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgICBAT3V0cHV0KCkgZXZlbnRDbGlja2VkOiBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB9PiA9IG5ldyBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB9PigpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikgeyAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zZWdtZW50Lmhhc0JvcmRlciA9IHRoaXMuaG91ci5oYXNCb3JkZXIgPSAhdGhpcy5ldmVudC5lbmRzQWZ0ZXJTZWdtZW50O1xyXG5cclxuICAgICAgICB0aGlzLnRpdGxlID0gbW9tZW50KHRoaXMuZXZlbnQuc3RhcnQpLmZvcm1hdCgnZGRkZCBMJyk7XHJcblxyXG4gICAgICAgIHRoaXMuY2hlY2tFbmFibGVTdGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hlY2tFbmFibGVTdGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5zZWdtZW50LmlzRGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXkuaG91cnMuZm9yRWFjaCgoaG91cjogU2NoZWR1bGVyVmlld0hvdXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGhvdXIuc2VnbWVudHMuZm9yRWFjaCgoc2VnbWVudDogU2NoZWR1bGVyVmlld0hvdXJTZWdtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudC5ldmVudHMuZmlsdGVyKChldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCkgPT4gZXZlbnQuaWQgPT09IHRoaXMuZXZlbnQuaWQgJiYgaXNTYW1lRGF5KGV2ZW50LnN0YXJ0LCB0aGlzLmV2ZW50LnN0YXJ0KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKGV2ZW50OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5pc0Rpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhpZ2hsaWdodEV2ZW50KCk6IHZvaWQge1xyXG4gICAgICAgIC8vIGxldCBldmVudHM6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRbXSA9IHRoaXMuZGF5LmhvdXJzXHJcbiAgICAgICAgLy8gICAgLmZpbHRlcihoID0+IGguc2VnbWVudHMuc29tZShzID0+IHMuZXZlbnRzLnNvbWUoZSA9PiBlLmlkID09PSB0aGlzLmV2ZW50LmlkKSkpXHJcbiAgICAgICAgLy8gICAgLm1hcChoID0+XHJcbiAgICAgICAgLy8gICAgICAgIGguc2VnbWVudHMubWFwKHMgPT5cclxuICAgICAgICAvLyAgICAgICAgICAgIHMuZXZlbnRzLmZpbHRlcihlID0+IGUuaWQgPT09IHRoaXMuZXZlbnQuaWQpXHJcbiAgICAgICAgLy8gICAgICAgICkucmVkdWNlKChwcmV2LCBjdXJyKSA9PiBwcmV2LmNvbmNhdChjdXJyKSlcclxuICAgICAgICAvLyAgICApXHJcbiAgICAgICAgLy8gICAgLnJlZHVjZSgocHJldiwgY3VycikgPT4gcHJldi5jb25jYXQoY3VycikpO1xyXG5cclxuICAgICAgICB0aGlzLmRheS5ob3Vycy5mb3JFYWNoKChob3VyOiBTY2hlZHVsZXJWaWV3SG91cikgPT4ge1xyXG4gICAgICAgICAgICBob3VyLnNlZ21lbnRzLmZvckVhY2goKHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudC5ldmVudHMuZmlsdGVyKChldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCkgPT4gZXZlbnQuaWQgPT09IHRoaXMuZXZlbnQuaWQgJiYgaXNTYW1lRGF5KGV2ZW50LnN0YXJ0LCB0aGlzLmV2ZW50LnN0YXJ0KSlcclxuICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaCgoZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuaXNIb3ZlcmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdW5oaWdobGlnaHRFdmVudCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRheS5ob3Vycy5mb3JFYWNoKChob3VyOiBTY2hlZHVsZXJWaWV3SG91cikgPT4ge1xyXG4gICAgICAgICAgICBob3VyLnNlZ21lbnRzLmZvckVhY2goKHNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudC5ldmVudHMuZmlsdGVyKChldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCkgPT4gZXZlbnQuaWQgPT09IHRoaXMuZXZlbnQuaWQgJiYgaXNTYW1lRGF5KGV2ZW50LnN0YXJ0LCB0aGlzLmV2ZW50LnN0YXJ0KSlcclxuICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaCgoZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuaXNIb3ZlcmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgc2FtZUV2ZW50SW5QcmV2aW91c0hvdXIoZGF5OiBTY2hlZHVsZXJWaWV3RGF5LCBob3VyOiBTY2hlZHVsZXJWaWV3SG91cik6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQge1xyXG4gICAgLy8gICAgbGV0IGhvdXJJbmRleDogbnVtYmVyID0gZGF5LmhvdXJzLmluZGV4T2YoaG91cik7XHJcbiAgICAvLyAgICBsZXQgcHJldmlvdXNIb3VyID0gZGF5LmhvdXJzW2hvdXJJbmRleCAtIDFdO1xyXG4gICAgLy8gICAgaWYgKHByZXZpb3VzSG91cikge1xyXG4gICAgLy8gICAgICAgIGxldCBwcmV2aW91c1NlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCA9IHByZXZpb3VzSG91ci5zZWdtZW50c1twcmV2aW91c0hvdXIuc2VnbWVudHMubGVuZ3RoIC0gMV07XHJcbiAgICAvLyAgICAgICAgcmV0dXJuIHByZXZpb3VzU2VnbWVudC5ldmVudHNbcHJldmlvdXNTZWdtZW50LmV2ZW50cy5sZW5ndGggLSAxXTtcclxuICAgIC8vICAgIH1cclxuICAgIC8vICAgIHJldHVybiBudWxsO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHByaXZhdGUgc2FtZUV2ZW50SW5QcmV2aW91c1NlZ21lbnQoc2VnbWVudEluZGV4OiBudW1iZXIpOiBDYWxlbmRhclNjaGVkdWxlckV2ZW50IHtcclxuICAgIC8vICAgIGxldCBwcmV2aW91c1NlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCA9IHRoaXMuaG91ci5zZWdtZW50c1tzZWdtZW50SW5kZXggLSAxXTtcclxuICAgIC8vICAgIGlmIChwcmV2aW91c1NlZ21lbnQpIHtcclxuICAgIC8vICAgICAgICByZXR1cm4gcHJldmlvdXNTZWdtZW50LmV2ZW50c1twcmV2aW91c1NlZ21lbnQuZXZlbnRzLmxlbmd0aCAtIDFdO1xyXG4gICAgLy8gICAgfVxyXG4gICAgLy8gICAgcmV0dXJuIG51bGw7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBzYW1lRXZlbnRJbk5leHRIb3VyKCk6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQge1xyXG4gICAgLy8gICAgbGV0IGhvdXJJbmRleDogbnVtYmVyID0gdGhpcy5kYXkuaG91cnMuaW5kZXhPZih0aGlzLmhvdXIpO1xyXG4gICAgLy8gICAgbGV0IG5leHRIb3VyOiBTY2hlZHVsZXJWaWV3SG91ciA9IHRoaXMuZGF5LmhvdXJzW2hvdXJJbmRleCArIDFdO1xyXG4gICAgLy8gICAgaWYgKG5leHRIb3VyKSB7XHJcbiAgICAvLyAgICAgICAgbGV0IG5leHRTZWdtZW50OiBTY2hlZHVsZXJWaWV3SG91clNlZ21lbnQgPSBuZXh0SG91ci5zZWdtZW50c1swXTtcclxuICAgIC8vICAgICAgICByZXR1cm4gbmV4dFNlZ21lbnQuZXZlbnRzWzBdO1xyXG4gICAgLy8gICAgfVxyXG4gICAgLy8gICAgcmV0dXJuIG51bGw7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBzYW1lRXZlbnRJbk5leHRTZWdtZW50KHNlZ21lbnRJbmRleDogbnVtYmVyKTogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB7XHJcbiAgICAvLyAgICBsZXQgbmV4dFNlZ21lbnQ6IFNjaGVkdWxlclZpZXdIb3VyU2VnbWVudCA9IHRoaXMuaG91ci5zZWdtZW50c1tzZWdtZW50SW5kZXggKyAxXTtcclxuICAgIC8vICAgIGlmIChuZXh0U2VnbWVudCkge1xyXG4gICAgLy8gICAgICAgIHJldHVybiBuZXh0U2VnbWVudC5ldmVudHNbMF07XHJcbiAgICAvLyAgICB9XHJcbiAgICAvLyAgICByZXR1cm4gbnVsbDtcclxuICAgIC8vIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgICBDYWxlbmRhclNjaGVkdWxlckV2ZW50XHJcbn0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItdmlldy5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC10aXRsZScsXHJcbiAgICB0ZW1wbGF0ZTogYFxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgICAgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLWV2ZW50LXRpdGxlXCJcclxuICAgICAgICAgICAgW2lubmVySFRNTF09XCJldmVudC50aXRsZSB8IHNjaGVkdWxlckV2ZW50VGl0bGU6dmlldzpldmVudFwiPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgKm5nSWY9XCJldmVudC5zdGF0dXNcIlxyXG4gICAgICAgICAgICBjbGFzcz1cImNhbC1zY2hlZHVsZXItZXZlbnQtc3RhdHVzXCJcclxuICAgICAgICAgICAgW2NsYXNzLm9rXT1cImV2ZW50LnN0YXR1cyA9PT0gJ29rJ1wiXHJcbiAgICAgICAgICAgIFtjbGFzcy53YXJuaW5nXT1cImV2ZW50LnN0YXR1cyA9PT0gJ3dhcm5pbmcnXCJcclxuICAgICAgICAgICAgW2NsYXNzLmRhbmdlcl09XCJldmVudC5zdGF0dXMgPT09ICdkYW5nZXInXCI+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICBgLFxyXG4gICAgaG9zdDoge1xyXG4gICAgICAgICdjbGFzcyc6ICdjYWwtc2NoZWR1bGVyLWV2ZW50LXRpdGxlLWNvbnRhaW5lcidcclxuICAgIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRUaXRsZUNvbXBvbmVudCB7XHJcblxyXG4gICAgQElucHV0KCkgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQ7XHJcblxyXG4gICAgQElucHV0KCkgdmlldzogc3RyaW5nO1xyXG59XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRcclxufSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci12aWV3LmNvbXBvbmVudCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LWNvbnRlbnQnLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgICAgICA8ZGl2ICpuZ0lmPVwiZXZlbnQuY29udGVudFwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiY2FsLXNjaGVkdWxlci1ldmVudC1jb250ZW50XCJcclxuICAgICAgICAgICAgW2lubmVySFRNTF09XCJldmVudC5jb250ZW50XCI+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICBgLFxyXG4gICAgaG9zdDoge1xyXG4gICAgICAgICdjbGFzcyc6ICdjYWwtc2NoZWR1bGVyLWV2ZW50LWNvbnRlbnQtY29udGFpbmVyJ1xyXG4gICAgfVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudENvbnRlbnRDb21wb25lbnQge1xyXG5cclxuICAgIEBJbnB1dCgpIGV2ZW50OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50O1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnQsXHJcbiAgICBDYWxlbmRhclNjaGVkdWxlckV2ZW50QWN0aW9uXHJcbn0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItdmlldy5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zJyxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICAgICAgPHNwYW4gKm5nSWY9XCJldmVudC5hY3Rpb25zXCIgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLWV2ZW50LWFjdGlvbnNcIj5cclxuICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiY2FsLXNjaGVkdWxlci1ldmVudC1hY3Rpb25cIlxyXG4gICAgICAgICAgICAgICAgaHJlZj1cImphdmFzY3JpcHQ6O1wiXHJcbiAgICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgYWN0aW9uIG9mIGFjdGlvbnNcIlxyXG4gICAgICAgICAgICAgICAgKG13bENsaWNrKT1cIm9uQWN0aW9uQ2xpY2soJGV2ZW50LCBhY3Rpb24sIGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJhY3Rpb24uY3NzQ2xhc3NcIlxyXG4gICAgICAgICAgICAgICAgW2lubmVySHRtbF09XCJhY3Rpb24ubGFiZWxcIlxyXG4gICAgICAgICAgICAgICAgW3RpdGxlXT1cImFjdGlvbi50aXRsZVwiPlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9zcGFuPlxyXG4gICAgYCxcclxuICAgIGhvc3Q6IHtcclxuICAgICAgICAnY2xhc3MnOiAnY2FsLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zLWNvbnRhaW5lcidcclxuICAgIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRBY3Rpb25zQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgICBASW5wdXQoKSBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudDtcclxuXHJcbiAgICBwdWJsaWMgYWN0aW9uczogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudEFjdGlvbltdID0gW107XHJcblxyXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucyA9IHRoaXMuZXZlbnQuaXNEaXNhYmxlZCA/XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnQuYWN0aW9ucy5maWx0ZXIoKGE6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRBY3Rpb24pID0+ICFhLndoZW4gfHwgYS53aGVuID09PSAnZGlzYWJsZWQnKSA6XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnQuYWN0aW9ucy5maWx0ZXIoKGE6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRBY3Rpb24pID0+ICFhLndoZW4gfHwgYS53aGVuID09PSAnZW5hYmxlZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGhpZGRlblxyXG4gICAgICovXHJcbiAgICBvbkFjdGlvbkNsaWNrKG1vdXNlRXZlbnQ6IE1vdXNlRXZlbnQsIGFjdGlvbjogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudEFjdGlvbiwgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAobW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24pIHtcclxuICAgICAgICAgICAgbW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFjdGlvbi5vbkNsaWNrKGV2ZW50KTtcclxuICAgIH1cclxufVxyXG4iLCIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDApXHJcbiAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHQuZGVmYXVsdCA9IG1vZDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcbiIsImltcG9ydCB7IENhbGVuZGFyRXZlbnRUaXRsZUZvcm1hdHRlciB9IGZyb20gJ2FuZ3VsYXItY2FsZW5kYXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjaGVkdWxlckV2ZW50VGl0bGVGb3JtYXR0ZXIgZXh0ZW5kcyBDYWxlbmRhckV2ZW50VGl0bGVGb3JtYXR0ZXIge1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQgfSBmcm9tICcuLi9jYWxlbmRhci1zY2hlZHVsZXItdmlldy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBTY2hlZHVsZXJFdmVudFRpdGxlRm9ybWF0dGVyIH0gZnJvbSAnLi4vZm9ybWF0dGVycy9zY2hlZHVsZXItZXZlbnQtdGl0bGUtZm9ybWF0dGVyLnByb3ZpZGVyJztcclxuXHJcbkBQaXBlKHtcclxuICBuYW1lOiAnc2NoZWR1bGVyRXZlbnRUaXRsZSdcclxufSlcclxuZXhwb3J0IGNsYXNzIFNjaGVkdWxlckV2ZW50VGl0bGVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzY2hlZHVsZXJFdmVudFRpdGxlOiBTY2hlZHVsZXJFdmVudFRpdGxlRm9ybWF0dGVyKSB7fVxyXG5cclxuICB0cmFuc2Zvcm0odGl0bGU6IHN0cmluZywgdGl0bGVUeXBlOiBzdHJpbmcsIGV2ZW50OiBDYWxlbmRhclNjaGVkdWxlckV2ZW50KTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLnNjaGVkdWxlckV2ZW50VGl0bGVbdGl0bGVUeXBlXShldmVudCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IENhbGVuZGFyRGF0ZUZvcm1hdHRlciwgRGF0ZUZvcm1hdHRlclBhcmFtcyB9IGZyb20gJ2FuZ3VsYXItY2FsZW5kYXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjaGVkdWxlckRhdGVGb3JtYXR0ZXIgZXh0ZW5kcyBDYWxlbmRhckRhdGVGb3JtYXR0ZXIge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIHRpbWUgZm9ybWF0dGluZyBkb3duIHRoZSBsZWZ0IGhhbmQgc2lkZSBvZiB0aGUgZGF5IHZpZXdcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRheVZpZXdIb3VyKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIHsgaG91cjogJ251bWVyaWMnLCBtaW51dGU6ICdudW1lcmljJyB9KS5mb3JtYXQoZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHdlZWtWaWV3VGl0bGUoeyBkYXRlLCBsb2NhbGUgfTogRGF0ZUZvcm1hdHRlclBhcmFtcyk6IHN0cmluZyB7XHJcbiAgICAgICAgLy8gaHR0cDovL2dlbmVyYXRlZGNvbnRlbnQub3JnL3Bvc3QvNTk0MDMxNjgwMTYvZXNpbnRsYXBpXHJcbiAgICAgICAgY29uc3QgeWVhcjogc3RyaW5nID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobG9jYWxlLCB7IHllYXI6ICdudW1lcmljJyB9KS5mb3JtYXQoZGF0ZSk7XHJcbiAgICAgICAgY29uc3QgbW9udGg6IHN0cmluZyA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZSwgeyBtb250aDogJ3Nob3J0JyB9KS5mb3JtYXQoZGF0ZSk7XHJcblxyXG4gICAgICAgIC8vIHZhciBmaXJzdERheTogbnVtYmVyID0gZGF0ZS5nZXREYXRlKCkgLSBkYXRlLmdldERheSgpICsgMTsgLy8gRmlyc3QgZGF5IGlzIHRoZSBkYXkgb2YgdGhlIG1vbnRoIC0gdGhlIGRheSBvZiB0aGUgd2Vla1xyXG4gICAgICAgIGxldCBmaXJzdERheTogbnVtYmVyID0gZGF0ZS5nZXREYXRlKCk7XHJcbiAgICAgICAgaWYgKGRhdGUuZ2V0RGF5KCkgPT09IDApIHtcclxuICAgICAgICAgICAgZmlyc3REYXkgKz0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsYXN0RGF5OiBudW1iZXIgPSBmaXJzdERheSArIDY7IC8vIGxhc3QgZGF5IGlzIHRoZSBmaXJzdCBkYXkgKyA2XHJcblxyXG4gICAgICAgIGxldCBmaXJzdERheU1vbnRoOiBzdHJpbmcgPSBtb250aDtcclxuICAgICAgICBsZXQgbGFzdERheU1vbnRoOiBzdHJpbmcgPSBtb250aDtcclxuXHJcbiAgICAgICAgbGV0IGZpcnN0RGF5WWVhcjogc3RyaW5nID0geWVhcjtcclxuICAgICAgICBsZXQgbGFzdERheVllYXI6IHN0cmluZyA9IHllYXI7XHJcblxyXG4gICAgICAgIGlmIChmaXJzdERheSA8IDEpIHtcclxuICAgICAgICAgICAgY29uc3QgcHJldk1vbnRoRGF0ZTogRGF0ZSA9IG5ldyBEYXRlKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpIC0gMSk7XHJcbiAgICAgICAgICAgIGZpcnN0RGF5TW9udGggPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIHsgbW9udGg6ICdzaG9ydCcgfSkuZm9ybWF0KHByZXZNb250aERhdGUpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXlzSW5QcmV2TW9udGg6IG51bWJlciA9IHRoaXMuZGF5c0luTW9udGgocHJldk1vbnRoRGF0ZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgaTogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgbGV0IHByZXZNb250aERheTogbnVtYmVyID0gZGF5c0luUHJldk1vbnRoO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgTWF0aC5hYnMoZmlyc3REYXkpOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHByZXZNb250aERheS0tO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpcnN0RGF5ID0gcHJldk1vbnRoRGF5O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcHJldk1vbnRoWWVhcjogc3RyaW5nID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobG9jYWxlLCB7IHllYXI6ICdudW1lcmljJyB9KS5mb3JtYXQocHJldk1vbnRoRGF0ZSk7XHJcbiAgICAgICAgICAgIGlmIChOdW1iZXIocHJldk1vbnRoWWVhcikgPCBOdW1iZXIoeWVhcikpIHtcclxuICAgICAgICAgICAgICAgIGZpcnN0RGF5WWVhciA9IHByZXZNb250aFllYXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRheXNJbk1vbnRoOiBudW1iZXIgPSB0aGlzLmRheXNJbk1vbnRoKGRhdGUpO1xyXG4gICAgICAgIGlmIChsYXN0RGF5ID4gZGF5c0luTW9udGgpIHtcclxuICAgICAgICAgICAgY29uc3QgbmV4dE1vbnRoRGF0ZTogRGF0ZSA9IG5ldyBEYXRlKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICAgICAgICAgIGxhc3REYXlNb250aCA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZSwgeyBtb250aDogJ3Nob3J0JyB9KS5mb3JtYXQobmV4dE1vbnRoRGF0ZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgaTogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgbGV0IG5leHRNb250aERheTogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IChsYXN0RGF5IC0gZGF5c0luTW9udGgpOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIG5leHRNb250aERheSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxhc3REYXkgPSBuZXh0TW9udGhEYXk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBuZXh0TW9udGhZZWFyOiBzdHJpbmcgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIHsgeWVhcjogJ251bWVyaWMnIH0pLmZvcm1hdChuZXh0TW9udGhEYXRlKTtcclxuICAgICAgICAgICAgaWYgKE51bWJlcihuZXh0TW9udGhZZWFyKSA+IE51bWJlcih5ZWFyKSkge1xyXG4gICAgICAgICAgICAgICAgbGFzdERheVllYXIgPSBuZXh0TW9udGhZZWFyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYCR7Zmlyc3REYXl9YCArIChmaXJzdERheU1vbnRoICE9PSBsYXN0RGF5TW9udGggPyAnICcgKyBmaXJzdERheU1vbnRoIDogJycpICtcclxuICAgICAgICAgICAgKGZpcnN0RGF5WWVhciAhPT0gbGFzdERheVllYXIgPyAnICcgKyBmaXJzdERheVllYXIgOiAnJykgK1xyXG4gICAgICAgICAgICBgIC0gJHtsYXN0RGF5fSAke2xhc3REYXlNb250aH0gJHtsYXN0RGF5WWVhcn1gO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGF5c0luTW9udGgoYW55RGF0ZUluTW9udGg6IERhdGUpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShhbnlEYXRlSW5Nb250aC5nZXRGdWxsWWVhcigpLCBhbnlEYXRlSW5Nb250aC5nZXRNb250aCgpICsgMSwgMCkuZ2V0RGF0ZSgpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7XHJcbiAgICBzdGFydE9mRGF5LFxyXG4gICAgc3RhcnRPZldlZWssXHJcbiAgICBzdGFydE9mTW9udGgsXHJcbiAgICBlbmRPZkRheSxcclxuICAgIGVuZE9mV2VlayxcclxuICAgIGVuZE9mTW9udGgsXHJcbiAgICBhZGREYXlzLFxyXG4gICAgYWRkV2Vla3MsXHJcbiAgICBhZGRNb250aHMsXHJcbiAgICBzdWJEYXlzLFxyXG4gICAgc3ViV2Vla3MsXHJcbiAgICBzdWJNb250aHNcclxufSBmcm9tICdkYXRlLWZucyc7XHJcblxyXG5leHBvcnQgdHlwZSBDYWxlbmRhclBlcmlvZCA9ICdkYXknIHwgJ3dlZWsnIHwgJ21vbnRoJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRQZXJpb2QocGVyaW9kOiBDYWxlbmRhclBlcmlvZCwgZGF0ZTogRGF0ZSwgYW1vdW50OiBudW1iZXIpOiBEYXRlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF5OiBhZGREYXlzLFxyXG4gICAgICAgIHdlZWs6IGFkZFdlZWtzLFxyXG4gICAgICAgIG1vbnRoOiBhZGRNb250aHNcclxuICAgIH1bcGVyaW9kXShkYXRlLCBhbW91bnQpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3ViUGVyaW9kKHBlcmlvZDogQ2FsZW5kYXJQZXJpb2QsIGRhdGU6IERhdGUsIGFtb3VudDogbnVtYmVyKTogRGF0ZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGRheTogc3ViRGF5cyxcclxuICAgICAgICB3ZWVrOiBzdWJXZWVrcyxcclxuICAgICAgICBtb250aDogc3ViTW9udGhzXHJcbiAgICB9W3BlcmlvZF0oZGF0ZSwgYW1vdW50KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0T2ZQZXJpb2QocGVyaW9kOiBDYWxlbmRhclBlcmlvZCwgZGF0ZTogRGF0ZSk6IERhdGUge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBkYXk6IHN0YXJ0T2ZEYXksXHJcbiAgICAgICAgd2Vlazogc3RhcnRPZldlZWssXHJcbiAgICAgICAgbW9udGg6IHN0YXJ0T2ZNb250aFxyXG4gICAgfVtwZXJpb2RdKGRhdGUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZW5kT2ZQZXJpb2QocGVyaW9kOiBDYWxlbmRhclBlcmlvZCwgZGF0ZTogRGF0ZSk6IERhdGUge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBkYXk6IGVuZE9mRGF5LFxyXG4gICAgICAgIHdlZWs6IGVuZE9mV2VlayxcclxuICAgICAgICBtb250aDogZW5kT2ZNb250aFxyXG4gICAgfVtwZXJpb2RdKGRhdGUpO1xyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBJbmplY3Rpb25Ub2tlbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5cclxuaW1wb3J0IHsgQ2FsZW5kYXJNb2R1bGUgfSBmcm9tICdhbmd1bGFyLWNhbGVuZGFyJztcclxuaW1wb3J0IHsgQ2FsZW5kYXJTY2hlZHVsZXJWaWV3Q29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItdmlldy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDYWxlbmRhclNjaGVkdWxlckNlbGxDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci1jZWxsLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENhbGVuZGFyU2NoZWR1bGVySGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItaGVhZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDYWxlbmRhclNjaGVkdWxlckV2ZW50VGl0bGVDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC10aXRsZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDYWxlbmRhclNjaGVkdWxlckV2ZW50Q29udGVudENvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LWNvbnRlbnQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudEFjdGlvbnNDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zLmNvbXBvbmVudCc7XHJcblxyXG5pbXBvcnQgeyBTY2hlZHVsZXJFdmVudFRpdGxlUGlwZSB9IGZyb20gJy4vcGlwZXMnO1xyXG5pbXBvcnQgeyBTY2hlZHVsZXJFdmVudFRpdGxlRm9ybWF0dGVyIH0gZnJvbSAnLi9mb3JtYXR0ZXJzJztcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vY2FsZW5kYXItc2NoZWR1bGVyLXZpZXcuY29tcG9uZW50JztcclxuZXhwb3J0ICogZnJvbSAnLi9mb3JtYXR0ZXJzJztcclxuZXhwb3J0ICogZnJvbSAnLi9waXBlcyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vY2FsZW5kYXItdXRpbHMnO1xyXG5cclxuaW1wb3J0IHsgU2NoZWR1bGVyQ29uZmlnIH0gZnJvbSAnLi9zY2hlZHVsZXItY29uZmlnJztcclxuXHJcbmV4cG9ydCBjb25zdCBTQ0hFRFVMRVJfQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuKCdTY2hlZHVsZXJDb25maWcnKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlQXV0aENvbmZpZyhjb25maWc6IFNjaGVkdWxlckNvbmZpZykge1xyXG4gICAgcmV0dXJuIG5ldyBTY2hlZHVsZXJDb25maWcoY29uZmlnKTtcclxufVxyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBDYWxlbmRhck1vZHVsZS5mb3JSb290KClcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJWaWV3Q29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJDZWxsQ29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJIZWFkZXJDb21wb25lbnQsXHJcbiAgICBDYWxlbmRhclNjaGVkdWxlckV2ZW50Q29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudFRpdGxlQ29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudENvbnRlbnRDb21wb25lbnQsXHJcbiAgICBDYWxlbmRhclNjaGVkdWxlckV2ZW50QWN0aW9uc0NvbXBvbmVudCxcclxuICAgIFNjaGVkdWxlckV2ZW50VGl0bGVQaXBlXHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIFNjaGVkdWxlckV2ZW50VGl0bGVQaXBlLFxyXG4gICAgU2NoZWR1bGVyRXZlbnRUaXRsZUZvcm1hdHRlclxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJWaWV3Q29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJDZWxsQ29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJIZWFkZXJDb21wb25lbnQsXHJcbiAgICBDYWxlbmRhclNjaGVkdWxlckV2ZW50Q29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudFRpdGxlQ29tcG9uZW50LFxyXG4gICAgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudENvbnRlbnRDb21wb25lbnQsXHJcbiAgICBDYWxlbmRhclNjaGVkdWxlckV2ZW50QWN0aW9uc0NvbXBvbmVudFxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFNjaGVkdWxlck1vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QoY29uZmlnPzogU2NoZWR1bGVyQ29uZmlnKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5nTW9kdWxlOiBTY2hlZHVsZXJNb2R1bGUsXHJcbiAgICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgICAgIHsgcHJvdmlkZTogU0NIRURVTEVSX0NPTkZJRywgdXNlVmFsdWU6IGNvbmZpZyB9LFxyXG4gICAgICAgICAgICB7IHByb3ZpZGU6IFNjaGVkdWxlckNvbmZpZywgdXNlRmFjdG9yeTogcHJvdmlkZUF1dGhDb25maWcsIGRlcHM6IFtTQ0hFRFVMRVJfQ09ORklHXSB9XHJcbiAgICAgICAgXVxyXG4gICAgfTtcclxufVxyXG59XHJcbiJdLCJuYW1lcyI6WyJJbmplY3RhYmxlIiwiRXZlbnRFbWl0dGVyIiwic3RhcnRPZkRheSIsInN0YXJ0T2ZXZWVrIiwiYWRkRGF5cyIsImVuZE9mRGF5IiwiZW5kT2ZXZWVrIiwic2V0RGF0ZSIsInNldE1vbnRoIiwic2V0WWVhciIsImFkZE1pbnV0ZXMiLCJpc1NhbWVTZWNvbmQiLCJzdWJTZWNvbmRzIiwiaXNTYW1lRGF5IiwiZ2V0RGF5Iiwic2V0TWludXRlcyIsInNldEhvdXJzIiwic3RhcnRPZk1pbnV0ZSIsImFkZEhvdXJzIiwiQ29tcG9uZW50IiwiVmlld0VuY2Fwc3VsYXRpb24iLCJDaGFuZ2VEZXRlY3RvclJlZiIsIkluamVjdCIsIkxPQ0FMRV9JRCIsIklucHV0IiwiT3V0cHV0IiwibW9tZW50IiwiUmVuZGVyZXIyIiwidHNsaWJfMS5fX2V4dGVuZHMiLCJDYWxlbmRhckV2ZW50VGl0bGVGb3JtYXR0ZXIiLCJQaXBlIiwiQ2FsZW5kYXJEYXRlRm9ybWF0dGVyIiwiYWRkV2Vla3MiLCJhZGRNb250aHMiLCJzdWJEYXlzIiwic3ViV2Vla3MiLCJzdWJNb250aHMiLCJzdGFydE9mTW9udGgiLCJlbmRPZk1vbnRoIiwiSW5qZWN0aW9uVG9rZW4iLCJOZ01vZHVsZSIsIkNvbW1vbk1vZHVsZSIsIkNhbGVuZGFyTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7UUFVSSx5QkFBWSxNQUE0QjtZQUE1Qix1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