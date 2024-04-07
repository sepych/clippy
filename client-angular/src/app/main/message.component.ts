import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { SettingsModal } from './settings.modal';
import { ServerMessage } from '../../../../common/types';
import ColorLabelComponent from './color-label.component';
import ColorWellComponent from './color-well.component';

@Component({
  selector: 'message-component',
  template: `
    <div class="flex flex-row mb-2">
      <div class="basis-1/5">
        <div class="flex flex-row space-between">
          <color-label color="indigo" class="grow">
            {{ message.ipAddress }}
          </color-label>
          <button mat-button (click)="copyTextToClipboard(message.message)">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                 class="w-4 h-4">
              <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z"
                    fill="currentColor"></path>
            </svg>
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
  ],
  standalone: true,
})
export class MessageComponent {
  @Input() message!: ServerMessage;

  async copyTextToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }
}
