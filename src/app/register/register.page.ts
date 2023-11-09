import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController, MenuController } from '@ionic/angular';
import { User } from '../login/login_instance';
import { AuthGuardService } from '../services/auth-guard.service';
import { AppService } from '../services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  user: User= new User;
  loader:any;
  con_err:string = "Ohh";
  public prefixError = false;
  public invalid_cnic = false;
  
  constructor(private auth_service:AuthGuardService, public app_service: AppService, public navCtrl: NavController
  ,public formBuilder: FormBuilder, private alertCtrl: AlertController,private fcm: FCM,
  private loadingCtrl: LoadingController, private toastCtrl: ToastController, public menuCtrl: MenuController) {
    this.registerForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.required,])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8),])],
      phone: ['', Validators.compose([Validators.required,Validators.min(1000000000), Validators.max(9999999999)])],
      // cnic: ['', Validators.compose([Validators.required, Validators.max(999999999999999)])],
      address: [''],
      generalTerms: ['', Validators.requiredTrue]
    });
  }

  ionViewDidLoad() {
    
    
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    setTimeout(() => {
      this.fcm.subscribeToTopic('ustad');

      this.fcm.getToken().then(token => {
        this.user.device_token  = token;
      }) 
    }, 2000);
  }


  async create_account() {
    if (parseInt(String(this.registerForm.value.phone).charAt(0)) == 0) {
      this.registerForm.value.phone = '92' + this.registerForm.value.phone.substr(1);
    }
    else {
      this.registerForm.value.phone = '92' + this.registerForm.value.phone;
    }
    if (this.registerForm.valid) {
      await this.presentLoading();
      this.user.firstname = this.registerForm.value.firstname;
      this.user.phone = this.registerForm.value.phone;
      this.user.password = this.registerForm.value.password;
      this.user.role_id = 3;
      // this.user.cnic = this.registerForm.value.cnic;
      this.user.address = this.registerForm.value.address;
      this.user.username = this.registerForm.value.phone;
      console.log(this.user);
      console.log(this.registerForm.value);
      
      this.auth_service.register(this.user).subscribe(async response => {
        console.log("response", response);
        this.presentToast("Registered Successfully. You will shortly receive confirmation code");
        await this.loader.dismiss();
        this.navCtrl.navigateRoot('login');


      },(error)=>{
        this.handleError(error)
      })
      
    }
  }

  showAlert(t_msg:any, msg:any) {
    this.alertCtrl.create({
      header: t_msg,
      subHeader: msg,
      buttons: ['OK']
    }).then(alert => alert.present())
  }


  onChangePhone() {
    console.log(this.registerForm.value.phone);
    if (this.registerForm.value.phone == '') {
      return;
    }
    else if (this.registerForm.value.phone.length >= 2) {
      return;
    }
    else if (this.registerForm.value.phone.length >= 1) {
      let abc = this.registerForm.value.phone.substr(0,1);
      if (abc == 0) {
      }
    }
  }

  onChangeCnic() {
    var idToTest = this.registerForm.value.cnic,
    cnic_no_regex = /^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$/;

    if(cnic_no_regex.test(idToTest)) {
      //if true
      this.invalid_cnic = false;

    }
    else {
      this.invalid_cnic = true;
      //if false
    }


        //Make sure that the event fires on input change
        
        //Prevent default
        
        //Remove hyphens
        let input = this.registerForm.value.cnic.split("-").join("");
        
        //Make a new string with the hyphens
        // Note that we make it into an array, and then join it at the end
        // This is so that we can use .map() 
        input = input.split('').map(function(cur:any, index:any){
          
          //If the size of input is 6 or 8, insert dash before it
          //else, just insert input
          if(index == 5 || index == 12)
            return "-" + cur;
          else
            return cur;
        }).join('');
        
        //Return the new string
        
        this.registerForm.controls['cnic'].setValue(input);
    
  }

  presentToast(message:any) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
  }
  
  async presentLoading() {
    // Prepare a loading controller
    this.loader = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    // Present the loading controller
    await this.loader.present();
  }

  goToLogin() {
    this.navCtrl.pop();
  }

  terms_conditions() {
    window.open('http://ustad.online/terms/');
  }

  public async handleError(error: any): Promise<any> {
    await this.loader.dismiss();
    if (error.status == '422') {
      this.con_err = 'Ohhh snap...';
      let mno = JSON.parse(error._body);
      if (mno.email != undefined) {
        this.con_err = this.con_err + ' ' + mno.email[0];
      }
      if (mno.username != undefined) {
        this.con_err = this.con_err + ' ' + mno.username[0];
        console.log(this.con_err);
      }
      if (mno.phone != undefined) {
        if (mno.phone.length == 2) {
          this.con_err = this.con_err + ' ' + mno.phone[0] + ' ' + mno.phone[1];
        }
        else {
          this.con_err = this.con_err + ' ' + mno.phone[0];
        }
      }
      if (mno.cnic != undefined) {
        this.con_err = this.con_err + ' ' + mno.cnic[0];
      }
      if (mno.error != undefined) {
        this.con_err = this.con_err + ' ' + mno.error;
      }
      this.showAlert('Registeration Failed' , this.con_err);
    }
    else if (error.status == '500') {
      this.showAlert('Registeration Failed' , 'Internal server Error. Try again');
    }
    else if (error.status == '0') {
      this.showAlert('Registeration Failed' , 'Oh snap please check your internet connection...');
    }
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
