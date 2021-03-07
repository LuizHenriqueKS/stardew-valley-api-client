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
      await args.player.setCurrentItemByTypeName('FishingRod').next();
      await this.wait(100);
      if (till) {
        await this.fishMultipleFishes(args, till, true);
      } else {
        await this.singleFish(args);
      }
    } catch (e) {
      await defaultHandleException(args, e);
    }
  }

  async fishMultipleFishes(args: CommandArgs, till: number, first: boolean) {
    let timeOfDay = await args.client.bridge.game1.getTimeOfDay();
    while (timeOfDay < till) {
      await this.validate(args);
      if (first) {
        args.sendInfo('Iniciando pesca...');
      } else {
        args.sendInfo('Retomando pesca...');
      }
      const reader = args.player.fish();
      await reader.next();
      const response = await reader.next();
      if (response.result.finished) {
        /* await args.client.bridge.game1.input.setLeftButtonPressed(true).next();
        await this.wait(500);
        await args.client.bridge.game1.input.setLeftButtonPressed(false).next();
        await this.wait(500); */
        first = false;
      } else {
        args.sendError('Pesca cancelada');
        return;
      }
      timeOfDay = await args.client.bridge.game1.getTimeOfDay();
    }
    args.sendInfo('Atingiu o tempo limite de pesca');
  }

  async singleFish(args: CommandArgs) {
    await this.validate(args);
    args.sendInfo('Iniciando pesca...');
    const reader = args.player.fish();
    await reader.next();
    const response = await reader.next();
    if (response.result.finished) {
      args.sendInfo('Pesca concluída');
    } else {
      args.sendError('Pesca cancelada');
    }
  }

  async validate(args: CommandArgs) {
    await args.requireStamina();
    await args.requireInventorySpace();
    await args.requireTool('FishingRod');
  }

  wait(delay: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => resolve(), delay);
    });
  }
}

export default new FishCommand();
