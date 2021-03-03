import Proxy from '../core/Proxy';
import Ref from '../core/Ref';

class GameJS extends Proxy<GameJS> {
  sub(ref: Ref): GameJS {
    return new GameJS(ref);
  }
}

export default GameJS;
