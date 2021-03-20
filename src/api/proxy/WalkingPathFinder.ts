import Proxy from '../core/Proxy';
import Ref from '../core/Ref';
import ResponseType from '../enums/ResponseType';
import EscapedValue from '../model/EscapedValue';
import TileLocation from '../model/TileLocation';
import Character from './Character';
import WalkingPath from './WalkingPath';
import WalkingPathFinderArgs from './WalkingPathFinderArgs';

class WalkingPathFinder extends Proxy<WalkingPathFinder> {
  #character: Character;
  #activated: boolean;

  constructor(character: Character) {
    super(character.ref.sub('WalkingPathFinder'));
    this.#character = character;
    this.#activated = false;
  }

  sub(ref: Ref): WalkingPathFinder {
    return new WalkingPathFinder(new Character(ref));
  }

  async find(args: WalkingPathFinderArgs): Promise<WalkingPath> {
    try {
      this.#activated = true;
      const localArgs: WalkingPathFinderArgs = { ...args };
      const startPoint = this.tileLocationToRefExpression(await this.#character.getTileLocation());
      const endPoint = this.tileLocationToRefExpression(localArgs.endPoint);
      const reader = this.ref.invokeMethod('Find', this.#character, startPoint, endPoint, localArgs.distance);
      const response = await reader.next();
      if (response.type === ResponseType.RESPONSE) {
        return new WalkingPath(this.#character, response.result.tileLocationList, true);
      }
      return new WalkingPath(this.#character, [], false);
    } finally {
      this.#activated = false;
    }
  }

  /* stop() {
    const script = `${this.ref.expression}.Stop(request)`;
    return this.#character.ref.run(script);
  } */

  tileLocationToRefExpression(tileLocation: TileLocation): EscapedValue {
    return new EscapedValue(`new TileLocationModel('${tileLocation.location}', ${tileLocation.x}, ${tileLocation.y})`);
  }
}

export default WalkingPathFinder;
