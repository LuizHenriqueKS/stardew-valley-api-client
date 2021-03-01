import EventHandler from '../core/EventHandler';
import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import UpdateTickedEvent from '../event/UpdateTickedEvent';

class GameLoopEvents extends Proxy<GameLoopEvents> {
  sub(ref: Ref): GameLoopEvents {
    return new GameLoopEvents(ref);
  }

  get updateTicked(): EventHandler<UpdateTickedEvent> {
    return new EventHandler<UpdateTickedEvent>(this, 'UpdateTicked', false);
  }
}

export default GameLoopEvents;
