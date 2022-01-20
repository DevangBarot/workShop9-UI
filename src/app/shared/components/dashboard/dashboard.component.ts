import { Component, OnInit } from '@angular/core';
import { BlogsService } from '../../services/blogs.service';
import { EventsService } from '../../services/events.service';
import { SharedService } from '../../services/shared.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  countsData:any;
  constructor(private sharedService: SharedService,  private usersService: UsersService) { }

  ngOnInit(): void {
    this.countsData={
      users: 0,
      newUsers: 0,
      events: 0,
      blogs: 0
    };
    this.getCounts();
  }
  getCounts() {
    this.sharedService.changeLoaderStatus(true);
    this.usersService.getCount().subscribe((res: any) => {
      if (res['code'] === 200) {
        this.countsData = res['result'];
        console.log(this.countsData )
        this.sharedService.changeLoaderStatus(false)
      }
    }, (error: any) => {
      this.sharedService.changeLoaderStatus(false)
    })
  }
}
