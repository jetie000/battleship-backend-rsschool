import { Point } from '../interfaces/point.interface';
import { Ship } from '../interfaces/ship.interface';

export const getPointsFromShips = (ships: Ship[]) => {
  const points: Point[][] = [];
  ships.forEach((ship) => {
    points.push(
      Array(ship.length).map((_, i) =>
        ship.direction
          ? { x: ship.x, y: ship.y + i }
          : { x: ship.x + i, y: ship.y }
      )
    );
  });
  return points;
};

export const getMissedPointsAroundShip = (points: Point[]) => {
  const missedPoints: Point[] = [];
  points.forEach((point, index) => {
    if (index === 0 || index === points.length - 1) {
      missedPoints.push({ x: point.x - 1, y: point.y - 1 });
      missedPoints.push({ x: point.x + 1, y: point.y - 1 });
      missedPoints.push({ x: point.x - 1, y: point.y + 1 });
      missedPoints.push({ x: point.x + 1, y: point.y + 1 });
    }
    if (!(index === 1 || index === points.length - 2)) {
      missedPoints.push({ x: point.x - 1, y: point.y });
      missedPoints.push({ x: point.x + 1, y: point.y });
      missedPoints.push({ x: point.x, y: point.y - 1 });
      missedPoints.push({ x: point.x, y: point.y + 1 });
    }
  });
  return missedPoints.filter(
    (point) => !points.find((p) => p.x === point.x && p.y === point.y)
  );
};
