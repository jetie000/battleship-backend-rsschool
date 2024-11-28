import { Point } from '../interfaces/point.interface';
import { Ship } from '../interfaces/ship.interface';

export const getPointsFromShips = (ships: Ship[]) => {
  const points: Point[][] = [];

  ships.forEach((ship) => {
    points.push(
      Array(ship.length)
        .fill(0)
        .map((_, i) =>
          ship.direction
            ? { x: ship.position.x, y: ship.position.y + i }
            : { x: ship.position.x + i, y: ship.position.y }
        )
    );
  });
  return points;
};

export const getMissedPointsAroundShip = (points: Point[]) => {
  const missedPoints: Point[] = [];
  points.forEach((point, index) => {
    if (index === 0) {
      const isVertical = points.length === 1 || point.y + 1 === points[1].y;
      missedPoints.push({ x: point.x - 1, y: point.y - 1 });
      missedPoints.push({
        x: point.x + (isVertical ? 1 : -1),
        y: point.y + (isVertical ? -1 : 1),
      });
    }
    if (index === points.length - 1) {
      const isVertical =
        points.length === 1 || point.y === points[index - 1].y + 1;
      missedPoints.push({
        x: point.x + (isVertical ? -1 : 1),
        y: point.y + (isVertical ? 1 : -1),
      });
      missedPoints.push({ x: point.x + 1, y: point.y + 1 });
    }
    missedPoints.push({ x: point.x - 1, y: point.y });
    missedPoints.push({ x: point.x + 1, y: point.y });
    missedPoints.push({ x: point.x, y: point.y - 1 });
    missedPoints.push({ x: point.x, y: point.y + 1 });
  });
  return missedPoints.filter(
    (point) => !points.find((p) => p.x === point.x && p.y === point.y)
  );
};
