import { Injectable } from '@angular/core';
import { isSettings, Settings } from '../../../../common/settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private settings: Settings | undefined;

  static storageKey = 'clippy-settings';

  constructor() {
    const savedSettings = localStorage.getItem(SettingsService.storageKey);
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
    localStorage.setItem(SettingsService.storageKey, JSON.stringify(settings));
  }
}
