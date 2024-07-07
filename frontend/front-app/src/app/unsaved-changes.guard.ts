import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(private dialog: MatDialog) {}

  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | boolean {
    if (component.canDeactivate()) {
      return true;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: 'You have unsaved changes! Are you sure you want to leave?'
    });

    return dialogRef.afterClosed();
  }
}