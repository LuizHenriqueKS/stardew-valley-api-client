import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import ModEvents from './ModEvents';

class ModHelper extends Proxy<ModHelper> {
  sub(ref: Ref): ModHelper {
    return new ModHelper(ref);
  }

  get events(): ModEvents {
    return new ModEvents(this.ref.getChild('Events'));
  }
}

export default ModHelper;
