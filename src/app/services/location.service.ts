import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private alertCtrl: AlertController, private diagnostic: Diagnostic, private toastCtrl: ToastController) {
    this.alertPresented = false;
  }

  public alertPresented: any;

  client_latitude:any;
  client_longitude:any;

  
  presentConfirm() {
    if(!this.alertPresented) {
      this.alertPresented = true;
      let alert = this.alertCtrl.create({
        message: 'GPS Disabled',
        subHeader: 'Turn on GPS to calculate the Professional Status',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              this.alertPresented = false;
              this.presentToast('Unable to Get your location. Please turn on the GPS');
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Settings',
            handler: () => {
              this.alertPresented = false;
              this.diagnostic.switchToLocationSettings();
            }
          }
        ]
      }).then(alert => alert.present());
    }
  }

  presentToast(msg:any) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    }).then(toast => toast.present())
  }

}
