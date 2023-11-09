import { Component } from '@angular/core';
import { NavController, LoadingController, Platform } from '@ionic/angular';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from './transaction-instance';

import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage {
  public hasError = false;
  public networkfail = false;
  transactions: Transaction[] = [];
  loader:any;
  client_id:any;

  constructor(public navCtrl: NavController, private transaction_service: TransactionService,
  public loadCtrl: LoadingController, private platform: Platform, private diagnostic: Diagnostic) {
    this.get_id();
  }

  get_id() {
    this.client_id = localStorage.getItem("client_id");
    console.log(this.client_id);
    if (this.client_id != null) {
      this.getTransactions(this.client_id);
    }
  }

  getTransactions(client_id) {
    this.loader = true;
    this.transaction_service.getTransaction(client_id).then(data => {
      this.transactions = data;
      this.loader = false;
      console.log(data);
    })
    .catch(error => this.handleError(error));
  }


  public handleError(error: any): Promise<any> {
    this.loader = false;
    console.error('An error occurred', error); // for demo purposes only
    console.log(error.status);
    if (error.status == "404") {
      this.hasError = true;
      console.log(error.statusText);
    }
    else if (error.status == "0") {
      this.networkfail = true;
    }
    return Promise.reject(error.message || error);
  }
}
