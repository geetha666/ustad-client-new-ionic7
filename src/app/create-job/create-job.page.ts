import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, AlertController, ToastController, IonContent } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Job } from './create-job-instance';
import { JobService } from '../services/job.service';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { AppService } from '../services/app.service';
import { FileUploader , FileUploaderOptions } from 'ng2-file-upload';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Router } from '@angular/router';
import { UserDataService } from '../services/userdataservice';


declare var google:any;

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.page.html',
  styleUrls: ['./create-job.page.scss'],
})
export class CreateJobPage implements OnInit {

  job:any = {} as Job;
  category_data:any;
  jobForm:FormGroup;
  url!:any;
  tryheaders:any;
  public photos: any;
  audurl:any;
  loading:any;
  public later = false;
  public trial:any;
  public videoarray:any;
  public audioarray:any;
  public status:string = 'text';
  public initialise = true;
  localUrl:any;
  attchfile:any;
  currentTime:any;
  myDate:any;
  public loc_available:any = false;
  public current_location = "Getting your Location...";
  isRecording: boolean = false;
  filePath!: string;
  fileName!: string;
  audioObj!: MediaObject;
  audioFile: any;
  playing:boolean = false;
  sendLocation:any;
  public disablePause = false;

  check_rec:any;

  public uploader: FileUploader = new FileUploader({url: this.url, disableMultipart: true });
  fileReader = new FileReader();

  fileTransfer: FileTransferObject = this.transfer.create();

  private buttonColor: string = "primary";
  public btnstatus = 'Press to Record';


  constructor(public navCtrl: NavController, public navParams: NavParams,private job_service: JobService, 
   private formbuilder: FormBuilder, private mediaCapture: MediaCapture
  ,private file: File, private transfer: FileTransfer, private app_service: AppService
  ,private loadingCtrl: LoadingController, private alertCtrl: AlertController
  ,private event: UserDataService, private geolocation: Geolocation, private diagnostic: Diagnostic
  ,private toastCtrl: ToastController, private platform: Platform, private media: Media
  ,private zone: NgZone, private locationAccuracy: LocationAccuracy, private router: Router, private device: Device) {
    
    this.attchfile = [];
        
    this.jobForm = formbuilder.group({
      // job_title:['', Validators.compose([Validators.required,])],
      description: ['', Validators.compose([Validators.required, Validators.minLength(15),])],
    })

    this.category_data = navParams.data['item'];
    console.log(this.category_data);
    this.job.category_id = this.category_data.id;
    this.job.client_id = localStorage.getItem("client_id");
    this.job.description = 'test';


    this.tryheaders = {
      'Accept': 'X-Auth-Token', 'Authorization': 'Bearer ' + localStorage.getItem('token'), 'Content-Type': 'application/json'
    }

    // this.trial = new Date().toISOString();
    let date = new Date();
    this.myDate = new Date(date.getTime() - date.getTimezoneOffset()*60000).toISOString();

    const authHeader = this.app_service.upload_Header;
    const upload_options = <FileUploaderOptions>{headers: authHeader};
    this.uploader.setOptions(upload_options);

    this.uploader.onAfterAddingFile = (response: any) => {
      this.attchfile.push(response);
    }

    this.uploader.onBeforeUploadItem = (item) => {
      item.method = 'PUT',
      item.url = this.url,
      item.withCredentials = false
    }

    this.uploader.onSuccessItem = (response : any) => {
    }

  }

  ngOnInit() {
    setTimeout(() => {
      console.log('ionViewDidLoad CreateJobPage');
      this.photos = [];
      this.videoarray = [];
      this.audioarray = [];
  
      let dev_version:any = this.device.version;
      let first = dev_version.split('.');
      if (first[0] > 6 || first[0] == 6) {
        this.readLocationPermission();
      }
      else {
        this.sharelocation();
      }
    }, 3000);
  }

  ionViewCanEnter() {
    this.event.maplocation$.subscribe((data) => {
      console.log("Listened to the event");
      console.log(data);
      this.loc_available = true;
      this.job.latitude = data.lat;
      this.job.longitude = data.lang;
      this.geocodeLatLng(data.lat, data.lang);
    })
  }

