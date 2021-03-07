import CommandsFather from '../base/CommandsFather';
import path from 'path';

class WalkCommand extends CommandsFather {
  name: string = 'Walk';
}

export default new WalkCommand(path.join(__dirname, 'walk'));
