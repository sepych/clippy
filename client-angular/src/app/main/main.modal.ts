import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { SettingsComponent } from './settings.component';

@Component({
  selector: 'main-modal',
  template: `
    <h2 mat-dialog-title>Settings</h2>
    <mat-dialog-content>
      <settings-component></settings-component>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
    </mat-dialog-actions>
  `,
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatButton,
    MatDialogClose,
    MatDialogTitle,
    SettingsComponent,
  ],
  standalone: true,
})
export class MainModal { }
