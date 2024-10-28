import { WebSocket } from 'ws';
import { players } from '../db';
import { sendResponse } from '../helpers/sendResponse';
import { updateRoom } from './roomHandlers';
import { ResponseTypes } from '../helpers/responseTypes';
import { RequestTypes } from '../helpers/requestTypes';

export const handleUserReg = (data: any, ws: WebSocket) => {
  const { name, password } = JSON.parse(data);
  const player = players.find((player) => player.name === name);
  if (!player) {
    const index = players.length + 1;
    players.push({ index, name, password, wins: 0, ws });
    sendResponse(ws, RequestTypes.REG, {
      name,
      index,
      error: false,
      errorText: '',
    });
    players.forEach((player) => {
      updateWinners(player.ws);
      updateRoom(player.ws);
    });
    return;
  }
  if (player.password === password) {
    sendResponse(ws, ResponseTypes.REG, {
      name,
      index: player.index,
      error: false,
      errorText: '',
    });
    players.forEach((player) => {
      updateWinners(player.ws);
      updateRoom(player.ws);
    });
    return;
  }
  sendResponse(ws, ResponseTypes.REG, {
    name,
    index: player.index,
    error: true,
    errorText: 'Wrong password',
  });
};

export const updateWinners = (ws: WebSocket) => {
  sendResponse(
    ws,
    ResponseTypes.UPDATE_WINNERS,
    players
      .map((player) => ({ name: player.name, wins: player.wins }))
      .toSorted((a, b) => b.wins - a.wins)
  );
};
