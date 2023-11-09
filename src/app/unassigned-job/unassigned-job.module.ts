import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UnassignedJobPage } from './unassigned-job.page';

const routes: Routes = [
  {
    path: '',
    component: UnassignedJobPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UnassignedJobPage]
})
export class UnassignedJobPageModule {}
