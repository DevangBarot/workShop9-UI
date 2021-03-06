import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiUrl = 'users/';
  userId = '';
  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) {
    this.sharedService.currentUser?.subscribe(res => {
      if (res !== null) {
        this.userId = res['id'];
      } else {
        this.userId = '';
      }
    })
  }
  list(reqObj: any) {
    const url = this.apiUrl + this.userId + '/list';
    return this.http.post(url, reqObj);
  }

  add(reqObj: any) {
    const url = this.apiUrl + this.userId;
    if(reqObj['_id']){
      return this.http.put(url, reqObj)
    }
    return this.http.post(url, reqObj);
  }

  update(reqObj: any) {
    const url = this.apiUrl + this.userId;
    return this.http.put(url, reqObj);
  }
  updateStatus(reqObj: any) {
    const url = this.apiUrl + this.userId + '/' + reqObj.id + '/' + reqObj.status;
    return this.http.put(url, reqObj);
  }
  approve(reqObj: any) {
    const url = this.apiUrl + this.userId + '/approve/' + reqObj.id + '/' + reqObj.status;
    return this.http.put(url, reqObj);
  }
  delete(id: any) {
    const url = this.apiUrl + this.userId + '/' + id;
    return this.http.delete(url);
  }
  get(id: any) {
    const url = this.apiUrl + this.userId + '/' + id;
    return this.http.get(url);
  }
  getCount() {
    const url = this.apiUrl + this.userId + '/dashboard/counts';
    return this.http.get(url);
  }
}
