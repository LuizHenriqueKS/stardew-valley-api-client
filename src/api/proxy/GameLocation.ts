import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import EscapedValue from '../model/EscapedValue';

class GameLocation extends Proxy<GameLocation> {
  sub(ref: Ref): GameLocation {
    return new GameLocation(ref);
  }

  async getName(): Promise<string> {
    return await this.ref.getPropertyValue('Name');
  }

  async isTileLocationOpen(x: number, y: number): Promise<boolean> {
    return await this.ref.invokeMethodResult('isTileLocationOpen', new EscapedValue(`new Location(${x}, ${y})`));
  }
}
export default GameLocation;
