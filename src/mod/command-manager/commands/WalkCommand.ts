import Command from '../base/Command';
import CommandArgs from '../base/CommandArgs';
import defaultCanExecute from '../util/defaultCanExecute';

class WalkCommand implements Command {
  name: string = 'Walk';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    const type = args.commandArgs.length === 0 ? null : args.commandArgs[0];
    if (type && type.toLocaleLowerCase() === 'current') {
      await args.client.bridge.saveGame.save().next();
      args.sendInfo('Jogo salvo.');
    } else if (type && type.toLocaleLowerCase() === 'new') {
      await args.client.bridge.saveGame.saveNewGame().next();
      args.sendInfo('Novo save criado.');
    } else {
      args.sendError("Use '!save current' ou '!save new'");
    }
  }
}

export default new WalkCommand();
