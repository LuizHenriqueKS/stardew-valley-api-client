import CommandsFather from '../base/CommandsFather';
import path from 'path';

class TileCommand extends CommandsFather {
  name: string = 'Tile';
}

export default new TileCommand(path.join(__dirname, 'tile'));
