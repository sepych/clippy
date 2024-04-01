import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import ColorLabelComponent from './color-label.component';
import ColorWellComponent from './color-well.component';
import { Settings } from '../../../../common/settings';
import { SettingsService } from '../services/settings.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'settings-component',
  template: `
    <form [formGroup]="form" (submit)="submit()">
      <div>
        <mat-form-field>
          <mat-label>Master Server IP</mat-label>
          <input matInput formControlName="masterServerIp">
        </mat-form-field>
      </div>
      <div>
        <mat-form-field>
          <mat-label>Master Server Port</mat-label>
          <input matInput formControlName="masterServerPort">
        </mat-form-field>
      </div>
      <div>
        <mat-form-field>
          <mat-label>Server IP</mat-label>
          <input matInput formControlName="serverIp">
        </mat-form-field>
      </div>
      <div>
        <mat-form-field>
          <mat-label>Server Port</mat-label>
          <input matInput formControlName="serverPort">
        </mat-form-field>
      </div>
      <div>
        <mat-form-field>
          <mat-label>Channel</mat-label>
          <input matInput formControlName="channel">
        </mat-form-field>
      </div>
      <div>
        <mat-form-field>
          <mat-label>Encryption Key</mat-label>
          <input matInput formControlName="encryptionKey">
        </mat-form-field>
      </div>
      <button mat-button type="submit" color="primary" [disabled]="!form.valid">Submit</button>
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
  protected form = this.formBuilder.group({
    masterServerIp: ['', Validators.required],
    masterServerPort: [3000, Validators.required],
    serverIp: ['localhost', Validators.required],
    serverPort: [3000, Validators.required],
    channel: ['', Validators.required],
    encryptionKey: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private settingsService: SettingsService,
    private sessionService: SessionService,
  ) {
    const settings = this.settingsService.getSettings();
    if (settings) {
      this.form.setValue(settings);
    }
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value);

    this.settingsService.saveSettings(this.form.value as Settings);
    this.sessionService.init();
  }
}
