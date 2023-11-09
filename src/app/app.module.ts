import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';
import { Media } from '@ionic-native/media/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Device } from '@ionic-native/device/ngx';

import { FileUploadModule } from 'ng2-file-upload';
// import { IonicImageViewerModule } from 'ionic-img-viewer';

import { EditNamePage } from './edit-name/edit-name.page';
import { EditPhonePage } from './edit-phone/edit-phone.page';
import { EditPassPage } from './edit-pass/edit-pass.page';
import { EditEmailPage } from './edit-email/edit-email.page';
import { ChangephonePage } from './changephone/changephone.page';
import { SuccessModalPage } from './success-modal/success-modal.page';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuardService } from './services/auth-guard.service';
import { AppService } from './services/app.service';
import { AccountService } from './services/account.service';
import { CategoriesService } from './services/categories.service';
import { TransactionService } from './services/transaction.service';
import { JobService } from './services/job.service';
import { RatingService } from './services/rating.service';
import { ProfessionalService } from './services/professional.service';
import { NotificationService } from './services/notification.service';
import { EstimationService } from './services/estimation.service';
import { LocationService } from './services/location.service';
import { TimerService } from './services/timer.service';
import { UserDataService } from './services/userdataservice';

@NgModule({
  declarations: [
    AppComponent,
    // EditNamePage,
    // EditPhonePage,
    // EditEmailPage,
    // EditPassPage,
    // ChangephonePage,
    // SuccessModalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    // IonicImageViewerModule,
    FileUploadModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthGuardService,
    AppService,
    AccountService,
    CategoriesService,
    TransactionService,
    JobService,
    RatingService,
    ProfessionalService,
    NotificationService,
    EstimationService,
    LocationService,
    FCM,
    Diagnostic,
    LocalNotifications,
    BackgroundGeolocation,
    MediaCapture,
    FileTransfer,
    AndroidPermissions,
    TimerService,
    File,
    Media,
    Geolocation,
    SpeechRecognition,
    LocationAccuracy,
    TextToSpeech,
    Device,
    Facebook,
    GooglePlus,
    UserDataService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
