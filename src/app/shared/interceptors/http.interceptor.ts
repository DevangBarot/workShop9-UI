import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, throwError as observableThrowError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { SharedService } from '../services/shared.service';
import { LocalStorageService } from '../services/local-storage.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  authURL: string = '';
  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(
      private sharedService: SharedService,
      private localStorageService: LocalStorageService,
      private injector: Injector,
      private router: Router
  ) { }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): any {
      const url = environment.apiUrl + request.url;
      const headersObj: any = {
          'Accept-Language': 'en',
          Accept: 'application/json',
          Authorization: (this.localStorageService.getItem('token')) ? this.localStorageService.getItem('token') : `Bearer token`
      };
      return next.handle(request.clone({
          url,
          headers: new HttpHeaders(headersObj)
      })).pipe(catchError((err) => {
          if (err instanceof HttpErrorResponse) {
              switch ((<HttpErrorResponse>err).status) {
                  case 403:
                      return this.logoutUser(err);
                  case 401:
                      return this.handle401Error(request, next,err);
                  default:
                      return observableThrowError(err);
              }
          } else {
              return observableThrowError(err);
          }
      }));
  }
  handle401Error(req: HttpRequest<any>, next: HttpHandler, error: any): any {
      if (!this.isRefreshingToken) {
          this.isRefreshingToken = true;
          this.tokenSubject.next(null);
          const authService = this.injector.get(AuthService);
          return authService.refreshToken().pipe(
              switchMap((newToken: any) => {
                  const token = this.localStorageService.getItem('token') ? this.localStorageService.getItem('token') : null;
                  if (token !== null) {
                      this.tokenSubject.next(token);
                      const apiUrl = environment.apiUrl;
                      const reqUrl = req.url.trim();
                      const url = apiUrl + reqUrl;
                      const headersObj: any = {
                          'Accept-Language': 'en',
                          Accept: 'application/json',
                          Authorization: (this.localStorageService.getItem('token')) ? this.localStorageService.getItem('token') : `Bearer token`
                      };
                      return next.handle(req.clone({
                          url,
                          headers: new HttpHeaders(headersObj)
                      }));
                  }

                  // If we don't get a new token, we are in trouble so logout.
                  return this.logoutUser(error);
              }),
              catchError(error => {
                  return this.logoutUser(error);
              }),
              finalize(() => {
                  this.isRefreshingToken = false;
              }));
      } else {
          return this.tokenSubject.pipe(
              filter(token => token != null),
              take(1),
              switchMap(token => {
                  const apiUrl = environment.apiUrl;
                  const reqUrl = req.url.trim();
                  const url = apiUrl + reqUrl;
                  const headersObj: any = {
                      'Accept-Language': 'en',
                      Accept: 'application/json',
                      Authorization: (this.localStorageService.getItem('token')) ? this.localStorageService.getItem('token') : `Bearer token`
                  };
                  return next.handle(req.clone({
                      url,
                      headers: new HttpHeaders(headersObj)
                  }));
              }));
      }
  }

  logoutUser(error:any): any {
      this.sharedService.setCurrentUserValue(null);
      this.localStorageService.removeAll();
      this.router.navigateByUrl('/login');
      return observableThrowError(error);
  }
}
