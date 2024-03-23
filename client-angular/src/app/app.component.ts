import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div class="flex justify-center h-screen m-2">
      <router-outlet></router-outlet>
    </div>
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
