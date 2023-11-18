import { Component } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { AccountService } from '../services/account.service'; 
import { Professional } from './professional_instance';
import { ProfessionalService } from '../services/professional.service';

@Component({
  selector: 'app-professional-detail',
  templateUrl: './professional-detail.page.html',
  styleUrls: ['./professional-detail.page.scss'],
})
export class ProfessionalDetailPage {

  professional_id:any;
  public networkfail = false;
  public hasError = false;
  loader:any;

  professional: any = {} as Professional;

  constructor(public navCtrl: NavController, private account_service: AccountService
  ,private loadingCtrl: LoadingController, private professional_service: ProfessionalService) {

    this.professional_id = this.professional_service.professional_id_param;
    this.get_Professional(this.professional_id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfessionalDetailPage');
  }

  async get_Professional(professional_id:any) {
    await this.presentLoading();
    this.account_service.get_professional(professional_id).subscribe(async response => {
      console.log(response);
      this.professional = response;
      this.check_phone();
      await this.loader.dismiss();
    },(err:any)=>{
      this.handleError(err)
    })
   
  }

  check_phone() {
    let abc = this.professional.phone.substr(0,1);
    console.log(abc); 
    if (abc == 0) {
      console.log("Do nothing");
    }
    else {
      this.professional.phone = '+' + this.professional.phone;
    }
  }

  async presentLoading() {
    // Prepare a loading controller
    this.loader = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    // Present the loading controller
    await this.loader.present();
  }

  
  private async handleError(error: any): Promise<any> {
    await this.loader.dismiss();
    console.error('An error occurred', error);
    if (error.status == '404') {
      this.hasError = true;
    }
    else if (error.status == '0') {
      this.networkfail = true;
    }
    return Promise.reject(error.message || error);
  }
}
