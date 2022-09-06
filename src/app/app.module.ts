import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
registerLocaleData(localeIt);

import { AppComponent } from './app.component';

import { CalendarModule, DateAdapter, MOMENT } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { SchedulerModule } from 'angular-calendar-scheduler';

import { AppService } from './services/app.service';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import moment from 'moment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    SchedulerModule.forRoot({ locale: 'en', headerDateFormat: 'daysRange', logEnabled: true }),
    MatProgressSpinnerModule
  ],
  providers: [
    AppService,
    { provide: LOCALE_ID, useValue: 'en-US' },
    { provide: MOMENT, useValue: moment }   // https://github.com/mattlewis92/angular-calendar/blob/818eff06c88d357c59589a4077559c17ce246585/projects/angular-calendar/src/modules/common/calendar-moment-date-formatter.provider.ts
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
