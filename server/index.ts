import express from "express";
import * as path from "node:path";
import clipboard from 'clipboardy';
import {v4 as uuidv4} from 'uuid';
import {MasterServerConnection} from "./masterServerConnection.ts";

const app = express();

app.use(express.static(path.join(__dirname, '../client/dist/')));

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

type WebSocketData = {
    createdAt: number;
    channelId: string;
};

// get channel id from args
const args = process.argv.slice(2);
const channel = args[0] || uuidv4();


const server = Bun.serve<WebSocketData>({
    async fetch(req, server) {
        server.upgrade(req, {
            data: {
                createdAt: Date.now(),
                channelId: channel,
            },
        });

        return;
    },
    websocket: {
        open(ws) {
            console.log("new channel opened", ws.data);
            ws.subscribe(channel);
            const data = masterServerConnection.getInitialData();
            server.publish(channel, data);
        },
        close(ws) {
            ws.unsubscribe(channel);
        },
    },
});



const masterServerConnection = new MasterServerConnection(channel, ( data) => {
    server.publish(channel, data);
});
let prevClipboard = null;
setInterval(() => {
    const result = clipboard.readSync();
    if (prevClipboard !== result) {
        prevClipboard = result;
        masterServerConnection.sendMessage(result);
    }
}, 500);
