import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps/ngx';
import { AlertController, NavController, NavParams, ToastController, IonContent } from '@ionic/angular';
import { CreateJobPage } from '../create-job/create-job.page';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../categories/categories-instance';
import { UserDataService } from '../services/userdataservice';

declare var google:any;

@Component({
  selector: 'app-locationmap',
  templateUrl: './locationmap.page.html',
  styleUrls: ['./locationmap.page.scss'],
})
export class LocationmapPage {
  @ViewChild(IonContent, {static: false}) content!: IonContent;
  
  map!: GoogleMap;
  categories:Category[] = [];
  public later = false;
  public current_location = 'BZU Multan';

  constructor(private alertCtrl: AlertController, private navCtrl: NavController, private events: UserDataService, private params: NavParams
  ,private toastCtrl: ToastController, private zone: NgZone, private category_service: CategoriesService) {
  }


  public destination:any;
  marker_add:any;
  pre_location:any;
  next_location:any;

  ionViewCanEnter() {
    this.get_Categories();
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {


    let mapOptions: GoogleMapOptions = {
      camera: {
         target: {
           lat: 30.1910777,
           lng: 71.4412516
         },
         zoom: 18,
         tilt: 30
       }
    };

   

    let mapDiv = document.getElementById('map_canvas');

    if (mapDiv) {
      this.map = GoogleMaps.create(mapDiv, mapOptions);
    } else {
      console.error('Element with ID "map_canvas" not found');
    }

    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        this.presenttoast();
        this.destination = 'Calculating...';


        this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe(e => {
          console.log("LOng clicked the map");
          console.log(e);
          console.log(e[0].lat);
          this.next_location = {lat: e[0].lat , lang: e[0].lng};
          
          if (this.marker_add != undefined) {
            this.marker_add.remove();
          }

          this.map.addMarker({
            title : this.destination,
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: e[0].lat,
              lng: e[0].lng
            }
          })
          .then(marker => {
            this.marker_add = marker;
            setTimeout(() => {
              this.showConfirm();
            }, 1000);
            // this.showConfirm();
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe((d:any) => {
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

  showConfirm() {
    const confirm = this.alertCtrl.create({
      header: 'Confirm this Location?',
      subHeader: 'Do you agree to use this location?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            // this.events.publish("Map location", this.next_location);
            // this.navCtrl.pop();
            this.geocodeLatLng(this.next_location.lat, this.next_location.lang);
            console.log('Agree clicked');
          }
        }
      ]
    }).then(confirm => confirm.present())
  }


  presenttoast() {
    let toast = this.toastCtrl.create({
      message: 'Tap and hold to select Location',
      duration: 4000,
      position: 'top'
    }).then(toast => toast.present())
  }

  // Get Categories
  get_Categories() {
    this.zone.run(() => {
      this.category_service.getCategory().subscribe(response => {
        // console.log("Response", response);
        //this.categories = JSON.parse(response);
        this.categories = response;
      },(err:any)=>{
        this.handleError(err)

      })
    })
  }

  // Schedule Job
  scheduleIt() {
    this.later = !this.later;
    console.log(this.later);
  }

  // Decode the address from latitude and longitude
  geocodeLatLng(latitude:any, longitude:any) {
    this.current_location = 'Estimating..';
    var geocoder = new google.maps.Geocoder;
    var latlng = {lat:latitude, lng:longitude};
    console.log(latlng);
    geocoder.geocode({'location': latlng}, function(results:any, status:any) {
      if (status === 'OK') {
        console.log(results);
        var abc = document.getElementsByClassName('locating');
        abc[0].innerHTML = results[0].formatted_address;
      }
    })
  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    if (error.status == "404") {
    }
    else if (error.status == '0') {
    }
    else {
      
    }
    return Promise.reject(error.message || error);
  }


}
