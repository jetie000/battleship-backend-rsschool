import { Point } from './point.interface';
import { Ship } from './ship.interface';

type ShotStatus = 'miss' | 'killed' | 'shot';

interface Shot extends Point {
  status: ShotStatus;
}

interface ShipsInfo {
  ships: Ship[];
  points: Point[][];
}

export interface Room {
  id: number;
  player1Id: number;
  player2Id: number | undefined;
  shipsPlayer1: ShipsInfo;
  shipsPlayer2: ShipsInfo;
  shotsPlayer1: Shot[];
  shotsPlayer2: Shot[];
  turn: string;
}
