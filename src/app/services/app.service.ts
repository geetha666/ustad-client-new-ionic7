import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { User } from '../login/login_instance';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  user: any = {} as User;;

  public apiUrl = 'https://service.ustad.online/api';

  constructor(private http: HttpClient) {
    this.upload_Header.push({ name: 'Authorization', value: 'Bearer ' + localStorage.getItem('token') });
  }

  // headers for uploading the file
  upload_Header: Array<{
    name: string;
    value: string;
  }> = [];

  createAuthorizationHeader(headers: HttpHeaders) {
    headers = headers.append('Accept', 'X-Auth-Token');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    headers = headers.append('Content-Type', 'application/json');
  }

  mediaAuthorizationHeader(headers: HttpHeaders) {
    headers = headers.append('Accept', 'X-Auth-Token');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    headers = headers.append('Content-Type', 'application/json');
  }

  attchmentHeader(headers: HttpHeaders) {
    headers = headers.append('Accept', 'image/jpg');
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    headers = headers.append('Content-Type', 'application/json');
  }

  getClientData(client_id:any): Observable<User> {
    const headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.apiUrl}/clients/${client_id}`;
    return this.http.get<User>(url, options);
  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
