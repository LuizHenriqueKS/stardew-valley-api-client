import jsesc from 'jsesc';
import JSResponseReader from '../core/JSResponseReader';
import WalkingEvent from '../event/WalkingEvent';
import ActionCanceledException from '../exception/ActionCanceledException';
import TileLocation from '../model/TileLocation';
import Character from './Character';
import Game1 from './Game1';

class WalkingPath {
  #path: TileLocation[];
  #character: Character;
  #moving: boolean;
  #finished: boolean;
  #valid: boolean;

  constructor(character: Character, path: TileLocation[], valid: boolean) {
    this.#path = path.map(it => this.parseTileLocation(it));
    this.#character = character;
    this.#moving = false;
    this.#finished = false;
    this.#valid = valid;
  }

  cancel() {
    this.#moving = false;
  }

  async walk(eachStep?: (evt: WalkingEvent, path: WalkingPath) => Promise<boolean>, canResetInputs?: boolean): Promise<WalkingEvent> {
    try {
      this.#moving = true;
      this.#finished = false;
      const reader = this.startWalking(canResetInputs);
      let evt: WalkingEvent;
      do {
        evt = (await reader.next()).result;
        if (evt.finished) {
          this.#moving = false;
        } else if (evt.canceled) {
          this.#moving = false;
          throw new ActionCanceledException();
        } else if (eachStep) {
          this.#moving = await eachStep(evt, this);
        }
      } while (this.#moving);
      this.#finished = evt.finished;
      return evt;
    } finally {
      this.getGame1().input.disableSimulations();
    }
  }

  stop() {
    const script = `GameJS.GetWalker(${this.#character.ref.expression}).Stop(request)`;
    return this.#character.ref.run(script);
  }

  private startWalking(canResetInputs?: boolean): JSResponseReader {
    const path = JSON.stringify(this.#path);
    const escapedPath = jsesc(path);
    const script = `GameJS.GetWalker(${this.#character.ref.expression}).Walk(request, '${escapedPath}', ${!!canResetInputs})`;
    return this.#character.ref.run(script);
  }

  private getGame1(): Game1 {
    const game1 = new Game1(this.#character.ref.client);
    return game1;
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
    return this.#valid && this.path.length > 0;
  }

  get path(): TileLocation[] {
    return this.#path;
  }
}

export default WalkingPath;
