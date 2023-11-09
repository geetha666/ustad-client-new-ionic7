import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegistervalidationPage } from './registervalidation.page';
import { TimerComponent } from '../timerComp/timer';
import { HelloComponent } from './hello.component';

const routes: Routes = [
  {
    path: '',
    component: RegistervalidationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegistervalidationPage, TimerComponent, HelloComponent]
})
export class RegistervalidationPageModule {}
