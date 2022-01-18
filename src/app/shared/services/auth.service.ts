import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = 'auth/';
  constructor(
    private http: HttpClient,
    private storageService: LocalStorageService,
    private sharedService:SharedService
    ) { }

    loginUser(reqObj:any) {
      const url = this.apiUrl + 'login';
      return this.http.post(url, reqObj);
    }
    refreshToken() {
      const refToken = this.storageService.getItem('refreshToken') ? this.storageService.getItem('refreshToken') : null;
      const url = this.apiUrl + 'refresh-token/' + refToken;
      if (refToken !== null && refToken !== undefined) {
        return this.http.get(url)
          .pipe(map((res:any) => {
            this.storageService.setItem('token', res['result']['token']);
            this.storageService.setItem('refreshToken', res['result']['refreshToken']);
            res['result']['token'] = undefined;
            res['result']['refreshToken'] = undefined;
            this.sharedService.setCurrentUserValue(res['result']);
            return res;
          }))
      } else {
        return EMPTY
      }
  
    }
}
