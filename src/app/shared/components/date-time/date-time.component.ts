import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDate, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import * as momentTz from 'moment-timezone';
import * as _ from 'lodash';

export interface configuration {
  ordType?: 'FTL' | 'LTL' | 'EXPEDITE' | 'DIRECT_DRIVE',
  dateLabel: string,
  timeLabel: string,
  visible: 'DATE' | 'TIME' | 'BOTH',
  isRequired?: true | false
}

@Component({
  selector: 'date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss']
})
export class DateTimeComponent implements OnInit {
  // public maximumDate: object | undefined;
  // public minimumDate: object | undefined;

  // dateControl = new FormControl();
  // @Input() SystemConf:any = {};
  // @Input() arrayIndex:number =  0 ;
  // @Output() dateUtc: EventEmitter<object> = new EventEmitter<object>();
  // @Output() timeUtc: EventEmitter<object> = new EventEmitter<object>();
  // @Output() invalid: EventEmitter<boolean> = new EventEmitter<boolean>();
  // @Input() minDate: string | undefined;
  // @Input() maxDate: string | undefined;
  // @Input() dateObject: string | undefined;
  // @Input() timeObject: string | undefined;
  // @Input() setCurrent: boolean | undefined;
  // @Input() addObj: any = {};
  // @Input() StartEndDateFilter: boolean | undefined;
  // @Input() customClass: String = 'col-sm-6';
  // @Input() startDate: object | undefined;
  // @Input() isError: boolean = false;
  // @Input() errorMessage: string | undefined;
  // get utcDateTimeForm(){
  //   return new FormGroup({
  //     'date': new FormControl(null),
  //     'time': new FormControl(null)
  //   }) 
  // }
  // utcDateAndTime = this.utcDateTimeForm;
  // returnObj = {
  //   arrayIndex: 0,
  //   date: '',
  //   time: ''
  // }
  // addObjType = [
  //   "years",
  //   "quarters",
  //   "months",
  //   "weeks",
  //   "days",
  //   "hours",
  //   "minutes",
  //   "seconds",
  //   "milliseconds"
  // ];
  // month = {
  //   '1': '0',
  //   '2': '1',
  //   '3': '2',
  //   '4': '3',
  //   '5': '4',
  //   '6': '5',
  //   '7': '6',
  //   '8': '7',
  //   '9': '8',
  //   '10': '9',
  //   '11': '10',
  //   '12': '11',
  // }
  // meridianList: string[] = ['AM', 'PM'];
  // meridian: FormControl = new FormControl(null);
  // constructor() {
  //   this.utcDateAndTime = this.utcDateTimeForm;
  //   const timeZone = moment.tz.guess()
  //   this.utcDateAndTime.get('time')!.valueChanges.subscribe((res) => {
  //     if (res && res['hour'] !== null && res['hour'] !== undefined) {
  //       this.setTime(res);
  //     }
  //   })
  // }


  // ngOnChanges(change: SimpleChanges) {
  //   if (change['minDate'] && change['minDate'].currentValue !== undefined) {
  //     const newDate = change['minDate']['currentValue'];
  //     const timeZone = moment.tz.guess();
  //     const date = moment(newDate).tz(timeZone);
  //     this.minimumDate = date;
  //   }
  //   if (change['maxDate'] && change['maxDate'].currentValue !== undefined) {
  //     const newDate = change['maxDate']['currentValue'];
  //     const timeZone = moment.tz.guess()
  //     const date = moment(newDate).tz(timeZone);
  //     this.maximumDate = date;
  //   }
  //   // if (change['startDate'] && change['startDate'].currentValue !== undefined) {
  //   //   const newDate = change['startDate']['currentValue'];
  //   //   this.startDate = new Date(newDate['year'], newDate['month'] - 1, newDate['day']);
  //   // }

  //   if (change['dateObject'] && change['dateObject'].currentValue && change['dateObject'].currentValue !== undefined) {
  //     this.dateObject = change['dateObject'].currentValue;
  //     const timeZone = moment.tz.guess()
  //     const cdate = moment(this.dateObject).tz(timeZone)
  //     this.utcDateAndTime.get('date')!.setValue(cdate);
  //   } else {
  //     // this.utcDateAndTime.reset();
  //   }
  //   if (change['StartEndDateFilter'] && change['StartEndDateFilter'].currentValue !== undefined) {
  //     this.utcDateAndTime.get('date')!.reset();
  //   }
  // }

