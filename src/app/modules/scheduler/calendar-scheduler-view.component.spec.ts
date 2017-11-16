import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSchedulerViewComponent } from './calendar-scheduler-view.component';

describe('CalendarSchedulerViewComponent', () => {
  let component: CalendarSchedulerViewComponent;
  let fixture: ComponentFixture<CalendarSchedulerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarSchedulerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarSchedulerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
