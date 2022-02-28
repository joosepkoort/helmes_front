import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private snackBar: MatSnackBar) {}

  displayMessage(message: string, panelClass: string): void {
    this.snackBar.open(message, null, {
      duration: 2000,
      verticalPosition: 'bottom',
      panelClass: [panelClass]
    });
  }
}
