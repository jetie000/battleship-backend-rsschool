import { WebSocket } from 'ws';
import { handleUserReg } from './handlers/userHandlers';
import { RequestTypes } from './helpers/requestTypes';

export const handleWsMessage = (type: string, data: any, ws: WebSocket) => {
  switch (type) {
    case RequestTypes.REG:
      handleUserReg(data, ws);
      break;
    case RequestTypes.CREATE_ROOM:
      break;
    case RequestTypes.ADD_USER_TO_ROOM:
      break;
    case RequestTypes.ADD_SHIPS:
      break;
    case RequestTypes.START_GAME:
      break;
    case RequestTypes.ATTACK:
      break;
    case RequestTypes.RANDOM_ATTACK:
      break;
    default:
      break;
  }
};
