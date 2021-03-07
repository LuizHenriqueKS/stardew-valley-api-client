import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import defaultCanExecute from '../../util/defaultCanExecute';
import defaultHandleException from '../../util/defaultHandleException';
import defaultParseTileLocation from '../../util/defaultParseTileLocation';

class GetWalkCommand implements Command {
  name: string = 'Walk';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      const endPoint = await defaultParseTileLocation(args);
      args.sendInfo('Calculando rota...');
      const walkingPath = await args.player.findWalkingPathTo(endPoint);
      console.log(walkingPath.path);
      for (const tl of walkingPath.path) {
        await args.sendInfo(`${tl.location} (X: ${tl.x}, Y: ${tl.y})`).next();
      }
      if (walkingPath.path.length === 0) {
        args.sendError('Rota não encontrada');
      }
    } catch (e) {
      await await defaultHandleException(args, e);
      console.error(e);
    }
  }
}

export default new GetWalkCommand();
