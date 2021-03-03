import CommandArgs from './CommandArgs';

interface Command {
  name: string;
  canExecute(args: CommandArgs): Promise<boolean>;
  execute(args: CommandArgs): Promise<void>;
}

export default Command;
