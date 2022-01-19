import { Component, OnInit } from '@angular/core';
import { BlogsService } from 'src/app/shared/services/blogs.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { faEdit, faTrash, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
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
  pageLimitList: Array<number> = [5, 10, 20, 50, 100]
  paginationObject = { isPagination: true, page: 1, limit: 5, filterList: [], sortHeader: "createAt", sortDirection: "ASC" }
  fontData = { edit: faEdit, delete: faTrash, active: faToggleOn, inActive: faToggleOff };
  constructor(public ui: UiService, 
    public sharedService: SharedService, 
    public blogsService: BlogsService) { }

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.sharedService.changeLoaderStatus(true);
    this.blogsService.list(this.paginationObject).subscribe((res: any) => {
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
  changeLimit(limit: number) {

  }
  changePage(e: any) {
    this.paginationObject.page = e;
    this.getList();
  }
}
