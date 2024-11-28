import { WebSocket } from 'ws';

export const sendResponse = (ws: WebSocket, type: string, data: any) =>
  ws.send(
    JSON.stringify({
      type,
      data: JSON.stringify(data),
      id: 0,
    })
  );
