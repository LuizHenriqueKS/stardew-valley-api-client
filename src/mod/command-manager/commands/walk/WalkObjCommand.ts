import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import defaultCanExecute from '../../util/defaultCanExecute';
import defaultHandleException from '../../util/defaultHandleException';
import TileLocation from '@/src/api/model/TileLocation';
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
      const objLister = new ObjectInfoDao(args.client);
      objLister.location = location;
      objLister.acceptNames = [objName];
      args.sendInfo('Localizando os objetos...');
      const objects = await objLister.list();
      let rerouting = false;
      let finished = false;
      for (const obj of objects) {
        try {
          args.sendInfo(rerouting ? 'Calculando rota do próximo objeto...' : 'Calculando rota...');
          const endPoint = { location: obj.location, x: obj.x, y: obj.y };
          const walkingPath = await args.player.findWalkingPathTo(endPoint, 1);
          await walkingPath.walk();
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

  private async walkingTo(args: CommandArgs, charName: string, reroute: boolean, endPoint: TileLocation) {
    const it = this;
    args.sendInfo(!reroute ? 'Calculando rota...' : 'Recalculando rota...');
    console.log('Calculando rota para: ', endPoint);
    const walkingPath = await args.player.findWalkingPathTo(endPoint, 1);
    if (walkingPath.valid) {
      args.sendInfo('Indo até o destino...');
      walkingPath.walk().then(result => {
        if (result.finished) {
          args.client.bridge.game1.getCharacterFromName(charName).getTileLocation().then(charPos => {
            const x = Math.abs(result.tileLocation.x - charPos.x);
            const y = Math.abs(result.tileLocation.y - charPos.y);
            if (x < 2 && y < 2) {
              args.sendInfo('Chegou no destino');
            } else {
              it.walkingTo(args, charName, true, endPoint).then();
            }
          });
        } else {
          args.sendError('Rota cancelada');
        }
      });
    } else {
      args.sendError('Não foi possível montar uma rota');
    }
  }
}

export default new WalkObjCommand();
