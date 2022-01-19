import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as momentTz from 'moment-timezone';
import { NgbCalendar, NgbDate, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../services/shared.service';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

export interface Configuration {
  ordType?: 'FTL' | 'LTL' | 'EXPEDITE' | 'DIRECT_DRIVE';
  dateLabel: string | null;
  timeLabel: string | null;
  visible: 'DATE' | 'TIME' | 'BOTH';
  isRequired?: true | false;
}
@Component({
  selector: 'date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss']
})
export class DateTimeComponent implements OnInit,OnChanges {
  public utcDateAndTime: FormGroup;
  public maximumDate: any | null = null;
  public minimumDate: any | null = null;
  public markDisabled: any;
  public spinners: boolean = true;
  fontData={calender:faCalendarCheck};
  @Input() customClass: string = 'col-sm-12';
  month: any = {
    1: '0',
    2: '1',
    3: '2',
    4: '3',
    5: '4',
    6: '5',
    7: '6',
    8: '7',
    9: '8',
    10: '9',
    11: '10',
    12: '11',
  };
  @Input() systemConf: Configuration = { dateLabel: 'Pick Date', timeLabel: 'select Time', visible: 'BOTH', isRequired: false };
  @Output() dateUtc: EventEmitter<string> = new EventEmitter<string>();
  @Output() timeUtc: EventEmitter<string> = new EventEmitter<string>();
  @Input() dateObject: string | null = null;
  @Input() timeObject: string | null = null;
  @Input() minDate: string | null = null;
  @Input() maxDate: string | null = null;
  @Input() reset: string = 'none';
  constructor(private share: SharedService, calendar: NgbCalendar) {
    this.utcDateAndTime = new FormGroup({
      date: new FormControl(null),
      time: new FormControl(null)
    });
    //this.markDisabled = (date: NgbDate) => calendar.getWeekday(date) >= 6;
  }

  ngOnChanges(change: SimpleChanges): void {
    if (change.reset && change.reset.currentValue !== undefined) {
      const reset = change.reset.currentValue;
      if (reset === 'reset') this.utcDateAndTime.get('date')?.reset();
    }
    if (change.minDate && change.minDate.currentValue !== undefined) {
      const newDate = change.minDate.currentValue;
      const timeZone = this.share.getTimeZone() ? this.share.getTimeZone() : moment.tz.guess();
      const date = {
        year: moment(newDate).tz(timeZone).year(),
        month: moment(newDate).tz(timeZone).month() + 1,
        day: moment(newDate).tz(timeZone).date()
      };
      this.minimumDate = date;
    }
    if (change.maxDate && change.maxDate.currentValue !== undefined) {
      const newDate = change.maxDate.currentValue;
      const timeZone = this.share.getTimeZone() ? this.share.getTimeZone() : moment.tz.guess();
      const date = {
        year: moment(newDate).tz(timeZone).year(),
        month: moment(newDate).tz(timeZone).month() + 1,
        day: moment(newDate).tz(timeZone).date()
      };
      this.maximumDate = date;
    }
    if (change.dateObject && change.dateObject.currentValue && change.dateObject.currentValue !== undefined) {
      this.dateObject = change.dateObject.currentValue;
      const cdate = this.dateObject;
      const timeZone = this.share.getTimeZone() ? this.share.getTimeZone() : moment.tz.guess();
      const date = {
        year: moment(cdate).tz(timeZone).year(),
        month: moment(cdate).tz(timeZone).month() + 1,
        day: moment(cdate).tz(timeZone).date()
      };
      this.utcDateAndTime.get('date')?.setValue(date);
    } else {
      // this.utcDateAndTime.reset();
    }
    if (change.timeObject && change.timeObject.currentValue && change.timeObject.currentValue !== undefined) {
      const sTime = this.timeObject;
      const timeZone = this.share.getTimeZone() ? this.share.getTimeZone() : moment.tz.guess();
      const time = {
        hour: moment(sTime).tz(timeZone).hours(),
        minute: moment(sTime).tz(timeZone).minutes(),
        second: moment(sTime).tz(timeZone).seconds()
      };
      this.utcDateAndTime.get('time')?.setValue(time);
    }
  }

