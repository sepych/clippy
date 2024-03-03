import type {ServerMessage} from "../common/types.ts";
import {serverMessageEncode, serverMessagesDecode} from "../common/types.ts";

type DataCallback = (data: string) => void;

export class MasterServerConnection {
    private socket: WebSocket | null = null;
    private initialMessages: ServerMessage[] = [];
    private readonly channelId: string;
    private readonly cb: DataCallback;

    constructor(channelId: string, cb: DataCallback) {
        this.channelId = channelId;
        this.cb = cb;
        this.init();
    }

    init() {
        this.socket = new WebSocket(`ws://localhost:3001?channelId=${this.channelId}`);
        this.socket.addEventListener("open", () => {
            console.log("Master WebSocket connection established");
        });
        this.socket.addEventListener("message", event => {
            if (typeof event.data === "string") {
                const messages = serverMessagesDecode(event.data);
                // append messages to the initialMessages array
                this.initialMessages = [...this.initialMessages, ...messages];

                this.cb(serverMessageEncode(messages));
            }
        });
        this.socket.addEventListener("error", error => {
            console.error("WebSocket error:", error);
        });
        this.socket.addEventListener("close", () => {
            this.socket = null;
            this.initialMessages = [];
            setTimeout(() => {
                this.init();
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

    getInitialData(): string {
        return serverMessageEncode(this.initialMessages);
    }
}
