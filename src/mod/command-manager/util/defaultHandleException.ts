import WalkingPathNotFoundException from '@/src/api/exception/WalkingPathNotFoundException';
import CommandArgs from '../base/CommandArgs';
import FullInventoryException from '../exception/FullInventoryException';
import InsufficientStaminaException from '../exception/InsufficientStaminaException';
import InvalidArgumentsException from '../exception/InvalidArgumentsException';
import ItemNotFoundException from '../exception/ItemNotFoundException';

import ToolNotFoundException from '../exception/ToolNotFoundException';
import WaterNotFoundException from '../exception/WaterNotFoundException';

async function defaultHandleException(args: CommandArgs, e: any, logUnknownException: boolean = true): Promise<boolean> {
  if (e instanceof InvalidArgumentsException) {
    args.sendError('Argumentos inválidos');
  } else if (e instanceof WalkingPathNotFoundException) {
    args.sendError('Rota não encontrada');
  } else if (e instanceof InsufficientStaminaException) {
    args.sendError('Energia insuficiente');
  } else if (e instanceof FullInventoryException) {
    args.sendError('Inventário cheio');
  } else if (e instanceof ItemNotFoundException) {
    args.sendError(`Item não localizado: ${e.name}`);
  } else if (e instanceof ToolNotFoundException) {
    args.sendError(`Item não localizado: ${e.name}`);
  } else if (e instanceof WaterNotFoundException) {
    args.sendError('Sem água');
  } else if (logUnknownException) {
    console.error(e);
    args.sendError('Erro desconhecido');
    return false;
  }
  return true;
}

export default defaultHandleException;
