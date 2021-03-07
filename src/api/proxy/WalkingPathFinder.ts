import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import EscapedValue from '../model/EscapedValue';
import TileLocation from '../model/TileLocation';
import Character from './Character';
import WalkingPathFinderArgs from './WalkingPathFinderArgs';
import WalkingPathFinderResult from './WalkingPathFinderResult';

class WalkingPathFinder extends Proxy<WalkingPathFinder> {
  #character: Character;
  #activated: boolean;

  constructor(character: Character) {
    super(character.ref.sub(`GameJS.GetPathFinder(${character.ref.expression})`));
    this.#character = character;
    this.#activated = false;
  }

  sub(ref: Ref): WalkingPathFinder {
    return new WalkingPathFinder(new Character(ref.getChild('Character')));
  }

  async find(args: WalkingPathFinderArgs): Promise<WalkingPathFinderResult> {
    const localArgs: WalkingPathFinderArgs = { maxInteractions: 100, ...args };
    const endPoint = this.tileLocationToRefExpression(localArgs.endPoint);
    const request = new EscapedValue('request');
    const reader = this.ref.invokeMethod('Find', request, endPoint, localArgs.distance, localArgs.maxInteractions);
    this.#activated = true;
    while (this.#activated) {
      const response = await reader.next();
      const result: WalkingPathFinderResult = response.result;
      if (result.finished || result.canceled) {
        return result;
      }
    }
    return { finished: false, canceled: true, data: [] };
  }

  stop() {
    const script = `${this.ref.expression}.Stop(request)`;
    return this.#character.ref.run(script);
  }

  private tileLocationToRefExpression(tileLocation: TileLocation): EscapedValue {
    return new EscapedValue(`new TileLocationModel('${tileLocation.location}', ${tileLocation.x}, ${tileLocation.y})`);
  }
}

export default WalkingPathFinder;
