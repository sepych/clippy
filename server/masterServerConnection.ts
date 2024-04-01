import type {ServerMessage} from "../common/types.ts";
import {serverMessageEncode, serverMessagesDecode} from "../common/types.ts";
import type {Settings} from "../common/settings.ts";

type DataCallback = (data: ServerMessage[]) => void;

export class MasterServerConnection {
    private socket: WebSocket | null = null;
    private initialMessages: ServerMessage[] = [];
    private channelId: string | undefined;
    private masterServerIp: string | undefined;
    private masterServerPort: number | undefined;


    init(cb: DataCallback) {
        if (!this.channelId || !this.masterServerIp || !this.masterServerPort) {
            throw new Error("Channel ID, master server IP and master server port must be set before initializing the connection");
        }

        console.log(`Master WebSocket connection to ws://${this.masterServerIp}:${this.masterServerPort}?channelId=${this.channelId}`)
        this.socket = new WebSocket(`ws://${this.masterServerIp}:${this.masterServerPort}?channelId=${this.channelId}`);
        this.socket.addEventListener("open", () => {
            console.log("Master WebSocket connection established");
        });
        this.socket.addEventListener("message", event => {
            if (typeof event.data === "string") {
                const messages = serverMessagesDecode(event.data);
                // append messages to the initialMessages array
                this.initialMessages = [...this.initialMessages, ...messages];

                cb(messages);
            }
        });
        this.socket.addEventListener("error", error => {
            console.error("WebSocket error:", error);
        });
        this.socket.addEventListener("close", () => {
            this.socket = null;
            this.initialMessages = [];
            setTimeout(() => {
                this.init(cb);
            }, 3000);
        });
    }

    sendMessage(message: string): void {
        if (this.socket) {
            const serverMessage = {
                createdAt: Date.now(),
                channelId: this.channelId,
                message: message
            }
            this.socket.send(serverMessageEncode([serverMessage]));
        }
    }

    getInitialMessages(): ServerMessage[] {
        return this.initialMessages;
    }

    setSettings(data: Settings) {
        this.channelId = data.channel;
        this.masterServerIp = data.masterServerIp;
        this.masterServerPort = data.masterServerPort;
    }
}
