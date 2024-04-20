import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormBuilder, Validators } from '@angular/forms';
import { SettingsModal, SettingsDialogData } from './modals/settings.modal';
import { SessionService } from '../services/session.service';
import { MessageComponent } from './components/message.component';
import { ThemeService } from '../services/theme.service';
import ColorLabelComponent from '../components/color-label.component';
import ColorWellComponent from '../components/color-well.component';
import { SettingsService } from '../services/settings.service';
import { SettingsComponent } from './components/settings.component';
import { Settings } from '../../../../common/settings';
import SvgSettings from '../../assets/settings';
import SvgMoon from '../../assets/moon';
import SvgSun from '../../assets/sun';

@Component({
  selector: 'main-view',
  template: `
    @if (!settingsService.getSettings()) {
      <div class="flex justify-center items-center h-full">
        <settings-component [onSettingsChange]="onSettingsChange" [form]="form"></settings-component>
        <button mat-button type="submit" color="primary" [disabled]="!form.valid">Submit</button>
      </div>
    } @else {
      <div class="flex justify-between items-center mb-4">
        @if (sessionService.getChannelId()) {
          <color-label color="yellow">{{ sessionService.getChannelId() }}</color-label>
        }
        <div>
          @if (!themeService.isDark()) {
            <button mat-button (click)="themeService.toggleTheme(true)">
              <svg-sun></svg-sun>
            </button>
          } @else {
            <button mat-button (click)="themeService.toggleTheme(false)">
              <svg-moon></svg-moon>
            </button>
          }
          <button mat-button (click)="openSettings()">
            <svg-settings></svg-settings>
          </button>
        </div>
      </div>


      @for (message of sessionService.getRecentMessages(); track message.createdAt) {
        <message-component [message]="message"></message-component>
      }
    }
  `,
  imports: [
    SettingsModal,
    MatButton,
    MessageComponent,
    ColorLabelComponent,
    ColorWellComponent,
    MatProgressSpinner,
    SettingsComponent,
    MatIconButton,
    SvgSettings,
    SvgMoon,
    SvgSun,
  ],
  standalone: true,
})
export class MainView {
  protected form = this.formBuilder.group({
    masterServerIp: ['', Validators.required],
    masterServerPort: [3000, Validators.required],
    serverIp: ['localhost', Validators.required],
    serverPort: [3000, Validators.required],
    channel: ['', Validators.required],
    encryptionKey: ['', Validators.required],
  });

  constructor(
    public dialog: MatDialog,
    public sessionService: SessionService,
    public settingsService: SettingsService,
    public themeService: ThemeService,
    private formBuilder: FormBuilder,
  ) {
    const settings = this.settingsService.getSettings();
    if (settings) {
      this.form.setValue(settings);
    }
  }

  openSettings() {
    const ref = this.dialog.open<SettingsModal, SettingsDialogData, Settings>(SettingsModal, {
      minWidth: '40%',
      data: {
        form: this.form,
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.onSettingsChange(result);
      }
    });
  }

  onSettingsChange(settings: Settings) {
    this.settingsService.saveSettings(settings);
    this.sessionService.init();
  }
}
