import { Component, NgZone } from '@angular/core';
import { NavController, AlertController, ModalController, ToastController } from '@ionic/angular';
import { User } from '../login/login_instance';
import { AppService } from '../services/app.service';
import { EditNamePage } from '../edit-name/edit-name.page';
import { EditEmailPage } from '../edit-email/edit-email.page';
import { EditPhonePage } from '../edit-phone/edit-phone.page';
import { EditPassPage } from '../edit-pass/edit-pass.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage {

  client_id: any;
  user: any = {} as User;
  public loader = false;
  public networkfail = false;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private app_service: AppService,
    public modalCtrl: ModalController,
    private zone: NgZone,
    private router: Router
  ) {
    this.get_id();
  }

  get_id() {
    this.client_id = localStorage.getItem("client_id");
    this.get_ClientData(this.client_id);
  }

  get_ClientData(client_id: any) {
    this.zone.run(() => {
      this.loader = true;
      this.app_service.getClientData(client_id).subscribe(
        (response) => {
          this.loader = false;
          this.user = response;
        },
        (err) => this.handleError(err)
      );
    });
  }

  logout() {
    this.showLogoffAlert();
  }

  showLogoffAlert() {
    let alert = this.alertCtrl
      .create({
        header: 'Logout',
        subHeader: 'Are you sure you want to log out?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              localStorage.clear();
              this.router.navigate(['login']);
            },
          },
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Not navigating back');
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  updateName(paramm: any) {
    this.presentProfileModal(paramm);
  }

  updatePhone(param: any) {
    this.presentPhoneModal(param);
  }

  updateEmail(param: any) {
    this.presentEmailModal(param);
  }

  changePass(param: any) {
    let source = localStorage.getItem('source');
    if (source != 'social') {
      this.presentPasswordModal(param);
    }
  }

  presentPhoneModal(param: any) {
    let profileModal = this.modalCtrl.create({
      component: EditPhonePage,
      componentProps: {
        userId: param,
      },
    });
    profileModal.then((modal) => modal.present());
  }

  presentEmailModal(param: any) {
    let profileModal = this.modalCtrl.create({
      component: EditEmailPage,
      componentProps: {
        userId: param,
      },
    });
    profileModal.then((modal) => modal.present());
  }

  presentPasswordModal(param: any) {
    let profileModal = this.modalCtrl.create({
      component: EditPassPage,
      componentProps: {
        userId: param,
      },
    });
    profileModal.then((modal) => modal.present());
  }

  presentProfileModal(param: any) {
    let profileModal = this.modalCtrl.create({
      component: EditNamePage,
      componentProps: {
        userId: param,
      },
    });
    profileModal.then((modal) => modal.present());
  }

  openUrl() {
    window.open('http://ustad.online/terms/');
  }

  public handleError(error: any): Promise<any> {
    this.loader = false;
    console.log(this.loader);
    console.error('An error occurred', error); // for demo purposes only
    if (error.status == '0') {
      this.networkfail = true;
    }
    return Promise.reject(error.message || error);
  }
}
