import CommandsFather from '../base/CommandsFather';
import path from 'path';

class WalkCommand extends CommandsFather {
  name: string = 'Count';
}

export default new WalkCommand(path.join(__dirname, 'count'));
