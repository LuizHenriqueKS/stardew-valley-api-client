import TileLocation from '@/src/api/model/TileLocation';
import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import InvalidArgumentsException from '../../exception/InvalidArgumentsException';
import defaultCanExecute from '../../util/defaultCanExecute';

class GetWalkCommand implements Command {
  name: string = 'Walk';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      const endPoint = await this.parseTileLocation(args);
      args.sendInfo('Calculando rota...');
      const walkingPath = await args.player.findWalkingPathTo(endPoint);
      console.log(walkingPath.path);
      for (const tl of walkingPath.path) {
        await args.sendInfo(`${tl.location} (X: ${tl.x}, Y: ${tl.y})`).next();
      }
    } catch (e) {
      await this.handleInvalidArgumentsException(args, e);
      console.error(e);
    }
  }

  private async handleInvalidArgumentsException(args: CommandArgs, e: any) {
    if (e instanceof InvalidArgumentsException) {
      args.sendError('Argumentos inválidos');
    }
  }

  private async parseTileLocation(args: CommandArgs): Promise<TileLocation> {
    const location = args.commandArgs.length > 2 ? args.commandArgs[2] : (await args.player.currentLocation.getName());
    const x = parseInt(args.commandArgs[0]);
    const y = parseInt(args.commandArgs[1]);
    const result: TileLocation = {
      x,
      y,
      location
    };
    if (!location) throw new InvalidArgumentsException();
    if (typeof (x) !== 'number' || typeof (y) !== 'number') {
      throw new InvalidArgumentsException();
    }
    return result;
  }
}

export default new GetWalkCommand();
