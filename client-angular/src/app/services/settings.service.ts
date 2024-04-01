import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { isSettings, Settings } from '../../../../common/settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private settings: Settings | undefined;

  constructor() {
    const savedSettings = localStorage.getItem('clippy-settings');
    if (savedSettings) {
      const data = JSON.parse(savedSettings);
      if (isSettings(data)) {
        this.settings = data;
      }
    }
  }

  getSettings(): Settings | undefined {
    return this.settings;
  }

  saveSettings(settings: Settings): void {
    this.settings = settings;
    localStorage.setItem('settings', JSON.stringify(settings));
  }
}
