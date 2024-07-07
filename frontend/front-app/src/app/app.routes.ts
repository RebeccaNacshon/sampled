import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { UnsavedChangesGuard } from './unsaved-changes.guard';
export const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'upload', component: FileUploadComponent, canDeactivate: [UnsavedChangesGuard]},
    { path: '', redirectTo: '/login', pathMatch: 'full' }
  ];
