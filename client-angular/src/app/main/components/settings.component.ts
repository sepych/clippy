import { Component, Input } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import ColorLabelComponent from '../../components/color-label.component';
import ColorWellComponent from '../../components/color-well.component';
import { Settings } from '../../../../../common/settings';

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
          <button type="button" matSuffix mat-icon-button (click)="generateKey()">
            <mat-icon>refresh</mat-icon>
          </button>
        </mat-form-field>
      </div>
      <div>
        <mat-checkbox formControlName="excludePasswords">Don't log passwords</mat-checkbox>
      </div>
    </form>
  `,
  imports: [
    MatButton,
    ColorLabelComponent,
    ColorWellComponent,
    ReactiveFormsModule,
    MatInput,
    MatSuffix,
    MatLabel,
    MatFormField,
    MatCheckbox,
    MatIconButton,
    MatIcon,
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

  generateKey() {
    const length = 32;
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.form.get('encryptionKey')?.setValue(result);
  }
}
