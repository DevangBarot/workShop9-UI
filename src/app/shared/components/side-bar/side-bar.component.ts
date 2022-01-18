import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { faTachometerAlt,faCalendarAlt,faBlog } from '@fortawesome/free-solid-svg-icons';
import { UiService } from '../../services/ui.service';
@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit,OnChanges {
  @Input()
  collapseSideBar: any;
  dashboard = faTachometerAlt
  events = faCalendarAlt
  blogs = faBlog
  constructor(public ui: UiService) { }

  ngOnChanges(changes: SimpleChanges): void { }
  
  ngOnInit(): void {
  }

}
