import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Utils } from './utils';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private router: Router) { }

  public getOTP(mobile: string): Observable<any> {
    localStorage.setItem('mobile', mobile);

    return of({ mobileSaved: true });
  }

  public loginWithOTP(otp: string): Observable<any> {
    if (this.isLoggedIn) {
      return of({ otpSaved: true, matched: otp === localStorage.getItem('otp') });
    } else {
      localStorage.setItem('otp', otp.toString());

      return of({ otpSaved: true, matched: true });
    }
  }

  public get isLoggedIn(): boolean {
    const hasMobile: boolean = !Utils.isNullOrUndefined(localStorage.getItem('mobile'));
    const hasOTP: boolean = !Utils.isNullOrUndefined(localStorage.getItem('otp'));

    return hasMobile && hasOTP;
  }

  public get hasMobileEntered(): boolean {
    return !Utils.isNullOrUndefined(localStorage.getItem('mobile'));
  }

  public logout(): void {
    localStorage.removeItem('mobile');
    localStorage.removeItem('otp');

    this.router.navigate(['login']);
  }
}
