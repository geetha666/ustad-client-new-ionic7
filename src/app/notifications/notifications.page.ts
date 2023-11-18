import { Component } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { NotificationService } from '../services/notification.service';
import { Notification } from './notifications-instance';
import { JobService } from '../services/job.service';
import { Router, NavigationExtras } from '@angular/router'; 
import { ProfessionalService } from '../services/professional.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage {

  notification:any={} as Notification ;
  loadingSpin:any;
  public hasError = false;
  public networkfail = false;
  client_id:any;
  public refreshing = false;
  public notificationAvail = false;
  

  constructor(public navCtrl: NavController, private notification_service: NotificationService
  ,private job_service: JobService, private router: Router, private professional_service: ProfessionalService) {
    console.log("Notification page");
    this.client_id = localStorage.getItem("client_id");
    this.get_Allnotifications(this.client_id);
  }

  get_Allnotifications(client_id:any) {
    console.log(this.notification.length);
    this.loadingSpin = true;
    this.notification_service.getAllNotifications(client_id).subscribe(response => {
      // this.notification = response;
      if (response.length == '0') {
        this.hasError = true;
      }
      else {
        this.notification = response;
        this.notificationAvail = true;
      }
      // var abc = document.getElementsByClassName('testingPag');
      // abc[0].innerHTML = 'Testing Notifications';
      this.loadingSpin = false;
    },(error:any)=>{
      this.handleError(error)
    })
  }

  routetype(notifi:any) {
    console.log(notifi);
    if (notifi.type == 'estimation_created') {
      if (notifi.job_status == 'assigned') {
        // this.navCtrl.push(EstimationDetailPage, {estimation_id: notifi.type_id});
      }
    }
    else if (notifi.type == 'job_assigned') {

      let navigationExtras: NavigationExtras = {
        queryParams: {
          professional_id: notifi.type_id,
        }
      };
  
      this.professional_service.professional_id_param = notifi.type_id;
      this.router.navigate(['professional-detail'], navigationExtras);
      // this.navCtrl.push(ProfessionalDetailPage, {professional_id: notifi.type_id});
    }
    else if (notifi.type == 'visit_requested') {
      this.job_service.job_idr = notifi.type_id;
      this.navCtrl.navigateForward('professional-status');
      // this.navCtrl.push(ProfessionalStatusPage, {job_id: notifi.type_id});
    }
    else if (notifi.type == 'job_accepted') {
      if (notifi.job_status == 'assigned' || notifi.job_status == 'inprogress') {
        this.navCtrl.navigateRoot('job-dashboard');
        // this.navCtrl.setRoot(JobDashboard);
      }
    }
    else if (notifi.type == 'job_paused' || notifi.type == 'job_started') {
      this.navCtrl.navigateRoot('job-dashboard');
      // this.navCtrl.setRoot(JobDashboard);
    }
    else if (notifi.type == 'job_cancelled') {
      this.job_service.job_idr = notifi.job_id;
      this.navCtrl.navigateForward('job-history');
      // this.navCtrl.push(JobHistory, {job_id: notifi.job_id});
    }
    else {
      console.log("Do nothing...");
    }
  }

  ratePopover() {
    
  }

  doRefresh(event:any) {
    console.log('Begin async operation');

    console.log(event);

    this.refreshing = true;
    this.get_Allnotifications(this.client_id);

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }


  public handleError(error: any): Promise<any> {
    this.loadingSpin = false;
    console.error('An error occurred', error); // for demo purposes only
    console.error("Live reload fails....");
    if (error.status == "404") {
      this.hasError = true;
      console.log(error.statusText);
    }
    else if (error.status == '0') {
      this.networkfail = true;
      console.log("do nothing");
    }
    else {
      console.log("do nothing");
    }
    return Promise.reject(error.message || error);
  }

}
