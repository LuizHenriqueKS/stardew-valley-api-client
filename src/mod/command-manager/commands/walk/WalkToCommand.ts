import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import defaultCanExecute from '../../util/defaultCanExecute';
import defaultHandleException from '../../util/defaultHandleException';
import path from 'path';
import fs from 'fs';
import readJSON from '@/src/api/util/readJSON';
import TileLocation from '@/src/api/model/TileLocation';

class WalkToCommand implements Command {
  name: string = 'To';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      const localName = args.commandArgs[0];
      const saveId = await args.client.bridge.game1.getUniqueIDForThisGame();
      const dataPath = path.resolve(`./data/walk_${saveId}.json`);
      let endPoint = null;
      if (fs.existsSync(dataPath)) {
        endPoint = readJSON(dataPath)[localName];
      }
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
    const walkingPath = await args.player.findWalkingPathTo(endPoint);
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

export default new WalkToCommand();
