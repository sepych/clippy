import { Injectable, signal, WritableSignal } from '@angular/core';
import { ApiClient } from '../../../../common/api';
import { ServerMessage } from '../../../../common/types';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private client: ApiClient;

  private channelId: WritableSignal<string | undefined> = signal<string | undefined>(undefined);

  private recentMessages: WritableSignal<ServerMessage[]> = signal<ServerMessage[]>([]);

  private socket: WebSocket | undefined;

  constructor(private settingsService: SettingsService) {
    this.client = new ApiClient({
      onChannel: (channel) => {
        this.channelId.set(channel);
      },
      onMessage: (messages) => {
        const messagesReversed = [...messages].reverse();
        this.recentMessages.set([...messagesReversed, ...this.recentMessages()]);
      },
    });
    this.init();
  }

  init() {
    this.socket?.close();

    const settings = this.settingsService.getSettings();
    if (!settings) {
      console.error('Settings not found');
      return;
    }

    console.log('Settings:', settings);
    this.socket = new WebSocket(`ws://${settings.serverIp}:${settings.serverPort}`);

    // Set up WebSocket event listeners
    this.socket.addEventListener('open', () => {
      console.log('WebSocket connection established');
      this.client.setSettings(this.socket!, settings);
    });
    this.socket.addEventListener('message', (event) => {
      // console.log('Message from server:', event.data);
      this.client.onData(event.data);
    });
    this.socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });
    this.socket.addEventListener('close', () => {
      console.log('WebSocket connection closed');
      this.recentMessages.set([]);
      this.channelId.set(undefined);
      // setTimeout(() => {
      //   this.init();
      // }, 1000);
    });
  }

  isConnectionOpen(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  getChannelId(): string | undefined {
    return this.channelId();
  }

  getRecentMessages(): ServerMessage[] {
    return this.recentMessages();
  }
}
