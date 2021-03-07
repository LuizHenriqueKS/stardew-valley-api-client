import CommandsFather from '../base/CommandsFather';
import path from 'path';

class GetCommand extends CommandsFather {
  name: string = 'Get';
}

export default new GetCommand(path.join(__dirname, 'get'));
