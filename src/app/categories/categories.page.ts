import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { NavController, ModalController, AlertController, LoadingController } from '@ionic/angular';
import { CategoriesService } from '../services/categories.service';
import { Category } from './categories-instance';
import { JobService } from '../services/job.service';
import { Job } from '../create-job/create-job-instance';
import * as $ from 'jquery';
import { LocationService } from '../services/location.service';
import { SuccessModalPage } from '../success-modal/success-modal.page';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  categories:Category[] = [];
  loading:any;
  public hasError = false;
  public networkfail = false;
  job: Job = new Job;
  myDate: any;
  
  myloader: any;

  @ViewChild('content', {static: false}) private content: any;

  constructor(public navCtrl: NavController, private category_service: CategoriesService
  ,private zone: NgZone, private job_service: JobService
  ,private alertCtrl: AlertController, private loadingCtrl: LoadingController, private location_service: LocationService
  ,private modalCtrl: ModalController) {

    this.job.client_id = localStorage.getItem("client_id");
    this.job.latitude = this.location_service.client_latitude;
    this.job.longitude = this.location_service.client_longitude;

    // Set the date and time
    let date = new Date();
    this.myDate = new Date(date.getTime() - date.getTimezoneOffset()*60000).toISOString();
  }

  ionViewDidLoad() {
    
  }

  ngOnInit() {
    this.get_Categories();
    jQuery("#ex1").hide();
  }

  ngAfterViewInit(){

  }

  get_Categories() {
    this.zone.run(() => {
      this.loading = true;
      this.category_service.getCategory().subscribe(response => {
        this.loading = false;
        this.categories = response;
      },(err:any)=>{
         this.handleError(err)

      })
    })
  }

  click_img(id:any) {
    this.job.category_id = id;
    jQuery("#ex1").show();
    this.content.scrollToTop(300);
    // console.log('hyyyy');
    // this.navCtrl.pop();
    // let payModal = this.modalCtrl.create(ScheduleModelPage, {category_id: id});
    // payModal.present();
  }

  close() {
    jQuery("#ex1").hide();
  }

  // Hire Now or Schedule Job

  async hire_now() {
    this.job.type = "text";
    this.job.description ="test";
    await this.presentLoading();
    this.job_service.add_job(this.job).subscribe(async response => {
      await this.myloader.dismiss();
      this.go_to_home();
      setTimeout(() => {
        this.showModal();
      }, 3000);

    },(err:any)=>{
     this.handleJobError(err)
    })
  }

  async submit_job() {
    await this.presentLoading();
    this.job.stime = this.myDate;
    this.job.type = "text";
    this.job.description ="test";
    this.job_service.add_job(this.job).subscribe(async response => {
      await this.myloader.dismiss();
      console.log(response);
      this.go_to_home();
      setTimeout(() => {
        this.showModal();
      }, 3000);
    },(err:any)=>{
    this.handleJobError(err) 
    })
  }

  showModal() {
    let client_id = localStorage.getItem('client_id');
    this.job_service.checkForJob(client_id);
    this.modalCtrl.create({
      component: SuccessModalPage,
      cssClass: 'modal-transparency',
    }).then((profileModal:any) => profileModal.present());
  }

  go_to_home() {
    this.navCtrl.navigateRoot('/job-dashboard');
  }

  async presentLoading() {
    // Prepare a loading controller
    this.myloader = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    // Present the loading controller
    await this.myloader.present();
  }

  // Alert

  showAlert(sub_title:any) {
    this.alertCtrl.create({
      header: 'Oh Snap!',
      subHeader: sub_title,
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  // Handle Job Error

  public async handleJobError(error: any): Promise<any> {
    let mno = JSON.parse(error._body);
    await this.myloader.dismiss();
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
      if (mno.error != undefined) {
        this.showAlert(mno.error);
      }
      
    }
    
    return Promise.reject(error.message || error);
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
