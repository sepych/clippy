import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsModal } from './settings.modal';
import { ServerMessage } from '../../../../common/types';
import ColorLabelComponent from './color-label.component';
import ColorWellComponent from './color-well.component';
import SvgClipboard from '../../assets/clipboard';

@Component({
  selector: 'message-component',
  template: `
    <div class="flex flex-row mb-2">
      <div class="basis-1/5">
        <div class="flex flex-row space-between pe-1">
          <color-label color="indigo" class="grow">
            {{ message.ipAddress }}
          </color-label>
          <button mat-button (click)="copyTextToClipboard(message.message)">
            <svg-clipboard></svg-clipboard>
          </button>
        </div>

      </div>
      <div class="basis-4/5 overflow-x-auto">

        <color-well color="gray" size="xs">
          <div class="whitespace-pre">{{ message.message }}</div>
        </color-well>

      </div>
    </div>
  `,
  imports: [
    SettingsModal,
    MatButton,
    ColorLabelComponent,
    ColorWellComponent,
    SvgClipboard,
  ],
  standalone: true,
})
export class MessageComponent {
  @Input() message!: ServerMessage;

  constructor(
    private snackbar: MatSnackBar,
  ) {
  }

  async copyTextToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.snackbar.open('Copied to clipboard', undefined, {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }
}
