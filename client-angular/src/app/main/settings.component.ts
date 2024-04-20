import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import ColorLabelComponent from './color-label.component';
import ColorWellComponent from './color-well.component';
import { Settings } from '../../../../common/settings';

@Component({
  selector: 'settings-component',
  template: `
    <form [formGroup]="form" (submit)="submit()">
      <div>
        <mat-form-field class="w-full">
          <mat-label>Master Server IP</mat-label>
          <input matInput formControlName="masterServerIp">
        </mat-form-field>
      </div>
      <div>
        <mat-form-field class="w-full">
          <mat-label>Master Server Port</mat-label>
          <input matInput formControlName="masterServerPort">
        </mat-form-field>
      </div>
      <div>
        <mat-form-field class="w-full">
          <mat-label>Server IP</mat-label>
          <input matInput formControlName="serverIp">
        </mat-form-field>
      </div>
      <div>
        <mat-form-field class="w-full">
          <mat-label>Server Port</mat-label>
          <input matInput formControlName="serverPort">
        </mat-form-field>
      </div>
      <div>
        <mat-form-field class="w-full">
          <mat-label>Channel</mat-label>
          <input matInput formControlName="channel">
        </mat-form-field>
      </div>
      <div>
        <mat-form-field class="w-full">
          <mat-label>Encryption Key</mat-label>
          <input matInput formControlName="encryptionKey">
        </mat-form-field>
      </div>
    </form>
  `,
  imports: [
    MatButton,
    ColorLabelComponent,
    ColorWellComponent,
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatFormField,
  ],
  standalone: true,
})
export class SettingsComponent {
  @Input() onSettingsChange!: (settings: Settings) => void;

  @Input() form!: FormGroup;

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.onSettingsChange(this.form.value as Settings);
  }
}
