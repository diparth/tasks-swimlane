import { Router } from '@angular/router';
import { Utils } from './../../services/utils';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public isLoggedIn: boolean = false;
  public hasMobile: boolean = false;
  public tryAgain: boolean = false;

  public form: FormGroup = new FormGroup({});

  constructor(private loginService: LoginService, private router: Router) {

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      mobileNumber: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      otp: new FormControl('', [Validators.required])
    });

    this.isLoggedIn = this.loginService.isLoggedIn;
    this.hasMobile = this.loginService.hasMobileEntered;
  }

  get controls() {
    return this.form.controls;
  }

  public userLogin(): void {
    if (Utils.isNullOrUndefined(this.controls.mobileNumber.invalid)) {
      return;
    }

    this.loginService.getOTP(this.controls.mobileNumber.value).subscribe(data => {
      if (data.mobileSaved) {
        this.hasMobile = this.loginService.hasMobileEntered;
      }
    });
  }

  public loginWithOTP(): void {
    this.loginService.loginWithOTP(this.controls.otp.value).subscribe(data => {
      if (data.matched && data.otpSaved) {
        this.router.navigate(['dashboard']);
      } else {
        this.tryAgain = true;
      }
    });
  }
}
