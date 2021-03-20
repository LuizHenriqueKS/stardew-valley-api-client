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
    while (true) {
      args.sendInfo(!reroute ? 'Calculando rota...' : 'Recalculando rota...');
      const result = await args.player.walkTo(endPoint, { distance: 1 });
      const charPos = await args.client.bridge.game1.getCharacterFromName(charName).getTileLocation();
      const x = Math.abs(result.tileLocation.x - charPos.x);
      const y = Math.abs(result.tileLocation.y - charPos.y);
      if (x < 2 && y < 2) {
        args.sendInfo('Chegou no destino');
        break;
      } else {
        endPoint = charPos;
        reroute = true;
      }
    }
  }
}

export default new WalkCharCommand();
