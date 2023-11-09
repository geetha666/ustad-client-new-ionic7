import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { DomSanitizer} from "@angular/platform-browser";
import { JobService } from '../services/job.service';
import { ProfessionalDetailPage } from '../professional-detail/professional-detail.page';
import { RatingPage } from '../rating/rating.page';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ProfessionalService } from '../services/professional.service';

@Component({
  selector: 'app-job-history',
  templateUrl: './job-history.page.html',
  styleUrls: ['./job-history.page.scss'],
})
export class JobHistoryPage implements OnInit {

  job_id:any;
  job_status:any;
  imgArray:any;
  videoArray:any;
  audioArray:any;
  public loading = false;
  public networkfail = false;
  public hasError = false;

  ionViewDidLoad() {
    this.imgArray = [];
    this.videoArray = [];
    this.audioArray = [];
  }

  constructor(private job_service: JobService
  ,private domSanitizer : DomSanitizer, private toastCtrl: ToastController, private navCtrl: NavController
  ,private route: ActivatedRoute, private router: Router, private professional_service: ProfessionalService) {

    
    this.job_id = this.job_service.job_idr;
    console.log(this.job_id);

    // this.job_id = params.data.job_id;
  }

  ngOnInit() {
    this.getJob(this.job_id);
  }

  ionViewCanEnter() {
  }

  getJob(job_id:any) {
    this.loading = true;
    this.job_service.getJobDetail(job_id).subscribe(response  => {
      console.log(response);
      this.job_status = response;
      this.check_voice(this.job_status);
      if (this.job_status.attachment != 0) {
        this.get_attachments(this.job_status.job_id);
      }
      this.loading = false;
    },(err:any)=>{
     this.handleError(err)

    })
  }

  check_voice(job:any) {
    if (this.job_status.message_type == 'voice') {
      this.job_status.voice = this.job_service.jobapi + job.voice;
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.job_status.voice);
    }
  }

  get_attachments(job_id:any) {
    this.job_service.get_attachments(job_id).subscribe(response => {
      console.log(response);
      this.getImgs(response);
      this.getVideos(response);
      this.getAudio(response);
    },(err)=>{
      this.attchHandler(err);

    })
  

  }

  getImgs(response:any) {
    for (let i =0; i< response.length; i++) {
      if (response[i].type == 'jpeg' || response[i].type == 'jpg' || response[i].type == 'png') {
        this.domSanitizer.bypassSecurityTrustResourceUrl(response[i].attachments);
        this.imgArray.push(response[i].attachments);
      }
    }
  }

  getVideos(response:any) {
    for (let j =0; j< response.length; j++) {
      if (response[j].type == '3gp' || response[j].type == 'mp4') {
        this.domSanitizer.bypassSecurityTrustResourceUrl(response[j].attachments);
        this.videoArray.push(response[j].attachments);
      }
    }  
  }

  getAudio(response:any) {
    console.log(response);
    for (let k =0; k< response.length; k++) {
      if (response[k].type == 'mp3' || response[k].type == 'wav') {
        this.domSanitizer.bypassSecurityTrustResourceUrl(response[k].attachments);
        this.audioArray.push(response[k].attachments);
      }
    }  
  }

  viewPro(pro_id:any) {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        professional_id: pro_id,
      }
    };

    this.professional_service.professional_id_param = pro_id;
    this.router.navigate(['professional-detail'], navigationExtras);

    // this.navCtrl.navigateForward('professional-detail', );
    // this.navCtrl.push(ProfessionalDetailPage, {professional_id: pro_id});
  }

  route_to_rating(job:any) {
    this.job_service.job_data = job;
    this.navCtrl.navigateForward('rating');
    // this.navCtrl.push(RatingPage, {job: job});
  }

  attchHandler(err: any): Promise<any> {
    console.error('An error occurred', err);
    this.presentToast('Error in getting attachments')
    return Promise.reject(err.message || err);
  }

  presentToast(msg:any) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    }).then(toast => toast.present())
  }

  public handleError(error: any): Promise<any> {
    this.loading = false;
    console.error('An error occurred', error); // for demo purposes only
    console.log(error.status);
    if (error.status == '404') {
      this.hasError = true;
    }
    if (error.status == '0') {
      this.networkfail = true;
    }
    return Promise.reject(error.message || error);
  }

}
