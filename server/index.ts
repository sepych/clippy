import express from "express";
import * as path from "node:path";
import chalk from "chalk";
import {ApiServer} from "./src/api-server.ts";

const app = express();

app.use(express.static(path.join(__dirname, '../client-angular/dist/client-angular/browser')));

// Start the server
const spaPagePort = process.env.CLIENT_PORT;
app.listen(spaPagePort, () => {
    const url = `http://localhost:${spaPagePort}`;
    console.log(`App is running at ${chalk.underline.blue(url)}`);
    console.log('Press Ctrl+C to quit.');
});


new ApiServer();
