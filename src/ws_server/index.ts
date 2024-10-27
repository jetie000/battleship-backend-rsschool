import { wss } from '..';
import { players } from './db';
import { handleWsMessage } from './router';

export const startWSServer = (PORT: number) => {
  wss
    .on('connection', (ws) => {
      ws.on('error', console.error);
      ws.on('message', (data) => {
        const { type, data: messageData } = JSON.parse(data.toString());
        handleWsMessage(type, messageData, ws);
      });

      ws.on('close', () => {
        const playerIndex = players.findIndex((player) => player.ws === ws);
        if (playerIndex !== -1) {
          players.splice(playerIndex, 1);
        }
        ws.close();
      });
    })
    .on('listening', () =>
      console.log(`Started WebSocket server on the ${PORT} port!`)
    )
    .on('close', () => {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.close();
        }
      });

      console.log('WebSocker server closed.\n');
    });
};
