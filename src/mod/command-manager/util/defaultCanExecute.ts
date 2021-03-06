import Command from '../base/Command';
import CommandArgs from '../base/CommandArgs';

function defaultCanExecute(command: Command, args: CommandArgs): boolean {
  return command.name.toLowerCase() === args.commandName.toLocaleLowerCase();
}

export default defaultCanExecute;
