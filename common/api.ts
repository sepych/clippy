import {type ServerMessage, serverMessageEncode, serverMessagesDecode} from "./types";
import type {Settings} from "./settings";

export enum Event {
    CHANNEL = "CHANNEL",
    MESSAGE = "MESSAGE",
    SETTINGS = "SETTINGS",
}

export type Packet = {
    event: Event;
    payload: string;
}

function isPacket(data: unknown): data is Packet {
    return (data as Packet).event !== undefined && (data as Packet).payload !== undefined;
}



type Callback = {
    onChannel: (channel: string) => void;
    onMessage: (message: ServerMessage[]) => void;
}

export class ApiClient {
    private callbacks: Callback;

    constructor(callbacks: Callback) {
        this.callbacks = callbacks;
    }

    public onData = (data: unknown) => {
        try {
            data = JSON.parse(data as string);
            if (isPacket(data)) {
                switch (data.event) {
                    case Event.CHANNEL:
                        this.callbacks.onChannel(data.payload);
                        break;
                    case Event.MESSAGE:
                        this.callbacks.onMessage(serverMessagesDecode(data.payload));
                        break;
                }
            }
        } catch (e) {
            console.error("Failed to parse data:", e);
        }
    }
}

export class ApiServer {
    getMessagePacket = (message: ServerMessage[]) => {
        const packet: Packet = {
            event: Event.MESSAGE,
            payload: serverMessageEncode(message),
        }
        return JSON.stringify(packet);
    }

    getChannelPacket(channel: string) {
        const packet: Packet = {
            event: Event.CHANNEL,
            payload: channel,
        }
        return JSON.stringify(packet);
    }

    getSettingsPacket(settings: Settings) {
        const packet: Packet = {
            event: Event.SETTINGS,
            payload: JSON.stringify(settings),
        }
        return JSON.stringify(packet);
    }
}
