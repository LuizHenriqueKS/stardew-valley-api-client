import Command from './Command';
import CommandArgs from '../base/CommandArgs';
import defaultCanExecute from '../util/defaultCanExecute';
import path from 'path';
import fs from 'fs';

abstract class CommandsFather implements Command {
  abstract name: string;
  commands: Command[];

  constructor(directory: string) {
    this.commands = [];
    const commandsDir = directory;
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
    newArgs.commandArgs = [...commandArgs];
    newArgs.commandArgs.splice(0, 1);
    newArgs.commandArgsText = newArgs.commandArgs.join(' ');
    const command = await this.findExecutableCommand(newArgs);
    if (command) {
      await command.execute(newArgs);
    } else {
      args.sendError('Argumentos inválidos');
    }
  }

  async findExecutableCommand(args: CommandArgs): Promise<Command | undefined> {
    for (const command of this.commands) {
      if (await command.canExecute(args)) {
        return command;
      }
    }
    return undefined;
  }
}

export default CommandsFather;
