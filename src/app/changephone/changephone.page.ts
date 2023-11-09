import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from '@ionic/angular';
import { AccountService } from '../services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-changephone',
  templateUrl: './changephone.page.html',
  styleUrls: ['./changephone.page.scss'],
})
export class ChangephonePage {

  myloader:any;

  phoneForm: FormGroup;
  public prefixError = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private toastCtrl: ToastController
    ,private account_service: AccountService, private loadingCtrl: LoadingController, private fb: FormBuilder
    ,private alertCtrl: AlertController) {

    this.phoneForm = fb.group({
      phone: ['', Validators.compose([Validators.required, Validators.min(1000000000), Validators.max(99999999999)])],
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangephonePage');
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  showAlert(msg: any) {
    this.alertCtrl.create({
      header: 'Error',
      subHeader: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  async updatePhone() {
    let phone;
    if (parseInt(String(this.phoneForm.value.phone).charAt(0)) == 0) {
      phone = '92' + this.phoneForm.value.phone.substr(1);
    }
    else {
      phone = '92' + this.phoneForm.value.phone;
    }
    await this.presentLoading();
    this.account_service.update_verification_phone(phone).subscribe(async (response: any) => {
      console.log(response);
      await this.myloader.dismiss();
      this.presentToast('Phone number updated successfully.')
      this.dismiss();
    },(err:any)=>{
     this.handleError(err)

    })
  }

  presentToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    }).then(toast => toast.present());
  
  }

  async presentLoading() {
    // Prepare a loading controller
    this.myloader = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    // Present the loading controller
    await this.myloader.present();
  }

  public async handleError(error: any): Promise<any> {
    await this.myloader.dismiss();
    console.error('An error occurred', error); // for demo purposes only
    if (error.status == '0') {
      this.presentToast('No internet connection.. Try again');
    }
    else if (error.status == '422') {
      let err_msg = JSON.parse(error._body);
      console.log(err_msg);
      if (err_msg.phone != undefined ) {
        if (err_msg.phone.length == 2) {
          this.presentToast(err_msg.phone[0] + err_msg.phone[1]);
        }
        else {
          this.presentToast(err_msg.phone[0]);
        }
      }
      else {
        this.presentToast(err_msg.error);
      }
    }
    else if (error.status == '500') {
      this.presentToast('Internal server error.. Try again');
    }
    else if (error.status == '401') {
      this.presentToast('You are not authorized to perform this action');
    }
    else {
      this.presentToast('Unknown error occured.. Try again');
    }
    return Promise.reject(error.message || error);
  }

}
