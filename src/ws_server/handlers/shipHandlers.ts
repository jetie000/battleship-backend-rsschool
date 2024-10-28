import { WebSocket } from 'ws';
import { players, rooms } from '../db';
import { sendResponse } from '../helpers/sendResponse';
import { ResponseTypes } from '../helpers/responseTypes';
import { turn } from './roomHandlers';
import { getPointsFromShips } from '../helpers/shipsPoints';

export const handleAddShips = (data: any, ws: WebSocket) => {
  const { gameId, ships, indexPlayer } = JSON.parse(data);
  const room = rooms.find((room) => room.id === gameId);
  const player = players.find(
    (player) => player.index === Number(String(indexPlayer).split('-')[0])
  );
  if (!room || !player) {
    return;
  }
  const shipsPoints = getPointsFromShips(ships);
  if (room.player1Id === player.index) {
    room.shipsPlayer1 = { ships, points: shipsPoints };
  } else {
    room.shipsPlayer2 = { ships, points: shipsPoints };
  }
  if (
    room.shipsPlayer1.ships.length > 0 &&
    room.shipsPlayer2.ships.length > 0
  ) {
    const secondPlayerIndex =
      room.player1Id === player.index ? room.player2Id : room.player1Id;
    const secondPlayer = players.find(
      (player) => player.index === secondPlayerIndex
    );
    if (!secondPlayer) {
      return;
    }
    sendResponse(ws, ResponseTypes.START_GAME, {
      ships,
      currentPlayerIndex: player.index,
    });
    sendResponse(secondPlayer.ws, ResponseTypes.START_GAME, {
      ships:
        secondPlayerIndex === room.player1Id
          ? room.shipsPlayer1
          : room.shipsPlayer2,
      currentPlayerIndex: secondPlayerIndex,
    });
    turn(gameId);
  }
};
