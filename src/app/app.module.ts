import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';


import { AppComponent } from './app.component';

import { CalendarModule } from 'angular-calendar';
import { SchedulerModule } from './modules/scheduler/scheduler.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CalendarModule.forRoot(),
    SchedulerModule.forRoot({ locale: 'en', headerDateFormat: 'weekNumber' })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-US' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
