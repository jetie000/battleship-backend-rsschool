import { Point } from './point.interface';

export interface Ship {
  position: Point;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}
