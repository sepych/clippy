import express from "express";
import * as path from "node:path";
import clipboard from 'clipboardy';
import {v4 as uuidv4} from 'uuid';
import {MasterServerConnection} from "./masterServerConnection.ts";
import {ApiServer} from "../common/api.ts";
import {decrypt, encrypt} from "./crypto-util.ts";
import type {ServerMessage} from "../common/types.ts";
import chalk from "chalk";

const app = express();

app.use(express.static(path.join(__dirname, '../client/dist/')));

// Start the server
const spaPagePort = process.env.CLIENT_PORT;
app.listen(spaPagePort, () => {
    const url = `http://localhost:${spaPagePort}`;
    console.log(`App is running at ${chalk.underline.blue(url)}`);
    console.log('Press Ctrl+C to quit.');
});

type WebSocketData = {
    createdAt: number;
    channelId: string;
};

// get channel id from args
const args = process.argv.slice(2);
const channel = args[0] || uuidv4();


const apiServer = new ApiServer();

function decryptMessage(data: ServerMessage[]) {
    return data.map((msg) => {
        return {
            ...msg,
            message: decrypt(msg.message, process.env.ENCRYPTION_KEY),
        };
    });
}

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
            server.publish(channel, apiServer.getChannelPacket(channel));

            // const data = masterServerConnection.getInitialData();
            const data = masterServerConnection.getInitialMessages();
            server.publish(channel, apiServer.getMessagePacket(decryptMessage(data)));
        },
        close(ws) {
            ws.unsubscribe(channel);
        },
    },
});



const masterServerConnection = new MasterServerConnection(channel, ( data) => {
    // server.publish(channel, data);
    server.publish(channel, apiServer.getMessagePacket(decryptMessage(data)));
});
let prevClipboard = null;
setInterval(() => {
    const result = clipboard.readSync();
    if (prevClipboard !== result && result !== "") {
        prevClipboard = result;
        masterServerConnection.sendMessage(encrypt(result, process.env.ENCRYPTION_KEY));
    }
}, 500);
