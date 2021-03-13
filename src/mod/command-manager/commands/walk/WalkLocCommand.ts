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
      console.log('Calculando rota para: ', endPoint);
      const walkingPath = await args.player.findWalkingPathTo(endPoint, 999999);
      if (walkingPath.valid) {
        await args.sendInfo('Indo até o destino...');
        const result = await walkingPath.walk();
        if (result.finished) {
          await args.sendInfo('Chegou no destino');
        } else {
          await args.sendError('Rota cancelada');
        }
      } else {
        await args.sendError('Não foi possível montar uma rota');
      }
    } catch (ex) {
      await args.sendError('Não foi possível montar uma rota');
    } finally {
      args.player.freeInputs();
    }
  }
}

export default new WalkLocCommand();
