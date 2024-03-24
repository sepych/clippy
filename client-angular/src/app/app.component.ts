import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ThemeService} from "./services/theme.service";

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  imports: [
    RouterOutlet,
  ],
  standalone: true,
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {}
  ngOnInit() {
    this.themeService.init();
  }
}
