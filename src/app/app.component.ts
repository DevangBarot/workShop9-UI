import { Component } from '@angular/core';
import { SharedService } from './shared/services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public loading: boolean;
  title = 'workShop9-UI';
  constructor(
    private sharedService: SharedService,
  ) {
    this.loading = false;
    this.sharedService.loaderCurrentStatus.subscribe(status => {
      setTimeout(() => {
        this.loading = status;
      }, 0);
    });
  }
}
