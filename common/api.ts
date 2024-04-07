import {type ServerMessage, serverMessagesDecode} from "./types";
import type {Settings} from "./settings";

export type Packet = {
    event: ApiClientEvent | ApiServerEvent;
    payload: string;
}

export function isPacket(data: unknown): data is Packet {
    return (data as Packet).event !== undefined && (data as Packet).payload !== undefined;
}

export enum ApiServerEvent {
    SETTINGS = "SETTINGS",
}
export enum ApiClientEvent {
    CHANNEL = "CHANNEL",
    MESSAGE = "MESSAGE",
}

type ApiClientCallback = {
    onChannel: (channel: string) => void;
    onMessage: (message: ServerMessage[]) => void;
}

export class ApiClient {
    constructor(private callbacks: ApiClientCallback) {
    }

    public onData = (data: unknown) => {
        try {
            data = JSON.parse(data as string);
            if (isPacket(data)) {
                switch (data.event) {
                    case ApiClientEvent.CHANNEL:
                        this.callbacks.onChannel(data.payload);
                        break;
                    case ApiClientEvent.MESSAGE:
                        this.callbacks.onMessage(serverMessagesDecode(data.payload));
                        break;
                }
            }
        } catch (e) {
            console.error("Failed to parse data:", e);
        }
    }

    setSettings(socket: WebSocket, settings: Settings) {
        const packet: Packet = {
            event: ApiServerEvent.SETTINGS,
            payload: JSON.stringify(settings),
        }
        const packetStr = JSON.stringify(packet);
        socket.send(packetStr);
    }
}

