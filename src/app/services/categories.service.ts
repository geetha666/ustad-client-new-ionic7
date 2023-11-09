import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppService } from './app.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient, private app_service: AppService) { }

  getCategory(): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/categories`;
    return this.http.get(url, options);
  }
}
