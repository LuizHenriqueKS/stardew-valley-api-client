import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import defaultCanExecute from '../../util/defaultCanExecute';
import defaultHandleException from '../../util/defaultHandleException';
import defaultParseNameLocation from '../../util/defaultParseNameLocation';
import { ZStr } from 'z-str';
import ChestItemInfoDao from '@/src/api/dao/ChestItemInfoDao';
import WalkingPathNotFoundException from '@/src/api/exception/WalkingPathNotFoundException';

class WalkChestCommand implements Command {
  name: string = 'Chest';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      const location = await defaultParseNameLocation(args, 0);
      const itemName = new ZStr(args.commandArgsText).from(' ').toString();
      const lister = new ChestItemInfoDao(args.client);
      lister.location = location;
      lister.acceptNames = args.commandArgs.length > 1 ? [itemName] : [];
      args.sendInfo('Localizando os itens...');
      const objects = await lister.list();
      let rerouting = false;
      let finished = false;
      for (const obj of objects) {
        try {
          args.sendInfo(rerouting ? 'Calculando rota do próximo item...' : 'Calculando rota...');
          const endPoint = { location: obj.location, x: obj.x, y: obj.y };
          await args.player.toolTo(endPoint);
          await args.player.clickRightButton();
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
      }
    } catch (e) {
      await defaultHandleException(args, e);
    } finally {
      await args.player.freeInputs();
    }
  }
}

export default new WalkChestCommand();
