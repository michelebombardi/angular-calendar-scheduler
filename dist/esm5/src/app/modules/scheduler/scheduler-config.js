/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
/**
 * Auth configuration.
 */
var SchedulerConfig = /** @class */ (function () {
    function SchedulerConfig(config) {
        if (config === void 0) { config = {}; }
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
        { type: Injectable },
    ];
    /** @nocollapse */
    SchedulerConfig.ctorParameters = function () { return [
        { type: SchedulerConfig }
    ]; };
    return SchedulerConfig;
}());
export { SchedulerConfig };
if (false) {
    /** @type {?} */
    SchedulerConfig.prototype.locale;
    /** @type {?} */
    SchedulerConfig.prototype.headerDateFormat;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVyLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2FsZW5kYXItc2NoZWR1bGVyLyIsInNvdXJjZXMiOlsic3JjL2FwcC9tb2R1bGVzL3NjaGVkdWxlci9zY2hlZHVsZXItY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7OztJQVV2Qyx5QkFBWSxNQUE0QjtRQUE1Qix1QkFBQSxFQUFBLFdBQTRCO3NCQUh0QixJQUFJO2dDQUMwQixXQUFXOzs7Ozs7O1FBR3ZELGFBQWdCLE1BQVMsRUFBRSxZQUFlO1lBQ3RDLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7U0FDakU7UUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztLQUMvRTs7Z0JBWkosVUFBVTs7OztnQkFLYSxlQUFlOzswQkFWdkM7O1NBTWEsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbi8qKlxyXG4gKiBBdXRoIGNvbmZpZ3VyYXRpb24uXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBTY2hlZHVsZXJDb25maWcge1xyXG4gICAgbG9jYWxlPzogc3RyaW5nID0gJ2VuJztcclxuICAgIGhlYWRlckRhdGVGb3JtYXQ/OiAnd2Vla051bWJlcicgfCAnZGF5c1JhbmdlJyA9ICdkYXlzUmFuZ2UnO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogU2NoZWR1bGVyQ29uZmlnID0ge30pIHtcclxuICAgICAgICBmdW5jdGlvbiB1c2U8VD4oc291cmNlOiBULCBkZWZhdWx0VmFsdWU6IFQpOiBUIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZyAmJiBzb3VyY2UgIT09IHVuZGVmaW5lZCA/IHNvdXJjZSA6IGRlZmF1bHRWYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubG9jYWxlID0gdXNlKGNvbmZpZy5sb2NhbGUsIHRoaXMubG9jYWxlKTtcclxuICAgICAgICB0aGlzLmhlYWRlckRhdGVGb3JtYXQgPSB1c2UoY29uZmlnLmhlYWRlckRhdGVGb3JtYXQsIHRoaXMuaGVhZGVyRGF0ZUZvcm1hdCk7XHJcbiAgICB9XHJcbn1cclxuIl19