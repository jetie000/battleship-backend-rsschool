import { Point } from './point.interface';

type ShotStatus = 'miss' | 'killed' | 'shot';

interface Shot extends Point {
  status: ShotStatus;
}

interface PlayerWS {
  id: number;
  ws: WebSocket;
}

export interface Room {
  id: number;
  player1Id: PlayerWS;
  player2Id: PlayerWS;
  shipsPlayer1: Point[][];
  shipsPlayer2: Point[][];
  shotsPlayer1: Shot[];
  shotsPlayer2: Shot[];
  turn: 1 | 2;
}
