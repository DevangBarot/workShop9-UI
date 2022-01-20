import {
  Component, OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventsService } from '../../services/events.service';
import { SharedService } from '../../services/shared.service';
import * as moment from 'moment';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    h3 {
      margin: 0 0 10px;
    }
    pre {
      background-color: #f5f5f5;
      padding: 15px;
    }
  `,],
  templateUrl: './calendar.component.html',
})

// styles: [`
//   h3 {
//     margin: 0 0 10px;
//   }
//   pre {
//     background-color: #f5f5f5;
//     padding: 15px;
//   }
// `,],


export class CalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | any;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  } | any;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [
  ];

  activeDayIsOpen: boolean = true;
  listData: Array<any> = [];
  totalCount: number = 0;
  totalPages: number = 0;
  pageList: Array<number> = [];
  pageLimitList: Array<number> = [5,10,20,50,100]
  paginationObject = { isPagination: true, page: 1, limit: 5 , filterList : [],sortHeader:"createAt",sortDirection:"ASC" }
  currentUtcOffset:any;
  constructor(private modal: NgbModal,private sharedService: SharedService,private eventsService:EventsService) { }

  ngOnInit(): void {
    this.currentUtcOffset = moment.tz(this.sharedService.getTimeZone()).utcOffset();
    this.getList();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  close() {

  }
  getList() {
    this.sharedService.changeLoaderStatus(true)
    this.eventsService.list(this.paginationObject).subscribe((res: any) => {
      if (res['code'] === 200) {
        this.listData = res['result']['data']
        this.totalCount = res['result']['totalCount'];
        this.totalPages = res['result']['totalPages'];
        this.pageList = [];
        for (let i = 1; i <= this.totalPages; i++) {
          this.pageList.push(i);
        }
        this.events=[];
        for (const iterator of this.listData) {
          this.events.push({
            start: this.nativeDateFromTime(iterator['startDateTime']),
            end: this.nativeDateFromTime(iterator['endDateTime']),
            title: iterator['title'],
            color: colors.blue,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            draggable: false,
          },)
        }
        this.sharedService.changeLoaderStatus(false)
      }
    }, (error: any) => {
      this.listData = [];
      this.totalCount = 0;
      this.totalPages = 0
      this.pageList = [];
      this.sharedService.changeLoaderStatus(false)
    })
  }
  nativeDateFromTime(date:any) {
    const date_out = moment.utc(date).utcOffset(this.currentUtcOffset);
    return new Date(date_out.year(), date_out.month(), date_out.date(), date_out.hour(), date_out.minute(), date_out.second(), date_out.millisecond());
  }
}