  ngOnInit() {
  //   this.returnObj.arrayIndex = this.arrayIndex;
  //   const timeZone = moment.tz.guess()
  //   if (this.SystemConf['ordType'] && this.SystemConf['ordType'] !== 'LTL') {
  //     this.utcDateAndTime.get('date')!.reset();
  //     this.utcDateAndTime.get('date')!.clearValidators();
  //     this.utcDateAndTime.get('date')!.updateValueAndValidity();
  //     this.utcDateAndTime.get('date')!.markAsUntouched();
  //     this.utcDateAndTime.get('date')!.setValidators([Validators.required])
  //     this.utcDateAndTime.get('date')!.updateValueAndValidity();
  //     this.utcDateAndTime.get('time')!.reset();
  //     this.utcDateAndTime.get('time')!.clearValidators();
  //     this.utcDateAndTime.get('time')!.updateValueAndValidity();
  //     this.utcDateAndTime.get('time')!.markAsUntouched();
  //     this.utcDateAndTime.get('time')!.setValidators([Validators.required])
  //     this.utcDateAndTime.get('time')!.updateValueAndValidity();
  //   }
  //   if (this.SystemConf['isRequired']) {
  //     this.utcDateAndTime.get('date')!.clearValidators();
  //     this.utcDateAndTime.get('date')!.setValidators([Validators.required])
  //     this.utcDateAndTime.get('date')!.updateValueAndValidity();
  //   }

  //   if (this.dateObject) {
  //     const cdate = moment(this.dateObject).tz(timeZone)
  //     this.utcDateAndTime.get('date')!.setValue(cdate);
  //     this.utcDateAndTime.get('date')!.setValue(cdate);
  //   }
  //   if (this.timeObject) {
  //     const sTime = this.timeObject
  //     const timeZone =  moment.tz.guess()
  //     const time = {
  //       'hour': moment(sTime).tz(timeZone).hours(),
  //       'minute': moment(sTime).tz(timeZone).minutes(),
  //       'second': moment(sTime).tz(timeZone).seconds()
  //     };
  //     this.utcDateAndTime.get('time')!.setValue(time);
  //   }
  //   if (this.setCurrent === true) {
  //     const timeZone = moment.tz.guess()
  //     let cDateAndTime = null;
  //     if (this.addObj !== undefined && (this.addObjType.indexOf(this.addObj['duration']) != -1)) {
  //       cDateAndTime = moment().tz(timeZone).add(this.addObj['duration'], this.addObj['value'])
  //       this.utcDateAndTime.get('date')!.setValue(cDateAndTime);
  //       this.utcDateAndTime.get('time')!.setValue(this.getCurrentTimeFromTZ(cDateAndTime))
  //       this.returnObj['date'] = cDateAndTime.toISOString()
  //       this.returnObj['time'] = cDateAndTime.toISOString()
  //       this.dateUtc.emit(this.returnObj)
  //       this.timeUtc.emit(this.returnObj)
  //     } else {
  //       cDateAndTime = moment().tz(timeZone ? timeZone : moment.tz.guess());
  //       let currentDate = this.getCurrentDateFromTZ(cDateAndTime);
  //       this.utcDateAndTime.get('date')!.setValue(cDateAndTime)
  //       this.utcDateAndTime.get('time')!.setValue(this.getCurrentTimeFromTZ(cDateAndTime));
  //       this.returnObj['date'] = cDateAndTime.toISOString();
  //       this.returnObj['time'] = cDateAndTime.toISOString();
  //       this.dateUtc.emit(this.returnObj)
  //       this.timeUtc.emit(this.returnObj)
  //     }
  //   }
  }

  // dateObj(date: string) {
  //   if (date) {
  //     return { 'year': moment(date.toString(), "YYYY-MM-DD").year(), 'month': moment(date.toString(), "YYYY-MM-DD").month() + 1, 'day': moment(date.toString(), "YYYY-MM-DD").date() }
  //   }
  // }

  // getCurrentDateFromTZ(dateObj: moment.MomentInput) {
  //   const timeZone = moment.tz.guess()
  //   let tz = moment(dateObj).tz(timeZone)
  //   return { 'year': tz.get('year'), 'month': tz.get('month') + 1, 'day': tz.get('date') }
  // }

