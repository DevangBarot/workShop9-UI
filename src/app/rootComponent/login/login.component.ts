import { Component, OnInit } from '@angular/core';
import { faEnvelope,faLock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = faEnvelope;
  password = faLock;
  constructor() { }

  ngOnInit(): void {
  }

}
