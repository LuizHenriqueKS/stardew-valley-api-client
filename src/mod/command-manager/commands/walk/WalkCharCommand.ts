import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import defaultCanExecute from '../../util/defaultCanExecute';
import defaultHandleException from '../../util/defaultHandleException';
import TileLocation from '@/src/api/model/TileLocation';

class WalkCharCommand implements Command {
  name: string = 'Char';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      const charName = args.commandArgs[0];
      const charPos = args.client.bridge.game1.getCharacterFromName(charName);
      const endPoint = await charPos.getTileLocation();
      if (endPoint) {
        await this.walkingTo(args, charName, false, endPoint);
      } else {
        args.sendInfo('Localização não encontrada');
      }
    } catch (e) {
      await defaultHandleException(args, e);
    }
  }

  private async walkingTo(args: CommandArgs, charName: string, reroute: boolean, endPoint: TileLocation) {
    const it = this;
    args.sendInfo(!reroute ? 'Calculando rota...' : 'Recalculando rota...');
    console.log('Calculando rota para: ', endPoint);
    const walkingPath = await args.player.findWalkingPathTo(endPoint, 1);
    if (walkingPath.valid) {
      args.sendInfo('Indo até o destino...');
      walkingPath.walk().then(result => {
        if (result.finished) {
          args.client.bridge.game1.getCharacterFromName(charName).getTileLocation().then(charPos => {
            const x = Math.abs(result.tileLocation.x - charPos.x);
            const y = Math.abs(result.tileLocation.y - charPos.y);
            if (x < 2 && y < 2) {
              args.sendInfo('Chegou no destino');
            } else {
              it.walkingTo(args, charName, true, charPos).then();
            }
          });
        } else {
          args.sendError('Rota cancelada');
        }
      });
    } else {
      args.sendError('Não foi possível montar uma rota');
    }
  }
}

export default new WalkCharCommand();
