import { WebSocket } from 'ws';

export interface Player {
  index: number;
  name: string;
  password: string;
  ws: WebSocket;
  wins: number;
}
