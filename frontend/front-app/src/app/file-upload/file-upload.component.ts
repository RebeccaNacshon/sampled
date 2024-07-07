import { Component, HostListener } from '@angular/core';
import axios from 'axios';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { filter } from 'rxjs/operators';

import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [ HttpClientModule,CommonModule, FormsModule, MatTableModule, MatInputModule, MatButtonModule],  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  file: File | null = null;
  data: any = [];
  isDirty = false;
  isLoading: boolean = false; 
  displayedColumns: string[] = ['Name', 'Description', 'NlpOutput'];

  constructor(private http: HttpClient,private authService: AuthService,public dialog: MatDialog,private router: Router) 

{
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: any) => {
      if (this.isDirty) {
        this.canDeactivate();
      }
    });
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  uploadFile() {
    if (this.file) {
      const formData: FormData = new FormData();
      formData.append('file', this.file, this.file.name);

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      });
      this.isLoading = true;
      this.http.post<any>('http://localhost:8000/upload', formData).subscribe(
        response => {
          this.data = response;
          console.log('Upload success', response);
          this.isLoading = false;
          this.markDirty();
        },
        error => {
          console.error('Upload failed', error);
        }
      );
    }
  }
  markDirty() {
    this.isDirty = true;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.isDirty) {
      $event.returnValue = true;
      return 'You have unsaved changes! Are you sure you want to leave?';
    }
    return false;
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (!this.isDirty) {
      return true;
    }
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '1000px',
      data: 'You have unsaved changes! Are you sure you want to leave?'
    });

    return dialogRef.afterClosed();
  }
    

  async saveData() {
    try {
      const formData = new FormData();
     
      formData.append('NLP_Output', this.data.NLP_Output);

      await axios.post('http://localhost:8000/save', formData);
      this.isDirty = false; 
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Save failed', error);
    }
  }

}

