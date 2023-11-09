import { Component, OnInit } from '@angular/core';
import { User, LogUser, SocialUser } from './login_instance';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController, MenuController } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';
import { AppService } from '../services/app.service';
import { AuthGuardService } from '../services/auth-guard.service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user: User = new User;
  authForm: FormGroup;
  public hasError = false;
  bad_request:any;
  loader:any;

  loguser: LogUser = new LogUser;
  socialuser: SocialUser = new SocialUser;

  isLoggedIn = false;


  constructor(private auth_service: AuthGuardService, public formBuilder: FormBuilder, public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController, private app_service: AppService, private fcm: FCM, private navCtrl: NavController
  ,public menuCtrl: MenuController, private fb: Facebook, private googlePlus: GooglePlus ) {

    this.authForm = formBuilder.group({
      phone: ['', Validators.compose([Validators.required, Validators.min(1000000000), Validators.max(9999999999)])],
      password: ['', Validators.compose([Validators.required,])]
    });

    fb.getLoginStatus().then(res => {
      console.log(res.status);
      if (res.status === 'connect') {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    })
    .catch(e => console.log(e));

  }

  async doFbLogin(){

    //the permissions your facebook app needs from the user
    const permissions = ["public_profile", "email"];

    this.fb.login(permissions)
    .then(response => {
      let userId = response.authResponse.userID;
      //Getting name and email properties
      //Learn more about permissions in https://developers.facebook.com/docs/facebook-login/permissions

      this.fb.api("/me?fields=name,email", permissions)
      .then(user => {
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //now we have the users info


        this.socialuser.social_id = user.id;
        this.socialuser.email = user.email;
        this.socialuser.user_name = user.name;
        this.socialuser.firstname = user.name;
        this.socialuser.social_source = 'facebook';

        this.auth_service.social_login(this.socialuser).subscribe(response => {
          localStorage.setItem("token",response.token);
          localStorage.setItem("client_id",response.client_id);
          localStorage.setItem("source", 'social');

          this.route_to_home(response);
        },()=>{
        
            this.showAlert('error logging into facebook');
       
        })
      
      })
    }, error =>{
      console.log(error);
    });
  }

  googleLogin() {
    this.googlePlus.login({})
      .then(res => {
        console.log(res);

        this.socialuser.social_id = res.userId;
        this.socialuser.email = res.email;
        this.socialuser.user_name = res.displayName;
        this.socialuser.firstname = res.givenName;
        this.socialuser.social_source = 'google';

        this.auth_service.social_login(this.socialuser).subscribe(response => {
          localStorage.setItem("token",response.token);
          localStorage.setItem("client_id",response.client_id);
          localStorage.setItem("source", 'social');

          this.route_to_home(response);
        },()=>{
          this.showAlert('error logging into google');

        })
       
        
      })
      .catch(err => console.error(err));
  }

  ngOnInit() {
    setTimeout(() => {
      this.fcm.subscribeToTopic('ustad');

      this.fcm.getToken().then(token => {
        this.loguser.device_token  = token;
      })
    }, 3000);
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
   }

  ionViewDidLoad() {
    
    
  }

  async login() {
    if (parseInt(String(this.authForm.value.phone).charAt(0)) == 0) {
      this.authForm.value.phone = '92' + this.authForm.value.phone.substr(1);
    }
    else {
      this.authForm.value.phone = '92' + this.authForm.value.phone;
    }
    if(this.authForm.valid) {
      await this.presentLoading();
      this.loguser.phone = this.authForm.value.phone;
      this.auth_service.login(this.loguser).subscribe(async response => {
        await this.loader.dismiss();
        let res:any = response;
        localStorage.setItem("token",res.token);
        localStorage.setItem("client_id",res.client_id);
        localStorage.setItem("source", 'normal');
        
        if (res.status == 'verified') {
          // console.log(res.status);
          this.route_to_home(response);
        }
        else {
          this.verify_account(response);
        }
        
        
      
      },(error:any)=>{
        this.handleError(error)
      })
    }
  }

  signup() {
    this.navCtrl.navigateForward('register');
  }

  async presentLoading() {
    // Prepare a loading controller
    this.loader = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    // Present the loading controller
    await this.loader.present();
  } 

  route_to_home(response:any) {
    var token = localStorage.getItem("token");
    if(response != null && token != null) {
      console.log(response);
      this.navCtrl.navigateRoot('home');
    }
  }

  verify_account(response:any) {
    console.log(response);
    this.navCtrl.navigateRoot('registervalidation');
  }

  public async handleError(error: any) :Promise<any>{
    
    await this.loader.dismiss();
    if (error.status == "401") {
      // alert(error.statusText);
      this.showAlert('Phone and Password Combination is incorrect!');
      console.log("Status Text", error.statusText);
    }
    else if (error.status == '500') {
      this.showAlert('Try again...')
    }
    else if (error.status == '0') {
      this.showAlert('No internet connection')
    }
    return Promise.reject(error.message || error);
  }

  showAlert(msg:any) {
    this.alertCtrl.create({
      header: 'Oh Snap!',
      subHeader: msg,
      buttons: ['OK']
    }).then(alert => alert.present())
  }

}
