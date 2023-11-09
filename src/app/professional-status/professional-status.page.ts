import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { ProfessionalService } from '../services/professional.service';
import { Professional } from './professional-instance';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { JobService } from '../services/job.service';
import { LocationService } from '../services/location.service';
import { timer } from 'rxjs';
import { Device } from '@ionic-native/device/ngx';

declare var google:any;

@Component({
  selector: 'app-professional-status',
  templateUrl: './professional-status.page.html',
  styleUrls: ['./professional-status.page.scss'],
})
export class ProfessionalStatusPage implements OnInit {
  map: any;
  client_lang:any;
  client_lat:any;
  professional_lang:any;
  professional_lat: any;
  job_id:any;
  updateVar:any;
  readVar:any;
  professional_id:any;
  public grantedpermission:any;

  professional:Professional = new Professional;

  constructor(public navCtrl: NavController, private prof_service: ProfessionalService
  ,private geolocation: Geolocation, private diagnostic: Diagnostic, private alertCtrl: AlertController
  ,private job_service: JobService, private location_service: LocationService
  ,private toastCtrl: ToastController, private device: Device) {

    this.job_id = this.job_service.job_idr;
    if (this.job_id != null) {
      this.getJobDetail(this.job_id);
    }
  }

  ngOnInit() {
    let dev_version:any = this.device.version;
    let first = dev_version.split('.');
    if (first[0] > 6 || first[0] == 6) {
      this.readLocationPermission();
    }
    else {
      this.grantedpermission = true;
    } 
  }

  ionViewDidLeave() {
    this.unsubscribe_from_reading();
    this.unsubscribe_to_update();
  }

  getJobDetail(job_id: any) {
    console.log('get job detail');
    this.job_service.getJobDetail(job_id).subscribe((response:any) => {
      console.log(response);
      this.professional_id = response.professional_id;
      this.updateCurrentLoc();
      this.readCurrentLoc();
    })
  }

  get_Professional() {
    this.prof_service.get_Professionallocation(this.professional_id).subscribe((response: any) => {
      console.log(response);
      this.professional = response;
      this.professional_lat = response.current_latitude;
      this.professional_lang = response.current_longitude;
      this.check_phone();
    },(error)=>{
      this.handleError(error)
    })
  }

  check_phone() {
    if (this.professional.phone != null) {
      let abc:any = this.professional.phone.substr(0,1);
      console.log(abc); 
      if (abc == 0) {
        console.log("Do nothing");
      }
      else {
        this.professional.phone = '+' + this.professional.phone;
      }
    }
  }

  get_mylocation() {
    let options = { enableHighAccuracy: true, maximumAge: 5000};
    console.log("Getting professional location");
    this.geolocation.getCurrentPosition(options).then((resp) => {
      this.client_lat = resp.coords.latitude;
      this.client_lang = resp.coords.longitude;
      console.log("Gps latitude", resp.coords.latitude);
      console.log("Gps longitude",resp.coords.longitude);
    })
    .catch((error) => {
      console.log('Error getting location', error);
    });     
  }

  readLocationPermission() {
    this.diagnostic.getLocationAuthorizationStatus().then(status => {
      console.log(status);
      if (status != 'GRANTED') {
        this.requestPermission();
      }
      else {
        this.grantedpermission = true;
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  requestPermission() {
    this.diagnostic.requestLocationAuthorization('always').then(response => {
      console.log(response);
      if (response != 'GRANTED') {
        this.presentToast("Please enable GPS")
        this.requestPermission();
      }
      else {
        this.grantedpermission = true;
      }
    })
    .catch(err => console.log(err));
  }

  presentToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    }).then(toast => toast.present())
  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  checkLocation() {
    this.diagnostic.isLocationAvailable().then(response => {
      console.log("Location Available Success", response);
      if (response == false) {
        console.log("Response is false");
        this.location_service.presentConfirm();
      }
      else {
        this.get_mylocation();
        this.get_Professional();
        console.log("Got the location");
      }

    })
    .catch(error => {
      console.log("Location Available Error", error);
    })
  }

  updateCurrentLoc() {
    console.log('Update current location');
    if (this.grantedpermission == true) {
      this.checkLocation();
      this.subscribe_to_update();
    }
  }

  subscribe_to_update() {
    this.updateVar = timer(17000).subscribe(() => this.updateCurrentLoc());
  }

  unsubscribe_to_update() {
    this.updateVar.unsubscribe();
  }

  readCurrentLoc() {
    console.log('read current location');
    if (!this.grantedpermission ) {
      return;
    }
    this.readVar = timer(1, 15000).subscribe(() => {
      console.log(this.professional_lat);
      console.log(this.client_lat + "," + this.client_lang);
      if (this.client_lat != null) {
        this.initMap(this.professional_lat, this.professional_lang, this.client_lat, this.client_lang);
      }
    })
  }

  unsubscribe_from_reading() {
    this.readVar.unsubscribe();
  }

  initMap(p_lat: string, p_long: string, c_lat: string, c_long: string) {
    console.log('initialize the map');
    console.log(p_lat);
    console.log(p_long);
    console.log(c_lat);
    console.log(c_long);
    const directionsDisplay = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: { lat: parseFloat(c_lat), lng: parseFloat(c_long) },
    });
    directionsDisplay.setMap(map);

    directionsService.route(
      {
        origin: p_lat + ',' + p_long,
        destination: c_lat + ',' + c_long,
        travelMode: 'DRIVING',
      },
      (
        response: {
          routes: { legs: { duration: { text: string }; distance: { text: string } }[] }[];
        },
        status: string
      ) => {
        if (status === 'OK') {
          console.log(response);
          directionsDisplay.setDirections(response);
          console.log(response.routes[0].legs[0].duration.text);
          console.log(response.routes[0].legs[0].distance.text);
          const time = document.getElementsByClassName('time_remain');
          time[0].innerHTML = response.routes[0].legs[0].duration.text;
          const dist = document.getElementsByClassName('distance_remain');
          dist[0].innerHTML = response.routes[0].legs[0].distance.text;
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  }

}
