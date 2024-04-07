import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { FormGroup } from '@angular/forms';
import { SettingsComponent } from './settings.component';
import { Settings } from '../../../../common/settings';

export interface SettingsDialogData {
  form: FormGroup;
}

@Component({
  selector: 'settings-modal',
  template: `
    <h2 mat-dialog-title>Settings</h2>
    <mat-dialog-content>
      <settings-component [onSettingsChange]="onSettingsChange.bind(this)" [form]="form">
      </settings-component>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button [disabled]="!form.valid" (click)="onSettingsChange(form.value)">Save</button>
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
export class SettingsModal {
  protected form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<SettingsModal>,
    @Inject(MAT_DIALOG_DATA) public data: SettingsDialogData,
  ) {
    this.form = data.form;
  }

  onSettingsChange(settings: Settings) {
    this.dialogRef.close(settings);
  }
}
