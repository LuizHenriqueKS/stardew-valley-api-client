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
    await args.toolTo(args.tileLocation);
    await args.client.bridge.game1.input.pressLeftButton();
  }

  private async requireWaterLeft(args: AutomationArgs) {
    const waterLeft = await args.player.currentTool.getWaterLeft();
    if (waterLeft < 1) {
      throw new WaterNotFoundException();
    }
  }
}

export default new WaterAutomation();
