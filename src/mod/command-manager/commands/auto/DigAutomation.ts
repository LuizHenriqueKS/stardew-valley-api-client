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
    await args.toolTo(args.tileLocation);
    await args.client.bridge.game1.input.pressLeftButton();
  }
}

export default new DigAutomation();