  ngOnInit(): void {
    if (this.systemConf?.isRequired) {
      this.utcDateAndTime.get('date')?.clearValidators();
      this.utcDateAndTime.get('date')?.setValidators([Validators.required]);
      this.utcDateAndTime.get('date')?.updateValueAndValidity();
      this.utcDateAndTime.get('time')?.clearValidators();
      this.utcDateAndTime.get('time')?.setValidators([Validators.required]);
      this.utcDateAndTime.get('time')?.updateValueAndValidity();
    }
    if (this.dateObject) {
      const cdate = this.dateObject;
      const timeZone = this.share.getTimeZone() ? this.share.getTimeZone() : moment.tz.guess();
      const date = {
        year: moment(cdate).tz(timeZone).year(),
        month: moment(cdate).tz(timeZone).month() + 1,
        day: moment(cdate).tz(timeZone).date()
      };
      this.utcDateAndTime.get('date')?.setValue(date);
    }
    if (this.timeObject) {
      const sTime = this.timeObject;
      const timeZone = this.share.getTimeZone() ? this.share.getTimeZone() : moment.tz.guess();
      const time = {
        hour: moment(sTime).tz(timeZone).hours(),
        minute: moment(sTime).tz(timeZone).minutes(),
        second: moment(sTime).tz(timeZone).seconds()
      };
      this.utcDateAndTime.get('time')?.setValue(time);
    }
  }

  /** DATE SELECTION CHANGE EVENT */
  onDateSelection(date: NgbDate): void {
    const timeZone = this.share.getTimeZone();
    const selectedTime = this.utcDateAndTime.get('time')?.value;
    let utcDate: string = '';
    if (selectedTime && selectedTime?.hour !== null) {
      // utcDate = moment(this.nativeDateFromTime(date,selectedTime)).utc().format('YYYY-MM-DDTHH:mm:ss');
      utcDate = this.nativeDateFromTime(date, selectedTime);
      this.dateUtc.emit(utcDate);
    } else {
      const dat = momentTz().tz(timeZone);
      const time = { hour: dat.hours(), minute: dat.minutes(), second: dat.seconds() };
      utcDate = this.nativeDateFromTime(date, time);
      this.dateUtc.emit(utcDate);
    }
  }

  /** TIME SELECTION CHANGE EVENT */
  onTimeSelection(time: NgbTimeStruct): void {
    if (time) {
      this.setTime(time);
    }
  }

  /** SET TIME TO UTC STRING */
  setTime(time: NgbTimeStruct): void {
    const selectedDate = this.utcDateAndTime.get('date')?.value;
    let utcTime: string | null = null;
    if (selectedDate && selectedDate?.day !== null) {
      utcTime = this.nativeDateFromTime(selectedDate, time);
    } else {
      const timeZone = this.share.getTimeZone();
      const currentDate = this.dateObj(moment().tz(timeZone).toISOString());
      utcTime = this.nativeDateFromTime(currentDate, time);
      // utcTime = moment().tz(timeZone).toISOString();
    }
    this.timeUtc.emit(utcTime);
  }

  nativeDateFromTime(date?: any, time?: any): string {
    const timeZone = this.share.getTimeZone();
    const dat = moment().tz(timeZone);
    const dh = ((time !== undefined && 'hour' in time) ? time.hour : dat.hours());
    const dm = ((time !== undefined && 'minute' in time) ? time.minute : dat.minutes());
    const ds = ((time !== undefined && 'second' in time) ? time.second : dat.seconds());
    const dd = ((date !== undefined && date.day) ? date.day : dat.date());
    const dmm = ((date !== undefined && date.month) ? this.month[date.month] : dat.month());
    const dy = (date !== undefined && date.year) ? date.year : dat.year();
    const tz = moment.tz(timeZone);
    tz.set('year', dy); tz.set('month', dmm); tz.set('date', dd); tz.set('hour', dh); tz.set('minute', dm); tz.set('second', ds);
    return tz.toISOString();
  }

  dateObj(date: string): object | string {
    if (date) {
      return { year: moment(date.toString(), 'YYYY-MM-DD').year(), month: moment(date.toString(), 'YYYY-MM-DD').month() + 1, day: moment(date.toString(), 'YYYY-MM-DD').date() };
    } else {
      return { year: 0, month: 0, day: 0 };
    }
  }

}
