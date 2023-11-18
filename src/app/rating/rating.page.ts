import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { Rating } from './rating-instance';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RatingService } from '../services/rating.service';
import { JobService } from '../services/job.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.page.html',
  styleUrls: ['./rating.page.scss'],
})
export class RatingPage {

  rating:any = {} as Rating;
  job:any;
  loading: any;
  ratingForm:any= FormGroup;

  constructor(private rating_service: RatingService, public navCtrl: NavController
  ,private alertCtrl: AlertController, private loadingCtrl: LoadingController, public formBuilder: FormBuilder
  ,private job_service: JobService) {
   
   
    this.job = this.job_service.job_data;
    console.log(this.job);
    this.rating.client_id = localStorage.getItem("client_id");
    this.rating.professional_id = this.job.professional_id;
    this.rating.job_id = this.job.job_id;
    console.log(this.rating);

    this.ratingForm = formBuilder.group({
      // feedback: ['', Validators.compose([Validators.required,])],
      rating: ['', Validators.compose([Validators.required,])],
      description: ['']
    });

  }

  async submit() {
    await this.presentLoading();
    // this.rating.feedback = this.ratingForm.value.feedback;
    this.rating.rating = this.ratingForm.value.rating;
    this.rating.description = this.ratingForm.value.description;
    console.log(this.rating);
    this.rating_service.add_rating(this.rating).subscribe(async response => {
      console.log(response);
      await this.loading.dismiss();
      this.navCtrl.navigateRoot('job');
      //this.app.getRootNav().setRoot(JobPage);
      this.navCtrl.pop();
    },(error:any)=>{
      this.handleError(error)
    })
   
  }

  async presentLoading() {
    // Prepare a loading controller
    this.loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    // Present the loading controller
    await this.loading.present();
  }
  
  showAlert() {
    this.alertCtrl.create({
      header: 'Oh Snap!',
      subHeader: 'Error sending Feedback.. Try again',
      buttons: ['OK']
    }).then(alert => alert.present())
  }


  public async handleError(error: any): Promise<any> {
    await this.loading.dismiss();
    console.error('An error occurred', error); // for demo purposes only
    this.showAlert();
    return Promise.reject(error.message || error);
  }

}