import { Point } from './point.interface';

type ShotStatus = 'miss' | 'killed' | 'shot';

interface Shot extends Point {
  status: ShotStatus;
}

export interface Room {
  id: number;
  player1Id: number;
  player2Id: number | undefined;
  shipsPlayer1: Point[][];
  shipsPlayer2: Point[][];
  shotsPlayer1: Shot[];
  shotsPlayer2: Shot[];
  turn: 0 | 1 | 2;
}
