import sleep from '@/src/api/util/sleep';
import Command from '../base/Command';
import CommandArgs from '../base/CommandArgs';
import defaultCanExecute from '../util/defaultCanExecute';
import defaultHandleException from '../util/defaultHandleException';

class FishCommand implements Command {
  name: string = 'Fish';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      const till = args.commandArgs.length === 0 ? undefined : parseInt(args.commandArgs[0]);
      await this.validate(args);
      await args.player.setCurrentItemByTypeName('FishingRod');
      await sleep(100);
      if (till) {
        await this.fishMultipleFishes(args, till, true);
      } else {
        await this.singleFish(args);
      }
    } catch (e) {
      await defaultHandleException(args, e);
    } finally {
      await args.player.freeInputs();
    }
  }

  async fishMultipleFishes(args: CommandArgs, till: number, first: boolean) {
    let timeOfDay = await args.client.bridge.game1.getTimeOfDay();
    while (timeOfDay < till) {
      await this.validate(args);
      if (first) {
        await args.sendInfo('Iniciando pesca...');
      } else {
        await args.sendInfo('Retomando pesca...');
      }
      const result = await args.player.fish();
      if (result.finished) {
        await args.player.clickLeftButton();
        while (await args.player.currentTool.getFishCaught()) {
          await sleep(1);
        }
        first = false;
      } else {
        await args.sendError('Pesca cancelada');
        return;
      }
      timeOfDay = await args.client.bridge.game1.getTimeOfDay();
    }
    await args.sendInfo('Atingiu o tempo limite de pesca');
  }

  async singleFish(args: CommandArgs) {
    await this.validate(args);
    await args.sendInfo('Iniciando pesca...');
    const result = await args.player.fish();
    if (result.finished) {
      await args.sendInfo('Pesca concluída');
    } else {
      await args.sendError('Pesca cancelada');
    }
  }

  async validate(args: CommandArgs) {
    await args.requireStamina();
    await args.requireInventorySpace();
    await args.requireTool('FishingRod');
  }
}

export default new FishCommand();
