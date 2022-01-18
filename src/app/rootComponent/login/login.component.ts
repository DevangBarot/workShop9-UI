import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEnvelope,faLock } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({});
  email = faEnvelope;
  password = faLock;
  submitted=false;
  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private localStorageService:LocalStorageService,
    public router: Router,
    private toaster: ToastrService
    ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }
  submitLoginForm() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.sharedService.changeLoaderStatus(true);
    const data = this.loginForm.value;
    const reqObj = {
      email: data['email'],
      password: data['password']
    };
    this.authService.loginUser(reqObj).subscribe((res: any) => {
      if (res['code'] === 200) {
        this.localStorageService.setItem('token', res['result']['token']);
        this.localStorageService.setItem('refreshToken', res['result']['refreshToken']);
        res['result']['token'] = undefined;
        res['result']['refreshToken'] = undefined;
        this.sharedService.setCurrentUserValue(res['result']);
        this.sharedService.changeLoaderStatus(false);
        this.router.navigateByUrl('/_/dashboard');
      }
    }, (error) => {
      this.sharedService.changeLoaderStatus(false);
      this.toaster.error('Error', error.error.message)
      this.submitted = false;
    });
  }
}
