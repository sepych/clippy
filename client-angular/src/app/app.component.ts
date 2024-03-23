import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  imports: [
    RouterOutlet,
  ],
  standalone: true,
})
export class AppComponent implements OnInit {
  ngOnInit(): void {

  }
}
