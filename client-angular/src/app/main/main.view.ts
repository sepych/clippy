import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsDialogData, SettingsModal } from './modals/settings.modal';
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
import { FormGeneric } from '../utils/types';

@Component({
  selector: 'main-view',
  template: `
    @if (!settingsService.getSettings()) {
      <div class="flex justify-center items-center h-full">
        <button mat-raised-button (click)="openSettings()">
          Start
        </button>
      </div>
    } @else {
      <div class="flex justify-between items-center mb-4">
        @if (sessionService.getChannelId()) {
          <div>
            <color-label color="yellow"><span class="lowercase text-xs">Channel #</span>{{ sessionService.getChannelId() }}</color-label>
          </div>
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
  protected form = new FormGroup<FormGeneric<Settings>>({
    masterServerIp: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    masterServerPort: new FormControl<number>(3001, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    serverIp: new FormControl('localhost', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    serverPort: new FormControl<number>(3000, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    channel: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    encryptionKey: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(32)],
    }),
    excludePasswords: new FormControl<boolean>(true, {
      nonNullable: true,
      validators: [Validators.required],
    }),
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
