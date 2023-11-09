import { Component } from '@angular/core';
import { NavParams, AlertController, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { User } from '../login/login_instance';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-edit-phone',
  templateUrl: './edit-phone.page.html',
  styleUrls: ['./edit-phone.page.scss'],
})
export class EditPhonePage {

  loader:any;

  user: User = new User;
  public prefixError = false;

  constructor(params: NavParams, private modalCtrl: ModalController, private toastCtrl: ToastController
  ,private account_service: AccountService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.user = params.get('userId');
    console.log(this.user);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  done() {
    if (this.user.phone == '') {
      this.presentToast('Please Enter the Phone');
      return;
    }
    else if (this.user.phone != '') {
      this.updateClient(this.user);
    }
    console.log(this.user);
    console.log("Done");
  }

  onChangePhone() {
    if (this.user.phone == '') {
      return;
    }
    else if (this.user.phone.length >= 10) {
      if (this.user.phone.substr(0,1) == 0) {
        this.user.phone = '92' + this.user.phone.substr(1);
      }
    }
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

  showAlert(msg:any) {
    this.alertCtrl.create({
      header: 'Error',
      subHeader: msg,
      buttons: ['OK']
    }).then(alert => alert.present())
    ;
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
    if (error.status == '500') {
      this.presentToast('Internal server Error.. Try again');
    }
    else if (error.status == '0') {
      this.presentToast('No internet connection');
    }
    else if (error.status == '422') {
      let err_msg = JSON.parse(error._body);
      // console.log(err_msg);
      if (err_msg.phone == undefined) {
        this.presentToast(err_msg.error);
      }
      else {
        // console.log(err_msg.phone[0]);
        this.presentToast(err_msg.phone[0]);
      }
    }

    return Promise.reject(error.message || error);
  }

}
