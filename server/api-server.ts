import {isSettings, type Settings} from "../common/settings.ts";
import {type ServerMessage, serverMessageEncode} from "../common/types.ts";
import {ApiClientEvent, ApiServerEvent, isPacket, type Packet} from "../common/api.ts";
import type {Server, ServerWebSocket} from "bun";
import {MasterServerConnection} from "./masterServerConnection.ts";
import {decrypt, encrypt} from "./crypto-util.ts";
import clipboard from "clipboardy";




type WebSocketData = {
    createdAt: number;
    settings: Settings | undefined;
};

export class ApiServer {
    private server: Server;
    private masterServerConnection: MasterServerConnection;
    private prevClipboard?: string;

    private currentConnection?: ServerWebSocket<WebSocketData>;

    constructor() {
        this.masterServerConnection = new MasterServerConnection();
        this.server = Bun.serve<WebSocketData>({
            async fetch(req, server) {
                server.upgrade(req, {
                    data: {
                        createdAt: Date.now(),
                    },
                });

                return;
            },
            websocket: {
                open: (ws: ServerWebSocket<WebSocketData>) => this.open(ws),
                close: (ws: ServerWebSocket<WebSocketData>) => this.close(ws),
                message: (ws: ServerWebSocket<WebSocketData>, message: string | Buffer) => this.message(ws, message),
            },
        });

        setInterval(() => {
            if (!this.currentConnection || !this.currentConnection.data.settings) {
                return;
            }
            const result = clipboard.readSync();
            if (this.prevClipboard !== result && result !== "") {
                this.prevClipboard = result;
                console.log("Sending clipboard data:", result);
                this.masterServerConnection.sendMessage(encrypt(result,
                    this.currentConnection.data.settings.encryptionKey));
            }
        }, 500);
    }


    public open = (ws: ServerWebSocket<WebSocketData>) => {
        if (this.currentConnection) {
            this.currentConnection.close();
        }

        this.currentConnection = ws;
        console.log("new channel opened", ws.data);
    }
    public close = (ws: ServerWebSocket<WebSocketData>) => {
        console.log("channel closed", ws.data);
        if (ws.data.settings?.channel) {
            ws.unsubscribe(ws.data.settings.channel);
        }
    }
    public message = (ws: ServerWebSocket<WebSocketData>, message: string | Buffer): void | Promise<void> => {
        try {
            const data = JSON.parse(message as string);
            if (isPacket(data)) {
                switch (data.event) {
                    case ApiServerEvent.SETTINGS:
                        const settingsPacket = JSON.parse(data.payload);
                        if (isSettings(settingsPacket)) {
                            this.onSettingsPacket(settingsPacket, ws);
                        }
                        break;
                }
            }
        } catch (e) {
            console.error("Failed to parse data:", e);
        }
    }

    private onSettingsPacket = (settings: Settings, ws: ServerWebSocket<WebSocketData>) => {
        ws.data.settings = settings;
        ws.subscribe(settings.channel);
        // FIXME: this is not needed as client knows the channel
        this.server.publish(settings.channel, this.getChannelPacket(settings.channel));

        this.masterServerConnection.setSettings(settings);
        this.masterServerConnection.init((data) => {
            console.log("Received packets:", data.length);
            this.server.publish(settings.channel, this.getMessagePacket(
                this.decryptMessage(data, settings.encryptionKey)));
        });
    }

    getMessagePacket = (message: ServerMessage[]) => {
        const packet: Packet = {
            event: ApiClientEvent.MESSAGE,
            payload: serverMessageEncode(message),
        }
        return JSON.stringify(packet);
    }

    getChannelPacket(channel: string) {
        const packet: Packet = {
            event: ApiClientEvent.CHANNEL,
            payload: channel,
        }
        return JSON.stringify(packet);
    }

    private decryptMessage(data: ServerMessage[], key: string) {
        return data.map((msg) => {
            return {
                ...msg,
                message: decrypt(msg.message, key),
            };
        });
    }
}
