/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
export class CalendarSchedulerHeaderComponent {
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
if (false) {
    /** @type {?} */
    CalendarSchedulerHeaderComponent.prototype.days;
    /** @type {?} */
    CalendarSchedulerHeaderComponent.prototype.locale;
    /** @type {?} */
    CalendarSchedulerHeaderComponent.prototype.customTemplate;
    /** @type {?} */
    CalendarSchedulerHeaderComponent.prototype.dayClicked;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItc2NoZWR1bGVyLWhlYWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLXNjaGVkdWxlci8iLCJzb3VyY2VzIjpbInNyYy9hcHAvbW9kdWxlcy9zY2hlZHVsZXIvY2FsZW5kYXItc2NoZWR1bGVyLWhlYWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBa0NwRixNQUFNOzswQkFRbUQsSUFBSSxZQUFZLEVBQWtCOzs7O1lBdkMxRixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLDJCQUEyQjtnQkFDckMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0EyQlQ7YUFDSjs7O21CQUdJLEtBQUs7cUJBRUwsS0FBSzs2QkFFTCxLQUFLO3lCQUVMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU2NoZWR1bGVyVmlld0RheSB9IGZyb20gJy4vY2FsZW5kYXItc2NoZWR1bGVyLXZpZXcuY29tcG9uZW50JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdjYWxlbmRhci1zY2hlZHVsZXItaGVhZGVyJyxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICAgICAgPG5nLXRlbXBsYXRlICNkZWZhdWx0VGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLWhlYWRlcnNcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtaGVhZGVyIGFzaWRlIGNhbC1oZWFkZXItY2xvY2sgYWxpZ24tY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBtZC0zMlwiIHN0eWxlPVwibWFyZ2luOmF1dG87XCI+c2NoZWR1bGU8L2k+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLWhlYWRlci1jb2xzIGFzaWRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImNhbC1oZWFkZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgZGF5IG9mIGRheXNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbY2xhc3MuY2FsLXBhc3RdPVwiZGF5LmlzUGFzdFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjbGFzcy5jYWwtdG9kYXldPVwiZGF5LmlzVG9kYXlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbY2xhc3MuY2FsLWZ1dHVyZV09XCJkYXkuaXNGdXR1cmVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbY2xhc3MuY2FsLXdlZWtlbmRdPVwiZGF5LmlzV2Vla2VuZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjbGFzcy5jYWwtZHJhZy1vdmVyXT1cImRheS5kcmFnT3ZlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChtd2xDbGljayk9XCJkYXlDbGlja2VkLmVtaXQoe2RhdGU6IGRheS5kYXRlfSlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGI+e3sgZGF5LmRhdGUgfCBjYWxlbmRhckRhdGU6J3dlZWtWaWV3Q29sdW1uSGVhZGVyJzpsb2NhbGUgfX08L2I+PGJyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57eyBkYXkuZGF0ZSB8IGNhbGVuZGFyRGF0ZTond2Vla1ZpZXdDb2x1bW5TdWJIZWFkZXInOmxvY2FsZSB9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZVxyXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxyXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie2RheXM6IGRheXMsIGxvY2FsZTogbG9jYWxlLCBkYXlDbGlja2VkOiBkYXlDbGlja2VkfVwiPlxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICBgXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDYWxlbmRhclNjaGVkdWxlckhlYWRlckNvbXBvbmVudCB7XHJcblxyXG4gICAgQElucHV0KCkgZGF5czogU2NoZWR1bGVyVmlld0RheVtdO1xyXG5cclxuICAgIEBJbnB1dCgpIGxvY2FsZTogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dCgpIGN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICAgIEBPdXRwdXQoKSBkYXlDbGlja2VkOiBFdmVudEVtaXR0ZXI8eyBkYXRlOiBEYXRlIH0+ID0gbmV3IEV2ZW50RW1pdHRlcjx7IGRhdGU6IERhdGUgfT4oKTtcclxufVxyXG4iXX0=