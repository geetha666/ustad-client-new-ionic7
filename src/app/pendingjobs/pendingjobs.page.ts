import { Component, OnInit } from '@angular/core';
import { JobService } from '../services/job.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ClientJob } from '../job/clientjob_instance';

@Component({
  selector: 'app-pendingjobs',
  templateUrl: './pendingjobs.page.html',
  styleUrls: ['./pendingjobs.page.scss'],
})
export class PendingjobsPage implements OnInit {

  constructor(private job_service: JobService, private loadingCtrl: LoadingController, private alertCtrl: AlertController
    ,private navCtrl: NavController, private router: Router) {
      this.get_id();
    }
  
    clientJob: ClientJob[] = [];
    public loading = false;
    public hasError = false;
    public networkfail = false;
    client_id:any;
  
    get_id() {
      this.client_id = localStorage.getItem("client_id");
      // console.log(this.client_id);
    }
  
    ngOnInit() {
      this.getJobs(this.client_id);
    }
  
    getJobs(client_id:any) {
      // console.log("get unassigned jobs");
      this.loading = true;
      this.job_service.get_completejobs(client_id).subscribe(response => {
        response.forEach(element => {
          if (element.rating == null) {
            this.clientJob.push(element);
          }
        });
        this.loading = false;
      },(error:any)=>{
        this.handleError(error)
      })
    }
  
    job_details(job:any) {
     
      // this.router.navigate(['/job-history'],{queryParams: job.job_id})

      this.job_service.job_idr = job.job_id;

      this.navCtrl.navigateForward('job-history');



      // this.navCtrl.push(JobHistory, {job_id: job.job_id});
    }
  
    route_to_rating(job:any) {

      this.router.navigate(['/rating'],{queryParams: job});
      // console.log(job);
      // this.navCtrl.push(RatingPage, {job: job});
    }
  
    public handleError(error: any): Promise<any> {
      this.loading = false;
      console.error('An error occurred', error); // for demo purposes only
      if (error.status == "404") {
        this.hasError = true;
        // console.log(error.statusText);
      }
      else if (error.status == '0') {
        this.networkfail = true;
      }
      else {
  
      }
      return Promise.reject(error.message || error);
    }

}
