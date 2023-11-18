import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { Transaction } from '../transaction/transaction-instance';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  transaction: any = {} as Transaction;

  constructor(private http: HttpClient, private app_service: AppService) { }

  getTransaction(client_id:any): Observable<Transaction[]> {
    const headers = new HttpHeaders();
    this.app_service.createAuthorizationHeader(headers);
    const options = { headers: headers };
    const url = `${this.app_service.apiUrl}/clients/${client_id}/transactions`;
    return this.http.get<Transaction[]>(url, options);
  }
}
