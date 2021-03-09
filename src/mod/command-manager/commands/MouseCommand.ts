import Command from '../base/Command';
import CommandArgs from '../base/CommandArgs';
import defaultCanExecute from '../util/defaultCanExecute';

class PingCommand implements Command {
  name: string = 'Mouse';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    if (args.commandArgs.length === 0) {
      const pos = await args.client.bridge.game1.input.getMousePosition();
      args.sendInfo(`Posição atual do cursor do mouse: ${pos.x}, ${pos.y}`);
      return;
    }
    const x = parseInt(args.commandArgs[0]);
    const y = parseInt(args.commandArgs[1]);
    args.client.bridge.game1.input.simulateMousePosition(x, y);
    args.sendInfo(`Cursor do mouse movido para: ${x}, ${y}`);
  }
}

export default new PingCommand();
