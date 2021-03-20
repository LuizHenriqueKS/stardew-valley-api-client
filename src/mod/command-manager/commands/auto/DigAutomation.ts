import TerrainFeatureInfoDao from '@/src/api/dao/TerrainFeatureInfoDao';
import TileLocation from '@/src/api/model/TileLocation';
import Automation from '../../base/Automation';
import AutomationArgs from '../../base/AutomationArgs';
import CommandArgs from '../../base/CommandArgs';

class DigAutomation implements Automation {
  name: string = 'Dig';

  async validateStart(args: CommandArgs): Promise<void> {
    await args.requireTool('Hoe');
  }

  async validateStep(args: AutomationArgs): Promise<void> {
    await args.args.requireStamina();
  }

  async execute(args: AutomationArgs): Promise<void> {
    await args.player.setCurrentItemByTypeName('Hoe');
    await args.player.toolTo(args.tileLocation);
    await args.client.bridge.game1.input.clickLeftButton();
  }

  async list(args: CommandArgs): Promise<TileLocation[]> {
    return [];
  }

  async canExecute(args: AutomationArgs): Promise<boolean> {
    const dao = new TerrainFeatureInfoDao(args.client);
    const terrain = await dao.get(args.tileLocation);
    return !terrain;
  }
}

export default new DigAutomation();