  onChange(value: any) {
    console.log("Value is changed")
    console.log("Job type", value);
    if (value == 'text') {
      this.status = value;
    }
    else {
      this.status = value;
      this.captureAudio();
      console.log(this.status);
    }
  }

  onOk($event: any) {
    console.log("OK button clickced");
    // console.log("Job type", value);
    console.log($event);
    let value = $event;
    if (value == 'text') {
      this.status = value;
      console.log(this.status);
    }
    else {
      this.status = value;
      this.initialise = true;
      this.captureAudio();
      console.log(this.status);
    }
  }

  onCancel() {
    console.log("Cancel button clickced");
  }


  async post_Job(job: Job) {
    await this.presentLoading();
    this.job_service.add_job(job).subscribe(async (response: any) => {
      console.log(response);
      await this.loading.dismiss();
      this.presentToast("Job posted successfully.Our Professional will contact you shortly.")
      this.go_to_home();
      this.url = `${this.app_service.apiUrl}/jobs/${response}/attachments`;
      this.audurl = `${this.app_service.apiUrl}/jobs/${response}/voice`;
      this.uploadAttachment();
      if (this.photos.length != 0) {
        this.uploadFile(this.photos);
      }
      if (this.audioFile != undefined) {
        this.sendNativeRecording(this.audioFile);
      }
      if (this.videoarray.length > 0) {
        this.uploadVideo(this.videoarray);
      }
    },(error:any)=>{
     this.handleError(error)

    })
  }

  async post_Job_later(job: Job) {
    await this.presentLoading();
    this.job_service.add_job(job).subscribe(async (response: any) => {
      console.log(response);
      await this.loading.dismiss();
      this.presentToast("Job posted successfully.Our Professional will contact you shortly.")
      this.go_to_home();
      this.url = `${this.app_service.apiUrl}/jobs/${response}/attachments`;
      this.audurl = `${this.app_service.apiUrl}/jobs/${response}/voice`;
      this.uploadAttachment();
      if (this.photos.length  > 0) {
        this.uploadFile(this.photos);
      }
      if (this.audioFile != undefined) {
        this.sendNativeRecording(this.audioFile);
      }
      if (this.videoarray.length > 0) {
        this.uploadVideo(this.videoarray);
      }

    },(error:any)=>{
        this.handleError(error)
    })
  }

  go_to_home() {
    this.router.navigateByUrl('/home');
  }

  captureCamera() {
    this.mediaCapture.captureImage().then(
      (data: any) => {
        let attachment = data[0];
        console.log(attachment);
        this.photos.push(attachment);
        console.log(this.photos);
      },
      (err: CaptureError) => console.error(err)
    );
  }

  captureAudio() {
    this.mediaCapture.captureAudio().then(
      (data: any) => { 
        console.log(data)
        let voice = data[0];
        console.log(voice);
        console.log(voice.fullPath);
        this.audioarray.push(voice);
        console.log(this.audioarray);
      },
      (err: CaptureError) => console.error(err)
    );
  }

  captureVideo() {
    this.mediaCapture.captureVideo().then(
      (data: any) => {
        let video = data[0];
        console.log(video);
        this.videoarray.push(video);
        console.log(this.videoarray);
      },
      (err: CaptureError) => console.error(err)
    );
  }

  deletePhoto(id: any) {
    console.log(id);
    this.photos.splice(id, 1)
    console.log(this.photos);
  }

  deleteVideo(ind: any) {
    console.log("Delete videos")
    console.log(ind);
    this.videoarray.splice(ind, 1);
    console.log(this.videoarray);
  }

  deleteAud(indx: any) {
    console.log("Delete videos")
    console.log(indx);
    this.audioarray.splice(indx, 1);
    console.log(this.audioarray);
  }

  uploadFile(photos: string | any[]) {
    let i;
    for (i=0;i<photos.length;i++) {
      console.log(i);
      console.log(photos[i]);

      console.log("Upload File");
      let options: FileUploadOptions = {
        fileKey: photos[i].fullPath,
        fileName: photos[i].name,
        chunkedMode: false,
        mimeType: "image/jpeg",
        httpMethod: 'PUT',
        headers: this.tryheaders,
      }

      this.fileTransfer.upload(photos[i].fullPath, this.url, options)
      .then((data) => {
        console.log(data+" Uploaded Successfully");
        console.log(data.response);
        console.log(data.responseCode);
        console.log(data.headers);
        console.log(data.bytesSent);
        console.log(data.response);
      })
      .catch(error => {
        console.log(error);
      })
    }
  }

