import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class UIService {

  loadingStateChanged = new Subject<boolean>();

  constructor(private snakbar: MatSnackBar) {}

  showSnakbar(message, action, duration) {
    this.snakbar.open(message, action, {duration});
  }

}
