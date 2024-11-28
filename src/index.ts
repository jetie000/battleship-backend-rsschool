import { startWSServer } from './ws_server';
import { httpServer } from './http_server';
import { WebSocketServer } from 'ws';

const HTTP_PORT = 8181;
const WS_PORT = 3000;

export const wss = new WebSocketServer({ port: WS_PORT });
startWSServer(WS_PORT);

console.log(`Started Static HTTP server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