  // getCurrentTimeFromTZ(dateObj: moment.MomentInput) {
  //   const timeZone = moment.tz.guess()
  //   let tz = moment(dateObj).tz(timeZone)
  //   return { 'hour': tz.get('hour'), 'minute': tz.get('minute'), 'second': tz.get('second') }
  // }

  // utcToTimeObj(time: string) {
  //   if (time) {
  //     const utcTime = moment.utc(time)
  //     return { 'hour': utcTime.hours(), 'minute': utcTime.minutes(), 'second': utcTime.seconds() }
  //   }
  // }


  // onDateSelection(date: { value: moment.Moment; }) {
  //   const selectedDate = date.value as moment.Moment
  //   const ngbDateObj = selectedDate.toObject()
  //   const sDate = {'year': ngbDateObj['years'], 'month': ngbDateObj['months'] + 1, 'day': ngbDateObj['date'] };
  //   const timeZone = moment.tz.guess()
  //   const selectedTime = this.utcDateAndTime.get('time')!.value
  //   let utcDate: string = ''
  //   if (selectedTime && selectedTime['hour'] !== null) {
  //     utcDate = this.nativeDateFromTime(sDate, selectedTime)
  //     this.returnObj['date'] = utcDate;
  //     this.returnObj['time'] = utcDate;
  //     this.dateUtc.emit(this.returnObj);
  //   } else {
  //     var dat = moment().tz(timeZone);
  //     const time = { 'hour': dat.hours(), 'minute': dat.minutes(), 'second': dat.seconds() }
  //     utcDate = this.nativeDateFromTime(sDate, time)
  //     this.returnObj['date'] = utcDate;
  //     this.returnObj['time'] = utcDate;
  //     this.dateUtc.emit(this.returnObj);
  //   }
  // }

  // setTime(time: NgbTimeStruct) {
  //   const timeZone = moment.tz.guess()
  //   let date = this.utcDateAndTime.get('date')!.value as moment.Moment;
  //   const ngbDateObj = date.toObject()
  //   let timeControl: FormControl = this.utcDateAndTime.get('time') as FormControl;
  //   const selectedDate = moment(date).tz(timeZone) as moment.Moment

  //   // const selectedDate = moment(date) as moment.Moment
  //   const sDate = { 'year': ngbDateObj['years'], 'month': ngbDateObj['months'] + 1, 'day': ngbDateObj['date'] };
  //   let utcTime: string = '';
  //   if (timeControl.valid) {
  //     if (selectedDate && selectedDate['day'] !== null) {
  //       utcTime = this.nativeDateFromTime(sDate, time)
  //       this.returnObj['time'] = utcTime;
  //       this.returnObj['date'] = utcTime;
  //       this.timeUtc.emit(this.returnObj);
  //     } else {
  //       const timeZone = moment.tz.guess()
  //       utcTime = moment().tz(timeZone).toISOString();
  //       this.returnObj['time'] = utcTime;
  //       this.returnObj['date'] = utcTime;
  //       this.timeUtc.emit(this.returnObj);
  //     }
  //   } else {
  //     this.invalid.emit(true);
  //   }
  // }

  // nativeDateFromTime(date?: { [x: string]: any; year?: number; month?: number; day?: number; } | undefined, time?: NgbTimeStruct) {
  //   const timeZone = momentTz.tz.guess();
  //   var dat = moment().tz(timeZone);
  //   const dh = ((time !== undefined && 'hour' in time) ? time['hour'] : dat.hours())
  //   const dm = ((time !== undefined && 'minute' in time) ? time['minute'] : dat.minutes())
  //   const ds = ((time !== undefined && 'second' in time) ? time['second'] : dat.seconds())
  //   const dd = ((date !== undefined && date['day']) ? date['day'] : dat.date())
  //   const dmm = ((date !== undefined && date['month']) ? this.month?[date['month']] : dat.month())
  //   const dy = (date !== undefined && date['year']) ? date['year'] : dat.year()
  //   let tz = moment.tz(timeZone)
  //   tz.set('year', dy); tz.set('month', dmm); tz.set('date', dd); tz.set('hour', dh); tz.set('minute', dm); tz.set('second', ds);
  //   return tz.toISOString();
  // }
}
