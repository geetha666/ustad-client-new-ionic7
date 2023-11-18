import { Component } from '@angular/core';
import { NavParams, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { User } from '../login/login_instance';
import { AccountService } from '../services/account.service';


@Component({
  selector: 'app-edit-email',
  templateUrl: './edit-email.page.html',
  styleUrls: ['./edit-email.page.scss'],
})
export class EditEmailPage {
  loader:any;

  user: any = {} as User;;

  constructor(params: NavParams, private modalCtrl: ModalController, private toastCtrl: ToastController
  ,private account_service: AccountService, private loadingCtrl: LoadingController) {
    this.user = params.get('userId');
    console.log(this.user);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  done() {
    if (this.user.email == '') {
      this.presentToast('Please Enter the Email');
      return;
    }
    else if (this.user.email != '') {
      this.updateClient(this.user);
    }
    console.log(this.user);
    console.log("Done");
  }

  async updateClient(user:any) {
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
    this.presentToast('unable to update the Email');
    return Promise.reject(error.message || error);
  }


}

