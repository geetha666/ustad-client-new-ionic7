import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { IonicRatingModule } from "ionic4-rating";

import { PendingjobsPage } from './pendingjobs.page';

const routes: Routes = [
  {
    path: '',
    component: PendingjobsPage
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
  declarations: [PendingjobsPage]
})
export class PendingjobsPageModule {}
