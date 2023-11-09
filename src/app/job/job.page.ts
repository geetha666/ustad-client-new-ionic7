import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { JobService } from '../services/job.service';
import { ClientJob, CancelledJobs } from './clientjob_instance';
import { Router, NavigationExtras } from '@angular/router';
import { SuccessModalPage } from '../success-modal/success-modal.page';

@Component({
  selector: 'app-job',
  templateUrl: './job.page.html',
  styleUrls: ['./job.page.scss'],
})
export class JobPage {
  clientJob: ClientJob[] = [];
  public loading = false;
  public hasError = false;
  public networkfail = false;
  job_id:any;
  client_id:any;
  err_reason:any = '';

  cancelledJobs: CancelledJobs[] = [];

  constructor(public navCtrl: NavController
  ,private job_service: JobService, public alertCtrl: AlertController, public loadingCtrl: LoadingController, private router: Router
  ,private modalCtrl: ModalController) {
    this.client_id = localStorage.getItem("client_id");
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.get_all_jobs(this.client_id);
  }

  

  get_all_jobs(client_id:any) {
    this.loading = true;
    this.job_service.get_all_jobs(client_id).subscribe(response => {
      console.log(response);
      this.clientJob = response.jobs;
      this.cancelledJobs = response.client_cancel_jobs;
      this.loading = false;
    },(err:any)=>{
    this.handleError(err)

    })
  }

  jobDetail(job:any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        job: job,
      }
    };
    this.job_service.job_data = job;
    this.router.navigate(['job-detail'] , navigationExtras);
    // this.navCtrl.push(JobDetailPage, {job: job});
  }

  job_history(c_job:any) {

    this.job_service.job_idr = c_job.job_id;
    console.log(c_job);

    this.router.navigate(['job-history']);


    // this.navCtrl.navigateForward('job-history')

    // this.navCtrl.push(JobHistory, {job_id: c_job.job_id});
  }

  completedJobs() {
    //this.router.navigate(['completed-jobs']);
    this.navCtrl.navigateForward('/completed-jobs');
  }
  
  cancelJobs() {
    this.navCtrl.navigateForward('/cancel-jobs')

  }

  assignjob() {
    this.navCtrl.navigateForward('/assign-job');
  }

  unassignjob() {
    this.navCtrl.navigateForward('/unassigned-job');
  }

  pendingjob() {
    this.navCtrl.navigateForward('/pendingjobs');
  }

  inprogressjob() {
    this.navCtrl.navigateForward('/inprogressjob');
  }

  g2cat() {
    // this.navCtrl.push(CategoriesPage);
  }

  public handleError(error: any): Promise<any> {
    this.loading = false;
    console.error('An error occurred', error); // for demo purposes only
    if (error.status == '404') {
      this.hasError = true;
    }
    else if (error.status == '0') {
      this.networkfail = true;
      this.err_reason = 'No internet connection';
    }
    else if (error.status == '500') {
      this.networkfail = true;
      this.err_reason = 'Internal server Error';
    }
    return Promise.reject(error.message || error);
  }
}
