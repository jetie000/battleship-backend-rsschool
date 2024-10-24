import { wss } from '..';

const wsclients = [];

wss.on('connection', (ws) => {
  wsclients.push(ws);

  ws.on('error', console.error);

  ws.on('message', (data) => {
    ws.send(data);
    console.log('received: %s', data);
  });
});
