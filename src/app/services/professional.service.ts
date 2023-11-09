import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Professional } from '../professional-status/professional-instance';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {

  professional_id_param: any;

  constructor(private app_service: AppService, private http: HttpClient) { }

  get_Professionallocation(professional_id:any): Observable<Professional> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/professionals/${professional_id}`;
    return this.http.get<Professional>(url, options);
  }
}
