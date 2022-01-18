import { Component, OnInit } from '@angular/core';
import { BlogsService } from 'src/app/shared/services/blogs.service';
import { EventsService } from 'src/app/shared/services/events.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UiService } from 'src/app/shared/services/ui.service';
import * as moment from 'moment';
import { faEdit,faTrash,faToggleOn,faToggleOff,faCalendarCheck ,faArrowAltCircleRight} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  listData: Array<any> = [];
  totalCount: number = 0;
  totalPages: number = 0;
  pageList: Array<number> = [];
  pageLimitList: Array<number> = [5,10,20,50,100]
  fontData={edit:faEdit,delete:faTrash,active:faToggleOn,inActive:faToggleOff,calender:faCalendarCheck,join:faArrowAltCircleRight};
  paginationObject = { isPagination: true, page: 1, limit: 5 , filterList : [],sortHeader:"createAt",sortDirection:"ASC" }
  selectedTimeZone:string='';
  dateFormat:string=''
  constructor(public ui: UiService, public sharedService: SharedService, public eventsService: EventsService) { }

  ngOnInit(): void {
    this.selectedTimeZone=moment.tz.guess();
    console.log(this.selectedTimeZone)
    this.dateFormat='MMM dd yyyy hh:mm a';
    this.getList();
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
  changeLimit(limit:number){

  }
  changePage(e: any) {
    this.paginationObject.page = e;
    this.getList();
  }
}
