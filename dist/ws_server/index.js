"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const wsclients = [];
__1.wss.on('connection', (ws) => {
    wsclients.push(ws);
    ws.on('error', console.error);
    ws.on('message', (data) => {
        ws.send(data);
        console.log('received: %s', data);
    });
});
