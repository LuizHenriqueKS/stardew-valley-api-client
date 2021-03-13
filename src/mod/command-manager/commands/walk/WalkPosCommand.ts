import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import defaultCanExecute from '../../util/defaultCanExecute';
import defaultHandleException from '../../util/defaultHandleException';
import defaultParseTileLocation from '../../util/defaultParseTileLocation';

class WalkPosCommand implements Command {
  name: string = 'Pos';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      const endPoint = await defaultParseTileLocation(args);
      const distance = this.parseDistance(args);
      args.sendInfo('Calculando rota...');
      console.log('Calculando rota para: ', endPoint);
      const walkingPath = await args.player.findWalkingPathTo(endPoint, distance);
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
    } catch (e) {
      await defaultHandleException(args, e);
    } finally {
      await args.player.freeInputs();
    }
  }

  private parseDistance(args: CommandArgs): number {
    const distance = args.commandArgs.length > 3 ? parseInt(args.commandArgs[3]) : 0;
    if (isNaN(distance)) {
      return 0;
    }
    return distance;
  }
}

export default new WalkPosCommand();
