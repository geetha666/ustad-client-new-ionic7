import { Component, ViewChildren, QueryList, ViewChild } from '@angular/core';

import { Platform, NavController, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AlertController, MenuController, ModalController, ActionSheetController, PopoverController, IonRouterOutlet } from '@ionic/angular';
import { AppService } from './services/app.service';
import { AuthGuardService } from './services/auth-guard.service';
import { DeviceClass } from './home/device-instance';


import { FCM } from '@ionic-native/fcm/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';


import { PaymentmodalPage } from './paymentmodal/paymentmodal.page';


import { JobService } from './services/job.service';
import { Router, NavigationExtras } from '@angular/router';
import { ProfessionalService } from './services/professional.service';
import { UserDataService } from './services/userdataservice';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  rootPage: any;
  client_id:any;
  client_name:any;
  client_phone:any;
  client_balance: any;
  authenticated:any;
  res = [];

  deviceclass: DeviceClass = new DeviceClass;

  pages: Array<{title: string, icon: string, url: any}>;

  @ViewChild(IonRouterOutlet, {static: false}) routerOutlet!: IonRouterOutlet;


  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
  private app_service: AppService, private alertCtrl: AlertController,
  private auth_service: AuthGuardService, private fcm: FCM, public userdata:UserDataService,
  private localNotifications: LocalNotifications, private androidPermissions: AndroidPermissions, private menuCtrl: MenuController, private modalCtrl: ModalController
  ,private navCtrl: NavController, private router: Router, private job_service: JobService, private actionSheetCtrl: ActionSheetController,
  private popoverCtrl: PopoverController, private loadCtrl: LoadingController, private professional_service: ProfessionalService) {


    this.userdata.userData$.subscribe((user:any) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user);
      this.client_name = user.firstname;
      this.client_phone = user.phone;
      this.client_balance = user.balance;
    });
    
    this.initializeApp();

    // Initialize BackButton Eevent.
    this.backButtonEvent();

   // this.check_Permission();
    

    // used for an example of ngFor and navigation
    this.pages = [
      
      // { title: 'Chat',icon:'chatboxes', url: '/dialog-chat' },
      { title: 'Post a Job',icon:'home', url: '/home'},
      { title: 'Job Dashboard',icon:'jet', url: '/job-dashboard' },
      { title: 'Notifications',icon:'notifications', url: '/notifications' },
      { title: 'Transaction History',icon:'logo-usd', url: '/transaction' },
      { title: 'All Jobs',icon:'list', url: '/job' },
      { title: 'About',icon:'person', url: '/account' },
      { title: 'Call or support',icon:'call', url: '/support' }
    ];
  }


  initializeApp() {
    this.platform.ready().then(() => {
      /*
      this.platform.registerBackButtonAction(()=>{
        let abc:any = this.app;
        console.log(abc._title);
        let activePortal = this.ionicApp._loadingPortal.getActive() ||  this.ionicApp._modalPortal.getActive() || this.ionicApp._toastPortal.getActive() || this.ionicApp._overlayPortal.getActive();
        if (activePortal) {
          activePortal.dismiss();
          return;
        }
        else if (this.menuCtrl.isOpen()) {
          // Close menu if open 
          this.menuCtrl.close();
          return; 
        }
        else if (this.nav.canGoBack()) {
          console.log("Can Go back");
          this.nav.pop();
        }
        else if(abc._title != "Ustad Online" && abc._title != "Login" && abc._title != "Verification" )
        {   
          
          this.app.getRootNav().setRoot(HomePage);
        }
        else {

          this.showAlert();
        }
      })
      */

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then(
        result => console.log('Has phone read permission?',result.hasPermission),
        err => console.log(err),
      );

      this.androidPermissions.requestPermissions(
        [
          this.androidPermissions.PERMISSION.CAMERA, 
          this.androidPermissions.PERMISSION.CALL_PHONE, 
          this.androidPermissions.PERMISSION.GET_ACCOUNTS, 
          this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, 
          this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
          this.androidPermissions.PERMISSION.READ_PHONE_STATE
        ]
      ).then(res => console.log("Permission status", res))
      .catch(err => console.log(err));

      
      
      this.fcm.subscribeToTopic('ustad');

      this.fcm.getToken().then(token => {
        this.deviceclass.device_token  = token;
        this.send_token(this.deviceclass);
      })

      
      this.fcm.onNotification().subscribe(data => {
        console.log(data);
        let notifi = data;
        if(data.wasTapped) {
         this.routetype(notifi);
         console.info("Received in background");
        } else {
          this.localNotifications.schedule({
            id: 1,
            title:notifi['title'],
            text: notifi['body'],
            sound: this.platform.is('android') ? 'file://assets/sounds/hangout_message.mp3': 'file://assets/sounds/hangout_message.mp3',
            vibrate: true,
            data: { type: notifi['type'], type_id: notifi['type_id'], job_status: notifi['job_status'], job_id: notifi['job_id'] },
          });
          this.showConfirm(notifi);
         console.info("Received in foreground");
         if (notifi['type'] == 'completed') {
           setTimeout(() => {
            this.showModal(notifi['job_id']);
           }, 1000);
         }
        };
      });
      

      this.fcm.onTokenRefresh().subscribe(token => {
        this.deviceclass.device_token  = token;
        this.send_token(this.deviceclass);
      });

      this.fcm.subscribeToTopic('ustad');
      

      

      // Local notification click

      this.localNotifications.on('click').subscribe(data => {
        this.routetype(data.data);
      });


      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  send_token(device_token:any) {
    this.auth_service.send_token(device_token).subscribe((response:any) => {
      console.log(response);
    })
  }


  showModal(job_id:any) {

    
    let payModal = this.modalCtrl.create({
      component: PaymentmodalPage,
      componentProps: {
        'job_id': job_id
      }
     }).then(payModal => payModal.present());

  }


  
  exitAlert() {
    let alert = this.alertCtrl.create({
      header: 'Exit?',
      subHeader: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Exit',
          handler: () => {
            // this.platform.exitApp();
            //navigator['app'].exitApp(); // work in ionic 4
            this.router.navigate(['/']);

          }
        }
      ]
    }).then(alert => alert.present())
  }
  

 // active hardware back button
 backButtonEvent() {
  this.platform.backButton.subscribe(async () => {

    console.log(this.router.url);
    console.log(this.routerOutlet);

      // close action sheet
      try {
          const element = await this.actionSheetCtrl.getTop();
          if (element) {
              element.dismiss();
              return;
          }
      } catch (error) {
      }

      // close popover
      try {
          const element = await this.popoverCtrl.getTop();
          if (element) {
              element.dismiss();
              return;
          }
      } catch (error) {
      }

      // close modal
      try {
          const element = await this.modalCtrl.getTop();
          if (element) {
              element.dismiss();
              return;
          }
      } catch (error) {
          console.log(error);

      }

      // close side menua
      try {
          const element = await this.menuCtrl.getOpen();
          if (element) {
              this.menuCtrl.close();
              return;

          }

      } catch (error) {

      }

      // close alert controller
      
      try {
        const element = await this.alertCtrl.getTop();
        if (element) {
          element.dismiss();
          return;
        }

      } catch(error) {
        console.log(error);
      }

      // close loading controller

      try {
        const element = await this.loadCtrl.getTop();
        if (element) {
          element.dismiss();
          return;
        }

      } catch(error) {
        console.log(error);
      }

      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      }
      else if (this.router.url != '/home' &&  this.router.url != '/login' && this.router.url != '/registervalidation') {
        this.navCtrl.navigateRoot('home');
      }
      else {
        this.exitAlert();
      }  
  });
}

  showConfirm(notifi:any) {
    console.log(notifi);
    const confirm = this.alertCtrl.create({
      message: notifi.title,
      subHeader: notifi.body,
      buttons: [
        {
          text: 'Ignore',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'View Detail',
          handler: () => {
            this.routetype(notifi);
          }
        }
      ]
    }).then(confirm => {
      confirm.present();

      setTimeout(() => {
        confirm.dismiss();
      },5000);

    })
  }

  routetype(notifi:any) {
    console.log(notifi);
    if (notifi.type == 'estimation_created') {
      if (notifi.job_status == 'assigned') {
        // this.navCtrl.push(EstimationDetailPage, {estimation_id: notifi.type_id});
      }
    }
    else if (notifi.type == 'job_assigned') {

      let navigationExtras: NavigationExtras = {
        queryParams: {
          professional_id: notifi.type_id,
        }
      };
  
      this.professional_service.professional_id_param = notifi.type_id;
      this.router.navigate(['professional-detail'], navigationExtras);
      // this.navCtrl.push(ProfessionalDetailPage, {professional_id: notifi.type_id});
    }
    else if (notifi.type == 'visit_requested') {
      this.job_service.job_idr = notifi.type_id;
      this.navCtrl.navigateForward('professional-status');
      // this.navCtrl.push(ProfessionalStatusPage, {job_id: notifi.type_id});
    }
    else if (notifi.type == 'job_accepted') {
      if (notifi.job_status == 'assigned' || notifi.job_status == 'inprogress') {
        this.navCtrl.navigateRoot('job-dashboard');
        // this.navCtrl.setRoot(JobDashboard);
      }
    }
    else if (notifi.type == 'job_paused' || notifi.type == 'job_started') {
      this.navCtrl.navigateRoot('job-dashboard');
      // this.navCtrl.setRoot(JobDashboard);
    }
    else if (notifi.type == 'job_cancelled') {
      this.job_service.job_idr = notifi.job_id;
      this.navCtrl.navigateForward('job-history');
      // this.navCtrl.push(JobHistory, {job_id: notifi.job_id});
    }
    else {
      console.log("Do nothing...");
    }
  }

  notificationAlert(response:any) {
    let abc = JSON.parse(response);
    console.log(abc);
    let notify = this.alertCtrl.create({
      message: "Notification",
      subHeader: response,
      buttons: ['OK']
    }).then(notify => notify.present())
  }


  logout() {
    this.showLogoffAlert();
  }

  /*
  ngDoCheck() {
    if (localStorage.getItem('client_id') != undefined || localStorage.getItem('client_id') != null) {
      let client_id = localStorage.getItem('client_id');
      setTimeout(() => {
        this.job_service.checkForJob(client_id);
      }, 1);
    }
  }
  */

  showLogoffAlert() {
    let alert = this.alertCtrl.create({
      header: 'Logout',
      subHeader: 'Are you sure you want to log out?',
      buttons: [
        {
          text:'Yes',
          handler:() => {
            localStorage.clear();
            this.router.navigate(["login"]);
          }
        },
        {
          text:'No',
          role:'cancel',
          handler:() => {
            console.log("Not navigating back");
          }
        }
      ]
    }).then(alert => alert.present());
    
  }
}
