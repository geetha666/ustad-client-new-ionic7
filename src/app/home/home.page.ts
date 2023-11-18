import { Component, NgZone,  OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { NavController, LoadingController, Platform, ModalController, AlertController, ToastController, MenuController } from '@ionic/angular';
import { AuthGuardService } from '../services/auth-guard.service';
import { CategoriesPage } from '../categories/categories.page';
import { AppService } from '../services/app.service';
import { RegistervalidationPage } from '../registervalidation/registervalidation.page';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Job } from '../create-job/create-job-instance';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
} from '@ionic-native/google-maps/ngx';
import { Router } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';
import { LocationService } from '../services/location.service';
import { JobService } from '../services/job.service';
import { UserDataService } from '../services/userdataservice';


declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit /* ,OnDestroy, AfterViewInit */ {

  client_id:any;
  balance:any;
  public loader = false;
  authenticated!:boolean;
  public networkfail = false;

  public loc_available = false;
  public current_location = "Getting your Location...";

  job:Job = {} as Job;
  map!: GoogleMap;

  marker_add:any;
  next_location:any;

  backButtonSubscription:any; 

  constructor(public navCtrl: NavController, private auth_service:AuthGuardService
  ,private app_service: AppService, public loadCtrl: LoadingController
  ,private events: UserDataService
  , private alertCtrl: AlertController
  ,private platform: Platform, private modalCtrl: ModalController
  ,private zone: NgZone, private diagnostic: Diagnostic, private locationAccuracy: LocationAccuracy
  ,private geolocation: Geolocation, private toastCtrl: ToastController, private router: Router, private device: Device
  ,private location_service: LocationService, private job_service: JobService, public menuCtrl: MenuController) {

    this.client_id = localStorage.getItem("client_id");
    console.log(this.client_id);
    this.get_ClientData(this.client_id);
  }

  // After Entering firstly check the location

  ngOnInit() {
    // console.log(this.timer);
    this.loader = true;
    setTimeout(() => {
      this.check_for_location();
    }, 3000);
  }

  /*
  ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      this.exitAlert();
      // navigator['app'].exitApp();
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }
  */ 

 ionViewWillEnter() {
  this.menuCtrl.enable(true);
 }


  check_for_location() {
    let dev_version:any = this.device.version;
    let first = dev_version.split('.');
    if (first[0] > 6 || first[0] == 6) {
      this.readLocationPermission();
    }
    else {
      this.sharelocation();
    }
    
  }

  // Location Permission Related

  readLocationPermission() {
    this.diagnostic.getLocationAuthorizationStatus().then(status => {
     console.log(status);
      if (status != 'GRANTED') {
        console.log('please request permission')
        this.requestPermission();
      }
      else {
        this.sharelocation();
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  requestPermission() {
    console.log('i am  requesting permission');
    this.diagnostic.requestLocationAuthorization('always').then(response => {
      console.log(response);
      if (response != 'GRANTED') {
        this.presentToast("Please enable GPS")
        this.requestPermission();
      }
      else {
        this.sharelocation();
      }
    })
    .catch(err => console.log(err));
  }

  // Share Location Function

  sharelocation() {
    console.log("Share my location");
    this.requestHighAccuracy();
    // this.watchMode();
  }

  // Request High Accuracy

  requestHighAccuracy() {
    console.log('i need to request high accuracy');
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      console.log(canRequest);

      if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            console.log('Request successful'),
            this.callNTimes(this.client_location, 3, 5000)
          }, 
          error => {
            this.loader = false;
            console.log('Error requesting location permissions', error);
            if (error.code == 4) {
              this.actionToast();
            }
          }
        );
      }
    
    });
  }

  // Get Client Location

  client_location() {
    console.log(this.job.longitude);
    this.current_location = 'Calculating..';
    let options = { enableHighAccuracy: true, maximumAge: 5000};
    this.geolocation.getCurrentPosition(options).then((resp) => {
      if (this.job.latitude == undefined && this.job.longitude == undefined) {
        // this.loc_available = true;
        let gmDiv = document.getElementById("gmdiv");

        if (gmDiv) {
          gmDiv.style.visibility = "visible";
        } else {
          console.error('Element with ID "gmdiv" not found');
        }
                this.job.latitude = resp.coords.latitude;
        this.job.longitude = resp.coords.longitude;
        console.log(this.job.longitude);
        console.log(this.job.latitude);
        this.geocodeLatLng(resp.coords.latitude, resp.coords.longitude);
        this.loadMap(this.job.latitude, this.job.longitude);
      }
    }).catch(error => console.log(error));
  }

  geocodeLatLng(latitude:any, longitude:any) {
    console.log('calculate latitude and longitude');
    console.log(latitude + ' ' + longitude);
    this.current_location = 'Estimating..';
    this.loc_available = true;
    this.location_service.client_latitude = latitude;
    this.location_service.client_longitude = longitude;
    var geocoder = new google.maps.Geocoder;
    var latlng = {lat:latitude, lng:longitude};
    console.log(latlng);
    geocoder.geocode({ 'location': latlng }, (results:any, status:any) => {
      if (status === 'OK') {
        console.log(status);
        this.loc_available = true;
        console.log(results);
        this.current_location = results[0].formatted_address;
        var abc = document.getElementsByClassName('loctrack');
        console.log(abc);
        abc[0].innerHTML = results[0].formatted_address;
      }
    });
    
  }

  // Load Map

  loadMap(latitude: any, longitude: any) {

    if (this.loader == true) {
      this.loader = false;
    }

    this.loc_available = true;

    let mapOptions: GoogleMapOptions = {
      camera: {
         target: {
           lat: latitude,
           lng: longitude
         },
         zoom: 18
       }
    };

   
    let mapDiv = document.getElementById('new_map');

    if (mapDiv) {
      this.map = GoogleMaps.create(mapDiv, mapOptions);
    } else {
      console.error('Element with ID "new_map" not found');
    }

    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        this.presentToast('Tap and hold to select Location');
        this.current_location = 'Calculating...';

        // Set marker on User Current Location

        this.map.addMarker({
          title : this.current_location,
          icon: 'blue',
          animation: 'DROP',
          position: {
            lat: latitude,
            lng: longitude
          }
        })
        .then(marker => {
          this.marker_add = marker;
        })
        .catch(err => console.log(err));  


        this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe(e => {
          console.log("LOng clicked the map");
          console.log(e);
          console.log(e[0].lat);
          this.next_location = {lat: e[0].lat , lang: e[0].lng};
          
          this.geocodeLatLng(e[0].lat, e[0].lng);
          
          if (this.marker_add != undefined) {
            this.marker_add.remove();
          }

          this.map.addMarker({
            title : this.current_location,
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: e[0].lat,
              lng: e[0].lng
            }
          })
          .then(marker => {
            this.marker_add = marker;
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe((d: any) => {
                console.log(d);
              });
          });
        });
        },
      err => {
        console.log("Long click error");
        console.log(err);
      })
    }

  // Call N times function

  callNTimes(func: () => void, num: number, delay: number) {
    if (!num) {
      // this.presentToast("Try again please...");
      this.tryToast();
      return;
    }
    if (this.job.latitude != undefined && this.job.longitude != undefined) {
      
      
      
      return;
    }
    setTimeout(() => {
      this.callNTimes(() => this.client_location(), num - 1, delay);
    },delay);
  }

  // Present Toast

  presentToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000,
      position: 'middle'
    }).then(toast => toast.present())
  }

  // Action Toast

  async actionToast() {
    const t = await this.toastCtrl.create({
      message: 'Unable to Post Job because location is not available..Please Turn on GPS',
      duration: 3000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'GPS Settings',
    } as any);
  
    await t.present();
  
    const data = await t.onDidDismiss();
    console.log(data);
  
    if (data.role == 'cancel') {
      this.requestHighAccuracy();
    }
  }
  

  // Try Toast

  async tryToast() {
    const n = await this.toastCtrl.create({
      message: 'Error in getting location',
      duration: 3000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Try Again',
    } as any);
  
    await n.present();
  
    const data = await n.onDidDismiss();
    console.log(data);
  
    if (data.role == 'cancel') {
      this.sharelocation();
    }
  }
  

  goto_Categories() {
    this.navCtrl.navigateForward('categories');
  }

  get_ClientData(client_id: any) {
    this.zone.run(() => {
      // this.loader = true;
      this.app_service.getClientData(client_id).subscribe((response: { balance: null; }) => {
        console.log("Home", response);
        console.log(response.balance);
        this.events.setUserData(response);
        this.job_service.checkForJob(client_id);
        // this.loader = false;
        if (response.balance == null) {
          this.balance = 0;
        }
        else {
          this.balance = response.balance;
        }
      },(error:any)=>{
        this.handleError(error)
 
       })
    })
    
  }

  exitAlert() {
    let alert = this.alertCtrl.create({
      message: 'Exit?',
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
this.router.navigateByUrl('/')          }
        }
      ]
    }).then(alert => alert.present())
  }

  public handleError(error: any): Promise<any> {
    this.loader = false;
    console.error('An error occurred', error); // for demo purposes only
    if (error.status == '0') {
      this.networkfail = true;
    }
    else if (error.status == '303') {
      this.navCtrl.navigateRoot('registervalidation');
    }
    return Promise.reject(error.message || error);
  }

}
