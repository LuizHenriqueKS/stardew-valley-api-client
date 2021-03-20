import WalkingPathNotFoundException from '@/src/api/exception/WalkingPathNotFoundException';
import TileLocation from '@/src/api/model/TileLocation';
import ProximityIterator from '@/src/api/util/ProximityIterator';
import Command from '../base/Command';
import CommandArgs from '../base/CommandArgs';
import defaultCanExecute from '../util/defaultCanExecute';
import defaultHandleException from '../util/defaultHandleException';
import listGrabbableObjects from '../util/listGrabbableObject';

class GrabCommand implements Command {
  name: string = 'Grab';

  #lastMsg: number;

  constructor() {
    this.#lastMsg = new Date().getTime();
  }

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      args.sendInfo('Localizando itens coletáveis...');
      const result = await listGrabbableObjects(args, 0);
      if (result.find(obj => obj.name === 'Artifact Spot')) {
        await args.requireTool('Hoe');
      }
      const iterator = new ProximityIterator(args.player.getTileLocation(), result);
      let i = 0;
      while (iterator.hasNext()) {
        try {
          const obj = await iterator.next();
          const dynObj: any = obj;
          await args.requireInventorySpace();
          i++;
          await this.sendInfo(args, `Indo até ${obj.displayName} [${i}/${result.length}]...`);
          const endPoint: TileLocation = await obj.getTileLocation();
          await args.player.walkTo(endPoint, { distance: 1 });
          await args.player.pinMousePositionAtTile(endPoint.x, endPoint.y);
          if (obj.name === 'Artifact Spot') {
            await args.player.setCurrentItemByTypeName('Hoe');
          }
          if (dynObj.typeName && dynObj.typeName === 'Bush') {
            await args.player.clickRightButton();
          } else {
            await args.player.clickLeftButton();
          }
          if (obj.name === 'Artifact Spot') {
            await args.player.walkTo(endPoint);
          }
        } catch (e) {
          if (!(e instanceof WalkingPathNotFoundException)) {
            throw e;
          }
        }
      }
      await args.sendInfo('Pronto');
    } catch (e) {
      await defaultHandleException(args, e);
    } finally {
      await args.player.freeInputs();
    }
  }

  async sendInfo(args: CommandArgs, message: string): Promise<void> {
    // if ((new Date().getTime() - this.#lastMsg) > 30000) {
    await args.sendInfo(message);
    // this.#lastMsg = new Date().getTime();
    //  }
  }
}

export default new GrabCommand();
