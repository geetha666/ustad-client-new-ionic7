import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estimation } from '../estimation/estimation-instance';

@Injectable({
  providedIn: 'root'
})
export class EstimationService {

  constructor(private http: HttpClient, private app_service: AppService) { }

  estimation: any = {} as Estimation;

  getEstimationDetail(estimation_id:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/estimations/${estimation_id}`;
    return this.http.get(url, options);
  }

  acceptEstimation(acceptest:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const body = JSON.stringify(acceptest);
    const url = `${this.app_service.apiUrl}/jobs/accept_estimation`;
    return this.http.post(url, body, options);
  }

  rejectEstimation(estimation:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/estimations/${estimation.id}/cancel`;
    const body = JSON.stringify(estimation);
    return this.http.put(url, body, options);
  }
}
