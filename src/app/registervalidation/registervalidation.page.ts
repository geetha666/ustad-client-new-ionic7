import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { NavController, LoadingController, AlertController, ModalController, ToastController, MenuController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { ValidateReg } from './registervalidation_instance';
import { AuthGuardService } from '../services/auth-guard.service';
import { AppService } from '../services/app.service';
import { AccountService } from '../services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home.page';
import { ChangephonePage } from '../changephone/changephone.page';

import { TimerComponent } from '../timerComp/timer';
import { HelloComponent } from './hello.component';

declare var SMSReceive: any;


@Component({
  selector: 'app-registervalidation',
  templateUrl: './registervalidation.page.html',
  styleUrls: ['./registervalidation.page.scss'],
})


export class RegistervalidationPage implements OnInit {
  verificationForm: FormGroup;
  valreg: ValidateReg = new ValidateReg;
  loginresponse:any;
  loading:any;

  phone_number:any;

  public codesent = false;

  @ViewChild(TimerComponent, {static: false}) timer!: TimerComponent;



  constructor(public navCtrl: NavController
  ,private auth_service: AuthGuardService, public formBuilder: FormBuilder, private loadingCtrl: LoadingController
  ,private alertCtrl: AlertController, private toastCtrl: ToastController, private app_service: AppService
  , private account_service: AccountService, private modalCtrl: ModalController, private menuCtrl: MenuController) {
    //this.loginresponse = params.data.response;
    //console.log(this.loginresponse);
    this.valreg.client_id = localStorage.getItem("client_id");

    this.verificationForm = formBuilder.group({
      code: ['', Validators.compose([Validators.required,])],
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistervalidationPage');
  }

  ngOnInit() {
    // console.log(this.timer);
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    this.get_client_data(this.valreg.client_id);
  }

  get_client_data(client_id:any) {
    console.log('get client phone number');
    this.app_service.getClientData(client_id).subscribe(response => {
      
    },(err:any)=>{
      if (err.status == '303') {
        let error = JSON.parse(err._body);
        this.phone_number = error.phone;
      }
    })
  

  }


  async verify(code:any) {
    this.valreg.code = code;
    this.verificationForm.value.code = this.valreg.code;
    console.log(this.valreg);
    await this.presentLoading();
    this.account_service.verifyaccount(this.valreg).subscribe(async response => {
      console.log(response);
      await this.loading.dismiss();
      this.presentToast("Account verified successfully");
      // this.stop();
      this.route_to_home(response);
    },(err:any)=>{
      this.handleError(err)
    })
  }

  async resend() {
    await this.presentLoading();
    const m_type = {'message_type': 'sms'}
    this.account_service.resendCode(m_type).subscribe(async response => {
      console.log(response);
      await this.loading.dismiss();
      this.showAlert('Code sent successfully', 'Code has been successfully sent to your number');
      // this.start();
      this.codesent = true;
      setTimeout(() => {
        this.timer.startTimer();
      }, 1000);
    },(err:any)=>{
      this.handleSendError(err)
    })
  }

  start() {
    SMSReceive.startWatch(
      () => {
        document.addEventListener('onSMSArrive', (e: any) => {
          var IncomingSMS = e.data;
          this.processSMS(IncomingSMS);
        });
      },
      () => { console.log('watch start failed') }
    )
  }

  processSMS(data:any) {
    // Check SMS for a specific string sequence to identify it is you SMS
    // Design your SMS in a way so you can identify the OTP quickly i.e. first 6 letters
    // In this case, I am keeping the first 6 letters as OTP
    const message = data.body;
    if (message && data.address == "ICT VISION") {
      var regex = /\d+/g;
      var matches = message.match(regex);  // creates array from matches
      console.log(matches);
      if (matches) {
        this.valreg.code = matches;
        this.verify(this.valreg.code);
      }
    }
  }

  stop() {
    SMSReceive.stopWatch(
      () => { console.log('watch stopped') },
      () => { console.log('watch stop failed') }
    )
  }

  presentPhoneModal() {
    this.modalCtrl.create({
      component: ChangephonePage,
     }).then(profileModal => profileModal.present());
  }

  presentPrompt() {
    this.alertCtrl.create({
      message: 'Change Phone number',
      inputs: [
        {
          name: 'phone_number',
          placeholder: 'Enter your number e.g (923001234567)'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Update',
          handler: data => {
            console.log(data.phone_number);
            this.update_number(data.phone_number);
            console.log("Update Clicked");
          }
        }
      ]
    }).then(alert => alert.present())
  }

  ngDoCheck() {
    if (this.timer) {
      if (this.timer.timer.hasFinished) {
        this.codesent = false;
      }
    }
  }

  async update_number(phone: any) {
    await this.presentLoading();
    this.account_service.update_verification_phone(phone).subscribe(async (response: any) => {
      console.log(response);
      await this.loading.dismiss();
      this.showAlert('Phone number updated', 'You will shortly receive verification code on your new number.');
      this.codesent = true;
      setTimeout(() => {
        this.timer.startTimer();
      }, 1000);
    },(err:any)=>{
      this.handleUpdateError(err)
    })
  }

  logout() {
    this.showLogoffAlert();
  }

  resendCall() {
    const m_type = {'message_type': 'call'}
    this.account_service.resendCode(m_type).subscribe(async (response: any) => {
      console.log(response);
    },(err)=>{
      console.log(err)
    })
  }

  showLogoffAlert() {
    this.alertCtrl.create({
      header: 'Logout',
      subHeader: 'Are you sure you want to log out?',
      buttons: [
        {
          text:'Yes',
          handler:() => {
            localStorage.clear();
            this.navCtrl.navigateRoot('login');
          }
        },
        {
          text:'No',
          role:'cancel',
          handler:() => {
            console.log("Not navigating back");
            // this.location.back();
          }
        }
      ]
    }).then(alert => alert.present())
  }

  async handleSendError(err:any):Promise<any> {
    await this.loading.dismiss();
    console.error('An error occurred', err);
    this.showAlert('SMS Sending Failed', 'Error while sending code.. Please Try again');
    return Promise.reject(err.message || err);
  }

  async handleUpdateError(err:any):Promise<any> {
    console.log(err);
    await this.loading.dismiss();
    return Promise.reject(err.message || err);
  }

  route_to_home(response: null) {
    var token = localStorage.getItem("token");
    if(response != null && token != null) {
      console.log(response);
      this.navCtrl.navigateRoot('home');
      // this.navCtrl.setRoot(HomePage);
    }
  }

  async presentLoading() {
    // Prepare a loading controller
    this.loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    // Present the loading controller
    await this.loading.present();
  }

  presentToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    }).then(toast => toast.present());
  }

  showAlert(r_title: string, response: string) {
    this.alertCtrl.create({
      header: r_title,
      subHeader: response,
      buttons: ['OK']
    }).then(alert => alert.present())
  }

  public async handleError(error: any): Promise<any> {
    await this.loading.dismiss();
    console.error('An error occurred', error); // for demo purposes only
    this.showAlert('SMS Verification Failed','Please Enter correct code');
    if (error.status == "404") {
      console.log(error.statusText);
    }
    return Promise.reject(error.message || error);
  }

}
