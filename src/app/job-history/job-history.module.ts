import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JobHistoryPage } from './job-history.page';
import { StarRatingModule } from 'angular-star-rating';

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
    StarRatingModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [JobHistoryPage]
})
export class JobHistoryPageModule {}
