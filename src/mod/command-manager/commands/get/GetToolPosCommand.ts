import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import defaultCanExecute from '../../util/defaultCanExecute';

class GetToolPosCommand implements Command {
  name: string = 'Toolpos';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    const tileLocation = await args.player.getGrabTile();
    args.sendInfo(`Posição do alvo da ferramenta: ${tileLocation.location} (x: ${tileLocation.x}, y: ${tileLocation.y})`);
  }
}

export default new GetToolPosCommand();
