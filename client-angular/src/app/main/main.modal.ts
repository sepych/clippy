import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'main-modal',
  template: `
    <h2 mat-dialog-title>Delete file</h2>
    <mat-dialog-content>
      Would you like to delete cat.jpeg?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>No</button>
      <button mat-button mat-dialog-close cdkFocusInitial>Ok</button>
    </mat-dialog-actions>
  `,
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatButton,
    MatDialogClose,
    MatDialogTitle
  ],
  standalone: true
})
export class MainModal { }
