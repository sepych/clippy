import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MainModal } from './main.modal';
import { SessionService } from '../services/session.service';
import { MessageComponent } from './message.component';
import {ThemeService} from "../services/theme.service";

@Component({
  selector: 'main-component',
  template: `
    @if (theme.isDark()) {
      <button mat-button (click)="theme.toggleTheme(false)">Light Mode</button>
    } @else {
      <button mat-button (click)="theme.toggleTheme(true)">Dark Mode</button>
    }

    @if (session.getChannelId()) {
      <h1>{{ session.getChannelId() }}</h1>
      @for (message of session.getRecentMessages(); track message.createdAt) {
        <message-component [message]="message"></message-component>
      }
    }
  `,
  imports: [
    MainModal,
    MatButton,
    MessageComponent,
  ],
  standalone: true,
})
export class MainComponent {
  constructor(public dialog: MatDialog,
              public session: SessionService,
              public theme: ThemeService) {}

  openDialog() {
    this.dialog.open(MainModal, {
      width: '250px',
    });
  }
}
