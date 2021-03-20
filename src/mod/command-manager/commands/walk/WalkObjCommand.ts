import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import defaultCanExecute from '../../util/defaultCanExecute';
import defaultHandleException from '../../util/defaultHandleException';
import defaultParseNameLocation from '../../util/defaultParseNameLocation';
import { ZStr } from 'z-str';
import ObjectInfoDao from '@/src/api/dao/ObjectInfoDao';
import WalkingPathNotFoundException from '@/src/api/exception/WalkingPathNotFoundException';

class WalkObjCommand implements Command {
  name: string = 'Obj';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      const location = await defaultParseNameLocation(args, 0);
      const objName = new ZStr(args.commandArgsText).from(' ').toString();
      const dao = new ObjectInfoDao(args.player);
      dao.location = location;
      dao.acceptNames = [objName];
      await args.sendInfo('Localizando os objetos...');
      const objects = await dao.list();
      let rerouting = false;
      let finished = false;
      for (const obj of objects) {
        try {
          await args.sendInfo(rerouting ? 'Calculando rota do próximo objeto...' : 'Calculando rota...');
          const endPoint = { location: obj.location, x: obj.x, y: obj.y };
          await args.player.walkTo(endPoint, { distance: 1 });
          finished = true;
          break;
        } catch (ex) {
          rerouting = true;
          if (!(ex instanceof WalkingPathNotFoundException)) {
            throw ex;
          }
        }
      }
      if (objects.length === 0) {
        args.sendError('Objeto não localizado');
      } else if (finished) {
        args.sendInfo('Chegou no destino');
      } else {
        args.sendError('Não foi possível encontrar uma rota');
      }
    } catch (e) {
      await defaultHandleException(args, e);
    }
  }
}

export default new WalkObjCommand();
