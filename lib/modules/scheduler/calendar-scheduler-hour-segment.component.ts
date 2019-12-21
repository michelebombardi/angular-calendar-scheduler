import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import {
    SchedulerViewDay,
    SchedulerViewHourSegment,
    CalendarSchedulerEvent
} from './models';

// WORKAROUND: https://github.com/dherges/ng-packagr/issues/217#issuecomment-339460255
import * as momentImported from 'moment';
const moment = momentImported;

@Component({
    selector: 'calendar-scheduler-hour-segment',
    template: `
        <ng-template #defaultTemplate>
            <div class="cal-scheduler-hour-segment"
                [title]="title"
                [ngClass]="segment?.cssClass"
                [class.has-events]="segment.events.length > 0"
                [class.cal-cancelled]="segment.isCancelled"
                [class.cal-disabled]="segment.isDisabled"
                [style.backgroundColor]="segment.backgroundColor"
                [style.height.px]="hourSegmentHeight"
                (mwlClick)="onSegmentClick($event, segment)">
                <div class="cal-scheduler-time unselectable" *ngIf="showHour && segment.events.length === 0">
                    {{ segment.date | calendarDate:'dayViewHour':locale }}
                </div>
            </div>
        </ng-template>
        <ng-template
            [ngTemplateOutlet]="customTemplate || defaultTemplate"
            [ngTemplateOutletContext]="{
                title: title,
                day: day,
                segment: segment,
                locale: locale,
                hourSegmentHeight: hourSegmentHeight,
                showHour: showHour,
                segmentClicked: segmentClicked
            }">
        </ng-template>
    `
})
export class CalendarSchedulerHourSegmentComponent implements OnInit {
    @Input() title: string;

    @Input() day: SchedulerViewDay;

    @Input() segment: SchedulerViewHourSegment;

    @Input() locale: string;

    @Input() customTemplate: TemplateRef<any>;

    @Input() hourSegmentHeight: number = 58;

    @Input() showHour: boolean = false;

    @Output() segmentClicked: EventEmitter<{ segment: SchedulerViewHourSegment }> = new EventEmitter<{ segment: SchedulerViewHourSegment }>();

    ngOnInit(): void {
        this.title = this.title || moment(this.segment.date).format('dddd L, LT');
    }

    /**
     * @hidden
     */
    onMouseEnter(mouseEvent: MouseEvent, segment: SchedulerViewHourSegment, event: CalendarSchedulerEvent): void {
        if (!event.isDisabled && !segment.isDisabled) {
            // Maybe do something
        }
    }

    /**
     * @hidden
     */
    onMouseLeave(mouseEvent: MouseEvent, segment: SchedulerViewHourSegment, event: CalendarSchedulerEvent): void {
        if (!event.isDisabled && !segment.isDisabled) {
            // Maybe do something
        }
    }

    /**
     * @hidden
     */
    onSegmentClick(mouseEvent: MouseEvent, segment: SchedulerViewHourSegment): void {
        if (mouseEvent.stopPropagation) {
            mouseEvent.stopPropagation();
        }

        if (segment.events.length === 0 && !segment.isDisabled && !segment.isCancelled) {
            this.segmentClicked.emit({ segment: segment });
        }
    }
}
