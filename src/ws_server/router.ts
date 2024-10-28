import { WebSocket } from 'ws';
import { handleUserReg } from './handlers/userHandlers';
import { RequestTypes } from './helpers/requestTypes';
import { handleAddUserToRoom, handleCreateRoom } from './handlers/roomHandlers';
import { handleAddShips } from './handlers/shipHandlers';

export const handleWsMessage = (type: string, data: any, ws: WebSocket) => {
  switch (type) {
    case RequestTypes.REG:
      handleUserReg(data, ws);
      break;
    case RequestTypes.CREATE_ROOM:
      handleCreateRoom(ws);
      break;
    case RequestTypes.ADD_USER_TO_ROOM:
      handleAddUserToRoom(data, ws);
      break;
    case RequestTypes.ADD_SHIPS:
      handleAddShips(data, ws);
      break;
    case RequestTypes.ATTACK:
      break;
    case RequestTypes.RANDOM_ATTACK:
      break;
    default:
      break;
  }
};
