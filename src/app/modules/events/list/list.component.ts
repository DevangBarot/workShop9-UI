import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/shared/services/events.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UiService } from 'src/app/shared/services/ui.service';
import * as moment from 'moment';
import { faEdit,faTrash,faToggleOn,faToggleOff,faCalendarCheck ,faArrowAltCircleRight} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
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
  dateFormat:string='';
  selectedData:any;
  constructor(
    public ui: UiService, 
    public sharedService: SharedService, 
    public eventsService: EventsService,
    private modalService: NgbModal,
    private toaster: ToastrService
    ) { }

  ngOnInit(): void {
    this.selectedTimeZone=moment.tz.guess();
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

  open(content: any,data:any) {
    this.selectedData = data;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
      close();
    });
  }
  close() {
    this.modalService.dismissAll();
    this.selectedData={};
  }
  deleteBlog() {
    this.sharedService.changeLoaderStatus(true);
    this.eventsService.delete(this.selectedData['_id'])
    .toPromise()
    .then((res:any) => {
      this.toaster.success('Success', res['message'])
      this.close();
      this.getList();
      this.sharedService.changeLoaderStatus(false);
    })
    .catch((error) => {
      this.sharedService.changeLoaderStatus(false);
      this.toaster.error('Error', error.error.message)
    })
  }
}
