import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment-timezone';
@Pipe({
  name: 'momentDate'
})
export class MomentDatePipe extends DatePipe implements PipeTransform {
  transform(value: any, format: any , timezone: any ): any {
    let timezoneOffset = moment.tz(timezone).format('Z');
    return super.transform(value, format, timezoneOffset);
  }
}
