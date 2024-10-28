import { wss } from '..';
import { handleWsMessage } from './router';

export const startWSServer = (PORT: number) => {
  wss
    .on('connection', (ws) => {
      ws.on('error', console.error);
      ws.on('message', (data) => {
        const { type, data: messageData } = JSON.parse(data.toString());
        handleWsMessage(type, messageData, ws);
      });
    })
    .on('listening', () =>
      console.log(`Started WebSocket server on the ${PORT} port!`)
    )
    .on('close', () => {
      console.log('WebSocker server closed.\n');
    })
    .on('error', console.error);
};
