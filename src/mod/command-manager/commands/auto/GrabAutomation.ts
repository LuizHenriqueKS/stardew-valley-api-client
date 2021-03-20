import CropInfoDao from '@/src/api/dao/CropInfoDao';
import TileLocation from '@/src/api/model/TileLocation';
import Automation from '../../base/Automation';
import AutomationArgs from '../../base/AutomationArgs';
import CommandArgs from '../../base/CommandArgs';

class GrabAutomation implements Automation {
  name: string = 'Grab';

  async validateStart(args: CommandArgs): Promise<void> {

  }

  async validateStep(args: AutomationArgs): Promise<void> {
    await args.args.requireInventorySpace();
  }

  async execute(args: AutomationArgs): Promise<void> {
    const dao = new CropInfoDao(args.player);
    const crop = await dao.get(args.tileLocation);
    if (crop.name === 'Wheat') {
      await args.args.requireStamina();
      await args.args.requireTool('Scythe');
      await args.player.setCurrentItemByName('Scythe');
    }
    await args.player.toolTo(args.tileLocation);
    await args.client.bridge.game1.input.clickLeftButton();
  }

  async list(args: CommandArgs): Promise<TileLocation[]> {
    const dao = new CropInfoDao(args.player);
    dao.location = args.commandArgs[0];
    const result = await dao.list();
    return result.filter(r => r.canHarvest && !r.dead);
  }

  async canExecute(args: AutomationArgs): Promise<boolean> {
    const dao = new CropInfoDao(args.player);
    const crop = await dao.get(args.tileLocation);
    return crop.canHarvest && !crop.dead;
  }
}

export default new GrabAutomation();
