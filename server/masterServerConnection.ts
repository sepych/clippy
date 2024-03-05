import type {ServerMessage} from "../common/types.ts";
import {serverMessageEncode, serverMessagesDecode} from "../common/types.ts";

type DataCallback = (data: ServerMessage[]) => void;

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
        const host = process.env.SERVER_WS_HOST || "localhost";
        const port = process.env.SERVER_WS_PORT || 3001;

        console.log(`Master WebSocket connection to ws://${host}:${port}?channelId=${this.channelId}`)
        this.socket = new WebSocket(`ws://${host}:${port}?channelId=${this.channelId}`);
        this.socket.addEventListener("open", () => {
            console.log("Master WebSocket connection established");
        });
        this.socket.addEventListener("message", event => {
            if (typeof event.data === "string") {
                const messages = serverMessagesDecode(event.data);
                // append messages to the initialMessages array
                this.initialMessages = [...this.initialMessages, ...messages];

                this.cb(messages);
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

    getInitialMessages(): ServerMessage[] {
        return this.initialMessages;
    }
}
