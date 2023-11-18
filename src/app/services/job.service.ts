import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppService } from './app.service';
import { Observable, catchError } from 'rxjs';
import { Job } from '../create-job/create-job-instance';
import { ClientJob } from '../job/clientjob_instance';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  client_id: any;
  attachment: any;
  job_id: any;
  jobapi: any;
  job_data: any;

  job_idr: any;

  active_job_id: any = null;

  constructor(private http: HttpClient, private app_service: AppService) {
    this.jobapi = 'https://service.ustad.online';
  }

  job: any = {} as Job;
  clientJob: any = {} as ClientJob;

  add_job(job: Job): Observable<Job> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/jobs`;
    const body = JSON.stringify(job);
    return this.http.post<Job>(url, body, options);
  }

  get_jobs(): Observable<ClientJob[]> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/clients/${this.client_id}/jobs`;
    return this.http.get<ClientJob[]>(url, options);
  }

  getJobDetail(job_id:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/jobs/${job_id}`;
    return this.http.get(url, options);
  }

  delete_Job(job_id:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/jobs/${job_id}`;
    return this.http.delete(url, options);
  }

  get_estimation(job_id:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/jobs/${job_id}/estimations`;
    return this.http.get(url, options);
  }

  get_JObData(): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/jobs/1`;
    return this.http.get(url, options);
  }

  updateVoice(voice:any, job_id:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/jobs/${job_id}/voice`;
    const body = JSON.stringify(voice);
    return this.http.put(url, body, options);
  }

  updateAttchment(attachment:any, job_id:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.mediaAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/jobs/${job_id}/attachments`;
    const body = JSON.stringify(attachment);
    return this.http.put(url, body, options);
  }

  get_unassignjobs(client_id:any): Observable<ClientJob[]> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/clients/${client_id}/jobs/new`;
    return this.http.get<ClientJob[]>(url, options);
  }

  get_assignjobs(client_id:any): Observable<ClientJob[]> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/clients/${client_id}/jobs/assign`;
    return this.http.get<ClientJob[]>(url, options);
  }

  get_completejobs(client_id:any): Observable<ClientJob[]> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    console.log(this.client_id);
    const url = `${this.app_service.apiUrl}/clients/${client_id}/jobs/completed`;
    return this.http.get<ClientJob[]>(url, options);
  }

  cancelJob(job_id:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/jobs/client/${job_id}/cancel`;
    return this.http.get(url, options);
  }

  get_inprogressJobs(client_id:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/clients/${client_id}/jobs/inprograss`;
    return this.http.get(url, options);
  }

  getJobRecentStatus(job_id:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/jobs/${job_id}/durations`;
    return this.http.get(url, options);
  }

  get_all_jobs(client_id:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/clients/${client_id}/jobs/all`;
    return this.http.get(url, options);
  }

  get_attachments(job_id:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/jobs/${job_id}/attachments`;
    return this.http.get(url, options);
  }

  get_JobCost(job_id:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/jobs/${job_id}/cost`;
    return this.http.get(url, options);
  }

  get_balance(client_id:any): Observable<any> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/clients/${client_id}/balance`;
    return this.http.get(url, options);
  }

  checkForJob(client_id:any): Observable<any> {
    return this.get_inprogressJobs(client_id).pipe(
      catchError((error:any) => {
        console.log(error);
        console.log("Checking........");
        this.active_job_id = null;
        return [];
      })
    );
  }
}
