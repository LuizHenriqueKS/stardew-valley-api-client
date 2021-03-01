import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import GameLoopEvents from './GameLoopEvents';
import InputEvents from './InputEvents';

class ModEvents extends Proxy<ModEvents> {
  sub(ref: Ref): ModEvents {
    return new ModEvents(ref);
  }

  get input(): InputEvents {
    return new InputEvents(this.ref.getChild('Input'));
  }

  get gameLoop(): GameLoopEvents {
    return new GameLoopEvents(this.ref.getChild('GameLoop'));
  }
}

export default ModEvents;
