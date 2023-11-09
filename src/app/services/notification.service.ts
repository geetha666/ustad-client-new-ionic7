import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient, private app_service: AppService) { }

  getAllNotifications(client_id:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/fcmnotifications/${client_id}/3`;
    return this.http.get(url, options);
  }
}
