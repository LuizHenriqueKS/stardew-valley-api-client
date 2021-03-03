import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import ChatEvents from './ChatEvents';
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

  get chat(): ChatEvents {
    return new ChatEvents(this.ref.sub('mod'));
  }
}

export default ModEvents;
