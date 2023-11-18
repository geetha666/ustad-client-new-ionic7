import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { User } from '../login/login_instance';
import { AccountService } from '../services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-pass',
  templateUrl: './edit-pass.page.html',
  styleUrls: ['./edit-pass.page.scss'],
})
export class EditPassPage {

  passForm:any= FormGroup;
  loader:any;

  user: any = {} as User;;

  constructor(params: NavParams, private modalCtrl: ModalController, private toastCtrl: ToastController
  ,private account_service: AccountService, private loadingCtrl: LoadingController, private fb: FormBuilder) {
    this.user = params.get('userId');
    console.log(this.user);

    this.passForm = fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, {validator: this.matchingPasswords('password', 'confirmPassword')})
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditpassPage');
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): {[key: string]: any} | null => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      } else {
        return null; // Add this line
      }
    }
  }
  

  dismiss() {
    this.modalCtrl.dismiss();
  }

  changePass() {
    if (this.passForm.valid) {
      this.user.password = this.passForm.value.password;
      this.updateProfessional(this.user);
    }
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
    this.presentToast('unable to update the Password');
    return Promise.reject(error.message || error);
  }

}
