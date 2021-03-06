import Proxy from '../core/Proxy';
import Ref from '../core/Ref';

class GameLocation extends Proxy<GameLocation> {
  sub(ref: Ref): GameLocation {
    return new GameLocation(ref);
  }

  async getName(): Promise<string> {
    return await this.ref.getPropertyValue('Name');
  }
}
export default GameLocation;
