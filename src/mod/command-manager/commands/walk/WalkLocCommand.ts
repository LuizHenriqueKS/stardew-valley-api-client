import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import defaultCanExecute from '../../util/defaultCanExecute';
import defaultHandleException from '../../util/defaultHandleException';
import TileLocation from '@/src/api/model/TileLocation';

class WalkLocCommand implements Command {
  name: string = 'Loc';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      const location = args.commandArgs[0];
      const endPoint = {
        x: 0,
        y: 0,
        location
      };
      if (endPoint) {
        await this.walkingTo(args, endPoint);
      } else {
        args.sendInfo('Localização não encontrada');
      }
    } catch (e) {
      await defaultHandleException(args, e);
    }
  }

  private async walkingTo(args: CommandArgs, endPoint: TileLocation) {
    try {
      await args.sendInfo('Calculando rota...');
      await args.player.walkTo(endPoint, { distance: 9999999 });
      await args.sendInfo('Chegou no destino');
    } finally {
      args.player.freeInputs();
    }
  }
}

export default new WalkLocCommand();
