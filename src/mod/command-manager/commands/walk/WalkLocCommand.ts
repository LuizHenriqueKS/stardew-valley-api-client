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
    args.sendInfo('Calculando rota...');
    console.log('Calculando rota para: ', endPoint);
    const walkingPath = await args.player.findWalkingPathTo(endPoint, 999999);
    if (walkingPath.valid) {
      args.sendInfo('Indo até o destino...');
      walkingPath.walk().then(result => {
        if (result.finished) {
          args.sendInfo('Chegou no destino');
        } else {
          args.sendError('Rota cancelada');
        }
      });
    } else {
      args.sendError('Não foi possível montar uma rota');
    }
  }
}

export default new WalkLocCommand();