  uploadRecording(audioarray: string | any[]) {
    console.log(audioarray);
    let k;
    for (k=0;k<audioarray.length;k++) {
      console.log("Uploading recording");
      let options: FileUploadOptions = {
        fileKey: audioarray[k].fullPath,
        fileName: audioarray[k].name,
        chunkedMode: false,
        // mimeType: this.voice.type,
        httpMethod: 'PUT',
        headers: this.tryheaders,
      }
  
      this.fileTransfer.upload(audioarray[k].fullPath, this.audurl, options)
      .then((data) => {
      console.log(data+" Uploaded Successfully");
      console.log(data.response);
      console.log(data.responseCode);
      console.log(data.headers);
      console.log(data.bytesSent);
      console.log(data.response);
      })
      .catch(error => {
        console.log(error);
      })
    }
  }

  uploadVideo(videoarray: string | any[]) {
    let j;
    for (j=0;j<videoarray.length;j++) {
      console.log(videoarray[j]);

      let options: FileUploadOptions = {
        fileKey: videoarray[j].fullPath,
        fileName: videoarray[j].name,
        chunkedMode: false,
        mimeType: videoarray[j].type,
        httpMethod: 'PUT',
        headers: this.tryheaders,
      }
  
      this.fileTransfer.upload(videoarray[j].fullPath, this.url, options)
      .then((data) => {
      console.log(data+" Uploaded Successfully");
      console.log(data.response);
      console.log(data.responseCode);
      console.log(data.headers);
      console.log(data.bytesSent);
      console.log(data.response);
      })
      .catch(error => {
        console.log(error);
      })
    }
  }

  deleteAttchm(f: any) {
    console.log(f);
    this.attchfile.splice(f, 1);
    console.log(this.attchfile);
  }

  uploadAttachment() {
    if (this.attchfile.length > 0) {
      console.log("Length is greater than 0");
      let m;
      for(m=0;m<this.attchfile.length;m++) {
        console.log(this.attchfile[m]);
        this.attchfile[m].upload();
      }
    }
  }

  post_recording(job: Job) {
    console.log(job);
    this.post_Job(this.job);
  }

  post_text(job: Job) {
    console.log(job);
    this.post_Job(job);
  }

  post_recording_later(job: Job) {
    console.log(job);
    this.post_Job_later(job);
  }

  post_text_later(job: Job) {
    console.log(job);
    this.post_Job_later(job);
  }

  hire_now() {
    this.job.type = this.status;
    console.log(this.job.type);
    if (this.job.type == 'text') {
      //this.job.job_title = this.jobForm.value.job_title;
      // this.job.description = this.jobForm.value.description;
      this.post_text(this.job);
    }
    if (this.job.type == 'voice') {
      this.post_recording(this.job);
    }
  }

  hire_later() {
    this.job.type = this.status;
    this.job.stime = this.myDate;
    if (this.job.type == 'text') {
      // this.job.job_title = this.jobForm.value.job_title;
      // this.job.description = this.jobForm.value.description;
      this.post_text_later(this.job);
    }
    if (this.job.type == 'voice') {
      this.post_recording_later(this.job);
    }
  }

  showAlert(sub_title: string) {
    this.alertCtrl.create({
      header: 'Oh Snap!',
      subHeader: sub_title,
      buttons: ['OK']
    }).then(alert =>  alert.present())
   
  }

  async presentLoading() {
    // Prepare a loading controller
    this.loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    // Present the loading controller
    await this.loading.present();
  }

  // Location Related

  sharelocation() {
    console.log("Share my location");
    this.requestHighAccuracy();
  }

