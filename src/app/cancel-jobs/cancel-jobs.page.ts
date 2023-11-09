import { Component, OnInit } from '@angular/core';
import { CancelledJobs } from '../job/clientjob_instance';
import { JobService } from '../services/job.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cancel-jobs',
  templateUrl: './cancel-jobs.page.html',
  styleUrls: ['./cancel-jobs.page.scss'],
})
export class CancelJobsPage implements OnInit {

  cancelledJobs: CancelledJobs[] = [];
  public loading = false;
  public hasError = false;
  public networkfail = false;

  constructor(private job_service: JobService, private navCtrl: NavController) { }

  ngOnInit() {
    let client_id = localStorage.getItem('client_id');
    this.get_all_jobs(client_id);
  }

  get_all_jobs(client_id:any) {
    this.loading = true;
    this.job_service.get_all_jobs(client_id).subscribe(
      (response) => {
        console.log(response);
        this.cancelledJobs = response.client_cancel_jobs;
        if (response.client_cancel_jobs.length == 0) {
          this.hasError = true;
        }
        this.loading = false;
      },
      (err) => this.handleError(err)
    );
  }

  job_history(c_job:any) {
    this.job_service.job_idr = c_job.job_id;
    console.log(c_job);
    this.navCtrl.navigateForward('/job-history');
    // this.navCtrl.push(JobHistory, {job_id: c_job.job_id});
  }

  public handleError(error: any): Promise<any> {
    this.loading = false;
    console.error('An error occurred', error);
    if (error.status == "404") {
      this.hasError = true;
    } else if (error.status == '0') {
      this.networkfail = true;
    } else {
      // Handle other cases if needed
    }
    return Promise.reject(error.message || error);
  }
}
