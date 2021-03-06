import Command from '../base/Command';
import CommandArgs from '../base/CommandArgs';
import defaultCanExecute from '../util/defaultCanExecute';
import path from 'path';
import fs from 'fs';

class GetCommand implements Command {
  name: string = 'Get';
  commands: Command[];

  constructor() {
    this.commands = [];
    const commandsDir = path.join(__dirname, 'get');
    for (const file of fs.readdirSync(commandsDir)) {
      const filePath = path.join(commandsDir, file);
      import(filePath).then(cmd => {
        this.commands.push(cmd.default);
      });
    }
  }

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    const newArgs = args.clone();
    const commandArgs = newArgs.commandArgs;
    newArgs.commandName = commandArgs[0];
    newArgs.commandArgs = commandArgs.slice(1);
    newArgs.commandArgsText = commandArgs.join(' ');
    for (const command of this.commands) {
      if (await command.canExecute(newArgs)) {
        await command.execute(newArgs);
      }
    }
  }
}

export default new GetCommand();
