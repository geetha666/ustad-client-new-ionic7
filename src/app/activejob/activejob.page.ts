import { Component, OnDestroy } from '@angular/core';
import { JobService } from '../services/job.service';
import { TimerService } from '../services/timer.service';
import { ToastController } from '@ionic/angular';
import { timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-activejob',
  templateUrl: './activejob.page.html',
  styleUrls: ['./activejob.page.scss'],
})
export class ActivejobPage implements OnDestroy {

  activejob: any;
  digitalTime: any;
  totalTime: any;
  job_id: any;
  loader: any;
  updateVar!: Subscription;

  constructor(
    private job_service: JobService,
    private toastCtrl: ToastController,
    private timer_service: TimerService
  ) {
    this.activejob = this.job_service.job_data;
    this.getJobTime(this.activejob.job_id);
    this.startUpdate();
  }

  getActiveJob(job_id: any) {
    this.job_service.getJobDetail(job_id).subscribe(
      (response) => {
        console.log(response);
        this.activejob = response;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ionViewDidLeave() {
    this.stopUpdate();
  }

  subscribeToUpdate() {
    this.updateVar = timer(5000).subscribe(() => this.startUpdate());
  }

  startUpdate() {
    this.getJobTime(this.activejob.job_id);
    this.subscribeToUpdate();
  }

  stopUpdate() {
    this.updateVar.unsubscribe();
  }

  getJobTime(job_id: any) {
    console.log("Update the Timer automatically");
    this.job_service.getJobRecentStatus(job_id).subscribe(
      (response) => {
        console.log(response);

        if (response.time_start != null && response.shift_id != null) {

          var ts = Math.round(new Date().getTime() / 1000);
          console.log(ts);
    
          var diff = ts - response.time_start;
          console.log(diff);

          this.digitalTime = this.timer_service.getSecondsAsDigitalClock(diff);
    
          if (response.total != null) {
            this.totalTime = this.timer_service.getSecondsAsDigitalClock(response.total);
          } else if (response.total == null) {
            this.totalTime = this.timer_service.getSecondsAsDigitalClock(diff);
          }

        } else if (response.time_start == null && response.shift_id == null) {

          this.digitalTime = '00:00:00';

          this.totalTime = this.timer_service.getSecondsAsDigitalClock(response.total);

        }
      },
      (err) => this.recentHandle(err)
    );
  }

  recentHandle(err: { status: string; }) {
    console.log(err);
    if (err.status == '404') {
      this.digitalTime = '00:00:00';
      this.totalTime = '00:00:00';
    } else {
      this.presentToast('Unable to refresh the Job');
    }
  }

  doRefresh(refresher: { complete: () => void; }) {
    this.getJobTime(this.activejob.job_id);
    this.getActiveJob(this.activejob.job_id);
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  presentToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 3000
    }).then(toast => toast.present());
  }

  ngOnDestroy() {
    this.stopUpdate();
  }
}
