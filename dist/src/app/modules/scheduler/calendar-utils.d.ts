export declare type CalendarPeriod = 'day' | 'week' | 'month';
export declare function addPeriod(period: CalendarPeriod, date: Date, amount: number): Date;
export declare function subPeriod(period: CalendarPeriod, date: Date, amount: number): Date;
export declare function startOfPeriod(period: CalendarPeriod, date: Date): Date;
export declare function endOfPeriod(period: CalendarPeriod, date: Date): Date;
