import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, LogUser } from '../login/login_instance';
import { DeviceClass } from '../home/device-instance';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  private apiUrl = 'https://service.ustad.online/api';
  private isLoggedIn = false;
  client_id: any;

  constructor(private router: Router, private http: HttpClient) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const auth_user = localStorage.getItem('token');

    if (auth_user == null) {
      this.router.navigateByUrl('/login');
      return false;
    }

    return true;
  }

  registerAuthorizationHeader(headers: HttpHeaders) {
    headers = headers.append('Content-Type', 'application/json');
  }

  createAuthorizationHeader(headers: HttpHeaders) {
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Accept', 'X-Auth-Token');
  }

  register(user: User): Observable<number> {
    const headers = new HttpHeaders();
    this.registerAuthorizationHeader(headers);

    const options = { headers: headers };
    const url = `${this.apiUrl}/users`;
    const body = JSON.stringify(user);

    return this.http.post<number>(url, body, options);
  }

  login(loguser: LogUser): Observable<User> {
    const headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);

    const options = { headers: headers };
    const url = `${this.apiUrl}/authenticate`;
    const body = JSON.stringify(loguser);

    return this.http.post<User>(url, body, options);
  }

  social_login(user:any): Observable<any> {
    const headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);

    const options = { headers: headers };
    const url = `${this.apiUrl}/social`;
    const body = JSON.stringify(user);

    return this.http.post<any>(url, body, options);
  }

  send_token(deviceclass: DeviceClass): Observable<any> {
    const headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);

    const options = { headers: headers };
    const url = `${this.apiUrl}/device_token`;
    const body = JSON.stringify(deviceclass);

    return this.http.post<any>(url, body, options);
  }
}
