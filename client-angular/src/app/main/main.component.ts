import { Component } from '@angular/core';
import {MainModal} from "./main.modal";
import {MatDialog} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'main-component',
  template: `
    <button mat-raised-button (click)="openDialog()">Open dialog without animation</button>
  `,
  imports: [
    MainModal,
    MatButton
  ],
  standalone: true
})
export class MainComponent {
  constructor(public dialog: MatDialog) {}
  openDialog() {
    this.dialog.open(MainModal, {
      width: '250px',
    });
  }
}
