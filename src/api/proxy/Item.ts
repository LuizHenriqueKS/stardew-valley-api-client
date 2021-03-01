import Proxy from '../core/Proxy';
import Ref from '../core/Ref';

class Item extends Proxy<Item> {
  sub(ref: Ref): Item {
    return new Item(ref);
  }

  async getName(): Promise<string> {
    return await this.ref.getPropertyValue('Name');
  }
}

export default Item;
