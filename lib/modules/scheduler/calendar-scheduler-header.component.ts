import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { SchedulerViewDay } from './models';

@Component({
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
                        (mwlClick)="onDayHeaderClick($event, day)">
                        <b>{{ day.date | calendarDate:'weekViewColumnHeader':locale }}</b><br>
                        <span>{{ day.date | calendarDate:'weekViewColumnSubHeader':locale }}</span>
                    </div>
                </div>
            </div>
        </ng-template>
        <ng-template
            [ngTemplateOutlet]="customTemplate || defaultTemplate"
            [ngTemplateOutletContext]="{
                days: days,
                locale: locale,
                dayHeaderClicked: dayHeaderClicked
            }">
        </ng-template>
    `
})
export class CalendarSchedulerHeaderComponent {

    @Input() days: SchedulerViewDay[];

    @Input() locale: string;

    @Input() customTemplate: TemplateRef<any>;

    @Output() dayHeaderClicked: EventEmitter<{ day: SchedulerViewDay }> = new EventEmitter<{ day: SchedulerViewDay }>();

    /**
     * @hidden
     */
    onDayHeaderClick(mouseEvent: MouseEvent, day: SchedulerViewDay): void {
        if (mouseEvent.stopPropagation) {
            mouseEvent.stopPropagation();
        }

        this.dayHeaderClicked.emit({ day: day });
    }
}
