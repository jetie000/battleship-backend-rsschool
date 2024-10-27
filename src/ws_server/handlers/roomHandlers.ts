import { ResponseTypes } from 'ws_server/helpers/responseTypes';
import { players, rooms } from '../db';
import { sendResponse } from '../helpers/sendResponse';
import { WebSocket } from 'ws';

export const updateRoom = (ws: WebSocket) => {
  sendResponse(
    ws,
    ResponseTypes.UPDATE_ROOM,
    rooms
      .filter((room) => room.player1Id && !room.player2Id)
      .map((room) => {
        const player = players.find(
          (player) => player.index === room.player1Id
        );
        return {
          roomId: room.id,
          roomUsers: [
            {
              name: player?.name || '',
              index: room.player1Id,
            },
          ],
        };
      })
  );
};

export const createGame = (gameId: number) => {
  const room = rooms.find((room) => room.id === gameId);
  if (!room) {
    return;
  }
  const player1 = players.find((player) => player.index === room.player1Id);
  const player2 = players.find((player) => player.index === room.player2Id);
  if (!player1 || !player2) {
    return;
  }
  sendResponse(player1.ws, ResponseTypes.CREATE_GAME, {
    idGame: gameId,
    idPlayer: `${player1.index}-${gameId}`,
  });
  sendResponse(player2.ws, ResponseTypes.CREATE_GAME, {
    idGame: gameId,
    idPlayer: `${player2.index}-${gameId}`,
  });
};

export const handleCreateRoom = (ws: WebSocket) => {
  const player = players.find((player) => player.ws === ws);
  if (!player) {
    return;
  }
  const index = rooms.length + 1;
  rooms.push({
    id: index,
    player1Id: player.index,
    player2Id: undefined,
    shipsPlayer1: [],
    shipsPlayer2: [],
    shotsPlayer1: [],
    shotsPlayer2: [],
    turn: 0,
  });
  players.forEach((player) => {
    updateRoom(player.ws);
  });
  console.log(rooms);
};

export const handleAddUserToRoom = (data: any, ws: WebSocket) => {
  const { indexRoom } = JSON.parse(data);
  const room = rooms.find((room) => room.id === indexRoom);
  const player = players.find((player) => player.ws === ws);
  if (!room || !player) {
    return;
  }
  room.player2Id = player.index;
  players.forEach((player) => {
    updateRoom(player.ws);
  });
};
