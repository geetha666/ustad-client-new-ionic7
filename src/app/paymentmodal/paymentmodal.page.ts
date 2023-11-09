import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { JobService } from '../services/job.service';
import { AccountService } from '../services/account.service';


@Component({
  selector: 'app-paymentmodal',
  templateUrl: './paymentmodal.page.html',
  styleUrls: ['./paymentmodal.page.scss'],
})
export class PaymentmodalPage {

  job_id:any;
  client_id:any;
  job_cost:any;
  balance_amount:any;
  loadingSpin:any;
  due_amount:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private job_service: JobService
  ,private account_service: AccountService, private modalCtrl: ModalController) {
    this.job_id = navParams.data['job_id'];
    this.client_id = localStorage.getItem("client_id");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentmodalPage');
    this.get_jobCost();
    this.get_dueAmount();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  get_jobCost() {
    this.job_service.get_JobCost(this.job_id).subscribe(response => {
      this.job_cost = response.job_cost;
    })
  }

  get_balanceamount() {
    this.loadingSpin = true;
    this.job_service.get_balance(this.client_id).subscribe(response => {
      this.balance_amount = response.balance;
      this.loadingSpin = false;
    })
  }

  get_dueAmount() {
    this.loadingSpin = true;
    this.account_service.get_dueAmount(this.client_id).subscribe(response => {
      this.due_amount = response.due_amount;
      this.loadingSpin = false;
    })
  }


}
