/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from 'date-fns';
/** @typedef {?} */
var CalendarPeriod;
export { CalendarPeriod };
/**
 * @param {?} period
 * @param {?} date
 * @param {?} amount
 * @return {?}
 */
export function addPeriod(period, date, amount) {
    return {
        day: addDays,
        week: addWeeks,
        month: addMonths
    }[period](date, amount);
}
/**
 * @param {?} period
 * @param {?} date
 * @param {?} amount
 * @return {?}
 */
export function subPeriod(period, date, amount) {
    return {
        day: subDays,
        week: subWeeks,
        month: subMonths
    }[period](date, amount);
}
/**
 * @param {?} period
 * @param {?} date
 * @return {?}
 */
export function startOfPeriod(period, date) {
    return {
        day: startOfDay,
        week: startOfWeek,
        month: startOfMonth
    }[period](date);
}
/**
 * @param {?} period
 * @param {?} date
 * @return {?}
 */
export function endOfPeriod(period, date) {
    return {
        day: endOfDay,
        week: endOfWeek,
        month: endOfMonth
    }[period](date);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItdXRpbHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLXNjaGVkdWxlci8iLCJzb3VyY2VzIjpbInNyYy9hcHAvbW9kdWxlcy9zY2hlZHVsZXIvY2FsZW5kYXItdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDSCxVQUFVLEVBQ1YsV0FBVyxFQUNYLFlBQVksRUFDWixRQUFRLEVBQ1IsU0FBUyxFQUNULFVBQVUsRUFDVixPQUFPLEVBQ1AsUUFBUSxFQUNSLFNBQVMsRUFDVCxPQUFPLEVBQ1AsUUFBUSxFQUNSLFNBQVMsRUFDWixNQUFNLFVBQVUsQ0FBQzs7Ozs7Ozs7OztBQUlsQixNQUFNLG9CQUFvQixNQUFzQixFQUFFLElBQVUsRUFBRSxNQUFjO0lBQ3hFLE1BQU0sQ0FBQztRQUNILEdBQUcsRUFBRSxPQUFPO1FBQ1osSUFBSSxFQUFFLFFBQVE7UUFDZCxLQUFLLEVBQUUsU0FBUztLQUNuQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztDQUMzQjs7Ozs7OztBQUVELE1BQU0sb0JBQW9CLE1BQXNCLEVBQUUsSUFBVSxFQUFFLE1BQWM7SUFDeEUsTUFBTSxDQUFDO1FBQ0gsR0FBRyxFQUFFLE9BQU87UUFDWixJQUFJLEVBQUUsUUFBUTtRQUNkLEtBQUssRUFBRSxTQUFTO0tBQ25CLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0NBQzNCOzs7Ozs7QUFFRCxNQUFNLHdCQUF3QixNQUFzQixFQUFFLElBQVU7SUFDNUQsTUFBTSxDQUFDO1FBQ0gsR0FBRyxFQUFFLFVBQVU7UUFDZixJQUFJLEVBQUUsV0FBVztRQUNqQixLQUFLLEVBQUUsWUFBWTtLQUN0QixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ25COzs7Ozs7QUFFRCxNQUFNLHNCQUFzQixNQUFzQixFQUFFLElBQVU7SUFDMUQsTUFBTSxDQUFDO1FBQ0gsR0FBRyxFQUFFLFFBQVE7UUFDYixJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxVQUFVO0tBQ3BCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gICAgc3RhcnRPZkRheSxcclxuICAgIHN0YXJ0T2ZXZWVrLFxyXG4gICAgc3RhcnRPZk1vbnRoLFxyXG4gICAgZW5kT2ZEYXksXHJcbiAgICBlbmRPZldlZWssXHJcbiAgICBlbmRPZk1vbnRoLFxyXG4gICAgYWRkRGF5cyxcclxuICAgIGFkZFdlZWtzLFxyXG4gICAgYWRkTW9udGhzLFxyXG4gICAgc3ViRGF5cyxcclxuICAgIHN1YldlZWtzLFxyXG4gICAgc3ViTW9udGhzXHJcbn0gZnJvbSAnZGF0ZS1mbnMnO1xyXG5cclxuZXhwb3J0IHR5cGUgQ2FsZW5kYXJQZXJpb2QgPSAnZGF5JyB8ICd3ZWVrJyB8ICdtb250aCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkUGVyaW9kKHBlcmlvZDogQ2FsZW5kYXJQZXJpb2QsIGRhdGU6IERhdGUsIGFtb3VudDogbnVtYmVyKTogRGF0ZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGRheTogYWRkRGF5cyxcclxuICAgICAgICB3ZWVrOiBhZGRXZWVrcyxcclxuICAgICAgICBtb250aDogYWRkTW9udGhzXHJcbiAgICB9W3BlcmlvZF0oZGF0ZSwgYW1vdW50KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN1YlBlcmlvZChwZXJpb2Q6IENhbGVuZGFyUGVyaW9kLCBkYXRlOiBEYXRlLCBhbW91bnQ6IG51bWJlcik6IERhdGUge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBkYXk6IHN1YkRheXMsXHJcbiAgICAgICAgd2Vlazogc3ViV2Vla3MsXHJcbiAgICAgICAgbW9udGg6IHN1Yk1vbnRoc1xyXG4gICAgfVtwZXJpb2RdKGRhdGUsIGFtb3VudCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdGFydE9mUGVyaW9kKHBlcmlvZDogQ2FsZW5kYXJQZXJpb2QsIGRhdGU6IERhdGUpOiBEYXRlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF5OiBzdGFydE9mRGF5LFxyXG4gICAgICAgIHdlZWs6IHN0YXJ0T2ZXZWVrLFxyXG4gICAgICAgIG1vbnRoOiBzdGFydE9mTW9udGhcclxuICAgIH1bcGVyaW9kXShkYXRlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVuZE9mUGVyaW9kKHBlcmlvZDogQ2FsZW5kYXJQZXJpb2QsIGRhdGU6IERhdGUpOiBEYXRlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF5OiBlbmRPZkRheSxcclxuICAgICAgICB3ZWVrOiBlbmRPZldlZWssXHJcbiAgICAgICAgbW9udGg6IGVuZE9mTW9udGhcclxuICAgIH1bcGVyaW9kXShkYXRlKTtcclxufVxyXG4iXX0=