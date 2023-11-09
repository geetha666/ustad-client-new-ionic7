import { Component } from '@angular/core';
import { JobService } from '../services/job.service';
import { ClientJob } from '../job/clientjob_instance';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-unassigned-job',
  templateUrl: './unassigned-job.page.html',
  styleUrls: ['./unassigned-job.page.scss'],
})
export class UnassignedJobPage {

  constructor(private job_service: JobService, private loadingCtrl: LoadingController, private alertCtrl: AlertController
  ,private router: Router) {
    this.get_id();
  }
  
  clientJob: ClientJob[] = [];
  client_id:any;
  loading:any;
  public hasError = false;
  public networkfail = false;
  confirm;
  
  get_id() {
    this.client_id = localStorage.getItem("client_id");
    console.log(this.client_id);
    if (this.client_id != null) {
      this.getJobs();
    }
  }

  jobDetail(job) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        job: job,
      }
    };
    this.job_service.job_data = job;
    this.router.navigate(['job-detail'] , navigationExtras);
    // this.navCtrl.push(JobDetailPage, {job: job});
  }
  
  
  async getJobs() {
    console.log("get unassigned jobs");
    await this.presentLoading();
    this.job_service.get_unassignjobs(this.client_id).then(async response => {
      console.log(response);
      console.log(response);
      this.clientJob = response;
      console.log(this.clientJob);
      await this.loading.dismiss();
    })
    .catch(error => this.handleError(error));
  }
  
  cancel_job(job) {
    this.job_service.cancelJob(job.job_id).then(response => {
      console.log(response);
      this.getJobs();  
    })
    .catch(error => this.handleError(error));
  }
  
  viewEst(job) {
    console.log(job);
    console.log(job.estimations);
    // this.navCtrl.push(EstimationPage, {job_id: job.job_id});
    // this.getEstimation(job_id);
  }

  showConfirm(job) {
    console.log(job);
    this.confirm = this.alertCtrl.create({
      message: 'Delete Job?',
      subHeader: 'Are you sure you want to delete the Job?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            console.log("Delete the Job");
            console.log(job.job_id);
            this.cancel_job(job);
            // console.log('Agree clicked');
          }
        }
      ]
    }).then(confirm => confirm.present())
  }
  
  
  async presentLoading() {
    // Prepare a loading controller
    this.loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    // Present the loading controller
    await this.loading.present();
  }
  
  public async handleError(error: any): Promise<any> {
    await this.loading.dismiss();
    console.error('An error occurred', error); // for demo purposes only
    if (error.status == "404") {
      this.hasError = true;
      console.log(error.statusText);
    }
    else if (error.status == '0') {
      this.networkfail = true;
    }
    return Promise.reject(error.message || error);
  }
  
}
