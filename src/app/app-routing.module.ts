import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from "./services/auth-guard.service";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuardService]
  },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountPageModule) },
  { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule) },
  { path: 'notifications', loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsPageModule) },
  { path: 'categories', loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesPageModule) },
  { path: 'rating', loadChildren: () => import('./rating/rating.module').then(m => m.RatingPageModule) },
  { path: 'transaction', loadChildren: () => import('./transaction/transaction.module').then(m => m.TransactionPageModule) },
  { path: 'support', loadChildren: () => import('./support/support.module').then(m => m.SupportPageModule) },
  { path: 'job', loadChildren: () => import('./job/job.module').then(m => m.JobPageModule) },
  { path: 'activejob', loadChildren: () => import('./activejob/activejob.module').then(m => m.ActivejobPageModule) },
  { path: 'assign-job', loadChildren: () => import('./assign-job/assign-job.module').then(m => m.AssignJobPageModule) },
  { path: 'changephone', loadChildren: () => import('./changephone/changephone.module').then(m => m.ChangephonePageModule) },
  { path: 'completed-jobs', loadChildren: () => import('./completed-jobs/completed-jobs.module').then(m => m.CompletedJobsPageModule) },
  { path: 'create-job', loadChildren: () => import('./create-job/create-job.module').then(m => m.CreateJobPageModule) },
  { path: 'estimation', loadChildren: () => import('./estimation/estimation.module').then(m => m.EstimationPageModule) },
  { path: 'locationmap', loadChildren: () => import('./locationmap/locationmap.module').then(m => m.LocationmapPageModule) },
  { path: 'paymentmodal', loadChildren: () => import('./paymentmodal/paymentmodal.module').then(m => m.PaymentmodalPageModule) },
  { path: 'estimation-detail', loadChildren: () => import('./estimation-detail/estimation-detail.module').then(m => m.EstimationDetailPageModule) },
  { path: 'hire-later', loadChildren: () => import('./hire-later/hire-later.module').then(m => m.HireLaterPageModule) },
  { path: 'edit-name', loadChildren: () => import('./edit-name/edit-name.module').then(m => m.EditNamePageModule) },
  { path: 'edit-email', loadChildren: () => import('./edit-email/edit-email.module').then(m => m.EditEmailPageModule) },
  { path: 'edit-phone', loadChildren: () => import('./edit-phone/edit-phone.module').then(m => m.EditPhonePageModule) },
  { path: 'edit-pass', loadChildren: () => import('./edit-pass/edit-pass.module').then(m => m.EditPassPageModule) },
  { path: 'job-history', loadChildren: () => import('./job-history/job-history.module').then(m => m.JobHistoryPageModule) },
  { path: 'dialog-chat', loadChildren: () => import('./dialog-chat/dialog-chat.module').then(m => m.DialogChatPageModule) },
  { path: 'job-dashboard', loadChildren: () => import('./job-dashboard/job-dashboard.module').then(m => m.JobDashboardPageModule) },
  { path: 'job-detail', loadChildren: () => import('./job-detail/job-detail.module').then(m => m.JobDetailPageModule) },
  { path: 'professional-detail', loadChildren: () => import('./professional-detail/professional-detail.module').then(m => m.ProfessionalDetailPageModule) },
  { path: 'professional-status', loadChildren: () => import('./professional-status/professional-status.module').then(m => m.ProfessionalStatusPageModule) },
  { path: 'registervalidation', loadChildren: () => import('./registervalidation/registervalidation.module').then(m => m.RegistervalidationPageModule) },
  { path: 'schedule-model', loadChildren: () => import('./schedule-model/schedule-model.module').then(m => m.ScheduleModelPageModule) },
  { path: 'unassigned-job', loadChildren: () => import('./unassigned-job/unassigned-job.module').then(m => m.UnassignedJobPageModule) },
  { path: 'rating', loadChildren: () => import('./rating/rating.module').then(m => m.RatingPageModule) },
  { path: 'success-modal', loadChildren: () => import('./success-modal/success-modal.module').then(m => m.SuccessModalPageModule) },
  { path: 'cancel-jobs', loadChildren: () => import('./cancel-jobs/cancel-jobs.module').then(m => m.CancelJobsPageModule) },
  { path: 'pendingjobs', loadChildren: () => import('./pendingjobs/pendingjobs.module').then(m => m.PendingjobsPageModule) },
  { path: 'inprogressjob', loadChildren: () => import('./inprogressjob/inprogressjob.module').then(m => m.InprogressjobPageModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 