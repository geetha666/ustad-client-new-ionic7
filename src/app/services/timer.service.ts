import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor() { }

  getSecondsAsDigitalClock(inputSeconds: number) {
    console.log("inputSeconds" + inputSeconds);
    if (inputSeconds == null ) {
      return;
    }
    var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    console.log("Sec num" + sec_num);
    // sec_num = Math.abs(sec_num);
    // console.log("abs Sec num" + sec_num);
    var hours = Math.round(sec_num / 3600);
    console.log("hours" + hours);
    var minutes = Math.round((sec_num - (hours * 3600)) / 60);
    //var minutes = Math.round((sec_num % 3600) / 60);
    console.log("minutes" + minutes);
    // var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var seconds = (sec_num % 3600) % 60;
    console.log("seconds"+ seconds);
    seconds = Math.abs(seconds);
    var hoursString = '';
    var minutesString = '';
    var secondsString = '';
    hoursString = hours.toString();
    minutesString = ("0" + minutes).slice(-2);
    secondsString = ("0" + seconds).slice(-2);
    console.log(secondsString);
    console.log(hoursString + ':' + minutesString + ':' + secondsString);
    return hoursString + ':' + minutesString + ':' + secondsString;
  }
}
