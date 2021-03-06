import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import defaultCanExecute from '../../util/defaultCanExecute';

class GetPosCommand implements Command {
  name: string = 'Pos';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    const tileLocation = await args.player.getTileLocation();
    args.sendInfo(`Posição atual: ${tileLocation.location} (x: ${tileLocation.x}, y: ${tileLocation.y})`);
  }
}

export default new GetPosCommand();
