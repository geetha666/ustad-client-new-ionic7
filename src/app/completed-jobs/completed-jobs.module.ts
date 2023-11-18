import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CompletedJobsPage } from './completed-jobs.page';
import { StarRatingModule } from 'angular-star-rating';

const routes: Routes = [
  {
    path: '',
    component: CompletedJobsPage
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
  declarations: [CompletedJobsPage]
})
export class CompletedJobsPageModule {}
