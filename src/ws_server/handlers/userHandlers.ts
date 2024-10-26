import { WebSocket } from 'ws';
import { players } from '../db';
import { sendResponse } from '../../ws_server/helpers/sendResponse';

export const handleUserReg = (data: any, ws: WebSocket) => {
  const { name, password } = JSON.parse(data);
  const player = players.find((player) => player.name === name);
  if (!player) {
    const index = players.length;
    players.push({ index, name, password, wins: 0 });
    sendResponse(ws, 'reg', { name, index, error: false, errorText: '' });
    return;
  }
  if (player.password === password) {
    sendResponse(ws, 'reg', {
      name,
      index: player.index,
      error: false,
      errorText: '',
    });
    return;
  }
  sendResponse(ws, 'reg', {
    name,
    index: player.index,
    error: true,
    errorText: 'Wrong password',
  });
};
