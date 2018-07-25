/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { CalendarDateFormatter } from 'angular-calendar';
var SchedulerDateFormatter = /** @class */ (function (_super) {
    tslib_1.__extends(SchedulerDateFormatter, _super);
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
}(CalendarDateFormatter));
export { SchedulerDateFormatter };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVyLWRhdGUtZm9ybWF0dGVyLnByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIvIiwic291cmNlcyI6WyJzcmMvYXBwL21vZHVsZXMvc2NoZWR1bGVyL2Zvcm1hdHRlcnMvc2NoZWR1bGVyLWRhdGUtZm9ybWF0dGVyLnByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLHFCQUFxQixFQUF1QixNQUFNLGtCQUFrQixDQUFDO0FBRTlFLElBQUE7SUFBNEMsa0RBQXFCOzs7Ozs7Ozs7SUFLdEQsNENBQVc7Ozs7O2NBQUMsRUFBcUM7WUFBbkMsY0FBSSxFQUFFLGtCQUFNO1FBQzdCLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7OztJQUd6Riw4Q0FBYTs7OztjQUFDLEVBQXFDO1lBQW5DLGNBQUksRUFBRSxrQkFBTTs7UUFFL0IsSUFBTSxJQUFJLEdBQVcsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7UUFDdkYsSUFBTSxLQUFLLEdBQVcsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7UUFHdkYsSUFBSSxRQUFRLEdBQVcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLFFBQVEsSUFBSSxDQUFD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QUFHLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDOUUsQ0FBQyxZQUFZLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7YUFDeEQsUUFBTSxPQUFPLFNBQUksWUFBWSxTQUFJLFdBQWEsQ0FBQSxDQUFDOzs7Ozs7SUFHL0MsNENBQVc7Ozs7Y0FBQyxjQUFvQjtRQUNwQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxFQUFFLGNBQWMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7O2lDQXhFbEc7RUFFNEMscUJBQXFCLEVBd0VoRSxDQUFBO0FBeEVELGtDQXdFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhbGVuZGFyRGF0ZUZvcm1hdHRlciwgRGF0ZUZvcm1hdHRlclBhcmFtcyB9IGZyb20gJ2FuZ3VsYXItY2FsZW5kYXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjaGVkdWxlckRhdGVGb3JtYXR0ZXIgZXh0ZW5kcyBDYWxlbmRhckRhdGVGb3JtYXR0ZXIge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIHRpbWUgZm9ybWF0dGluZyBkb3duIHRoZSBsZWZ0IGhhbmQgc2lkZSBvZiB0aGUgZGF5IHZpZXdcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRheVZpZXdIb3VyKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIHsgaG91cjogJ251bWVyaWMnLCBtaW51dGU6ICdudW1lcmljJyB9KS5mb3JtYXQoZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHdlZWtWaWV3VGl0bGUoeyBkYXRlLCBsb2NhbGUgfTogRGF0ZUZvcm1hdHRlclBhcmFtcyk6IHN0cmluZyB7XHJcbiAgICAgICAgLy8gaHR0cDovL2dlbmVyYXRlZGNvbnRlbnQub3JnL3Bvc3QvNTk0MDMxNjgwMTYvZXNpbnRsYXBpXHJcbiAgICAgICAgY29uc3QgeWVhcjogc3RyaW5nID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobG9jYWxlLCB7IHllYXI6ICdudW1lcmljJyB9KS5mb3JtYXQoZGF0ZSk7XHJcbiAgICAgICAgY29uc3QgbW9udGg6IHN0cmluZyA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZSwgeyBtb250aDogJ3Nob3J0JyB9KS5mb3JtYXQoZGF0ZSk7XHJcblxyXG4gICAgICAgIC8vIHZhciBmaXJzdERheTogbnVtYmVyID0gZGF0ZS5nZXREYXRlKCkgLSBkYXRlLmdldERheSgpICsgMTsgLy8gRmlyc3QgZGF5IGlzIHRoZSBkYXkgb2YgdGhlIG1vbnRoIC0gdGhlIGRheSBvZiB0aGUgd2Vla1xyXG4gICAgICAgIGxldCBmaXJzdERheTogbnVtYmVyID0gZGF0ZS5nZXREYXRlKCk7XHJcbiAgICAgICAgaWYgKGRhdGUuZ2V0RGF5KCkgPT09IDApIHtcclxuICAgICAgICAgICAgZmlyc3REYXkgKz0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsYXN0RGF5OiBudW1iZXIgPSBmaXJzdERheSArIDY7IC8vIGxhc3QgZGF5IGlzIHRoZSBmaXJzdCBkYXkgKyA2XHJcblxyXG4gICAgICAgIGxldCBmaXJzdERheU1vbnRoOiBzdHJpbmcgPSBtb250aDtcclxuICAgICAgICBsZXQgbGFzdERheU1vbnRoOiBzdHJpbmcgPSBtb250aDtcclxuXHJcbiAgICAgICAgbGV0IGZpcnN0RGF5WWVhcjogc3RyaW5nID0geWVhcjtcclxuICAgICAgICBsZXQgbGFzdERheVllYXI6IHN0cmluZyA9IHllYXI7XHJcblxyXG4gICAgICAgIGlmIChmaXJzdERheSA8IDEpIHtcclxuICAgICAgICAgICAgY29uc3QgcHJldk1vbnRoRGF0ZTogRGF0ZSA9IG5ldyBEYXRlKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpIC0gMSk7XHJcbiAgICAgICAgICAgIGZpcnN0RGF5TW9udGggPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIHsgbW9udGg6ICdzaG9ydCcgfSkuZm9ybWF0KHByZXZNb250aERhdGUpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXlzSW5QcmV2TW9udGg6IG51bWJlciA9IHRoaXMuZGF5c0luTW9udGgocHJldk1vbnRoRGF0ZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgaTogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgbGV0IHByZXZNb250aERheTogbnVtYmVyID0gZGF5c0luUHJldk1vbnRoO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgTWF0aC5hYnMoZmlyc3REYXkpOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHByZXZNb250aERheS0tO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpcnN0RGF5ID0gcHJldk1vbnRoRGF5O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcHJldk1vbnRoWWVhcjogc3RyaW5nID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobG9jYWxlLCB7IHllYXI6ICdudW1lcmljJyB9KS5mb3JtYXQocHJldk1vbnRoRGF0ZSk7XHJcbiAgICAgICAgICAgIGlmIChOdW1iZXIocHJldk1vbnRoWWVhcikgPCBOdW1iZXIoeWVhcikpIHtcclxuICAgICAgICAgICAgICAgIGZpcnN0RGF5WWVhciA9IHByZXZNb250aFllYXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRheXNJbk1vbnRoOiBudW1iZXIgPSB0aGlzLmRheXNJbk1vbnRoKGRhdGUpO1xyXG4gICAgICAgIGlmIChsYXN0RGF5ID4gZGF5c0luTW9udGgpIHtcclxuICAgICAgICAgICAgY29uc3QgbmV4dE1vbnRoRGF0ZTogRGF0ZSA9IG5ldyBEYXRlKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICAgICAgICAgIGxhc3REYXlNb250aCA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZSwgeyBtb250aDogJ3Nob3J0JyB9KS5mb3JtYXQobmV4dE1vbnRoRGF0ZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgaTogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgbGV0IG5leHRNb250aERheTogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IChsYXN0RGF5IC0gZGF5c0luTW9udGgpOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIG5leHRNb250aERheSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxhc3REYXkgPSBuZXh0TW9udGhEYXk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBuZXh0TW9udGhZZWFyOiBzdHJpbmcgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIHsgeWVhcjogJ251bWVyaWMnIH0pLmZvcm1hdChuZXh0TW9udGhEYXRlKTtcclxuICAgICAgICAgICAgaWYgKE51bWJlcihuZXh0TW9udGhZZWFyKSA+IE51bWJlcih5ZWFyKSkge1xyXG4gICAgICAgICAgICAgICAgbGFzdERheVllYXIgPSBuZXh0TW9udGhZZWFyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYCR7Zmlyc3REYXl9YCArIChmaXJzdERheU1vbnRoICE9PSBsYXN0RGF5TW9udGggPyAnICcgKyBmaXJzdERheU1vbnRoIDogJycpICtcclxuICAgICAgICAgICAgKGZpcnN0RGF5WWVhciAhPT0gbGFzdERheVllYXIgPyAnICcgKyBmaXJzdERheVllYXIgOiAnJykgK1xyXG4gICAgICAgICAgICBgIC0gJHtsYXN0RGF5fSAke2xhc3REYXlNb250aH0gJHtsYXN0RGF5WWVhcn1gO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGF5c0luTW9udGgoYW55RGF0ZUluTW9udGg6IERhdGUpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShhbnlEYXRlSW5Nb250aC5nZXRGdWxsWWVhcigpLCBhbnlEYXRlSW5Nb250aC5nZXRNb250aCgpICsgMSwgMCkuZ2V0RGF0ZSgpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==