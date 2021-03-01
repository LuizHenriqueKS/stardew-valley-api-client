import Ref from '../core/Ref';
import Item from './Item';

class Tool extends Item {
  sub(ref: Ref): Tool {
    return new Tool(ref);
  }
}

export default Tool;
