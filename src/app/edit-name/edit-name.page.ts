import { Component } from '@angular/core';
import { NavParams, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { User } from '../login/login_instance';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-edit-name',
  templateUrl: './edit-name.page.html',
  styleUrls: ['./edit-name.page.scss'],
})
export class EditNamePage {
  loader:any;

  user: User = new User;

  constructor(params: NavParams, private modalCtrl: ModalController, private toastCtrl: ToastController
  ,private account_service: AccountService, private loadingCtrl: LoadingController) {
    this.user = params.get('userId');
    console.log(this.user);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  done() {
    if (this.user.firstname == '' || this.user.lastname == '' || this.user.firstname == undefined) {
      this.presentToast('Please Enter the name');
      return;
    }
    else if (this.user.firstname != '' || this.user.lastname != '') {
      this.updateProfessional(this.user);
    }
    console.log(this.user);
    console.log("Done");
  }

  async updateProfessional(user:any) {
    await this.presentLoading();
    this.account_service.update_clientdata(user).subscribe(async response => {
      console.log(response);
      await this.loader.dismiss();
      this.dismiss();
    },(err:any)=>{
     this.handleError(err)

    })
  }

  presentToast(message:any) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    }).then(toast => toast.present())
  }

  async presentLoading() {
    // Prepare a loading controller
    this.loader = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    // Present the loading controller
    await this.loader.present();
  }

  public async handleError(error: any): Promise<any> {
    await this.loader.dismiss();
    console.error('An error occurred', error); // for demo purposes only
    this.presentToast('unable to update the name');
    return Promise.reject(error.message || error);
  }


}
