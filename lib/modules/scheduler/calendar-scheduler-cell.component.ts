import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import {
    SchedulerViewDay,
    SchedulerViewHour,
    SchedulerViewHourSegment,
    CalendarSchedulerEvent,
    SchedulerEventTimesChangedEvent
} from './calendar-scheduler-view.component';

// WORKAROUND: https://github.com/dherges/ng-packagr/issues/217#issuecomment-339460255
import * as momentImported from 'moment';
import { CalendarEventTimesChangedEventType } from 'angular-calendar';
const moment = momentImported;

@Component({
    selector: 'calendar-scheduler-cell',
    template: `
        <ng-template #defaultTemplate>
            <div class="cal-scheduler-segments" *ngIf="hour.segments.length > 0"
                [ngClass]="hour?.cssClass">
                <div class="cal-scheduler-segment"
                    *ngFor="let segment of hour.segments; let si = index"
                    [title]="getTitle(segment)"
                    [ngClass]="segment?.cssClass"
                    [class.has-events]="segment.events.length > 0"
                    [class.cal-disabled]="segment.isDisabled"
                    [class.cal-drag-over]="segment.dragOver"
                    [style.backgroundColor]="segment.backgroundColor"
                    [style.height.px]="hourSegmentHeight"
                    (mwlClick)="onSegmentClick($event, segment)"
                    mwlDroppable
                    dragOverClass="cal-drag-over"
                    dragActiveClass="cal-drag-active"
                    (dragEnter)="segment.dragOver = true"
                    (dragLeave)="segment.dragOver = false"
                    (drop)="segment.dragOver = false; onEventDropped($event, segment)">
                    <div class="cal-scheduler-time" *ngIf="showHour">
                        {{ segment.date | calendarDate:'dayViewHour':locale }}
                    </div>
                </div>
            </div>
        </ng-template>
        <ng-template
            [ngTemplateOutlet]="customTemplate || defaultTemplate"
            [ngTemplateOutletContext]="{
                day: day,
                hour: hour,
                locale: locale,
                tooltipPlacement: tooltipPlacement,
                showHour: showHour,
                highlightSegment: highlightSegment,
                unhighlightSegment: unhighlightSegment,
                segmentClicked: segmentClicked,
                eventClicked: eventClicked
            }">
        </ng-template>
    `,
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
})
export class CalendarSchedulerCellComponent implements OnInit {

    @Input() day: SchedulerViewDay;

    @Input() hour: SchedulerViewHour;

    @Input() locale: string;

    @Input() tooltipPlacement: string;

    @Input() customTemplate: TemplateRef<any>;

    @Input() hourSegmentHeight: number = 58;

    @Input() showHour: boolean = false;

    @Output() segmentClicked: EventEmitter<{ segment: SchedulerViewHourSegment }> = new EventEmitter<{ segment: SchedulerViewHourSegment }>();

    @Output() eventClicked: EventEmitter<{ event: CalendarSchedulerEvent }> = new EventEmitter<{ event: CalendarSchedulerEvent }>();

    /**
     * Called when an event is resized or dragged and dropped
     */
    @Output() eventTimesChanged: EventEmitter<SchedulerEventTimesChangedEvent> = new EventEmitter<SchedulerEventTimesChangedEvent>();


    ngOnInit(): void { }

    getTitle(segment: SchedulerViewHourSegment): string {
        return moment(segment.date).format('dddd L, LT');
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

        if (segment.events.length === 0) {
            this.segmentClicked.emit({ segment: segment });
        }
    }

    /**
     * @hidden
     */
    onEventDropped(dropEvent: { dropData?: { event?: CalendarSchedulerEvent } }, segment: SchedulerViewHourSegment): void {
        if (dropEvent.dropData && dropEvent.dropData.event) {
            this.eventTimesChanged.emit({
                type: CalendarEventTimesChangedEventType.Drop,
                event: dropEvent.dropData.event,
                newStart: segment.date,
                newEnd: null
            });
        }
    }
}
