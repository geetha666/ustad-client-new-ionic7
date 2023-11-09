import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { JobService } from '../services/job.service';
import { DomSanitizer} from "@angular/platform-browser";
import { ProfessionalService } from '../services/professional.service';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.page.html',
  styleUrls: ['./job-detail.page.scss'],
})
export class JobDetailPage implements OnInit {

  job:any;
  imgArray:any;
  videoArray:any;
  audioArray:any;
  loading:any;


  constructor(public navCtrl: NavController, private job_service: JobService
  ,private toastCtrl: ToastController, private professional_service: ProfessionalService, private domSanitizer : DomSanitizer
  ,private loadingCtrl: LoadingController, private alertCtrl: AlertController) {

    this.job = this.job_service.job_data;
    console.log(this.job);
    this.check_phone();
    this.check_voice(this.job);
    if (this.job.attachment != 0) {
      this.get_attachments(this.job.job_id);
    }
  }

  ngOnInit() {
    this.imgArray = [];
    this.videoArray = [];
    this.audioArray = [];
  }

  ionViewDidLoad() {
    
  }

  check_phone() {
    if (this.job.professional_phone != null) {
      let abc = this.job.professional_phone.substr(0,1);
      console.log(abc); 
      if (abc == 0) {
        console.log("Do nothing");
      }
      else {
        this.job.professional_phone = '+' + this.job.professional_phone;
      }
    }
  }

  get_attachments(job_id:any) {
    this.job_service.get_attachments(job_id).subscribe(response => {
      console.log(response);
      this.getImgs(response);
      this.getVideos(response);
      this.getAudio(response);
    },(err:any)=>{
      this.attchHandler(err);

    })
  

  }

  check_voice(job:any) {
    if (job.message_type == 'voice') {
      this.job.voice = this.job_service.jobapi + job.voice;
      console.log(this.job.voice);
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.job.voice);
    }
  }

  viewPro(pro_id: any) {
    this.professional_service.professional_id_param = pro_id;
    this.navCtrl.navigateForward('professional-detail');
    // this.navCtrl.push(ProfessionalDetailPage, {professional_id: pro_id});
  }

  monitorJob() {
    this.navCtrl.navigateRoot('job-dashboard');
    // this.navCtrl.setRoot(JobDashboard);
  }

  estimations(job_id: any) {
    // this.navCtrl.push(EstimationPage, {job_id: job_id});
  }

  cancel_job(job_id: any) {
    this.job_service.cancelJob(job_id).subscribe((response: any) => {
      console.log(response);
      let client_id = localStorage.getItem('client_id');
      this.job_service.checkForJob(client_id);
      this.navCtrl.navigateRoot('job-dashboard');
      // this.navCtrl.setRoot(JobPage);
    },()=>{
      this.presentToast('Please Try again..');

    })
   
  }

  showConfirm(job_id: any) {
    console.log(job_id);
    this.alertCtrl.create({
      header: 'Cancel Job?',
      subHeader: 'Are you sure you want to cancel the Job?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            this.cancel_job(job_id);
            // console.log('Agree clicked');
          }
        }
      ]
    }).then(confirm => confirm.present())
  }

  getImgs(response: string | any[]) {
    for (let i =0; i< response.length; i++) {
      if (response[i].type == 'jpeg' || response[i].type == 'jpg' || response[i].type == 'png') {
        this.domSanitizer.bypassSecurityTrustResourceUrl(response[i].attachments);
        this.imgArray.push(response[i].attachments);
      }
    }
  }

  getVideos(response: string | any[]) {
    for (let j =0; j< response.length; j++) {
      if (response[j].type == '3gp' || response[j].type == 'mp4') {
        this.domSanitizer.bypassSecurityTrustResourceUrl(response[j].attachments);
        this.videoArray.push(response[j].attachments);
      }
    }  
  }

  getAudio(response: string | any[]) {
    console.log(response);
    for (let k =0; k< response.length; k++) {
      if (response[k].type == 'mp3' || response[k].type == 'wav') {
        this.domSanitizer.bypassSecurityTrustResourceUrl(response[k].attachments);
        this.audioArray.push(response[k].attachments);
      }
    }  
  }

  attchHandler(err: any): Promise<any> {
    console.error('An error occurred', err);
    this.presentToast('Error in getting attachments')
    return Promise.reject(err.message || err);
  }

  presentToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    }).then(toast => toast.present())
  }

 
}
