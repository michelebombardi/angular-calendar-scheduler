import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
registerLocaleData(localeIt);

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
    SchedulerModule.forRoot({ locale: 'en', headerDateFormat: 'daysRange' })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-US' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
