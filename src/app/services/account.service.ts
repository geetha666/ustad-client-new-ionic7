import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppService } from './app.service';
import { User } from '../login/login_instance';
import { ValidateReg } from '../registervalidation/registervalidation_instance';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private app_service: AppService, private http: HttpClient) { }

  id: any;
  user: User = new User;
  validatereg: ValidateReg = new ValidateReg;

  update_clientdata(user: User): Observable<User> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const body = JSON.stringify(user);
    const url = `${this.app_service.apiUrl}/clients/${user.id}`;
    return this.http.put<User>(url, body, options);
  }

  verifyaccount(validatereg: ValidateReg): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/verified/account/${validatereg.client_id}`;
    const body = JSON.stringify(validatereg);
    return this.http.put(url, body, options);
  }

  resendCode(message_type:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/resent/verified/code`;
    const body = JSON.stringify(message_type);
    return this.http.put(url, body, options);
  }

  get_professional(professional_id:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/professionals/${professional_id}`;
    return this.http.get(url, options);
  }

  update_verification_phone(phone:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/phone/update`;
    const body = JSON.stringify({ 'phone': phone });
    return this.http.put(url, body, options);
  }

  get_dueAmount(client_id:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/clients/${client_id}/amount_due`;
    return this.http.get(url, options);
  }
}