  CheckPermissionStatus() {
    this.diagnostic.getLocationAuthorizationStatus().then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    })
  }

  cancelAlert() {
    let alert = this.alertCtrl.create({
      header:"GPS disabled",
      subHeader: "Turn on GPS to calculate the distance",
      buttons:['OK'],
    }).then(alert =>  alert.present())
  }

  client_location() {
    console.log(this.job.longitude);
    this.current_location = 'Calculating..';
    console.log("Does this method works???");
    let options = { enableHighAccuracy: true, maximumAge: 5000};
    this.geolocation.getCurrentPosition(options).then((resp) => {
      if (this.job.latitude == undefined && this.job.longitude == undefined) {
        this.job.latitude = resp.coords.latitude;
        this.job.longitude = resp.coords.longitude;
        console.log(this.job.longitude);
        console.log(this.job.latitude);
        this.geocodeLatLng(resp.coords.latitude, resp.coords.longitude);
      }
      this.loc_available = true;
    }).catch(error => console.log(error));
  }

  geocodeLatLng(latitude: string | number, longitude: string | number) {
    console.log('calculate latitude and longitude');
    console.log(latitude + ' ' + longitude);
    this.current_location = 'Estimating..';
    var geocoder = new google.maps.Geocoder;
    var latlng = {lat:latitude, lng:longitude};
    console.log(latlng);
    geocoder.geocode({'location': latlng}, (results: { formatted_address: string; }[], status: string) => {
      if (status === 'OK') {
        console.log(status);
        this.loc_available = true;
        console.log(results);
        var abc = document.getElementsByClassName('loctrack');
        console.log(abc);
        abc[0].innerHTML = results[0].formatted_address;
      }
    })
  }

  callNTimes(func: () => void, num: number, delay: number) {
    if (!num) {
      // this.presentToast("Try again please...");
      this.tryToast();
      return;
    }
    if (this.job.latitude != undefined && this.job.longitude != undefined) {
      return;
    }
    setTimeout(() => this.callNTimes(() => this.client_location(), num - 1, delay), delay);
  }


  presentToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    }).then(toast => {
      toast.present()
    })
  }

  changeValue(value: any) {
    console.log(this.status);
  }

  public async handleError(error: any): Promise<any> {
    await this.loading.dismiss();
    console.error('An error occurred', error); // for demo purposes only
    if (error.status == '500') {
      this.showAlert('Internal server Error.. Please try again');
    }
    else if (error.status == '422') {
      this.showAlert('Unprocessable entity.. Please try again');
    }
    else if (error.status == '401') {
      this.showAlert('Sorry you are not authorized to perform this action');
    }
    else {
      this.showAlert('Unknown error occured.. Please try again');
    }
    
    return Promise.reject(error.message || error);
  }

  readLocationPermission() {
    this.diagnostic.getLocationAuthorizationStatus().then(status => {
      console.log(status);
      if (status != 'GRANTED') {
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

  //Recording Related
  startRecord() {
    this.presentToast('Recording length should be minimum 5s and maximum 5 min');
    this.playing = false;
    if (this.platform.is('ios')) {
      this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.wav';
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audioObj = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.wav';
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audioObj = this.media.create(this.filePath);
    }
    this.audioObj.startRecord();
    this.isRecording = true;

    this.disablePause = true;

    this.enable_pause();

    setTimeout(() => {
      console.log("Stop recording after 5 min");
      if (this.isRecording) {
        this.stopRecord();
      }
    }, 300000);
  }

  canRecord() {
    this.presentToast('Hold to record, release to send');
    
    let dev_version:any = this.device.version;
    let first = dev_version.split('.');
    if (first[0] > 6 || first[0] == 6) {
      this.readRecordingPermissions();
    }
    else {
      this.startRecord();
    }
    
  }

  stopRecord() {
    this.zone.run(() => {
      if (this.isRecording) {
        this.audioObj.stopRecord();
        this.audioObj.release();
        let data = { filename: this.fileName, filePath: this.filePath };
        this.audioFile = data;
        this.isRecording = false;
        this.buttonColor = 'primary';
        this.btnstatus = 'Press to Record';
      }  
    })
  }

  getAudioList() {
    if(localStorage.getItem("audioFile")) {
      this.audioFile = localStorage.getItem("audioFile");
      console.log(this.audioFile);
    }
  }

  playAudio(file: string) {
    if (this.platform.is('ios')) {
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
      this.audioObj = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
      this.audioObj = this.media.create(this.filePath);
    }
    this.audioObj.play();
    this.playing = true;
    this.audioObj.setVolume(0.8);
    console.log(this.audioObj.getDuration());
  }

  pauseAudio() {
    this.audioObj.pause();
    this.playing = false;
  }

  enable_pause() {
    setTimeout(() => {
      console.log("Enable the pause button after 5s");
      this.disablePause = false;
    }, 5000);
  }

  sendNativeRecording(record: { filePath: string; fileName: any; }) {
    console.log("sending native recording..");
    let options: FileUploadOptions = {
      fileKey: record.filePath,
      fileName: record.fileName,
      chunkedMode: false,
      // mimeType: this.voice.type,
      httpMethod: 'PUT',
      headers: this.tryheaders,
    }

    let fullUrl = 'file://' + record.filePath;
    console.log(fullUrl);

    this.fileTransfer.upload(record.filePath, this.audurl, options)
    .then((data) => {
    console.log(data+" Uploaded Successfully");
    console.log(data.response);
    console.log(data.responseCode);
    console.log(data.headers);
    console.log(data.bytesSent);
    console.log(data.response);
    })
    .catch(error => {
      console.log(error);
    })
  }

  //Recording Permissions

  readRecordingPermissions() {
    this.diagnostic.getMicrophoneAuthorizationStatus().then(response => {
      console.log('Reading Response');
      console.log(response);
      if (response != 'GRANTED') {
        this.requestRecordingPermission();
      }
      else {
        this.startRecord();
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  requestRecordingPermission() {
    this.diagnostic.requestMicrophoneAuthorization().then(response => {
      console.log('Requesting Response');
      console.log(response);
      if (response != 'GRANTED') {
        this.presentToast("You cannot post the recording unless you grant the microphone permission")
        // this.requestRecordingPermission();
      }
      else {
        this.startRecord();
      }
    })
    .catch(err => console.log(err));
  }

  //Native Map

  loadMap() {
    this.router.navigateByUrl('/locationmap');
    // this.navCtrl.push(LocationMap);
  }

  async actionToast() {
    const toast = await this.toastCtrl.create({
      message: 'Unable to Post Job because location is not available. Please Turn on GPS',
      duration: 3000,
      position: 'bottom',
      buttons: [
        {
          side: 'end',
          text: 'GPS Settings',
          handler: () => {
            this.requestHighAccuracy();
          }
        }
      ]
    });

    toast.present();

    const { role } = await toast.onDidDismiss();
    if (role === 'cancel') {
      this.requestHighAccuracy();
    }
  }

  async tryToast() {
    const toast = await this.toastCtrl.create({
      message: 'Error in getting location',
      duration: 3000,
      position: 'bottom',
      buttons: [
        {
          side: 'end',
          text: 'Try Again',
          role: 'cancel',
          handler: () => {
            this.sharelocation();
          }
        }
      ]
    });
  
    toast.present();
  
    const { role } = await toast.onDidDismiss();
    if (role === 'cancel') {
      this.sharelocation();
    }
  }
  

  pressed() {
    console.log('pressed');
    this.presentToast('Hold to record, release to send');
  }

  active() {
    this.zone.run(() => {
      if (this.isRecording) {
        this.buttonColor = 'danger';
        this.btnstatus = 'Recording';
        console.log('active');
      }
    })
  }

  released() {
    console.log('released');
  }

  scheduleIt() {
    this.later = !this.later;
    // this.content.scrollToBottom();
    console.log(this.later);
    const laterDiv = document.getElementById("later_div");
  
    if (laterDiv) {
      laterDiv.style.visibility = this.later ? "visible" : "hidden";
  
      if (this.later) {
        let yOffset = laterDiv.offsetTop;
        // console.log(yOffset);
        // this.content.scrollTo(0, yOffset, 4000)
        // this.content.scrollToBottom();
      }
    }
  }
  

  requestHighAccuracy() {
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
            console.log('Error requesting location permissions', error);
            if (error.code == 4) {
              this.actionToast();
            }
          }
        );
      }
    
    });
  }
}
