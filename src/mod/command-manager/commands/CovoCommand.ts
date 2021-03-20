import CrabPotInfoDao from '@/src/api/dao/CrabPotInfoDao';
import WalkingPathNotFoundException from '@/src/api/exception/WalkingPathNotFoundException';
import CrabPotInfo from '@/src/api/model/CrabPotInfo';
import TileLocation from '@/src/api/model/TileLocation';
import ProximityIterator from '@/src/api/util/ProximityIterator';
import sleep from '@/src/api/util/sleep';
import Command from '../base/Command';
import CommandArgs from '../base/CommandArgs';
import defaultCanExecute from '../util/defaultCanExecute';
import defaultHandleException from '../util/defaultHandleException';

class GrabCommand implements Command {
  name: string = 'Covo';

  #lastMsg: number;

  constructor() {
    this.#lastMsg = new Date().getTime();
  }

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      args.sendInfo('Localizando os covos...');
      const result = await this.listCovos(args, 0);
      const iterator = new ProximityIterator(args.player.getTileLocation(), result);
      let i = 0;
      while (iterator.hasNext()) {
        const obj = await iterator.next();
        await this.doFunc(args, obj, ++i, result.length);
      }
      await args.sendInfo('Pronto');
    } catch (e) {
      await defaultHandleException(args, e);
    } finally {
      await args.player.freeInputs();
    }
  }

  async doFunc(args: CommandArgs, covo: CrabPotInfo, currentProgress: number, maxProgress: number) {
    try {
      if (covo.heldObject || !covo.bait) {
        const dao = new CrabPotInfoDao(args.player);
        await args.requireInventorySpace();
        await args.requireItem('Bait');
        await args.player.setCurrentItemByName('Bait');
        await this.sendInfo(args, `Calculando rota até o covo [${currentProgress}/${maxProgress}]...`);
        const endPoint: TileLocation = await covo.getTileLocation();
        const walkingPath = await args.player.findWalkingPathTo(endPoint, 1);
        await this.sendInfo(args, `Indo até o covo [${currentProgress}/${maxProgress}]...`);
        await walkingPath.walk();
        await args.client.bridge.game1.input.simulateMousePositionAtTile(endPoint.x, endPoint.y);
        if (covo.heldObject) {
          await args.player.clickLeftButton();
        }
        if (!covo.bait || covo.heldObject) {
          do {
            await args.player.clickLeftButton();
            covo = await dao.get(endPoint);
            await sleep(100);
          } while (!covo.bait);
        }
      }
    } catch (e) {
      if (!(e instanceof WalkingPathNotFoundException)) {
        throw e;
      }
    } finally {
      args.player.freeInputs();
    }
  }

  async sendInfo(args: CommandArgs, message: string): Promise<void> {
    // if ((new Date().getTime() - this.#lastMsg) > 30000) {
    //      await args.sendInfo(message);
    this.#lastMsg = new Date().getTime();
    //  }
  }

  async listCovos(args: CommandArgs, startIndex: number): Promise<CrabPotInfo[]> {
    const location = args.commandArgs[startIndex];
    const dao = new CrabPotInfoDao(args.player);
    dao.location = location;
    return await dao.list();
  }
}

export default new GrabCommand();
