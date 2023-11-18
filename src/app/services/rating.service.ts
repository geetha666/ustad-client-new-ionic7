import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rating } from '../rating/rating-instance';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  rating: any = {} as Rating;

  constructor(private app_service: AppService, private http: HttpClient) { }

  add_rating(rating: Rating): Observable<Rating> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/reviews`;
    const body = JSON.stringify(rating);
    return this.http.post<Rating>(url, body, options);
  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
