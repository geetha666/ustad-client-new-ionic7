import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { IonicRatingModule } from "ionic4-rating";

import { JobHistoryPage } from './job-history.page';

const routes: Routes = [
  {
    path: '',
    component: JobHistoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicRatingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JobHistoryPage]
})
export class JobHistoryPageModule {}
