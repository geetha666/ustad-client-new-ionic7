import { Component, OnInit } from '@angular/core';
import { NavParams, NavController } from '@ionic/angular';
import { JobService } from '../services/job.service';
import { Estimation } from './estimation-instance';
import { EstimationService } from '../services/estimation.service';
import { EstimationDetailPage } from '../estimation-detail/estimation-detail.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estimation',
  templateUrl: './estimation.page.html',
  styleUrls: ['./estimation.page.scss'],
})
export class EstimationPage {
  estimation :Estimation[] = [];
  job_id:any;
  public hasError = false;

  constructor(private params: NavParams, private job_service: JobService, private estimation_service: EstimationService
  ,private navCtrl: NavController, private router: Router) {
    this.job_id = params.data['job_id'];
    this.getJobEstimation(this.job_id);
  }

  getJobEstimation(job_id:any) {
    this.job_service.get_estimation(job_id).subscribe(response => {
      console.log(response);
      this.estimation = response;
      console.log(this.estimation);
    },(error:any)=>{
       this.handleError(error)

    })
  }

  estDetail(est:any) {
    console.log(est.estimation_id);
    this.router.navigate(['/estimation-detail'], {queryParams: est.estimation_id})
  }

  private handleError(error: any) {
    console.log(error.status);
    if (error.status == '404') {
      this.hasError = true;
    }
    console.log(error.statusText);
  }

}
