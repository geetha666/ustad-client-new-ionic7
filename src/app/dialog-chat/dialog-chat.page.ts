import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController } from '@ionic/angular';
import { IChat } from './chat';
import { ApiAiClient } from "api-ai-javascript/es6/ApiAiClient";
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Job } from '../create-job/create-job-instance';
import { JobService } from '../services/job.service';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

@Component({
  selector: 'app-dialog-chat',
  templateUrl: './dialog-chat.page.html',
  styleUrls: ['./dialog-chat.page.scss'],
})
export class DialogChatPage {
  chats : IChat[] = [];
  message : string='';
  sending! : boolean;
  msStrng!: string;
  job: any = {} as Job;

  categoryMapping : { [key: string]: number } = {
    'electrician': 1,
    'plumber': 2,
    'carpenter': 3,
    'cctv': 4,
    'ip camera': 4,
    'ip': 4,
    'glass Fitter': 6,
    'other': 7,
    'gas Machine': 8,
    'iron': 9,
    'iron expert': 9,
    'fiber': 9,
    'alumi': 9,
    'pvc wall': 10,
    'wallpaper': 11,
    'painter': 12,
    'roofer': 13,
    'floor finisher': 14,
    'mason': 15,
    'shuttering': 16,
    'steel worker': 17,
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private speechRecognition: SpeechRecognition
  , private tts: TextToSpeech, private toastCtrl: ToastController, private zone: NgZone
  ,private job_service: JobService) {
  }

  ionViewDidLoad() {
    this.hasSpeechPermission();
  }

  sendMessage() {
    let sent_message: any = {} as IChat;
    sent_message.message = this.message;
    sent_message.type = 'human';
    this.chats.push(sent_message);
    this.sending = true;
    const client = new ApiAiClient({accessToken: '8115750a19eb4803a86155a5c26f915c'}).textRequest({ query: this.message })
    .then((response) => {
      this.message = '';
      this.sending = false;
      let received_messages: any = {} as IChat;
      received_messages.message = response.result.fulfillment.speech;
      received_messages.type = 'machine';
      this.chats.push(received_messages);
      var check_job = received_messages.message.includes('book the ');
      if (check_job == true) {
        const splitString = received_messages.message.split(" ");
        let category_name = splitString[5];
        let category_id = this.categoryMapping[category_name];
        this.job.category_id = category_id;
        this.job.client_id = localStorage.getItem("client_id");
        this.job.type = 'text';
        this.job.description = 'I need ' + category_name;
        this.job_service.add_job(this.job).subscribe(response => {
          this.presentToast("Job posted successfully.Our Professional will contact you shortly.")  
        });  
      }
      if (response.result.parameters.date && response.result.parameters.time) {
        this.job.stime = response.result.parameters.date + response.result.parameters.time;
      } 
    })
    .catch((error) => {
      this.sending = false;
    })
  }

  hasSpeechPermission() {
    this.speechRecognition.hasPermission()
    .then((hasPermission: boolean) => {
      if (!hasPermission) {
        this.speechRecognition.requestPermission()
        .then(resp => {
        })
        .catch(err => {
          this.presentToast('You cannot use the speech recognition feature unless you enable it');
        })
      }
    });
  }

  startRecording() {
    this.speechRecognition.hasPermission()
    .then((hasPermission: boolean) => {
      if (!hasPermission) {
        this.speechRecognition.requestPermission()
        .then(resp => {
        })
        .catch(err => {
          this.presentToast('You cannot use the speech recognition feature unless you enable it');
        })
      }
      else {
        this.speechRecognition.startListening()
        .subscribe(
          (matches: Array<string>) => {
            this.zone.run(() => {
              this.msStrng = matches[0];
              this.message = this.msStrng.toString();
              this.sendMessage();
            })
          },
          (onerror) => console.log('error:', onerror)
        )
      }
    });
  }

  presentToast(msg:any) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    }).then(toast => toast.present())
    
  }

  playMessage(message:any) {
    this.tts.speak(message).then(() => console.log('Success'))
    .catch((reason: any) => console.log(reason));
  }

}
