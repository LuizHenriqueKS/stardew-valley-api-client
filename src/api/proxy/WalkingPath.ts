import JSResponseReader from '../core/JSResponseReader';
import WalkingEvent from '../event/WalkingEvent';
import TileLocation from '../model/TileLocation';
import Character from './Character';

class WalkingPath {
  #path: TileLocation[];
  #character: Character;
  #moving: boolean;
  #finished: boolean;

  constructor(character: Character, path: TileLocation[]) {
    this.#path = path.map(it => this.parseTileLocation(it));
    this.#character = character;
    this.#moving = false;
    this.#finished = false;
  }

  cancel() {
    this.#moving = false;
  }

  async walk(eachStep?: (evt: WalkingEvent, path: WalkingPath) => Promise<boolean>): Promise<WalkingEvent> {
    this.#moving = true;
    this.#finished = false;
    const reader = this.startWalking();
    let evt: WalkingEvent;
    do {
      evt = (await reader.next()).result;
      if (evt.finished) {
        this.#moving = false;
      } else if (eachStep) {
        this.#moving = await eachStep(evt, this);
      }
    } while (this.#moving);
    this.#finished = evt.finished;
    return evt;
  }

  stop() {
    const script = `GameJS.GetWalker(${this.#character.ref.expression}).Stop(request)`;
    return this.#character.ref.run(script);
  }

  private startWalking(): JSResponseReader {
    const path = this.#path.map(p => `${p.x}:${p.y}`).join(',');
    const script = `GameJS.GetWalker(${this.#character.ref.expression}).Walk(request, '${path}')`;
    return this.#character.ref.run(script);
  }

  private parseTileLocation(it: any | TileLocation): TileLocation {
    if (it instanceof TileLocation) {
      return it;
    }
    const result = new TileLocation();
    result.location = it.location;
    result.x = it.x;
    result.y = it.y;
    result.door = it.door;
    return result;
  }

  get finished(): boolean {
    return this.#finished;
  }

  get valid(): boolean {
    return this.#path.length > 0;
  }

  get path(): TileLocation[] {
    return this.#path;
  }
}

export default WalkingPath;
