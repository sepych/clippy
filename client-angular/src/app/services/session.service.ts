import { Injectable, signal, WritableSignal } from '@angular/core';
import { ApiClient } from '../../../../common/api';
import { ServerMessage } from '../../../../common/types';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private client: ApiClient;

  private channelId: WritableSignal<string | undefined> = signal<string | undefined>(undefined);

  private recentMessages: WritableSignal<ServerMessage[]> = signal<ServerMessage[]>([]);

  constructor() {
    this.client = new ApiClient({
      onChannel: (channel) => {
        this.channelId.set(channel);
      },
      onMessage: (messages) => {
        this.recentMessages.set([...this.recentMessages(), ...messages]);
      },
    });
    this.init();
  }

  init() {
    const socket = new WebSocket('ws://localhost:3000');

    // Set up WebSocket event listeners
    socket.addEventListener('open', () => {
      console.log('WebSocket connection established');
    });
    socket.addEventListener('message', (event) => {
      console.log('Message from server:', event.data);
      this.client.onData(event.data);
    });
    socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });
    socket.addEventListener('close', () => {
      console.log('WebSocket connection closed');
      this.recentMessages.set([]);
      this.channelId.set(undefined);
      setTimeout(() => {
        this.init();
      }, 1000);
    });
  }

  getChannelId(): string | undefined {
    return this.channelId();
  }

  getRecentMessages(): ServerMessage[] {
    return this.recentMessages();
  }
}
