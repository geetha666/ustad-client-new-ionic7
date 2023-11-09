import { Component, OnInit } from '@angular/core';
import { InprogressJob } from '../job-dashboard/job-dashboard-instance';
import { JobService } from '../services/job.service';
import { NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-inprogressjob',
  templateUrl: './inprogressjob.page.html',
  styleUrls: ['./inprogressjob.page.scss'],
})
export class InprogressjobPage implements OnInit {

  client_id:any;
  public nojob = false;
  public loading = false;
  public networkfail = false;
  loader:any;

  mySpecialLoader: any;

  progressJob: InprogressJob[] = [];

  constructor(private job_service: JobService, private navCtrl: NavController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    let client_id = localStorage.getItem('client_id');
    this.InprogressJobs(client_id);
  }

  async InprogressJobs(client_id:any) {
    await this.presentLoading();
    this.job_service.get_inprogressJobs(client_id).subscribe(async response => {
      this.progressJob = response;
      console.log(response);
      this.loading = false;
      await this.mySpecialLoader.dismiss();
    },(err:any)=>{
   this.handleError(err)

    })
  }

  jobview(job:any) {
    console.log('open the job view page');
    this.job_service.job_data = job;
    this.navCtrl.navigateForward('activejob');

    // this.navCtrl.push(ActiveJobPage, {job: job});
  }

  async presentLoading() {
    // Prepare a loading controller
    this.mySpecialLoader = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    // Present the loading controller
    await this.mySpecialLoader.present();
  }

  public async handleError(error: any): Promise<any> {
    await this.mySpecialLoader.dismiss();
    this.loading = false;
    console.error('An error occurred', error); // for demo purposes only
    if (error.status == "404") {
      this.nojob = true;
      console.log(error.statusText);
    }
    else if (error.status == '0') {
      this.networkfail = true;
    }
    return Promise.reject(error.message || error);
  }

}
