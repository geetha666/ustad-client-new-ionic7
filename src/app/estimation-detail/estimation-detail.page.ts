import { Component, OnInit } from '@angular/core';
import { NavParams, ToastController, LoadingController } from '@ionic/angular';
import { Estimation } from '../estimation/estimation-instance';
import { EstimationService } from '../services/estimation.service';
import { JobService } from '../services/job.service';
import { AcceptEst } from './estimation_detail_instance';

@Component({
  selector: 'app-estimation-detail',
  templateUrl: './estimation-detail.page.html',
  styleUrls: ['./estimation-detail.page.scss'],
})
export class EstimationDetailPage {

  est: Estimation = new Estimation;
  acceptest: AcceptEst = new AcceptEst;
  public hasError = false;
  public canAccept = false;
  loading:any;
  public loader = false;
  estimation_id:any;


  constructor(private params: NavParams, private estimation_service: EstimationService
  ,private job_service: JobService, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
    this.estimation_id = params.data['estimation_id'];
    if (this.estimation_id != null) {
      this.getEstimationDetail(this.estimation_id);
    }
  }

  getEstimationDetail(estimation_id:any) {
    console.log(estimation_id);
    // this.loader = true;
    this.showLoading();
    this.estimation_service.getEstimationDetail(estimation_id).subscribe(response => {
      console.log(response);
      this.est = response[0];
      console.log(this.est);
      // this.loader = false;
      this.dismissLoading();
      this.getJobDetail(this.est.job_id);
    },(error:any)=>{
      this.handleError(error)

    })
  }

  getJobDetail(job_id:any) {
    console.log("Get details of the Job");
    this.job_service.getJobDetail(job_id).subscribe(response => {
      console.log(response);
      if (response.status == 'New') {
        this.canAccept = true;
      }
    },(err:any)=>{
     this.handleError(err)

    })
  }

  accept(est:any) {
    this.showLoading();
    this.acceptest.job_id = est.job_id;
    this.acceptest.professional_id = est.professional_id;
    console.log(this.acceptest);
    this.estimation_service.acceptEstimation(this.acceptest).subscribe(response => {
      console.log(response);
      this.dismissLoading();
      console.log(est.id);
      this.getEstimationDetail(est.id);
    },(err:any)=>{
      this.handleAccepterr(err);

    })
  
  }

  reject(est:any) {
    this.showLoading();
    console.log(est);
    this.estimation_service.rejectEstimation(est).subscribe(response => {
      console.log(response);
      this.dismissLoading();
      this.getEstimationDetail(est.id);
    },(err:any)=>{
      this.rejecthandle(err)

    })
  }

  presentToast(message:any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    }).then(toast => toast.present())
  }

  showLoading() {

    if (this.loading) {
      return;
    }

    this.loadingCtrl.create({
      message: 'Please Wait...',
    }).then(loading => {
      this.loading = true;
      loading.present();
    })
  }

  dismissLoading() {
    if(this.loading){
      this.loadingCtrl.dismiss();
      this.loading = false;
    }
  }


  private handleError(error: any) {
    this.dismissLoading();
    // this.loader = false;
    console.log(error.status);
    console.log(error.statusText);
    if (error.status == '404') {
      this.hasError = true;
    }
  }

  private handleAccepterr(error: any) {
    this.dismissLoading();
    this.presentToast('Oh cannot accept estimation');
  }

  private rejecthandle(error: any) {
    this.dismissLoading();
    this.presentToast('Oh cannot reject estimation');
  }

}
