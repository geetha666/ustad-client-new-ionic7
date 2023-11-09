import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { AppService } from '../services/app.service';
import { User } from '../login/login_instance';
import { AccountService } from '../services/account.service'; 

@Component({
  selector: 'app-hire-later',
  templateUrl: './hire-later.page.html',
  styleUrls: ['./hire-later.page.scss'],
})
export class HireLaterPage {

  public today: any;
  public time: any;
  public trial: any;
  client_id:any;
  user:User = new User;
  public disable = true;
  loading:any;
  
  constructor(private app_service: AppService, private account_service: AccountService, private loadCtrl: LoadingController) {

    this.get_id();
  }

  get_id() {
    this.client_id = localStorage.getItem("client_id");
    console.log(this.client_id);
    if (this.client_id != null) {
      this.get_ClientData(this.client_id);
    }
  }

  get_ClientData(client_id: any) {
    this.showLoading();
    this.app_service.getClientData(client_id).subscribe((response: User) => {
      console.log(response);
      this.user = response;
      this.dismissLoading();
    });
  }
  
  updatePic() {
    console.log("Update my pic");
  }

  save(user: any) {
    this.showLoading();
    console.log("Save my data");
    console.log(user);
    this.account_service.update_clientdata(this.user).subscribe((response: any) => {
      console.log(response);
      this.dismissLoading();
    })
  }

  showLoading() {

    if (this.loading) {
      return;
    }

    this.loadCtrl.create({
      message: 'Please Wait...',
    }).then(loader => {
      this.loading = true;
      loader.present();
    })
  }

  dismissLoading() {
    if(this.loading){
      this.loadCtrl.dismiss();
      this.loading = false;
    }
  }


}
