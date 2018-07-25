import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { SchedulerViewDay } from './calendar-scheduler-view.component';

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
})
export class CalendarSchedulerHeaderComponent {

    @Input() days: SchedulerViewDay[];

    @Input() locale: string;

    @Input() customTemplate: TemplateRef<any>;

    @Output() dayClicked: EventEmitter<{ date: Date }> = new EventEmitter<{ date: Date }>();
}
