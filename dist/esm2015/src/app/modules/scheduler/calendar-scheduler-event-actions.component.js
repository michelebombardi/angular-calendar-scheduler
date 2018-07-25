/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
export class CalendarSchedulerEventActionsComponent {
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
if (false) {
    /** @type {?} */
    CalendarSchedulerEventActionsComponent.prototype.event;
    /** @type {?} */
    CalendarSchedulerEventActionsComponent.prototype.actions;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItc2NoZWR1bGVyLWV2ZW50LWFjdGlvbnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci1zY2hlZHVsZXIvIiwic291cmNlcyI6WyJzcmMvYXBwL21vZHVsZXMvc2NoZWR1bGVyL2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUF5QnpELE1BQU07O3VCQUkrQyxFQUFFOzs7OztJQUU1QyxRQUFRO1FBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQStCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDbEcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBK0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUM7Ozs7Ozs7OztJQU14RyxhQUFhLENBQUMsVUFBc0IsRUFBRSxNQUFvQyxFQUFFLEtBQTZCO1FBQ3JHLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzdCLFVBQVUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUNoQztRQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDekI7OztZQXhDSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGtDQUFrQztnQkFDNUMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7S0FZVDtnQkFDRCxJQUFJLEVBQUU7b0JBQ0YsT0FBTyxFQUFFLHVDQUF1QztpQkFDbkQ7YUFDSjs7O29CQUdJLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICAgIENhbGVuZGFyU2NoZWR1bGVyRXZlbnQsXHJcbiAgICBDYWxlbmRhclNjaGVkdWxlckV2ZW50QWN0aW9uXHJcbn0gZnJvbSAnLi9jYWxlbmRhci1zY2hlZHVsZXItdmlldy5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2NhbGVuZGFyLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zJyxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICAgICAgPHNwYW4gKm5nSWY9XCJldmVudC5hY3Rpb25zXCIgY2xhc3M9XCJjYWwtc2NoZWR1bGVyLWV2ZW50LWFjdGlvbnNcIj5cclxuICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiY2FsLXNjaGVkdWxlci1ldmVudC1hY3Rpb25cIlxyXG4gICAgICAgICAgICAgICAgaHJlZj1cImphdmFzY3JpcHQ6O1wiXHJcbiAgICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgYWN0aW9uIG9mIGFjdGlvbnNcIlxyXG4gICAgICAgICAgICAgICAgKG13bENsaWNrKT1cIm9uQWN0aW9uQ2xpY2soJGV2ZW50LCBhY3Rpb24sIGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJhY3Rpb24uY3NzQ2xhc3NcIlxyXG4gICAgICAgICAgICAgICAgW2lubmVySHRtbF09XCJhY3Rpb24ubGFiZWxcIlxyXG4gICAgICAgICAgICAgICAgW3RpdGxlXT1cImFjdGlvbi50aXRsZVwiPlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9zcGFuPlxyXG4gICAgYCxcclxuICAgIGhvc3Q6IHtcclxuICAgICAgICAnY2xhc3MnOiAnY2FsLXNjaGVkdWxlci1ldmVudC1hY3Rpb25zLWNvbnRhaW5lcidcclxuICAgIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIENhbGVuZGFyU2NoZWR1bGVyRXZlbnRBY3Rpb25zQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgICBASW5wdXQoKSBldmVudDogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudDtcclxuXHJcbiAgICBwdWJsaWMgYWN0aW9uczogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudEFjdGlvbltdID0gW107XHJcblxyXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucyA9IHRoaXMuZXZlbnQuaXNEaXNhYmxlZCA/XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnQuYWN0aW9ucy5maWx0ZXIoKGE6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRBY3Rpb24pID0+ICFhLndoZW4gfHwgYS53aGVuID09PSAnZGlzYWJsZWQnKSA6XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnQuYWN0aW9ucy5maWx0ZXIoKGE6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnRBY3Rpb24pID0+ICFhLndoZW4gfHwgYS53aGVuID09PSAnZW5hYmxlZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGhpZGRlblxyXG4gICAgICovXHJcbiAgICBvbkFjdGlvbkNsaWNrKG1vdXNlRXZlbnQ6IE1vdXNlRXZlbnQsIGFjdGlvbjogQ2FsZW5kYXJTY2hlZHVsZXJFdmVudEFjdGlvbiwgZXZlbnQ6IENhbGVuZGFyU2NoZWR1bGVyRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAobW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24pIHtcclxuICAgICAgICAgICAgbW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFjdGlvbi5vbkNsaWNrKGV2ZW50KTtcclxuICAgIH1cclxufVxyXG4iXX0=