import CropInfoDao from '@/src/api/dao/CropInfoDao';
import TileLocation from '@/src/api/model/TileLocation';
import Automation from '../../base/Automation';
import AutomationArgs from '../../base/AutomationArgs';
import CommandArgs from '../../base/CommandArgs';
import WaterNotFoundException from '../../exception/WaterNotFoundException';

class WaterAutomation implements Automation {
  name: string = 'Water';

  async validateStart(args: CommandArgs): Promise<void> {
    await args.requireTool('Watering Can');
  }

  async validateStep(args: AutomationArgs): Promise<void> {
    await args.player.setCurrentItemByName('Watering Can');
    await args.args.requireStamina();
    await this.requireWaterLeft(args);
  }

  async execute(args: AutomationArgs): Promise<void> {
    await args.player.toolTo(args.tileLocation);
    await args.player.clickLeftButton();
  }

  private async requireWaterLeft(args: AutomationArgs) {
    const waterLeft = await args.player.currentTool.getWaterLeft();
    if (waterLeft < 1) {
      throw new WaterNotFoundException();
    }
  }

  async list(args: CommandArgs): Promise<TileLocation[]> {
    const dao = new CropInfoDao(args.player);
    dao.location = args.commandArgs[0];
    const result = await dao.list();
    return result.filter(r => !r.watered && !r.dead);
  }

  async canExecute(args: AutomationArgs): Promise<boolean> {
    const dao = new CropInfoDao(args.player);
    const result = await dao.get(args.tileLocation);
    return !result.watered && !result.dead;
  }
}

export default new WaterAutomation();
