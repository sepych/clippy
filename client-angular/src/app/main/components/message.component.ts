import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsModal } from '../modals/settings.modal';
import { ServerMessage } from '../../../../../common/types';
import ColorLabelComponent from '../../components/color-label.component';
import ColorWellComponent from '../../components/color-well.component';
import SvgClipboard from '../../../assets/clipboard';
import SvgHeart from '../../../assets/heart';
import SvgHeartFilled from '../../../assets/heart-filled';

@Component({
  selector: 'message-component',
  template: `
    <div class="flex flex-row mb-2">
      <div class="">
        <div class="flex flex-row space-between pe-4">
          <span class="text-amber-700 dark:text-amber-300 text-xs">{{ message.ipAddress }}</span>
        </div>

      </div>
      <div
        class="overflow-x-auto rounded px-2.5 py-2.5 text-xs dark:bg-gray-900 bg-gray-200 dark:text-gray-100 text-gray-900">
        @if (message.message) {
          <div class="whitespace-pre w-full">{{ message.message }}</div>
        } @else {
          <div class="dark:text-red-300 text-red-800">Wrong encryption key</div>
        }
      </div>

      <div class="ml-2 flex-row">
        @if (message.message) {
          <button mat-button color="primary" (click)="copyTextToClipboard(message.message)" class="!min-w-[36px]">
            <svg-clipboard></svg-clipboard>
          </button>
          <button mat-button color="primary" (click)="toggleFavorite(message.message)" class="!min-w-[36px]">
            @if (this.favorite) {
              <svg-heart-filled></svg-heart-filled>
            } @else {
              <svg-heart></svg-heart>
            }
          </button>
        }
      </div>
      <div class="flex-grow">
      </div>

    </div>
  `,
  imports: [
    SettingsModal,
    MatButton,
    ColorLabelComponent,
    ColorWellComponent,
    SvgClipboard,
    SvgHeart,
    SvgHeartFilled,
  ],
  standalone: true,
})
export class MessageComponent {
  @Input() message!: ServerMessage;

  protected favorite: boolean = false;

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

  toggleFavorite(message: string) {
    // TODO: Implement favorite functionality
    this.favorite = !this.favorite;
  }
}
