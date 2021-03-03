import Command from '../base/Command';
import CommandArgs from '../base/CommandArgs';

class PingCommand implements Command {
  name: string = 'Ping';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return this.name.toLowerCase() === args.commandName.toLocaleLowerCase();
  }

  async execute(args: CommandArgs): Promise<void> {
    args.sendInfo('Pong!');
  }
}

export default new PingCommand();
