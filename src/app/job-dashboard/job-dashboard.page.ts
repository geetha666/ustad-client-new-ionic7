import { Component, OnInit } from '@angular/core';
import { JobService } from '../services/job.service';
import { InprogressJob } from './job-dashboard-instance';
import { NavController, LoadingController } from '@ionic/angular';
import { ClientJob } from '../job/clientjob_instance';
import { NavigationExtras, Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'app-job-dashboard',
  templateUrl: './job-dashboard.page.html',
  styleUrls: ['./job-dashboard.page.scss'],
})
export class JobDashboardPage implements OnInit {
  client_id:any;
  public loading = false;
  public networkfail = false;
  loader:any;
  public progressjobErr = false;
  public newjobErr = false;
  public assignjobErr = false;
  public ratingjobErr = false;

  private timerSubscription: any;

  mySpecialLoader: any;

  progressJob:any={} as InprogressJob[];
  newJob:  ClientJob[] = [];
  assignJob:  ClientJob[] = [];
  ratingPending:  ClientJob[] = [];

  err_reason:any;

  myjobs:any[] = [];

  constructor(private job_service: JobService, private navCtrl: NavController, private loadingCtrl: LoadingController
  ,private router: Router) {
    this.client_id = localStorage.getItem("client_id");
  }

  ngOnInit() {
    this.InprogressJobs(this.client_id);
    this.getAllJobs();
    this.getJobs(this.client_id);

    setTimeout(() => {
      this.refreshData();
    }, 10000);
  }

  ionViewDidLeave() {
    this.newJob = [];
    this.assignJob = [];
    this.ratingPending = [];
    if (this.timerSubscription != undefined) {
      this.unsubscribe_to_update();
    }
  }

  unsubscribe_to_update() {
    this.timerSubscription.unsubscribe();
  }

  private refreshData(): void {
    this.newJob = [];
    this.assignJob = [];
    this.ratingPending = [];
    this.InprogressJobs(this.client_id);
    this.getAllJobs();
    this.getJobs(this.client_id);
    this.subscribeToData();
  }

  private subscribeToData(): void {
    this.newJob = [];
    this.assignJob = [];
    this.ratingPending = [];
    this.timerSubscription = timer(17000).subscribe(() => this.refreshData());
    console.log(this.timerSubscription);
  }

  ionViewWillEnter() {
    console.log('ion view will enter executed');
    if (this.newJob.length > 0) {
      // this.newJob = [];
      // this.assignJob = [];
      // this.ratingPending = [];
    }
  }

  getAllJobs() {
    console.log('get all job');
    this.job_service.get_all_jobs(this.client_id).subscribe(async response => {
      
      //  let jobs = response.jobs;
      response.jobs.forEach(async (element:any) => {
        if (element.status == 'new' ) {
          this.newJob.push(element);  
        }
      });

      response.jobs.forEach((element:any) => {
        if (element.status == 'assigned') {
          this.assignJob.push(element);
        }
      });

      if (this.newJob.length <= 0 ) {
        this.newjobErr = true;
      }

      if (this.assignJob.length <= 0) {
        this.assignjobErr = true;
      }

    },(err:any)=>{
      
    })
  
  }

  getJobs(client_id: any) {
    // console.log("get unassigned jobs");
    this.job_service.get_completejobs(client_id).subscribe((response: any[]) => {
      response.forEach((element: ClientJob) => {
        if (element.rating == null) {
          this.ratingPending.push(element);
        }
      });

      if (this.ratingPending.length <= 0) {
        this.ratingjobErr = true;
      }
    },(error:any)=>{
      this.handleError(error)

    })
  }

  async InprogressJobs(client_id: any) {
    this.job_service.checkForJob(client_id);
    // await this.presentLoading();
    this.job_service.get_inprogressJobs(client_id).subscribe(async (response: InprogressJob[]) => {
      this.progressJob = response;
      console.log(response);
      this.loading = false;
      // await this.mySpecialLoader.dismiss();
    },(err:any)=>{
     this.handleError(err)

    })
  }

  jobview(job: any) {
    console.log('open the job view page');
    this.job_service.job_data = job;
    this.navCtrl.navigateForward('activejob');

    // this.navCtrl.push(ActiveJobPage, {job: job});
  }

  jobDetail(job: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        job: job,
      }
    };
    this.job_service.job_data = job;
    this.router.navigate(['job-detail'] , navigationExtras);
    // this.navCtrl.push(JobDetailPage, {job: job});
  }

  route_to_rating(job: any) {
    this.job_service.job_data = job;
    this.navCtrl.navigateForward('rating');
    // this.navCtrl.push(RatingPage, {job: job});
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
    this.loading = false;
    // await this.mySpecialLoader.dismiss();
    console.error('An error occurred', error); // for demo purposes only
    if (error.status == "404") {
      this.progressjobErr = true;
      // this.err_reason = 'No Jobs in Progress';
      console.log(error.statusText);
    }
    else if (error.status == '0') {
      this.networkfail = true;
    }
    return Promise.reject(error.message || error);
  }

  category() {
    this.navCtrl.navigateForward('/categories');
  }
}
