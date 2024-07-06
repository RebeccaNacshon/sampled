import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

export const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'upload', component: FileUploadComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' }
  ];
