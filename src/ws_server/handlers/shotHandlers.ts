import { ShotStatus } from '../helpers/shotStatus';
import { players, rooms } from '../db';
import { sendResponse } from '../helpers/sendResponse';
import { ResponseTypes } from '../helpers/responseTypes';
import { turn } from './roomHandlers';
import { getMissedPointsAroundShip } from '../helpers/shipsPoints';
import { updateWinners } from './userHandlers';
import { Point } from '../interfaces/point.interface';

export const handleAttack = (data: any) => {
  const { gameId, x, y, indexPlayer } = JSON.parse(data);
  const room = rooms.find((room) => room.id === gameId);
  const player = players.find(
    (player) => player.index === Number(indexPlayer.split('-')[0])
  );
  const playerEnemyIndex =
    player?.index === room?.player1Id ? room?.player2Id : room?.player1Id;
  const playerEnemy = players.find((pl) => pl.index === playerEnemyIndex);
  if (!room || !player || !playerEnemy) {
    return;
  }
  if (room.turn !== indexPlayer) {
    return;
  }
  const shotsTemp =
    room.player1Id === player.index
      ? [...room.shotsPlayer1]
      : [...room.shotsPlayer2];
  if (shotsTemp.find((shot) => shot.x === x && shot.y === y)) {
    return;
  }
  let shotStatus = ShotStatus.MISS;
  const shipsEnemy =
    room.player1Id === player.index ? room.shipsPlayer2 : room.shipsPlayer1;
  const shipShot = shipsEnemy.points.find((ship) =>
    ship.some((p) => p.x === x && p.y === y)
  );
  if (shipShot) {
    shotsTemp.push({ x, y, status: shotStatus });
    if (
      shipShot.every((p) =>
        shotsTemp.find((shot) => shot.x === p.x && shot.y === p.y)
      )
    ) {
      shotStatus = ShotStatus.KILLED;
      const missedPoints = getMissedPointsAroundShip(shipShot);
      missedPoints.forEach((point) => {
        if (room.player1Id === player.index) {
          room.shotsPlayer1.push({
            x: point.x,
            y: point.y,
            status: ShotStatus.MISS,
          });
        } else {
          room.shotsPlayer2.push({
            x: point.x,
            y: point.y,
            status: ShotStatus.MISS,
          });
        }
        [player.ws, playerEnemy.ws].forEach((ws) =>
          sendResponse(ws, ResponseTypes.ATTACK, {
            position: {
              x: point.x,
              y: point.y,
            },
            currentPlayer: indexPlayer,
            status: ShotStatus.MISS,
          })
        );
      });
    } else {
      shotStatus = ShotStatus.HIT;
    }
  }
  if (room.player1Id === player.index) {
    room.shotsPlayer1.push({ x, y, status: shotStatus });
  } else {
    room.shotsPlayer2.push({ x, y, status: shotStatus });
  }
  [player.ws, playerEnemy.ws].forEach((ws) =>
    sendResponse(ws, ResponseTypes.ATTACK, {
      position: {
        x,
        y,
      },
      currentPlayer: indexPlayer,
      status: shotStatus,
    })
  );
  const successfulShots1 = room.shotsPlayer1.filter(
    (shot) => shot.status !== ShotStatus.MISS
  );
  const successfulShots2 = room.shotsPlayer2.filter(
    (shot) => shot.status !== ShotStatus.MISS
  );
  if (successfulShots1.length === 20 || successfulShots2.length === 20) {
    const winnerId =
      successfulShots1.length === 20 ? room.player1Id : room.player2Id;
    const winner = players.find((pl) => pl.index === winnerId);
    if (winner) {
      winner.wins = winner.wins + 1;
    }
    [player.ws, playerEnemy.ws].forEach((ws) =>
      sendResponse(ws, ResponseTypes.FINISH, {
        winPlayer: `${winnerId}-${gameId}`,
      })
    );
    players.forEach((pl) => updateWinners(pl.ws));
    return;
  }
  turn(gameId, !!shipShot);
};

export const handleRandomAttack = (data: any) => {
  const { gameId, indexPlayer } = JSON.parse(data);
  const room = rooms.find((room) => room.id === gameId);
  const playerShots =
    room?.player1Id === Number(indexPlayer.split('-')[0])
      ? room?.shotsPlayer1
      : room?.shotsPlayer2;
  if (!playerShots) {
    return;
  }
  const notShootPoints: Point[] = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (!playerShots.find((shot) => shot.x === i && shot.y === j)) {
        notShootPoints.push({ x: i, y: j });
      }
    }
  }
  const randomShot =
    notShootPoints[Math.floor(Math.random() * notShootPoints.length)];
  handleAttack(
    JSON.stringify({ gameId, x: randomShot.x, y: randomShot.y, indexPlayer })
  );
};
