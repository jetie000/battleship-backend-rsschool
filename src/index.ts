import { httpServer } from "./http_server";
import { WebSocketServer } from 'ws';


const HTTP_PORT = 8181;
const WS_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

console.log(`Start WebSocket server on the ${WS_PORT} port!`);

export const wss = new WebSocketServer({ port: WS_PORT });
