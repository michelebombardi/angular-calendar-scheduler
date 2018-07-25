/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Pipe } from '@angular/core';
import { SchedulerEventTitleFormatter } from '../formatters/scheduler-event-title-formatter.provider';
var SchedulerEventTitlePipe = /** @class */ (function () {
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
        { type: Pipe, args: [{
                    name: 'schedulerEventTitle'
                },] },
    ];
    /** @nocollapse */
    SchedulerEventTitlePipe.ctorParameters = function () { return [
        { type: SchedulerEventTitleFormatter }
    ]; };
    return SchedulerEventTitlePipe;
}());
export { SchedulerEventTitlePipe };
if (false) {
    /** @type {?} */
    SchedulerEventTitlePipe.prototype.schedulerEventTitle;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVyLWV2ZW50LXRpdGxlLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLXNjaGVkdWxlci8iLCJzb3VyY2VzIjpbInNyYy9hcHAvbW9kdWxlcy9zY2hlZHVsZXIvcGlwZXMvc2NoZWR1bGVyLWV2ZW50LXRpdGxlLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBRXBELE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHdEQUF3RCxDQUFDOztJQU1wRyxpQ0FBb0IsbUJBQWlEO1FBQWpELHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBOEI7S0FBSTs7Ozs7OztJQUV6RSwyQ0FBUzs7Ozs7O0lBQVQsVUFBVSxLQUFhLEVBQUUsU0FBaUIsRUFBRSxLQUE2QjtRQUN2RSxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ25EOztnQkFSRixJQUFJLFNBQUM7b0JBQ0osSUFBSSxFQUFFLHFCQUFxQjtpQkFDNUI7Ozs7Z0JBSlEsNEJBQTRCOztrQ0FGckM7O1NBT2EsdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDYWxlbmRhclNjaGVkdWxlckV2ZW50IH0gZnJvbSAnLi4vY2FsZW5kYXItc2NoZWR1bGVyLXZpZXcuY29tcG9uZW50JztcclxuaW1wb3J0IHsgU2NoZWR1bGVyRXZlbnRUaXRsZUZvcm1hdHRlciB9IGZyb20gJy4uL2Zvcm1hdHRlcnMvc2NoZWR1bGVyLWV2ZW50LXRpdGxlLWZvcm1hdHRlci5wcm92aWRlcic7XHJcblxyXG5AUGlwZSh7XHJcbiAgbmFtZTogJ3NjaGVkdWxlckV2ZW50VGl0bGUnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTY2hlZHVsZXJFdmVudFRpdGxlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2NoZWR1bGVyRXZlbnRUaXRsZTogU2NoZWR1bGVyRXZlbnRUaXRsZUZvcm1hdHRlcikge31cclxuXHJcbiAgdHJhbnNmb3JtKHRpdGxlOiBzdHJpbmcsIHRpdGxlVHlwZTogc3RyaW5nLCBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5zY2hlZHVsZXJFdmVudFRpdGxlW3RpdGxlVHlwZV0oZXZlbnQpO1xyXG4gIH1cclxufVxyXG4iXX0=