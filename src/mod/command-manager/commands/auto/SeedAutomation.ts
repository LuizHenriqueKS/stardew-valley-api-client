import ItemInfo from '@/src/api/model/ItemInfo';
import Automation from '../../base/Automation';
import AutomationArgs from '../../base/AutomationArgs';
import CommandArgs from '../../base/CommandArgs';
import ItemNotFoundException from '../../exception/ItemNotFoundException';

class DigAutomation implements Automation {
  name: string = 'Seed';

  async validateStart(args: CommandArgs): Promise<void> {

  }

  async validateStep(args: AutomationArgs): Promise<void> {
    await args.args.requireStamina();
    await this.requireSeeds(args);
  }

  async execute(args: AutomationArgs): Promise<void> {
    const seeds = await this.getSeeds(args);
    if (seeds) {
      await args.player.setCurrentItemByName(seeds.name);
    }
    await args.toolTo(args.tileLocation);
    await args.client.bridge.game1.input.pressLeftButton();
  }

  private async getSeeds(args: AutomationArgs): Promise<ItemInfo | undefined> {
    const currentSeeds = await args.player.currentItem.getName();
    if (currentSeeds && currentSeeds.includes('Seeds')) {
      return undefined;
    }
    for (const seeds of await args.player.listItemsInfos()) {
      if (seeds.name.includes('Seeds')) {
        return seeds;
      }
    }
    throw new ItemNotFoundException('Sementes');
  }

  private async requireSeeds(args: AutomationArgs) {
    const items = await args.player.listItemsInfos();
    let found = false;
    for (const item of items) {
      if (item.name.includes('Seeds')) {
        found = true;
      }
    }
    if (!found) {
      throw new ItemNotFoundException('Sementes');
    }
  }
}

export default new DigAutomation();
