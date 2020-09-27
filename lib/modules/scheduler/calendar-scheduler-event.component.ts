import { Component, Input, Output, EventEmitter, TemplateRef, OnInit, ElementRef, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import {
    SchedulerViewDay,
    CalendarSchedulerEvent,
    SchedulerViewEvent
} from './models';

// WORKAROUND: https://github.com/dherges/ng-packagr/issues/217#issuecomment-339460255
import * as momentImported from 'moment';
const moment = momentImported;

@Component({
    selector: 'calendar-scheduler-event',
    template: `
        <ng-template #defaultTemplate>
            <div class="cal-scheduler-event"
                [title]="title"
                [style.max-width.px]="container.clientWidth - 4"
                [class.cal-cancelled]="event.event.isCancelled"
                [class.cal-disabled]="event.event.isDisabled"
                [class.cal-not-clickable]="!event.event.isClickable"
                [class.cal-draggable]="event.event.draggable"
                [class.cal-starts-before-day]="event.startsBeforeDay"
                [class.cal-ends-after-day]="event.endsAfterDay"
                [style.backgroundColor]="event.event.color?.secondary"
                [style.borderColor]="event.event.color?.primary"
                (mwlClick)="onEventClick($event, event.event)"
                (mouseenter)="onMouseEnter()"
                (mouseleave)="onMouseLeave()">
                <calendar-scheduler-event-title
                    view="week"
                    [event]="event.event"
                    [showStatus]="showStatus"
                    [showContent]="showContent"
                    [showActions]="showActions"
                    [customTemplate]="eventTitleTemplate">
                </calendar-scheduler-event-title>
                <calendar-scheduler-event-content
                    *ngIf="showContent"
                    [event]="event.event"
                    [eventContainer]="container">
                </calendar-scheduler-event-content>
                <calendar-scheduler-event-actions
                    *ngIf="showActions && showContent && (event.event.isClickable || event.event.isDisabled)"
                    [event]="event.event">
                </calendar-scheduler-event-actions>
            </div>
        </ng-template>
        <ng-template
            [ngTemplateOutlet]="customTemplate || defaultTemplate"
            [ngTemplateOutletContext]="{
                title: title,
                day: day,
                event: event,
                showContent: showContent,
                showActions: showActions,
                showStatus: showStatus,
                eventTitleTemplate: eventTitleTemplate,
                eventClicked: eventClicked
            }">
        </ng-template>
    `,
    host: {
        '[style.height.%]': '100'
    }
})
export class CalendarSchedulerEventComponent implements OnInit, AfterContentChecked {
    @Input() title: string;

    @Input() day: SchedulerViewDay;

    @Input() event: SchedulerViewEvent;

    @Input() container: HTMLElement;

    @Input() showContent: boolean = true;

    @Input() showActions: boolean = true;

    @Input() showStatus: boolean = true;

    @Input() customTemplate: TemplateRef<any>;

    @Input() eventTitleTemplate: TemplateRef<any>;

    @Output() eventClicked: EventEmitter<{ event: CalendarSchedulerEvent }> = new EventEmitter<{ event: CalendarSchedulerEvent }>();

    constructor(private hostElement: ElementRef, protected changeDetectorRef: ChangeDetectorRef) {   }

    public ngOnInit(): void {
        this.title = this.title || `${this.event.event.title}, ${this.event.event.content ? `${this.event.event.content},` : null} ${moment(this.event.event.start).format('dddd L, LT')}`;
    }

    public ngAfterContentChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    onMouseEnter(): void {
        // Maybe do something
    }

    onMouseLeave(): void {
        // Maybe do something
    }

    /**
     * @hidden
     */
    onEventClick(mouseEvent: MouseEvent, event: CalendarSchedulerEvent): void {
        if (mouseEvent.stopPropagation) {
            mouseEvent.stopPropagation();
        }
        if (event.isClickable) {
            this.eventClicked.emit({ event: event });
        }
    }
}
