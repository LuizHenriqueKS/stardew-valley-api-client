import readJSON from '@/src/api/util/readJSON';
import Command from '../../base/Command';
import CommandArgs from '../../base/CommandArgs';
import defaultCanExecute from '../../util/defaultCanExecute';
import defaultHandleException from '../../util/defaultHandleException';
import path from 'path';
import fs from 'fs';
import writeJSON from '@/src/api/util/writeJSON';

class WalkSaveCommand implements Command {
  name: string = 'Save';

  async canExecute(args: CommandArgs): Promise<boolean> {
    return defaultCanExecute(this, args);
  }

  async execute(args: CommandArgs): Promise<void> {
    try {
      if (args.commandArgs.length === 0) {
        args.sendError('!walk save <nome_do_local>');
      } else {
        const localName = args.commandArgs[0];
        const pos = await args.player.getTileLocation();
        const saveId = await args.client.bridge.game1.getUniqueIDForThisGame();
        const dataPath = path.resolve(`./data/walk_${saveId}.json`);
        let data;
        if (fs.existsSync(dataPath)) {
          data = readJSON(dataPath);
        } else {
          data = {};
        }
        data[localName] = pos;
        writeJSON(dataPath, data);
        args.sendInfo('Nova localização salva');
      }
    } catch (e) {
      await defaultHandleException(args, e);
    }
  }
}

export default new WalkSaveCommand();
