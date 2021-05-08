import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/services/login.service';
import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/services/utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public mobile: string;

  constructor(private loginService: LoginService, private datePipe: DatePipe, private router: Router) {
    if (this.isPunchedIn) {
      this.router.navigate(['work-list']);
    }
   }

  ngOnInit(): void {
    this.mobile = localStorage.getItem('mobile');
  }

  public get isPunchedIn(): boolean {
    return !Utils.isNullOrUndefined(localStorage.getItem('isPunchedIn')) && (localStorage.getItem('isPunchedIn') === "true");
  }

  public logout(): void {
    this.loginService.logout();
  }

  public punchIn(): void {
    localStorage.setItem('isPunchedIn', "true");
    const timestamp = Date.now();
    const time = this.datePipe.transform(timestamp, 'mediumTime');

    const punchDetails = {
      _id: this.mobile,
      user_id: this.mobile,
      time_of_punch: time,
      timestamp
    };
    localStorage.setItem('punch_details', JSON.stringify(punchDetails));

    this.router.navigate(['work-list']);
  }
}
