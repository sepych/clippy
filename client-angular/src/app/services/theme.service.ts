import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkTheme = false;

  isDark(): boolean {
    return this.isDarkTheme;
  }

  toggleTheme(value?: boolean): void {
    if (value !== undefined) {
      this.isDarkTheme = value;
    } else {
      this.isDarkTheme = !this.isDarkTheme;
    }
    console.log('isDarkTheme', this.isDarkTheme);
    document.body.classList.toggle('dark', this.isDarkTheme);
    localStorage.setItem('preferredTheme', this.isDarkTheme ? 'dark' : 'light');
  }

  init() {
    const savedTheme = localStorage.getItem('preferredTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      this.toggleTheme(savedTheme === 'dark');
    } else {
      this.toggleTheme(prefersDark);
    }
  }
}
