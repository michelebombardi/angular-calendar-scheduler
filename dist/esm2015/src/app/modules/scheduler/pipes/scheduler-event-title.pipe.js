/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Pipe } from '@angular/core';
import { SchedulerEventTitleFormatter } from '../formatters/scheduler-event-title-formatter.provider';
export class SchedulerEventTitlePipe {
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
if (false) {
    /** @type {?} */
    SchedulerEventTitlePipe.prototype.schedulerEventTitle;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVyLWV2ZW50LXRpdGxlLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLXNjaGVkdWxlci8iLCJzb3VyY2VzIjpbInNyYy9hcHAvbW9kdWxlcy9zY2hlZHVsZXIvcGlwZXMvc2NoZWR1bGVyLWV2ZW50LXRpdGxlLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBRXBELE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBS3RHLE1BQU07Ozs7SUFDSixZQUFvQixtQkFBaUQ7UUFBakQsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUE4QjtLQUFJOzs7Ozs7O0lBRXpFLFNBQVMsQ0FBQyxLQUFhLEVBQUUsU0FBaUIsRUFBRSxLQUE2QjtRQUN2RSxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ25EOzs7WUFSRixJQUFJLFNBQUM7Z0JBQ0osSUFBSSxFQUFFLHFCQUFxQjthQUM1Qjs7OztZQUpRLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ2FsZW5kYXJTY2hlZHVsZXJFdmVudCB9IGZyb20gJy4uL2NhbGVuZGFyLXNjaGVkdWxlci12aWV3LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFNjaGVkdWxlckV2ZW50VGl0bGVGb3JtYXR0ZXIgfSBmcm9tICcuLi9mb3JtYXR0ZXJzL3NjaGVkdWxlci1ldmVudC10aXRsZS1mb3JtYXR0ZXIucHJvdmlkZXInO1xyXG5cclxuQFBpcGUoe1xyXG4gIG5hbWU6ICdzY2hlZHVsZXJFdmVudFRpdGxlJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgU2NoZWR1bGVyRXZlbnRUaXRsZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNjaGVkdWxlckV2ZW50VGl0bGU6IFNjaGVkdWxlckV2ZW50VGl0bGVGb3JtYXR0ZXIpIHt9XHJcblxyXG4gIHRyYW5zZm9ybSh0aXRsZTogc3RyaW5nLCB0aXRsZVR5cGU6IHN0cmluZywgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuc2NoZWR1bGVyRXZlbnRUaXRsZVt0aXRsZVR5cGVdKGV2ZW50KTtcclxuICB9XHJcbn1cclxuIl19