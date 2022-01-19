import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  
  private loaderSource = new BehaviorSubject(false);
  loaderCurrentStatus = this.loaderSource.asObservable();
  constructor(private storageService: LocalStorageService) { 
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(this.storageService.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }
  setCurrentUserValue(data:any) {
    this.storageService.setItem('currentUser', JSON.stringify(data));
    this.currentUserSubject.next(data);
  }
  changeLoaderStatus(status: boolean) {
    this.loaderSource.next(status);
  }
  getTimeZone(): string {
    return 'America/Toronto';
  }

}
