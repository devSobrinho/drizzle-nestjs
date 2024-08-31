import { addMinutes, addHours, addDays, addMonths, addYears } from 'date-fns';

type TDateType = 'minutes' | 'hours' | 'days' | 'months' | 'years';

export class DateHelper {
  static generateFutureTime(type: TDateType, value: number): Date {
    const date = new Date();
    const fn = {
      minutes: addMinutes,
      hours: addHours,
      days: addDays,
      months: addMonths,
      years: addYears,
    }[type];

    return fn(date, value);
  }
}
