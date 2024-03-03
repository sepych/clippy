import type {ServerMessage} from "../common/types.ts";
import {serverMessageEncode, serverMessagesDecode} from "../common/types.ts";

type WebSocketData = {
    createdAt: number;
    channelId: string;
    ipAddress: string;
    // authToken: string;
};

const map = new Map<string, ServerMessage[]>();


let channel = null;

const WS_CHANNEL = "clippy";
const PORT = process.env.PORT || 3001;
const server = Bun.serve<WebSocketData>({
    fetch(req, server) {
        const ipAddress = server.requestIP(req)?.address || "unknown";
        server.upgrade(req, {
            data: {
                createdAt: Date.now(),
                channelId: new URL(req.url).searchParams.get("channelId"),
                ipAddress,
            },
        });

        return;
    },
    websocket: {
        message(ws, message: string) {
            const channel = `${WS_CHANNEL}-${ws.data.channelId}`;
            const hasChannel = map.has(channel);

            const nextMessages = serverMessagesDecode(message).map((msg) => {
                return {
                    ...msg,
                    ipAddress: ws.data.ipAddress,
                };
            });

            if (hasChannel) {
                const messages = map.get(channel);
                if (messages !== undefined) {
                    map.set(channel, [...messages, ...nextMessages]);
                }

                server.publish(channel, serverMessageEncode(nextMessages));
            } else {
                map.set(channel, nextMessages);
                server.publish(channel, serverMessageEncode(nextMessages));
            }
        },
        open(ws) {
            console.log("new channel opened", ws.data);
            channel = `${WS_CHANNEL}-${ws.data.channelId}`
            ws.subscribe(channel);
            const hasChannel = map.has(channel);
            if (hasChannel) {
                server.publish(channel, serverMessageEncode(map.get(channel) || []));
            }
        },
        close(ws) {
            ws.unsubscribe(channel);
            channel = null;
        },
    },
    port: PORT
});

console.log(`Ws server listening on port ${PORT}`);
console.log('Press Ctrl+C to quit.');
