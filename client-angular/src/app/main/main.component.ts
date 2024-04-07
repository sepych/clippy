import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormBuilder, Validators } from '@angular/forms';
import { SettingsModal, SettingsDialogData } from './settings.modal';
import { SessionService } from '../services/session.service';
import { MessageComponent } from './message.component';
import { ThemeService } from '../services/theme.service';
import ColorLabelComponent from './color-label.component';
import ColorWellComponent from './color-well.component';
import { SettingsService } from '../services/settings.service';
import { SettingsComponent } from './settings.component';
import { Settings } from '../../../../common/settings';

@Component({
  selector: 'main-component',
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
              <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                   fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z"></path>
              </svg>
            </button>
          } @else {
            <button mat-button (click)="themeService.toggleTheme(false)">
              <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                   fill="currentColor" viewBox="0 0 18 20">
                <path
                  d="M17.8 13.75a1 1 0 0 0-.859-.5A7.488 7.488 0 0 1 10.52 2a1 1 0 0 0 0-.969A1.035 1.035 0 0 0 9.687.5h-.113a9.5 9.5 0 1 0 8.222 14.247 1 1 0 0 0 .004-.997Z"></path>
              </svg>
            </button>
          }
          <button mat-button (click)="openSettings()">
            <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                 viewBox="340 140 280 279.416">
              <path xmlns="http://www.w3.org/2000/svg"
                    d="M620,305.666v-51.333l-31.5-5.25c-2.333-8.75-5.833-16.917-9.917-23.917L597.25,199.5l-36.167-36.75l-26.25,18.083  c-7.583-4.083-15.75-7.583-23.916-9.917L505.667,140h-51.334l-5.25,31.5c-8.75,2.333-16.333,5.833-23.916,9.916L399.5,163.333  L362.75,199.5l18.667,25.666c-4.083,7.584-7.583,15.75-9.917,24.5l-31.5,4.667v51.333l31.5,5.25  c2.333,8.75,5.833,16.334,9.917,23.917l-18.667,26.25l36.167,36.167l26.25-18.667c7.583,4.083,15.75,7.583,24.5,9.917l5.25,30.916  h51.333l5.25-31.5c8.167-2.333,16.333-5.833,23.917-9.916l26.25,18.666l36.166-36.166l-18.666-26.25  c4.083-7.584,7.583-15.167,9.916-23.917L620,305.666z M480,333.666c-29.75,0-53.667-23.916-53.667-53.666s24.5-53.667,53.667-53.667  S533.667,250.25,533.667,280S509.75,333.666,480,333.666z"/>
            </svg>
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
  ],
  standalone: true,
})
export class MainComponent {
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
