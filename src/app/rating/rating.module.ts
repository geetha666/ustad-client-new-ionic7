import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RatingPage } from './rating.page';
import { StarRatingModule } from 'angular-star-rating';

const routes: Routes = [
  {
    path: '',
    component: RatingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    StarRatingModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [RatingPage]
})
export class RatingPageModule {}
