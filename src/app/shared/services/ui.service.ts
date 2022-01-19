import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  
  private toggleSidebar = new BehaviorSubject<boolean>(false);
  toggleSidebar$ = this.toggleSidebar.asObservable();
  
  get collapsidebar(){
    return this.toggleSidebar.value
  }

  constructor() { }

  setCollapseSideBar(){
    let sideBar = this.collapsidebar;
    this.toggleSidebar.next(sideBar = !sideBar)
  }


  root(): string {
    return `/_`;
  }

  events() {
    const basePath = this.root();
    const page = 'events';
    return `${basePath}/${page}`
  }

  blogs() {
    const basePath = this.root();
    const page = 'blogs';
    return `${basePath}/${page}`
  }

  createBlog() {
    const basePath = this.root();
    const page = 'blogs/create';
    return `${basePath}/${page}`
  }

  editBlog(id: any) {
    const basePath = this.root();
    const page = `blogs/update/${id}`;
    return `${basePath}/${page}`
  }
  createEvent() {
    const basePath = this.root();
    const page = 'events/create';
    return `${basePath}/${page}`
  }
  editEvent(id: any) {
    const basePath = this.root();
    const page = `events/update/${id}`;
    return `${basePath}/${page}`
  }
  dashboard() {
    const basePath = this.root();
    const page = 'dashboard';
    return `${basePath}/${page}`
  }

  
}
