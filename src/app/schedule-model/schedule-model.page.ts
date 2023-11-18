import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Job } from '../create-job/create-job-instance';
import { JobService } from '../services/job.service';
import { HomePage } from '../home/home.page';
import { JobDashboardPage } from '../job-dashboard/job-dashboard.page';

@Component({
  selector: 'app-schedule-model',
  templateUrl: './schedule-model.page.html',
  styleUrls: ['./schedule-model.page.scss'],
})
export class ScheduleModelPage {
  myDate:any;
  job: any = {} as Job;
  loader:any;
  public later = false;
  loadingSpin:any
  constructor(public navCtrl: NavController, public navParams: NavParams
  ,private toastCtrl: ToastController, private alertCtrl: AlertController, private job_service: JobService
  ,private loadingCtrl: LoadingController, private modalCtrl: ModalController) {

    // Set the date and time
    let date = new Date();
    this.myDate = new Date(date.getTime() - date.getTimezoneOffset()*60000).toISOString();

    //Fetch the category id from the params
    this.job.category_id = navParams.data['category_id']

    //Get the client id from storage
    this.job.client_id = localStorage.getItem("client_id");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScheduleModelPage');
  }

  hire_now() {
    this.job.type = "text";
    this.job.description ="test";
    // this.showLoading();
    this.job_service.add_job(this.job).subscribe(response => {
      console.log(response);
      // this.dismissLoading();
      this.presentToast("Job posted successfully.Our Professional will contact you shortly.")
      this.go_to_home();
    },(err)=>{
      this.handleJobError(err)
    })  
  }

  submit_job() {
    // this.showLoading();
    // this.dismiss();
    this.job.stime = this.myDate;
    this.job.type = "text";
    this.job.description ="test";
    this.job_service.add_job(this.job).subscribe(response => {
      // this.dismissLoading();
      console.log(response);
      this.presentToast("Job posted successfully.Our Professional will contact you shortly.")
      this.go_to_home();
    },(err)=>{
      this.handleJobError(err)
    })
  }

  go_to_home() {
    this.modalCtrl.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss();
    
    /*
    let activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._overlayPortal.getActive();
    if (activePortal) {
      activePortal.dismiss();
      return;
    }
    */
    
  }

  showLoading() {

    if (this.loader) {
      return;
    }

    this.loadingCtrl.create({
      message: 'Please Wait...',
    }).then(loader => {
      this.loader = true;
      loader.present();
    })
  }

  dismissLoading() {
    if(this.loader){
      this.loadingCtrl.dismiss();
      this.loader = false;
    }
  }


  presentToast(msg:any) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    }).then(toast => toast.present())
  }

  showAlert(sub_title:any) {
    let alert = this.alertCtrl.create({
      message: 'Oh Snap!',
      subHeader: sub_title,
      buttons: ['OK']
    }).then(alert => alert.present())
  }

  public handleJobError(error: any): Promise<any> {
    // this.dismissLoading();
    console.error('An error occurred', error); // for demo purposes only
    if (error.status == '500') {
      this.showAlert('Internal server Error.. Please try again');
    }
    else if (error.status == '422') {
      this.showAlert('Unprocessable entity.. Please try again');
    }
    else if (error.status == '401') {
      this.showAlert('Sorry you are not authorized to perform this action');
    }
    else {
      this.showAlert('Unknown error occured.. Please try again');
    }
    
    return Promise.reject(error.message || error);
  }


}
