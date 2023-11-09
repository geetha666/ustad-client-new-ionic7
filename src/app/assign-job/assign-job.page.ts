import { Component } from '@angular/core';
import { JobService } from '../services/job.service';
import { ClientJob } from '../job/clientjob_instance';
import { AlertController, LoadingController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-assign-job',
  templateUrl: './assign-job.page.html',
  styleUrls: ['./assign-job.page.scss'],
})
export class AssignJobPage {

  clientJob: ClientJob[] = [];
  client_id: any;
  loading: any;
  public hasError = false;
  public networkfail = false;

  constructor(
    private job_service: JobService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    this.get_id();
  }

  async get_id() {
    this.client_id = localStorage.getItem("client_id");
    if (this.client_id != null) {
      this.getJobs();
    }
  }

  async getJobs() {
    await this.presentLoading();
    this.job_service.get_assignjobs(this.client_id).subscribe(
      async (response) => {
        this.clientJob = response;
        await this.loading.dismiss();
      },
      (error) => this.handleError(error)
    );
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    await this.loading.present();
  }

  jobDetail(job:any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        job: job,
      }
    };
    this.job_service.job_data = job;
    this.router.navigate(['job-detail'], navigationExtras);
  }

  async showConfirm(job:any) {
    const confirm = await this.alertCtrl.create({
      header: 'Delete Job?',
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
          }
        }
      ]
    });
    await confirm.present();
  }

  cancel_job(job:any) {
    this.job_service.cancelJob(job.job_id).subscribe(
      () => {
        this.getJobs();
      },
      (error) => this.handleError(error)
    );
  }

  async handleError(error: any): Promise<any> {
    await this.loading.dismiss();
    console.error('An error occurred', error);
    if (error.status == "404") {
      this.hasError = true;
    } else if (error.status == '0') {
      this.networkfail = true;
    }
    return Promise.reject(error.message || error);
  }

}
