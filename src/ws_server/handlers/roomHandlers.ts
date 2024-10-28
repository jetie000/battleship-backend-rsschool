import { ResponseTypes } from '../helpers/responseTypes';
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

export const turn = (roomId: number) => {
  const room = rooms.find((room) => room.id === roomId);
  const player1 = players.find((player) => player.index === room?.player1Id);
  const player2 = players.find((player) => player.index === room?.player2Id);
  if (!player1 || !player2) {
    return;
  }
  if (!room) {
    return;
  }
  if (room.turn === `${room.player1Id}-${roomId}`) {
    room.turn = `${room.player2Id}-${roomId}`;
  } else {
    room.turn = `${room.player1Id}-${roomId}`;
  }
  sendResponse(player1.ws, ResponseTypes.TURN, {
    currentPlayer: room.turn,
  });
  sendResponse(player2.ws, ResponseTypes.TURN, {
    currentPlayer: room.turn,
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
    shipsPlayer1: { points: [], ships: [] },
    shipsPlayer2: { points: [], ships: [] },
    shotsPlayer1: [],
    shotsPlayer2: [],
    turn: '0',
  });
  players.forEach((player) => {
    updateRoom(player.ws);
  });
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
    createGame(room.id);
  });
};
