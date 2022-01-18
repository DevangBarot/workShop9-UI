import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, RouteConfigLoadEnd, Router } from '@angular/router';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-auth-root',
  templateUrl: './auth-root.component.html',
  styleUrls: ['./auth-root.component.css']
})
export class AuthRootComponent implements OnInit {
  bars = faBars;
  activeRoute: string = '';
  // constructor(public ui: UiService) { }

  constructor( public ui: UiService,
    private router : Router) { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
      } else if (event instanceof RouteConfigLoadEnd) {
      } else if (event instanceof NavigationEnd) {
        this.activeRoute = event.url.replace('/_/','')
        // this.url = event.urlAfterRedirects.slice(21);
      }
  });
  }

  ngOnInit(): void {
  }

  toggleSideBar(){
    this.ui.setCollapseSideBar();
    console.log(this.ui.collapsidebar);
  }
}
