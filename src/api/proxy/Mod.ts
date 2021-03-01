import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import ModHelper from './ModHelper';

class Mod extends Proxy<Mod> {
  sub(ref: Ref): Mod {
    return new Mod(ref);
  }

  get helper(): ModHelper {
    return new ModHelper(this.ref.getChild('Events'));
  }
}

export default Mod;
