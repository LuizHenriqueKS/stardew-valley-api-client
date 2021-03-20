import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import InvalidArgumentException from '../../exception/InvalidArgumentException';
import defaultCanExecute from '../../util/defaultCanExecute';
import defaultHandleException from '../../util/defaultHandleException';
import defaultParseTileLocation from '../../util/defaultParseTileLocation';
import fs from 'fs';
import readJSON from '@/src/api/util/readJSON';
import path from 'path';
import TileLocation from '@/src/api/model/TileLocation';

class GetWalkCommand implements Command {
  name: string = 'Walk';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      if (args.commandArgs[0].toLocaleLowerCase() === 'pos') {
        await this.walkPos(args);
      } else if (args.commandArgs[0].toLocaleLowerCase() === 'to') {
        await this.walkTo(args);
      } else if (args.commandArgs[0].toLocaleLowerCase() === 'loc') {
        await this.walkLoc(args);
      } else {
        throw new InvalidArgumentException('Opção inválida');
      }
    } catch (e) {
      await defaultHandleException(args, e);
      console.error(e);
    }
  }

  async walkPos(args: CommandArgs) {
    const endPoint = await defaultParseTileLocation(args);
    args.sendInfo('Calculando rota...');
    const walkingPath = await args.player.findWalkingPathTo(endPoint);
    console.log(walkingPath.path);
    if (walkingPath.path.length === 0) {
      await args.sendError('Rota não encontrada');
    } else {
      await args.sendInfo(`Tamanho da rota encontrada: ${walkingPath.path.length}`);
    }
  }

  async walkTo(args: CommandArgs) {
    const localName = args.commandArgs[1];
    const saveId = await args.client.bridge.game1.getUniqueIDForThisGame();
    const dataPath = path.resolve(`./data/walk_${saveId}.json`);
    let endPoint = null;
    if (fs.existsSync(dataPath)) {
      endPoint = readJSON(dataPath)[localName];
    }
    args.sendInfo('Calculando rota...');
    const walkingPath = await args.player.findWalkingPathTo(endPoint);
    console.log(walkingPath.path);
    if (walkingPath.path.length === 0) {
      await args.sendError('Rota não encontrada');
    } else {
      await args.sendInfo(`Tamanho da rota encontrada: ${walkingPath.path.length}`);
    }
  }

  async walkLoc(args: CommandArgs) {
    const endPoint: TileLocation = {
      location: args.commandArgs[1],
      x: 0,
      y: 1
    };
    args.sendInfo('Calculando rota...');
    const walkingPath = await args.player.findWalkingPathTo(endPoint, 999999);
    console.log(walkingPath.path);
    if (walkingPath.path.length === 0) {
      await args.sendError('Rota não encontrada');
    } else {
      await args.sendInfo(`Tamanho da rota encontrada: ${walkingPath.path.length}`);
    }
  }
}

export default new GetWalkCommand();
